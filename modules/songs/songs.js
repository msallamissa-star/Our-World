/* ============================================================
   Songs, part of Entertainment (audio only, no screen)
   The child listens, never watches. Each song is the rights
   holder's own YouTube upload, played through the official
   YouTube player with the video hidden behind a custom music
   face, so only the sound comes through. Nothing is downloaded
   or hosted; only the song title and the video id are stored.
   A parent can also paste any YouTube link to add a song.
   ============================================================ */
(function(){
  "use strict";
  var P = window.ChloePlatform, el = P.el;

  var SONGS = [{"name":"Hop Little Bunnies","lang":"en","id":"BRjsyzbvqsc","title":"Hop Little Bunnies | Sing A Long | Action Song | Hop Hop Hop","ch":"The Tiny Boppers","dur":"2:16"},{"name":"Johny Johny Yes Papa","lang":"en","id":"F4tHL8reNCs","title":"Johny Johny Yes Papa - THE BEST Song for Children","ch":"LooLoo Kids","dur":"1:41"},{"name":"The Wheels on the Bus","lang":"en","id":"9UasekNr8KI","title":"The Wheels On The Bus | @SuperSimpleSongs Nursery Rhymes & Kids Songs | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:36"},{"name":"Baby Shark","lang":"en","id":"XqZsoesa55w","title":"Baby Shark Dance | #babyshark Most Viewed Video | Animal Songs | PINKFONG Songs for Children","ch":"Baby Shark - Pinkfong Kids’ Songs & Stories","dur":"2:17"},{"name":"Twinkle Twinkle Little Star","lang":"en","id":"yCjJyiqpAuU","title":"Twinkle Twinkle Little Star | Nursery Rhymes for Kids | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:34"},{"name":"Old MacDonald Had a Farm","lang":"en","id":"_6HzoUcx3eo","title":"Old MacDonald Had A Farm | Nursery Rhymes | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"3:18"},{"name":"If You're Happy and You Know It","lang":"en","id":"l4WNrvVjiTw","title":"If You're Happy | Kids Song | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:04"},{"name":"Five Little Ducks","lang":"en","id":"pZw9veQ76fo","title":"Five Little Ducks | Kids Songs | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:54"},{"name":"The Itsy Bitsy Spider","lang":"en","id":"bne3Ix_tJL8","title":"The Eensy Weensy Spider | Kids Songs and Nursery Rhymes | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:24"},{"name":"Head, Shoulders, Knees and Toes","lang":"en","id":"RuqvGiZi0qg","title":"Head Shoulders Knees And Toes | Noodle & Pals | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"1:46"},{"name":"The Alphabet Song","lang":"en","id":"I_3mbra4dHU","title":"ABC Quack | Super Simple ABCs | Kids Alphabet Songs","ch":"Super Simple ABCs","dur":"3:16"},{"name":"Row Row Row Your Boat","lang":"en","id":"7otAJa3jui8","title":"Row Row Row Your Boat | Bedtime Lullaby | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:02"},{"name":"Five Little Monkeys","lang":"en","id":"iqjbSMeL4t8","title":"Five Little Monkeys Jumping on the Bed | CoComelon Nursery Rhymes & Kids Songs","ch":"Cocomelon - Nursery Rhymes","dur":"3:34"},{"name":"BINGO","lang":"en","id":"9mmF8zOlh_g","title":"BINGO | Nursery Rhymes For Kids | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:46"},{"name":"Rain Rain Go Away","lang":"en","id":"LFrKYjrIDs8","title":"Rain Rain Go Away | Family Song for Kids | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:36"},{"name":"Are You Sleeping? (Brother John)","lang":"en","id":"chxQb4YRC2U","title":"Are You Sleeping, Baby Bear? | Kids Songs | Super Simple Songs","ch":"Super Simple Songs - Kids Songs","dur":"2:04"},{"name":"This Old Man","lang":"en","id":"Di23O5cN4ZU","title":"This Old Man - Nursery Rhyme Song for Kids","ch":"Rock 'N Learn","dur":"1:55"},{"name":"The Finger Family","lang":"en","id":"kCka94jeGTk","title":"Finger Family | CoComelon Nursery Rhymes & Kids Songs","ch":"Cocomelon - Nursery Rhymes","dur":"2:33"},{"name":"Ms Rachel Hello Song","lang":"en","id":"lvbCwqML9sc","title":"\"Songs for Littles\" theme song- Baby/Toddler Music Class","ch":"Ms Rachel - Toddler Learning Videos","dur":"1:59"},{"name":"Ainsi font font les petites marionnettes","lang":"fr","id":"NjvNn-oRycU","title":"Ainsi Font Font Font les Petites Marionnettes + karaoke 👶 Comptine pour bébé | HeyKids","ch":"HeyKids - Chansons Pour Enfants","dur":"2:55"},{"name":"Une souris verte","lang":"fr","id":"2rt2g_afiAg","title":"Une Souris Verte 🐁🌿🌿🌿 Les Comptines de Gabriel","ch":"Les comptines de Gabriel","dur":"2:39"}];   // [{name, lang, id, ch, dur}]

  /* ---------- parent-added songs (localStorage) ---------- */
  var UKEY = "myworld_songs_v1";
  function loadUser(){ try{ return JSON.parse(localStorage.getItem(UKEY))||[]; }catch(e){ return []; } }
  function saveUser(a){ try{ localStorage.setItem(UKEY, JSON.stringify(a)); }catch(e){} }
  function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  // pull an 11-char video id out of any YouTube link or a bare id
  function parseId(input){
    var s=(input||"").trim();
    var m=s.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|music\.youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
    if(/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
    return null;
  }

  /* ---------- the audio-only YouTube engine ---------- */
  var ytQueue=[], player=null, queue=[], idx=-1, poll=null;
  var els={};   // cached now-playing elements
  function ensureAPI(cb){
    if(window.YT && window.YT.Player){ cb(); return; }
    ytQueue.push(cb);
    if(!document.getElementById("yt-api-script")){
      var prev=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=function(){ if(prev) try{ prev(); }catch(e){} ytQueue.splice(0).forEach(function(f){ f(); }); };
      var s=document.createElement("script"); s.id="yt-api-script"; s.src="https://www.youtube.com/iframe_api"; document.head.appendChild(s);
    }
  }
  function fmt(t){ t=Math.max(0,Math.floor(t||0)); var m=Math.floor(t/60), s=t%60; return m+":"+(s<10?"0":"")+s; }
  function isPlaying(){ try{ return player && player.getPlayerState && player.getPlayerState()===1; }catch(e){ return false; } }
  function startPoll(){
    stopPoll();
    poll=setInterval(function(){
      if(!player||!player.getCurrentTime) return;
      try{ var c=player.getCurrentTime()||0, d=player.getDuration()||0;
        if(els.fill) els.fill.style.width=(d?(c/d*100):0)+"%";
        if(els.cur) els.cur.textContent=fmt(c);
        if(els.dur) els.dur.textContent=fmt(d);
      }catch(e){}
    }, 500);
  }
  function stopPoll(){ if(poll){ clearInterval(poll); poll=null; } }
  function setPlayIcon(){
    if(!els.toggle) return;
    var playing=isPlaying();
    els.toggle.innerHTML = playing
      ? '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    els.toggle.setAttribute("aria-label", playing?"Pause":"Play");
    if(els.np) els.np.classList.toggle("playing", playing);
  }
  function nowPlaying(song){
    if(els.title) els.title.textContent=song.name;
    if(els.ch) els.ch.textContent=song.ch||"";
    if(els.face) els.face.classList.remove("empty");
    // highlight the active row
    [].forEach.call(document.querySelectorAll(".song-row.on"),function(r){ r.classList.remove("on"); });
    var row=document.querySelector('.song-row[data-id="'+song.id+'"]'); if(row) row.classList.add("on");
  }
  function onState(e){
    setPlayIcon();
    if(e.data===1) startPoll();       // playing
    else if(e.data===2) stopPoll();   // paused (keep the bar)
    else if(e.data===0){ stopPoll(); next(); }   // ended -> next
  }
  function loadCurrent(autoplay){
    var song=queue[idx]; if(!song) return;
    nowPlaying(song);
    function go(){ try{ player.loadVideoById(song.id); }catch(e){} setTimeout(setPlayIcon,300); }
    if(player && player.loadVideoById){ go(); return; }
    ensureAPI(function(){
      if(player){ go(); return; }
      player=new YT.Player("songs-yt",{ videoId:song.id, host:"https://www.youtube.com",
        width:"100%", height:"100%",
        playerVars:{ playsinline:1, controls:0, disablekb:1, modestbranding:1, rel:0, fs:0, iv_load_policy:3 },
        events:{ onReady:function(){ if(autoplay!==false){ try{ player.playVideo(); }catch(e){} } setPlayIcon(); startPoll(); }, onStateChange:onState } });
    });
  }
  function playQueue(list, start){ queue=list.slice(); idx=Math.max(0,start||0); loadCurrent(true); }
  function toggle(){ if(!player){ if(queue.length) loadCurrent(true); return; } try{ isPlaying()?player.pauseVideo():player.playVideo(); }catch(e){} setTimeout(setPlayIcon,150); }
  function next(){ if(!queue.length) return; idx=(idx+1)%queue.length; loadCurrent(true); }
  function prev(){ if(!queue.length) return; idx=(idx-1+queue.length)%queue.length; loadCurrent(true); }

  /* ---------- building blocks ---------- */
  var FLAG={ en:"English", fr:"Français", yours:"Yours" };
  function allSongs(){ return SONGS.concat(loadUser()); }
  function songRow(song, i, list){
    var r=el('<button class="song-row" data-id="'+esc(song.id)+'">'+
      '<span class="sr-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>'+
      '<span class="sr-main"><b>'+esc(song.name)+'</b><small>'+esc(song.ch||"")+(song.dur?(' &middot; '+esc(song.dur)):'')+'</small></span>'+
      (song.lang==="fr"?'<span class="sr-tag">FR</span>':(song.lang==="yours"?'<span class="sr-tag you">Yours</span>':''))+
    '</button>');
    r.addEventListener("click",function(){ playQueue(list, i); });
    return r;
  }

  function nowPlayingCard(){
    var np=el(
      '<section class="np empty-wrap">'+
        '<div class="np-yt" id="songs-yt" aria-hidden="true"></div>'+
        '<div class="np-face empty">'+
          '<span class="np-badge">'+EAR+' Audio only &middot; no screen</span>'+
          '<div class="np-disc"><span class="np-bars"><i></i><i></i><i></i><i></i><i></i></span></div>'+
          '<div class="np-info"><b class="np-title">Pick a song to start</b><small class="np-ch">Just the music, nothing to watch</small></div>'+
          '<div class="np-progress"><span class="np-cur">0:00</span><span class="np-track"><span class="np-fill"></span></span><span class="np-dur">0:00</span></div>'+
          '<div class="np-ctrls">'+
            '<button class="np-btn prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zm3.5 7L18 5v14z"/></svg></button>'+
            '<button class="np-btn toggle" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>'+
            '<button class="np-btn next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM6 5l8.5 7L6 19z"/></svg></button>'+
          '</div>'+
        '</div>'+
      '</section>');
    els.np=np; els.face=np.querySelector(".np-face"); els.title=np.querySelector(".np-title"); els.ch=np.querySelector(".np-ch");
    els.fill=np.querySelector(".np-fill"); els.cur=np.querySelector(".np-cur"); els.dur=np.querySelector(".np-dur"); els.toggle=np.querySelector(".np-btn.toggle");
    np.querySelector(".np-btn.toggle").addEventListener("click",toggle);
    np.querySelector(".np-btn.next").addEventListener("click",next);
    np.querySelector(".np-btn.prev").addEventListener("click",prev);
    np.querySelector(".np-track").addEventListener("click",function(e){
      if(!player||!player.getDuration) return; var rct=this.getBoundingClientRect();
      var ratio=Math.min(1,Math.max(0,(e.clientX-rct.left)/rct.width));
      try{ player.seekTo(ratio*player.getDuration(), true); }catch(_e){}
    });
    return np;
  }
  var EAR='<svg viewBox="0 0 24 24" aria-hidden="true" style="width:14px;height:14px;vertical-align:-2px;fill:currentColor"><path d="M12 3a6 6 0 0 0-6 6 1 1 0 0 0 2 0 4 4 0 1 1 4 4c-1.1 0-2 .9-2 2v1a1 1 0 0 0 2 0v-.9A6 6 0 0 0 12 3zm-1 16a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 0 0-2.4 0z"/></svg>';

  function addForm(listHost, list){
    var box=el('<section class="song-add">'+
      '<div class="sa-k"><b>Add a song from YouTube</b><span>Paste a YouTube link. We play just the sound, never the video.</span></div>'+
      '<form class="sa-form"><input type="url" inputmode="url" placeholder="https://youtu.be/..." aria-label="YouTube link" /><button class="pill-btn warm" type="submit">Add</button></form>'+
      '<div class="sa-msg" hidden></div>'+
    '</section>');
    var form=box.querySelector("form"), msg=box.querySelector(".sa-msg");
    form.addEventListener("submit",function(e){ e.preventDefault();
      var id=parseId(form.querySelector("input").value);
      if(!id){ msg.hidden=false; msg.className="sa-msg err"; msg.textContent="That does not look like a YouTube link. Try copying the share link again."; return; }
      var user=loadUser();
      if(user.some(function(s){return s.id===id;}) || SONGS.some(function(s){return s.id===id;})){ msg.hidden=false; msg.className="sa-msg"; msg.textContent="That song is already in your list."; return; }
      var song={ id:id, name:"Your song", ch:"Added from YouTube", lang:"yours" };
      user.push(song); saveUser(user);
      form.querySelector("input").value=""; msg.hidden=false; msg.className="sa-msg ok"; msg.textContent="Added. Playing it now, listen only.";
      // play it, and once the player knows the real title, save it
      var full=allSongs(); var i=full.map(function(s){return s.id;}).indexOf(id);
      playQueue(full, i>-1?i:full.length-1);
      setTimeout(function(){ try{ var d=player&&player.getVideoData&&player.getVideoData(); if(d&&d.title){ song.name=d.title; song.ch=d.author||song.ch; saveUser(loadUser().map(function(s){return s.id===id?song:s;})); rebuildUser(listHost); } }catch(_e){} }, 1800);
    });
    return box;
  }
  var _userHostRef=null;
  function rebuildUser(host){
    if(!host) return; host.innerHTML="";
    var user=loadUser(); if(!user.length){ host.appendChild(el('<p class="song-empty">No saved songs yet. Paste a YouTube link above to add one.</p>')); return; }
    var full=allSongs();
    user.forEach(function(s){ var i=full.map(function(x){return x.id;}).indexOf(s.id);
      var row=songRow(s, i>-1?i:0, full);
      var rm=el('<span class="sr-rm" role="button" aria-label="Remove" title="Remove">&times;</span>');
      rm.addEventListener("click",function(ev){ ev.stopPropagation(); saveUser(loadUser().filter(function(x){return x.id!==s.id;})); rebuildUser(host); });
      row.appendChild(rm); host.appendChild(row);
    });
  }

  /* ---------- the page ---------- */
  function renderHome(root){
    root.innerHTML="";
    var v=el('<div class="view songs-view"></div>');
    v.appendChild(P.topbar());
    v.appendChild(P.sectionNav("play"));
    if(P.entSubNav) v.appendChild(P.entSubNav("songs"));

    v.appendChild(el(
      '<div class="h-hero songs-hero">'+
        '<span class="kick">Entertainment &middot; just for listening</span>'+
        '<h1>Songs <span class="accent">to hear</span></h1>'+
        '<p>Music only, with nothing to watch. Tap a song and your little one listens, no screen and no video, just the tunes they love.</p>'+
      '</div>'));

    v.appendChild(nowPlayingCard());

    // curated list, grouped by language
    var en=SONGS.filter(function(s){return s.lang!=="fr";}), fr=SONGS.filter(function(s){return s.lang==="fr";});
    var full=allSongs();
    function group(title, arr){
      if(!arr.length) return;
      v.appendChild(el('<div class="song-group-h">'+title+'</div>'));
      var g=el('<div class="song-list"></div>');
      arr.forEach(function(s){ var i=full.map(function(x){return x.id;}).indexOf(s.id); g.appendChild(songRow(s, i, full)); });
      v.appendChild(g);
    }
    group("Most loved", en);
    group("En français", fr);

    // add-from-youtube + the parent's saved songs
    var userHost=el('<div class="song-list yours"></div>');
    v.appendChild(addForm(userHost, full));
    v.appendChild(el('<div class="song-group-h">Your songs</div>'));
    v.appendChild(userHost);
    _userHostRef=userHost; rebuildUser(userHost);

    v.appendChild(el('<section class="songs-note"><p><b>Why listening, not watching.</b> Pediatric guidance favours less screen time for little ones. Here the picture is hidden on purpose, so songs become something to hear, sing and move to, not another screen. Songs play from their owners on YouTube; nothing is stored or downloaded.</p></section>'));

    root.appendChild(v);
  }

  P.registerModule({ id:"songs", title:"Songs", renderHome:renderHome });
})();
