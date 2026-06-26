/* ============================================================
   My World, Landing
   The front door of the platform. A calm, professional, editorial
   page that states the purpose, presents the three areas, shows the
   parent what they have done (an advanced session panel), and invites
   requests. Dark premium theme scoped behind body.lp-active, distinct
   from the children's light rose world.
   ============================================================ */
(function(){
  "use strict";
  var P = window.ChloePlatform, el = P.el;

  var IC = {
    table:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l-1.2 6.6A5 5 0 0 1 13 13.4V19h3v2H8v-2h3v-5.6A5 5 0 0 1 7.2 9.6L6 3z"/></svg>',
    spoon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2.8 0 5 2.7 5 6 0 2.6-1.4 4.8-3.4 5.6L14 22h-4l.4-8.4C8.4 12.8 7 10.6 7 8c0-3.3 2.2-6 5-6z"/></svg>',
    star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.7 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17l-5.6 3 1.1-6.3L2.9 9.3l6.3-.9z"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h13.2l-4.6-4.6L14 5l7 7-7 7-1.4-1.4 4.6-4.6H4z"/></svg>'
  };

  var SECTIONS = [
    { id:"grownmeals", kicker:"For you", title:"Grown-Ups Meal Plan", hash:"#/grownmeals", icon:IC.table,
      desc:"A fine-dining meal planner for the parent. Lunch and dinner across eight cuisines, two genuinely easy ideas and one world-class signature each day, each with the method, the ingredients and a ready shopping list.",
      points:["209 chef-built dishes","Calories, macros and allergens on every plate","Filter by cuisine, craving and diet"] },
    { id:"meals", kicker:"For their health", title:"Baby Meal Plan", hash:"#/meals", icon:IC.spoon,
      desc:"An age-aware feeding plan from six months to five years, built on AAP, CDC, WHO and NHS guidance and reviewed by a pediatric committee. Choose an age and the whole menu adjusts to safe foods and textures.",
      points:["Adjusts to your child's exact age","Choking, allergen and milk guidance","Iron first, with no salt, sugar or honey"] },
    { id:"play", kicker:"For their world", title:"Baby Entertainment", hash:"#/home", icon:IC.star,
      desc:"A calm, ad-free corner for watching and learning together. Real photos, real sounds and real video of animals, shaped by the pediatric guidance on screen time, made to be named out loud side by side.",
      points:["Real media, never cartoons","Built for watching together","A gentle, ad-free space"] }
  ];

  /* ---------------- requests (saved on the device) ----------------
     A static site has no server, so requests are kept in localStorage and
     shown back to the parent. Set REQUEST_EMAIL to also offer an email hand-off,
     or wire a form service (Formspree, Google Forms) to collect them centrally. */
  var REQUEST_EMAIL = "";
  var RKEY = "myworld_requests_v1";
  function loadReqs(){ try{ return JSON.parse(localStorage.getItem(RKEY))||[]; }catch(e){ return []; } }
  function saveReqs(a){ try{ localStorage.setItem(RKEY, JSON.stringify(a)); }catch(e){} }

  /* ---------------- session + lifetime stats ---------------- */
  function favCount(){
    var n=0;
    ["chloe_grownmeals_v1","chloe_meals_v1"].forEach(function(k){
      try{ var p=JSON.parse(localStorage.getItem(k)); if(p&&p.favorites) n+=p.favorites.length; }catch(e){}
    });
    return n;
  }
  function stats(){
    var pr=P.getProgress();
    var mins=Math.max(0, Math.round((Date.now()-P.sessionStartMs())/60000));
    return [
      { key:"time",    value:mins, suffix:mins===1?" min":" mins", label:"With us today", sub:"this visit" },
      { key:"recipes", value:pr.recipes||0, label:"Recipes opened", sub:"meals you explored" },
      { key:"animals", value:Object.keys(pr.visited||{}).length, label:"Animals met", sub:"together, so far" },
      { key:"favs",    value:favCount(), label:"Saved favourites", sub:"kept for later" },
      { key:"visits",  value:(pr.sessions||0)+1, label:"Visits", sub:"to My World" }
    ];
  }

  /* ---------------- scroll reveal + count-up ---------------- */
  var _io=null;
  function countUp(node, to){
    if(!P.motionOK()){ node.textContent=to; return; }
    var dur=900, t0=null;
    function step(ts){ if(t0===null) t0=ts; var k=Math.min(1,(ts-t0)/dur);
      var eased=1-Math.pow(1-k,3); node.textContent=Math.round(eased*to);
      if(k<1) requestAnimationFrame(step); else node.textContent=to; }
    requestAnimationFrame(step);
  }
  function lpReveal(scope){
    var nodes=scope.querySelectorAll("[data-lp]");
    function show(n){ n.classList.add("lp-in"); var c=n.querySelector&&n.querySelector("[data-count]"); if(c) countUp(c, Number(c.getAttribute("data-count"))||0); }
    if(!P.motionOK() || !("IntersectionObserver" in window)){ [].forEach.call(nodes,show); return; }
    if(!_io){ _io=new IntersectionObserver(function(ents,obs){ ents.forEach(function(e){ if(e.isIntersecting){ show(e.target); obs.unobserve(e.target); } }); },{ threshold:0.16, rootMargin:"0px 0px -8% 0px" }); }
    [].forEach.call(nodes,function(n){ _io.observe(n); });
  }
  function scrollTo(id){ var t=document.getElementById(id); if(t) t.scrollIntoView({behavior:P.motionOK()?"smooth":"auto", block:"start"}); }

  /* ---------------- pieces ---------------- */
  function header(){
    var h=el('<header class="lp-top">'+
      '<div class="lp-brand"><span class="lp-mark" aria-hidden="true"></span>My&nbsp;World</div>'+
      '<nav class="lp-nav">'+
        '<button data-to="lp-sections">Sections</button>'+
        '<button data-to="lp-about">About</button>'+
        '<button data-to="lp-requests">Requests</button>'+
      '</nav></header>');
    h.addEventListener("click",function(e){ var b=e.target.closest("[data-to]"); if(b) scrollTo(b.getAttribute("data-to")); });
    return h;
  }
  function sectionCard(s, i){
    var c=el('<article class="lp-card" tabindex="0" role="button" data-lp="rise" style="--lp-delay:'+(i*110)+'ms" aria-label="Open '+s.title+'">'+
      '<div class="lp-card-ic" aria-hidden="true">'+s.icon+'</div>'+
      '<span class="lp-kick">'+s.kicker+'</span>'+
      '<h3 class="lp-display">'+s.title+'</h3>'+
      '<p class="lp-card-desc">'+s.desc+'</p>'+
      '<ul class="lp-points">'+s.points.map(function(p){ return '<li>'+p+'</li>'; }).join("")+'</ul>'+
      '<span class="lp-enter">Enter '+IC.arrow+'</span>'+
    '</article>');
    function open(){ P.go(s.hash); }
    c.addEventListener("click",open);
    c.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); open(); } });
    return c;
  }
  function statTile(s, i){
    return el('<div class="lp-stat" data-lp="rise" style="--lp-delay:'+(i*80)+'ms">'+
      '<div class="lp-stat-v"><span data-count="'+s.value+'">0</span>'+(s.suffix?'<i>'+s.suffix+'</i>':'')+'</div>'+
      '<div class="lp-stat-l">'+s.label+'</div>'+
      '<div class="lp-stat-s">'+s.sub+'</div>'+
    '</div>');
  }
  function requestsBlock(){
    var sec=el('<section class="lp-requests" id="lp-requests" data-lp="rise">'+
      '<span class="lp-kick">Shape My World</span>'+
      '<h2 class="lp-display">Tell us what to <span class="it">build next</span></h2>'+
      '<p class="lp-lead">This platform grows from what parents actually need. If there is something you would like us to add or change, a section, a feature, a cuisine, a tracker, write it here.</p>'+
    '</section>');
    var form=el('<form class="lp-form" novalidate>'+
      '<label class="lp-field"><span>Your idea or request</span><textarea rows="3" required placeholder="I would love to see..."></textarea></label>'+
      '<label class="lp-field half"><span>Your name (optional)</span><input type="text" placeholder="So we can thank you" /></label>'+
      '<button class="lp-btn" type="submit">Send it in</button>'+
    '</form>');
    var done=el('<div class="lp-thanks" hidden><b>Thank you.</b> Your idea is saved. We read every request as we shape what comes next.</div>');
    var list=el('<div class="lp-ideas"></div>');
    function renderList(){
      var reqs=loadReqs(); if(!reqs.length){ list.innerHTML=""; return; }
      list.innerHTML='<div class="lp-ideas-k">Your ideas so far</div>'+reqs.slice().reverse().map(function(r){
        return '<div class="lp-idea"><p>'+esc(r.text)+'</p><span>'+(r.name?esc(r.name)+' · ':'')+r.when+'</span></div>';
      }).join("");
    }
    form.addEventListener("submit",function(e){ e.preventDefault();
      var ta=form.querySelector("textarea"), nm=form.querySelector("input");
      var text=(ta.value||"").trim(); if(!text) return;
      var reqs=loadReqs(); reqs.push({ text:text, name:(nm.value||"").trim(), when:dateLabel() }); saveReqs(reqs);
      ta.value=""; nm.value=""; done.hidden=false; renderList();
      if(REQUEST_EMAIL){ window.location.href="mailto:"+REQUEST_EMAIL+"?subject="+encodeURIComponent("My World request")+"&body="+encodeURIComponent(text); }
      P.sparkle(window.innerWidth/2, window.scrollY+120);
    });
    sec.appendChild(form); sec.appendChild(done); sec.appendChild(list); renderList();
    return sec;
  }
  function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function dateLabel(){ try{ var d=new Date(); return d.toLocaleDateString(undefined,{day:"numeric",month:"short"}); }catch(e){ return ""; } }

  /* ---------------- the page ---------------- */
  function renderHome(root){
    root.innerHTML="";
    var v=el('<div class="view lp-view"></div>');
    v.appendChild(header());

    // hero
    v.appendChild(el(
      '<section class="lp-hero">'+
        '<span class="lp-kick" data-lp="rise">A quiet platform for parents</span>'+
        '<h1 class="lp-display" data-lp="rise-s">My <span class="it">World</span></h1>'+
        '<p class="lp-lede" data-lp="rise">The two things a parent thinks about most, gathered in one calm place: a little something for you, and everything for your little one’s health, food and world.</p>'+
        '<div class="lp-hero-acts" data-lp="rise">'+
          '<button class="lp-btn" data-go="#/grownmeals">Start with you '+IC.arrow+'</button>'+
          '<button class="lp-btn ghost" data-to="lp-sections">See the three areas</button>'+
        '</div>'+
        '<div class="lp-scroll" data-to="lp-about" aria-hidden="true"><span></span>scroll</div>'+
      '</section>'));

    // about / purpose
    v.appendChild(el(
      '<section class="lp-about" id="lp-about">'+
        '<div class="lp-rule" data-lp="rule"></div>'+
        '<p class="lp-statement" data-lp="rise">My World holds the things a parent cares about most. One side is <b>for you</b>, because a parent is a person too. The other is <b>for your child</b>, their food, their health and their early window of learning. Everything here is built on professional guidance and reviewed by expert panels, then made calm, clear and quietly beautiful.</p>'+
        '<div class="lp-pillars" data-lp="rise">'+
          '<div class="lp-pillar"><b>For you</b><span>A real meal planner worth cooking from, not an afterthought.</span></div>'+
          '<div class="lp-pillar"><b>For their health</b><span>Age-right nutrition, grounded in pediatric guidance.</span></div>'+
          '<div class="lp-pillar"><b>For their world</b><span>A gentle, ad-free place to learn together.</span></div>'+
        '</div>'+
      '</section>'));

    // sections
    var sw=el('<section class="lp-sections" id="lp-sections"></section>');
    sw.appendChild(el('<div class="lp-shead"><span class="lp-kick" data-lp="rise">Three areas, one home</span><h2 class="lp-display" data-lp="rise">Where would you like to <span class="it">begin</span>?</h2></div>'));
    var grid=el('<div class="lp-grid"></div>');
    SECTIONS.forEach(function(s,i){ grid.appendChild(sectionCard(s,i)); });
    sw.appendChild(grid);
    v.appendChild(sw);

    // session stats
    var stz=el('<section class="lp-stats" id="lp-stats">'+
      '<div class="lp-shead"><span class="lp-kick" data-lp="rise">Your time here</span><h2 class="lp-display" data-lp="rise">What you have done in <span class="it">My World</span></h2></div>'+
    '</section>');
    var srow=el('<div class="lp-stat-row"></div>');
    stats().forEach(function(s,i){ srow.appendChild(statTile(s,i)); });
    stz.appendChild(srow);
    v.appendChild(stz);

    // requests
    v.appendChild(requestsBlock());

    // footer
    v.appendChild(el(
      '<footer class="lp-foot" data-lp="rise">'+
        '<div class="lp-foot-brand">My World</div>'+
        '<p>A calm home for the parent and the child. Meal plans and learning built on professional guidance, reviewed by expert panels, and made to be genuinely useful. This is educational and supplements, it does not replace, your own doctor or pediatrician.</p>'+
      '</footer>'));

    v.addEventListener("click",function(e){
      var g=e.target.closest("[data-go]"); if(g){ P.go(g.getAttribute("data-go")); return; }
      var t=e.target.closest("[data-to]"); if(t){ scrollTo(t.getAttribute("data-to")); }
    });

    root.appendChild(v);
    lpReveal(v);
  }

  P.registerModule({ id:"landing", title:"My World", renderHome:renderHome });
})();
