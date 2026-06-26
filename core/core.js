/* ============================================================
   Chloe's World, Platform Core
   A small, dependency-free engine that hosts pluggable learning
   modules. Module 1 (Animals) registers itself on top of this.

   Design law (AAP "5 Cs of Media Use"):
   - Content : real, trusted media only; no ads; no tappable links out.
   - Calm    : no autoplay, gentle pace, a clear "all done" ending.
   - CrowdingOut : short sessions; end pushes back to the real world.
   - Communication + Child : spoken audio paired with written words.
   - Joint Media Engagement : a Grown-Up Card on every activity.

   To add a future module, call ChloePlatform.registerModule({...}).
   See CLAUDE.md for the module contract.
   ============================================================ */
(function(){
  "use strict";

  var ICON = {
    speaker:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.06a7 7 0 0 1 0 13.48v2.06A9 9 0 0 0 14 3.2z"/></svg>',
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    back:'<svg viewBox="0 0 24 24" aria-hidden="true" style="width:24px;height:24px;fill:#fff"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg>'
  };

  /* ---------------- progress / profile (localStorage) ---------------- */
  var KEY = "chloe_world_progress_v1";
  function loadProgress(){
    try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; }
  }
  function saveProgress(p){ try{ localStorage.setItem(KEY, JSON.stringify(p)); }catch(e){} }
  var progress = loadProgress();
  if(!progress.child) progress.child = "Chloe";
  if(!progress.visited) progress.visited = {};   // key -> count
  if(!progress.plays) progress.plays = 0;        // sounds/videos played
  if(!progress.sessions) progress.sessions = 0;
  if(!progress.recipes) progress.recipes = 0;    // meal-plan recipes opened (grown-ups + baby)
  if(!progress.firstSeen) progress.firstSeen = Date.now();
  function recordVisit(key){ progress.visited[key] = (progress.visited[key]||0)+1; saveProgress(progress); }
  function recordPlay(){ progress.plays++; saveProgress(progress); }
  function recordRecipe(){ progress.recipes++; saveProgress(progress); }

  /* ---------------- speech (name + words read aloud) ----------------
     A soft, gentle, slightly sing-song voice for a toddler. Pitch and rate
     carry the charm even on Safari/iOS, which often ignores the chosen voice.
     Sweet spot: rate ~0.85 to 0.9 (not sped-up), pitch ~1.3 (cute, not chipmunk). */
  var voice=null, speechPrimed=false, voicesReady=false;
  // best-to-acceptable: warm Apple voices first, then clean cross-browser fallbacks
  var VOICE_PREFS=["Samantha (Enhanced)","Samantha (Premium)","Samantha",
    "Google US English","Microsoft Aria Online","Microsoft Jenny",
    "Karen","Moira","Tessa","Victoria"];
  function pickVoice(){
    if(!("speechSynthesis" in window)) return;
    var vs=window.speechSynthesis.getVoices(); if(!vs.length) return;
    voicesReady=true;
    var en=vs.filter(function(v){ return /^en/i.test(v.lang); });
    for(var p=0;p<VOICE_PREFS.length;p++) for(var i=0;i<en.length;i++)
      if(en[i].name===VOICE_PREFS[p]){ voice=en[i]; return; }
    for(var j=0;j<en.length;j++) if(en[j].default){ voice=en[j]; return; }
    voice=en[0]||vs[0];
  }
  if("speechSynthesis" in window){
    pickVoice(); window.speechSynthesis.onvoiceschanged=pickVoice;
    // older Safari can fail to fire onvoiceschanged, so poll briefly as well
    var _vTries=0, _vPoll=setInterval(function(){ pickVoice(); if(voicesReady||++_vTries>10){ clearInterval(_vPoll); } },200);
  }
  function speak(text, rate, onend, pitch){
    if(!("speechSynthesis" in window)){ if(onend) onend(); return; }
    try{ window.speechSynthesis.cancel();   // clear any stuck queue (iOS quirk) before speaking
      var u=new SpeechSynthesisUtterance(text); if(voice) u.voice=voice;
      u.lang=(voice&&voice.lang)||"en-US";
      u.rate=rate||0.9; u.pitch=(typeof pitch==="number")?pitch:1.3; u.volume=1;
      if(onend){ var done=false, fin=function(){ if(done) return; done=true; onend(); };
        u.onend=fin; u.onerror=fin; }   // onend is unreliable on Safari, so onerror also resolves it
      window.speechSynthesis.speak(u);
    }catch(e){ if(onend) onend(); }
  }
  function primeSpeech(){
    if(speechPrimed||!("speechSynthesis" in window)) return; speechPrimed=true;
    try{ var u=new SpeechSynthesisUtterance(" "); u.volume=0; window.speechSynthesis.speak(u); }catch(e){}
  }

  /* ---------------- shared audio (real animal sounds) ---------------- */
  var sndCache={}, curSnd=null;
  function clearRamp(a){ if(a&&a._ramp){ clearInterval(a._ramp); a._ramp=null; } }
  function playSound(src, onend, vol){
    if(curSnd){ try{ clearRamp(curSnd); curSnd.pause(); curSnd.currentTime=0; }catch(e){} }
    var a=sndCache[src]||(sndCache[src]=new Audio(src)); a.preload="auto"; curSnd=a;
    a.onended=function(){ clearRamp(a); if(onend) onend(); };
    try{ a.currentTime=0; }catch(e){}
    // A per-sound target volume keeps loud calls (roars, squawks) from startling a child held
    // close to the iPad, and a short fade-in softens the onset of every sound (Calm).
    var target=(typeof vol==="number")?vol:1; clearRamp(a);
    a.volume=0; var i=0, steps=8;
    a._ramp=setInterval(function(){ i++; try{ a.volume=Math.min(target, target*i/steps); }catch(e){} if(i>=steps) clearRamp(a); }, 18);
    var pr=a.play(); recordPlay();
    if(pr&&pr.catch) pr.catch(function(){ clearRamp(a); if(onend) onend(); });
    return a;
  }
  function stopSound(){ if(curSnd){ try{ clearRamp(curSnd); curSnd.pause(); curSnd.currentTime=0; }catch(e){} } if("speechSynthesis" in window){ try{ window.speechSynthesis.cancel(); }catch(e){} } }

  /* ---------------- little helpers ---------------- */
  function el(html){ var d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
  function toast(msg){
    var t=document.querySelector(".toast")||document.body.appendChild(el('<div class="toast"></div>'));
    t.textContent=msg; t.classList.add("show"); clearTimeout(t._h);
    t._h=setTimeout(function(){ t.classList.remove("show"); },1900);
  }
  function sparkle(x,y,opts){
    // respect Calm and a child's sensory comfort: no particles and no buzz when reduced motion is on
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    opts=opts||{};
    var count=opts.count||7, spread=opts.spread||72, rise=opts.rise||90, life=opts.life||1150;
    // soft blush petals of light drawn in CSS (no emoji); they drift up, decelerate, and fade
    for(var i=0;i<count;i++){ var s=el('<div class="spark"></div>');
      s.style.left=(x+(Math.random()*spread-spread/2))+"px"; s.style.top=(y-8)+"px";
      s.style.setProperty("--rise",(-(rise*(0.6+Math.random()*0.7)))+"px");
      s.style.setProperty("--dx",(Math.random()*44-22)+"px");
      s.style.setProperty("--rot",(Math.random()*44-22)+"deg");
      s.style.setProperty("--es",(1.0+Math.random()*0.5).toFixed(2));
      s.style.animationDuration=(life/1000).toFixed(2)+"s";
      s.style.animationDelay=(Math.random()*0.2).toFixed(2)+"s"; document.body.appendChild(s);
      (function(n){ setTimeout(function(){ n.remove(); },life+360); })(s);
    }
    try{ if(navigator.vibrate) navigator.vibrate(8); }catch(e){}  // gentle haptic where supported
  }

  /* ---------------- motion gate + gentle scroll motion (Calm) ----------------
     One switch governs every motion: a JS boolean (MOTION_OK) stops loops, and a
     CSS hook (html.motion-ok) gates idle drift, twinkle, and the scroll reveal's
     hidden pre-state. With reduced motion, content is simply, fully present. */
  var _mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var MOTION_OK = !(_mq && _mq.matches);
  function applyMotionClass(){ document.documentElement.classList.toggle("motion-ok", MOTION_OK); }
  if(_mq){ var _onMQ=function(e){ MOTION_OK=!e.matches; applyMotionClass(); };
    if(_mq.addEventListener) _mq.addEventListener("change",_onMQ); else if(_mq.addListener) _mq.addListener(_onMQ); }
  applyMotionClass();

  var _revealIO=null;
  function ensureIO(){
    if(_revealIO || !("IntersectionObserver" in window)) return _revealIO;
    _revealIO=new IntersectionObserver(function(entries,obs){
      entries.forEach(function(en){ if(!en.isIntersecting) return;
        var t=en.target, idx=Number(t.getAttribute("data-index")||0);
        t.style.setProperty("--reveal-delay",(idx*90)+"ms");
        t.classList.add("in"); obs.unobserve(t);
      });
    },{ threshold:0.14, rootMargin:"0px 0px -8% 0px" });
    return _revealIO;
  }
  // blocks that gently rise into view as you scroll. Nested reveals are avoided by
  // selecting leaf-level cards (.mcard, .tile) plus standalone section blocks.
  var REVEAL_SEL=".tile,.section-title,.mcard,.src-note,.mk,.tipbar,.h-hero,.meals-hero,.day-shop,.iron-nudge";
  function autoReveal(scope){
    scope=scope||document;
    var nodes=scope.querySelectorAll(REVEAL_SEL);
    if(!MOTION_OK || !("IntersectionObserver" in window)){
      [].forEach.call(nodes,function(n){ n.classList.add("in"); }); return;
    }
    var io=ensureIO();
    [].forEach.call(nodes,function(n){
      if(n.closest && n.closest(".detail-inner")) return;   // detail + game keep their own load stagger
      if(n.hasAttribute("data-reveal")) return;
      var idx=0, p=n.previousElementSibling;                // stagger resets per row/grid
      while(p){ if(p.matches && p.matches(REVEAL_SEL)) idx++; p=p.previousElementSibling; }
      n.setAttribute("data-reveal","");
      n.setAttribute("data-index", Math.min(idx,6));
      io.observe(n);
    });
  }
  function ambientParallax(){
    if(!MOTION_OK) return;
    var layers=[].slice.call(document.querySelectorAll("[data-parallax]")).map(function(elx){
      return { el:elx, speed:parseFloat(elx.getAttribute("data-parallax"))||0.04 };
    });
    if(!layers.length) return;
    var latestY=window.scrollY||window.pageYOffset||0, ticking=false;
    function upd(){ for(var i=0;i<layers.length;i++){ var l=layers[i];
      l.el.style.transform="translate3d(0,"+(latestY*l.speed).toFixed(2)+"px,0)"; } ticking=false; }
    window.addEventListener("scroll",function(){ latestY=window.scrollY||window.pageYOffset||0;
      if(!ticking){ ticking=true; requestAnimationFrame(upd); } },{passive:true});
  }
  function injectAmbient(){
    if(document.querySelector(".ambient")) return;
    var pts=[[16,22],[27,68],[44,13],[60,53],[77,30],[86,74]], tw="";
    for(var i=0;i<pts.length;i++){ tw+='<span class="tw" style="top:'+pts[i][0]+'%;left:'+pts[i][1]+'%"></span>'; }
    var a=el('<div class="ambient" aria-hidden="true">'+
      '<span class="orb-track" data-parallax="0.03" style="top:14%;left:10%"><span class="orb orb--blush"></span></span>'+
      '<span class="orb-track" data-parallax="0.05" style="top:58%;left:88%"><span class="orb orb--lilac"></span></span>'+
      '<span class="orb-track" data-parallax="0.04" style="top:33%;left:80%"><span class="orb orb--peach"></span></span>'+
      '<div class="tw-field">'+tw+'</div>'+
    '</div>');
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ---------------- boy / girl theme ----------------
     Girl is the default rose "First Light"; boy is the light-blue "Clear Morning"
     (a data-theme on <html> that overrides the colour tokens). The choice is saved,
     so a friend who sets it once keeps it. One tap in the top bar switches live. */
  var THEME_KEY="chloe_theme_v1";
  function loadTheme(){ try{ return localStorage.getItem(THEME_KEY)==="boy"?"boy":"girl"; }catch(e){ return "girl"; } }
  var currentTheme=loadTheme();
  function applyTheme(t){
    currentTheme=(t==="boy")?"boy":"girl";
    document.documentElement.setAttribute("data-theme",currentTheme);
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute("content", currentTheme==="boy" ? "#e6eef9" : "#fbe7ec");
    // keep any visible toggle in sync
    var btns=document.querySelectorAll(".theme-toggle .thm");
    [].forEach.call(btns,function(b){ var on=b.getAttribute("data-thm")===currentTheme;
      b.classList.toggle("on",on); b.setAttribute("aria-pressed",on?"true":"false"); });
  }
  function setTheme(t){ try{ localStorage.setItem(THEME_KEY,(t==="boy")?"boy":"girl"); }catch(e){} applyTheme(t); }
  applyTheme(currentTheme);   // apply immediately so the first paint is already themed

  /* ---------------- session guardrails (Calm + Crowding Out) ---------------- */
  var SESSION_SOFT_MS = 7*60*1000;   // gentle nudge to the grown-up after ~7 min, fired on a timer so it shows even without navigating (short shared bursts suit toddlers)
  var sessionStart = Date.now(), nudged=false;
  var REAL_WORLD = [
    "Go outside and find a real animal together, like a bird, a cat, or a dog.",
    "Open a picture book about animals and name them out loud together.",
    "Make animal sounds together: can you both moo like a cow?",
    "Have a snack together and talk about the animals you just saw.",
    "Go for a little walk and look for a friendly dog to wave at."
  ];
  function realWorldPick(){ return REAL_WORLD[Math.floor((Date.now()/1000)%REAL_WORLD.length)]; }
  function maybeNudge(){
    if(nudged) return;
    if(Date.now()-sessionStart > SESSION_SOFT_MS){ nudged=true; toast("You have been playing a while. A real-world break soon is nice."); }
  }

  /* ---------------- router ---------------- */
  var modules={}, root;
  function go(hash){ if(location.hash===hash) render(); else location.hash=hash; }
  function render(){
    maybeNudge();
    stopSound();   // never let a sound or spoken line bleed across a navigation (tab switch, edge-swipe back)
    var h=location.hash||"#/";
    var isLanding=(h===""||h==="#/"||h==="#/welcome");
    // the grown-ups Table and the My World landing each run their own dark theme, scoped by a
    // body class so they never touch the children's light rose world. Toggled per route.
    document.body.classList.toggle("gm-active", h==="#/grownmeals");
    document.body.classList.toggle("lp-active", isLanding);
    root.innerHTML="";
    var m=h.match(/^#\/animal\/([a-z]+)/);
    if(isLanding){ var lm=modules.landing; if(lm&&lm.renderHome){ lm.renderHome(root); } else { ChloePlatform._renderHome(root); } }
    else if(h==="#/home"){ ChloePlatform._renderHome(root); }
    else if(m){ ChloePlatform._renderDetail(root, m[1]); }
    else if(h==="#/done"){ renderAllDone(root); }
    else if(h==="#/grownups"){ renderParentGate(root); }
    else if(h==="#/meals"){ var mm=modules.meals; if(mm&&mm.renderHome){ mm.renderHome(root); } else { ChloePlatform._renderHome(root); } }
    else if(h==="#/grownmeals"){ var gmm=modules.grownmeals; if(gmm&&gmm.renderHome){ gmm.renderHome(root); } else { ChloePlatform._renderHome(root); } }
    else if(h==="#/game"){ var gm=modules.animals; if(gm&&gm.renderGame){ gm.renderGame(root); } else { ChloePlatform._renderHome(root); } }
    else { ChloePlatform._renderHome(root); }
    window.scrollTo(0,0);
    autoReveal(root);   // fresh content gently rises in as it scrolls into view
  }

  /* ---------------- top bar (guide + controls) ---------------- */
  function topbar(){
    var rays=""; for(var i=0;i<8;i++){ rays+='<span class="ray" style="--a:'+(i*45)+'deg"></span>'; }
    var bar=el(
      '<div class="topbar">'+
        '<div class="sunny spin" title="Sunny, your guide"><div class="core"></div>'+rays+'</div>'+
        '<div class="brand" data-act="landing" role="button" tabindex="0" title="Back to My World">My World <small>For you, and your little one</small></div>'+
        '<div class="spacer"></div>'+
        '<div class="theme-toggle" role="group" aria-label="Choose the theme: girl or boy">'+
          '<button class="thm thm-girl'+(currentTheme==="girl"?" on":"")+'" data-thm="girl" aria-pressed="'+(currentTheme==="girl")+'"><span class="sw" aria-hidden="true"></span>Girl</button>'+
          '<button class="thm thm-boy'+(currentTheme==="boy"?" on":"")+'" data-thm="boy" aria-pressed="'+(currentTheme==="boy")+'"><span class="sw" aria-hidden="true"></span>Boy</button>'+
        '</div>'+
        '<button class="pill-btn ghost" data-act="grownups">For grown-ups</button>'+
        '<button class="pill-btn warm" data-act="done">All done</button>'+
      '</div>');
    bar.addEventListener("click",function(e){
      var tb=e.target.closest("[data-thm]");
      if(tb){ setTheme(tb.getAttribute("data-thm")); return; }   // switch theme live, no reload
      var b=e.target.closest("[data-act]"); if(!b) return;
      if(b.dataset.act==="landing") go("#/");
      if(b.dataset.act==="done") go("#/done");
      if(b.dataset.act==="grownups") go("#/grownups");
    });
    return bar;
  }

  /* ---------------- top-level sections (Entertainment / Meal Plans) ---------------- */
  // Two areas sit at the top of the app. "Entertainment" holds the animal world today
  // (and any future play modules). "Meal Plans" is the next area we are building.
  var SEC_ICON={
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.7 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17l-5.6 3 1.1-6.3L2.9 9.3l6.3-.9z"/></svg>',
    meals:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M12 3c1.9 0 3.4 1.5 3.4 3.4 0 .6-.1 1.1-.4 1.6H9c-.3-.5-.4-1-.4-1.6C8.6 4.5 10.1 3 12 3z" opacity=".7"/></svg>',
    grownmeals:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l-1.2 6.6A5 5 0 0 1 13 13.4V19h3v2H8v-2h3v-5.6A5 5 0 0 1 7.2 9.6L6 3z"/></svg>'
  };
  var SECTIONS=[
    { id:"grownmeals", label:"Grown-Ups",          sub:"Meal Plan",  hash:"#/grownmeals" },
    { id:"meals",      label:"Baby Meal Plan",     sub:"By age",     hash:"#/meals"      },
    { id:"play",       label:"Baby Entertainment", sub:"Animals",    hash:"#/home"       }
  ];
  function sectionNav(active){
    var nav=el('<nav class="section-nav" aria-label="Sections"></nav>');
    SECTIONS.forEach(function(s){
      var b=el('<button class="sec-tab'+(s.id===active?' on':'')+'" data-go="'+s.hash+'"'+(s.id===active?' aria-current="page"':'')+'>'+
        '<span class="sec-ico" aria-hidden="true">'+(SEC_ICON[s.id]||'')+'</span>'+
        '<span class="sec-tx"><b>'+s.label+'</b><small>'+s.sub+'</small></span>'+
      '</button>');
      nav.appendChild(b);
    });
    nav.addEventListener("click",function(e){ var b=e.target.closest("[data-go]"); if(!b) return; go(b.dataset.go); });
    return nav;
  }

  /* ---------------- all-done / session end ---------------- */
  function renderAllDone(rootEl){
    progress.sessions++; saveProgress(progress);
    var v=el('<div class="view">');
    v.appendChild(topbar());
    var n=Object.keys(progress.visited).length;
    v.appendChild(el(
      '<div class="alldone">'+
        '<div style="height:90px;display:flex;align-items:center;justify-content:center;margin-bottom:14px"><div style="transform:scale(1.85)"><div class="sunny spin"><div class="core"></div>'+
          Array.from({length:8}).map(function(_,i){return '<span class="ray" style="--a:'+(i*45)+'deg"></span>';}).join('')+'</div></div></div>'+
        '<h2 class="big">All done for now!</h2>'+
        '<p class="sub">Great playing together'+(n?(', you met '+n+' animal'+(n>1?'s':'')):'')+'.</p>'+
        '<div class="activity"><div class="k">Now let\'s go play in the real world</div>'+
          '<div class="v">'+realWorldPick()+'</div></div>'+
        '<button class="pill-btn warm" style="min-height:64px;font-size:1.15rem" data-act="home">Back to the animals</button>'+
      '</div>'));
    v.querySelector('[data-act="home"]').addEventListener("click",function(){ sessionStart=Date.now(); nudged=false; go("#/home"); });
    rootEl.appendChild(v);
    speak("All done for now! Let's go play together.");
  }

  /* ---------------- parent-only area (gated) ---------------- */
  function renderParentGate(rootEl){
    var v=el('<div class="view">'); v.appendChild(topbar());
    var g=el(
      '<div class="parent-gate">'+
        '<h3>For grown-ups</h3>'+
        '<p style="color:var(--muted)">This area is for you, not for Chloe. Press and hold the button to open.</p>'+
        '<button class="hold"><span class="fill"></span><span class="t">Hold to open</span></button>'+
      '</div>');
    var btn=g.querySelector(".hold"), fill=g.querySelector(".fill"); var t0=0, raf=0, holding=false;
    function step(){ var p=Math.min(1,(Date.now()-t0)/1200); fill.style.width=(p*100)+"%"; if(p>=1){ holding=false; renderParentView(rootEl); return; } if(holding) raf=requestAnimationFrame(step); }
    function start(e){ e.preventDefault(); holding=true; t0=Date.now(); raf=requestAnimationFrame(step); }
    function end(){ holding=false; cancelAnimationFrame(raf); fill.style.width="0"; }
    btn.addEventListener("pointerdown",start); btn.addEventListener("pointerup",end); btn.addEventListener("pointerleave",end);
    v.appendChild(g); rootEl.appendChild(v);
  }
  function renderParentView(rootEl){
    rootEl.innerHTML=""; var v=el('<div class="view">'); v.appendChild(topbar());
    var names=Object.keys(progress.visited).map(function(k){ var a=ChloePlatform._animal(k); return a?a.name:k; });
    var mins=Math.round((Date.now()-sessionStart)/60000);
    var pv=el(
      '<div class="parent-view">'+
        '<h3>'+progress.child+'\'s activity</h3>'+
        '<div class="stat-row"><span>Animals explored together</span><span class="v">'+names.length+'</span></div>'+
        '<div class="stat-row"><span>Time together this session</span><span class="v">'+mins+' min</span></div>'+
        '<div class="stat-row"><span>Sessions together</span><span class="v">'+progress.sessions+'</span></div>'+
        (names.length?'<div class="explored">'+names.map(function(n){return '<span>'+n+'</span>';}).join('')+'</div>':'')+
        '<p class="parent-note" style="margin-top:16px"><b>Co-play tip.</b> Children learn far more from screens when a parent watches with them and talks about it. Name the animal, copy its sound, and ask Chloe simple questions. The Grown-Up Card on each animal gives you a prompt and a real-world follow-up.</p>'+
        '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">'+
          '<button class="pill-btn" data-act="home">Back to animals</button>'+
          '<button class="pill-btn ghost" data-act="reset">Reset progress</button>'+
        '</div>'+
      '</div>');
    pv.querySelector('[data-act="home"]').addEventListener("click",function(){ go("#/home"); });
    pv.querySelector('[data-act="reset"]').addEventListener("click",function(){
      progress={child:"Chloe",visited:{},plays:0,sessions:0}; saveProgress(progress); toast("Progress reset."); renderParentView(rootEl);
    });
    v.appendChild(pv); rootEl.appendChild(v);
  }

  /* ---------------- public platform API ---------------- */
  window.ChloePlatform = {
    icon:ICON, speak:speak, playSound:playSound, stopSound:stopSound,
    recordVisit:recordVisit, toast:toast, sparkle:sparkle, el:el, go:go,
    topbar:topbar, sectionNav:sectionNav, realWorldPick:realWorldPick, autoReveal:autoReveal,
    motionOK:function(){ return MOTION_OK; },
    getProgress:function(){ return progress; },
    recordRecipe:recordRecipe,
    sessionStartMs:function(){ return sessionStart; },
    registerModule:function(cfg){ modules[cfg.id]=cfg; },
    _module:function(id){ return modules[id]; },
    _animal:function(key){ var m=modules.animals; return m&&m.animals[key]; },
    // these are filled in by the animals module so the core can route to it
    _renderHome:function(r){ var m=modules.animals; if(m&&m.renderHome) m.renderHome(r); },
    _renderDetail:function(r,k){ var m=modules.animals; if(m&&m.renderDetail) m.renderDetail(r,k); },
    init:function(){
      root=document.getElementById("app");
      injectAmbient();      // the drifting dawn orbs + twinkles, behind everything
      ambientParallax();    // a barely-there scroll parallax on those orbs
      document.addEventListener("pointerdown",function once(){ primeSpeech(); document.removeEventListener("pointerdown",once); });
      window.addEventListener("hashchange",render);
      setInterval(maybeNudge, 30000);   // the break nudge shows even if the page never changes
      render();
    }
  };
})();
