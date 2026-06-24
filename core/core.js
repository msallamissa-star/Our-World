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
  function recordVisit(key){ progress.visited[key] = (progress.visited[key]||0)+1; saveProgress(progress); }
  function recordPlay(){ progress.plays++; saveProgress(progress); }

  /* ---------------- speech (name + words read aloud) ---------------- */
  var voice=null, speechPrimed=false;
  function pickVoice(){
    if(!("speechSynthesis" in window)) return;
    var vs=window.speechSynthesis.getVoices(); if(!vs.length) return;
    var pref=["Samantha","Karen","Tessa","Google US English","Microsoft Zira","Victoria","Moira","female"];
    var en=vs.filter(function(v){ return /^en/i.test(v.lang); });
    for(var p=0;p<pref.length;p++) for(var i=0;i<en.length;i++)
      if(en[i].name.toLowerCase().indexOf(pref[p].toLowerCase())>-1){ voice=en[i]; return; }
    voice=en[0]||vs[0];
  }
  if("speechSynthesis" in window){ pickVoice(); window.speechSynthesis.onvoiceschanged=pickVoice; }
  function speak(text, rate, onend){
    if(!("speechSynthesis" in window)){ if(onend) onend(); return; }
    try{ window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text); if(voice) u.voice=voice;
      u.rate=rate||0.9; u.pitch=1.12;
      if(onend){ u.onend=function(){ onend(); }; u.onerror=function(){ onend(); }; }
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
  function sparkle(x,y){
    // respect Calm and a child's sensory comfort: no particles and no buzz when reduced motion is on
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // soft golden particles drawn in CSS (no emoji), to fit the cinematic theme
    for(var i=0;i<7;i++){ var s=el('<div class="spark"></div>');
      s.style.left=(x+(Math.random()*72-36))+"px"; s.style.top=(y-8)+"px";
      var sc=0.7+Math.random()*0.8; s.style.transform="scale("+sc+")";
      s.style.animationDelay=(Math.random()*0.12)+"s"; document.body.appendChild(s);
      (function(n){ setTimeout(function(){ n.remove(); },1150); })(s);
    }
    try{ if(navigator.vibrate) navigator.vibrate(8); }catch(e){}  // gentle haptic where supported
  }

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
    var h=location.hash||"#/home";
    root.innerHTML="";
    var m=h.match(/^#\/animal\/([a-z]+)/);
    if(h==="#/home"||h===""||h==="#/"){ ChloePlatform._renderHome(root); }
    else if(m){ ChloePlatform._renderDetail(root, m[1]); }
    else if(h==="#/done"){ renderAllDone(root); }
    else if(h==="#/grownups"){ renderParentGate(root); }
    else if(h==="#/meals"){ var mm=modules.meals; if(mm&&mm.renderHome){ mm.renderHome(root); } else { ChloePlatform._renderHome(root); } }
    else if(h==="#/game"){ var gm=modules.animals; if(gm&&gm.renderGame){ gm.renderGame(root); } else { ChloePlatform._renderHome(root); } }
    else { ChloePlatform._renderHome(root); }
    window.scrollTo(0,0);
  }

  /* ---------------- top bar (guide + controls) ---------------- */
  function topbar(){
    var rays=""; for(var i=0;i<8;i++){ rays+='<span class="ray" style="--a:'+(i*45)+'deg"></span>'; }
    var bar=el(
      '<div class="topbar">'+
        '<div class="sunny spin" title="Sunny, your guide"><div class="core"></div>'+rays+'</div>'+
        '<div class="brand">Chloe\'s World <small>Learn together with Sunny</small></div>'+
        '<div class="spacer"></div>'+
        '<button class="pill-btn ghost" data-act="grownups">For grown-ups</button>'+
        '<button class="pill-btn warm" data-act="done">All done</button>'+
      '</div>');
    bar.addEventListener("click",function(e){
      var b=e.target.closest("[data-act]"); if(!b) return;
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
    meals:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M12 3c1.9 0 3.4 1.5 3.4 3.4 0 .6-.1 1.1-.4 1.6H9c-.3-.5-.4-1-.4-1.6C8.6 4.5 10.1 3 12 3z" opacity=".7"/></svg>'
  };
  var SECTIONS=[
    { id:"play",  label:"Entertainment", sub:"Animals",      hash:"#/home"  },
    { id:"meals", label:"Meal Plans",    sub:"Daily plans",  hash:"#/meals" }
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
    topbar:topbar, sectionNav:sectionNav, realWorldPick:realWorldPick,
    getProgress:function(){ return progress; },
    registerModule:function(cfg){ modules[cfg.id]=cfg; },
    _module:function(id){ return modules[id]; },
    _animal:function(key){ var m=modules.animals; return m&&m.animals[key]; },
    // these are filled in by the animals module so the core can route to it
    _renderHome:function(r){ var m=modules.animals; if(m&&m.renderHome) m.renderHome(r); },
    _renderDetail:function(r,k){ var m=modules.animals; if(m&&m.renderDetail) m.renderDetail(r,k); },
    init:function(){
      root=document.getElementById("app");
      document.addEventListener("pointerdown",function once(){ primeSpeech(); document.removeEventListener("pointerdown",once); });
      window.addEventListener("hashchange",render);
      setInterval(maybeNudge, 30000);   // the break nudge shows even if the page never changes
      render();
    }
  };
})();
