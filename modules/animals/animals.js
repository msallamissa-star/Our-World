/* ============================================================
   Module 1, Animals
   Plugs into the platform core. Each animal has a real photo
   thumbnail for the grid; a "ready" animal also has a full
   detail page (hero video, real sound, photo gallery, a read-
   aloud description, and a Grown-Up Card).

   To add the next module, copy this contract: register an object
   with { id, title, renderHome(root), renderDetail(root,key) }.
   ============================================================ */
(function(){
  "use strict";
  var P = window.ChloePlatform, el = P.el, ICON = P.icon;

  var CATEGORIES = [
    { id:"farm",  label:"Farm & Home Friends", emoji:"", keys:["dog","cat","cow","sheep","pig","horse","donkey","alpaca"] },
    { id:"birds", label:"Birds",               keys:["duck","chicken","bird","parakeet","macaw","peacock"] },
    { id:"wild",  label:"Wild Friends",         keys:["lion","tiger","elephant","monkey","bear","zebra","panda","snake","frog","alligator","crocodile"] },
    { id:"ocean", label:"Ocean Friends",        keys:["fish","dolphin","shark","turtle","jellyfish"] },
    { id:"dino",  label:"Dinosaurs",            keys:["trex","raptor"] }
  ];

  /* All 25 animals. Each has a real hero video, a real photo gallery, a real
     recorded sound, a toddler sentence (read aloud), a grown-up note, and a
     co-play Grown-Up Card. The detail-page asset paths are derived from the key. */
  var ANIMAL_DATA = {
    dog:{ name:"Dog", say:"Woof woof", photos:5,
      child:"This is a dog. A dog says woof! Dogs love to run, play, and wag their tails.",
      parent:"Dogs are domesticated animals and one of the most common family pets in the world. They come in many shapes and sizes, and people keep them as companions and to help with work like herding. Pointing to the dog, naming it, and copying its woof together builds Chloe's early vocabulary.",
      ask:"What sound does the dog make? Can you say 'woof woof' together?",
      later:"Next time you see a dog on a walk, point to it and say 'dog!' with Chloe.",
      nearNow:"You might spot a real dog out the window or on your street right now." },

    cat:{ name:"Cat", say:"Meow", photos:4,
      child:"This is a cat. A cat says meow! Cats are soft and love to curl up and sleep.",
      parent:"Cats are domesticated animals kept as pets around the world. They are natural hunters and sleep for many hours a day. Copying the soft meow and stroking a pretend cat together builds gentle language and turn taking.",
      ask:"Can you say 'meow' like a cat? Where is the cat's tail?",
      later:"When you see a cat, point and say 'cat', and notice how soft it looks.",
      nearNow:"There may be a real cat nearby, in a garden or sitting on a windowsill." },

    cow:{ name:"Cow", say:"Moo", photos:4,
      child:"This is a cow. A cow says moo! Cows live on the farm and eat green grass.",
      parent:"Cows are farm animals raised mainly for milk and meat, and they graze on grass. Naming the cow and making the moo sound together adds new words and the idea of farm animals for Chloe.",
      ask:"What does the cow say? Can you moo with me?",
      later:"Look for a cow in a book or on a drive and say 'moo' together." },

    sheep:{ name:"Sheep", say:"Baa baa", photos:4,
      child:"This is a sheep. A sheep says baa! Sheep have warm, fluffy wool.",
      parent:"Sheep are farm animals raised for wool, milk, and meat, and they live together in flocks. Talking about soft and fluffy while you both say baa links new words to how things feel.",
      ask:"Can you say 'baa'? Is the sheep soft and fluffy?",
      later:"Next time you wear something woolly, say 'sheep' and 'baa' together." },

    pig:{ name:"Pig", say:"Oink oink", photos:4,
      child:"This is a pig. A pig says oink! Pigs love to play and roll in the mud.",
      parent:"Pigs are clever farm animals that roll in mud to stay cool, not because they are dirty. Making the oink sound and talking about the farm gives Chloe playful new vocabulary.",
      ask:"What sound does the pig make? Can you 'oink'?",
      later:"At bath or mud play, talk about how pigs love to roll." },

    horse:{ name:"Horse", say:"Neigh", photos:4,
      child:"This is a horse. A horse says neigh! Horses are big and can run very fast.",
      parent:"Horses are strong animals that people ride and that help with work. Pointing to the legs and saying 'run' while you both neigh links words to movement.",
      ask:"Can you neigh like a horse? Can the horse run fast?",
      later:"If you see a horse, point and say 'horse', and clip-clop your hands together." },

    duck:{ name:"Duck", say:"Quack quack", photos:4,
      child:"This is a duck. A duck says quack! Ducks love to swim in the water.",
      parent:"Ducks are water birds with webbed feet that help them swim. Saying quack and talking about water and swimming connects the animal to where it lives.",
      ask:"What does the duck say? Can you 'quack'?",
      later:"At bath time, float a toy duck and say 'quack' and 'splash' together.",
      nearNow:"If there is a park or pond near you, you might find real ducks today." },

    chicken:{ name:"Chicken", say:"Cluck cluck", photos:4,
      child:"This is a chicken. A chicken says cluck! Chickens peck the ground and lay eggs.",
      parent:"Chickens are farm birds that lay eggs, and a group lives together in a coop. Naming the eggs while you cluck adds early words and gentle counting play.",
      ask:"Can you cluck like a chicken? Where do the eggs come from?",
      later:"At breakfast with eggs, say 'chicken' and 'cluck' together." },

    lion:{ name:"Lion", say:"Roar", photos:4,
      child:"This is a lion. A lion says roar! The lion is big and strong, the king of the animals.",
      parent:"Lions are big wild cats that live in Africa, mostly in grasslands, in family groups called prides. A gentle roar together is great for playful sounds and naming big and strong.",
      ask:"Can you do a big lion roar with me?",
      later:"Find a lion in a picture book and roar together at story time." },

    elephant:{ name:"Elephant", say:"Pawoo", photos:4,
      child:"This is an elephant. An elephant says pawoo! Elephants are huge and have a long nose called a trunk.",
      parent:"Elephants are the largest land animals and use their trunk to grab food, drink, and greet each other. Tracing a long trunk in the air while you say pawoo links words to actions.",
      ask:"Where is the elephant's long trunk? Can you say 'pawoo'?",
      later:"Use your arm as a trunk and pretend to be elephants together." },

    monkey:{ name:"Monkey", say:"Ooh ooh ah ah", photos:4,
      child:"This is a monkey. A monkey says ooh ooh ah ah! Monkeys love to climb and swing in the trees.",
      parent:"Monkeys are clever animals that live in trees and use their hands and tails to climb. Pretending to climb together while you make the monkey sound builds movement and language.",
      ask:"Can you climb like a monkey? Ooh ooh ah ah!",
      later:"At the park, pretend to climb and swing like monkeys together." },

    bird:{ name:"Bird", say:"Tweet tweet", photos:4,
      child:"This is a bird. A bird says tweet! Birds have wings and can fly up in the sky.",
      parent:"Birds have feathers and wings, and most can fly. Many sing to talk to each other. Watching a real bird out the window and copying its tweet is a lovely first nature lesson.",
      ask:"Can you flap your wings and tweet like a bird?",
      later:"Look out the window for a real bird and say 'tweet' together.",
      nearNow:"Look out the window now, you can often spot a real bird in a tree or on a wire." },

    parakeet:{ name:"Parakeet", say:"Chirp chirp", photos:4,
      child:"This is a parakeet. A parakeet chirps! Parakeets are little colourful birds that love to sing.",
      parent:"Parakeets are small, friendly parrots kept as pets all over the world, known for their bright colours and cheerful chirping, and some even learn to copy words. Naming the colours and chirping together gives Chloe new words and a happy sound to copy.",
      ask:"Can you chirp like a parakeet? What colours can you see?",
      later:"If you see a little bird or pass a pet shop, point and say 'parakeet' and chirp together.",
      nearNow:"Listen at the window, you might hear little birds chirping outside right now." },

    macaw:{ name:"Macaw", say:"Squawk", photos:4,
      child:"This is a macaw. A macaw squawks! Macaws are big, bright parrots with red, blue, and yellow feathers.",
      parent:"Macaws are the largest parrots, living in the rainforests of Central and South America. They are clever, loud, and full of colour. Making a big squawk and naming the bright colours together is wonderful for new words and playful sounds.",
      ask:"Can you make a big macaw squawk? Can you find the red, the blue, and the yellow?",
      later:"Look for a parrot in a picture book or at the zoo and name its colours together." },

    peacock:{ name:"Peacock", say:"May-awe", photos:4,
      child:"This is a peacock. A peacock calls out loud! A peacock can open its long tail like a big fan full of colours.",
      parent:"A peacock is a male peafowl, famous for the huge shimmering tail it fans out to show off, and for its loud, far carrying call. They come from India and nearby lands. Watching the tail open and naming the blue, green, and gold is a feast of colour and words for Chloe.",
      ask:"Can you open your arms wide like the peacock's tail? Can you find the blue and the green?",
      later:"Open a hand fan or spread a towel like a peacock's tail and count the colours together." },

    frog:{ name:"Frog", say:"Ribbit", photos:4,
      child:"This is a frog. A frog says ribbit! Frogs can hop and love the water.",
      parent:"Frogs are small animals that start life as tadpoles in water and can live both in water and on land. Hopping together while you say ribbit links the word to the action.",
      ask:"Can you hop like a frog and say 'ribbit'?",
      later:"Hop around the room together and count the hops." },

    bear:{ name:"Bear", say:"Grrr", photos:4,
      child:"This is a bear. A bear says grrr! Bears are big and furry and love to eat berries and fish.",
      parent:"Bears are large wild animals that live in forests and mountains and sleep through much of the winter. A soft growl and a big bear hug together turns the sound into a game.",
      ask:"Can you growl like a bear? Then give me a big bear hug!",
      later:"At story time, find a bear and do a gentle growl together." },

    donkey:{ name:"Donkey", say:"Hee haw", photos:4,
      child:"This is a donkey. A donkey says hee haw! Donkeys are strong and have long ears.",
      parent:"Donkeys are calm, strong animals related to horses that have helped people carry and pull loads for thousands of years. Pointing to the long ears while you both say hee haw links the word to what Chloe can see.",
      ask:"Where are the donkey's long ears? Can you say 'hee haw'?",
      later:"If you see a donkey or a horse, point to its ears and say 'hee haw' together." },

    // Live: real hero video, poster, and photos. No real isolated alpaca hum recording
    // exists on Commons, so there is no sound.m4a; the sound button instead speaks the
    // name warmly ("Alpaca! Hum!"). Do not AI-generate a fake hum. (see NO_SOUND below)
    alpaca:{ name:"Alpaca", say:"Hum", photos:4,
      child:"This is an alpaca. An alpaca hums! Alpacas are soft and fluffy and live in the mountains.",
      parent:"Alpacas are gentle animals from South America, kept for their soft warm wool. They hum to each other to stay in touch and keep calm. Talking about soft and fluffy while you both hum gives Chloe new words and a soothing sound to copy.",
      ask:"Can you hum softly like an alpaca? Is the alpaca soft and fluffy?",
      later:"Next time you touch something woolly or soft, say 'alpaca' and hum together." },

    zebra:{ name:"Zebra", say:"Bray", photos:4,
      child:"This is a zebra. A zebra brays! A zebra has black and white stripes and can run very fast.",
      parent:"Zebras are wild relatives of the horse that live in Africa in herds. Every zebra has its own pattern of stripes, like a fingerprint. They bark and bray to call each other. Tracing stripes in the air and naming black and white builds words and patterns.",
      ask:"Can you count the zebra's stripes? What colours are they?",
      later:"Draw some stripes together and say 'zebra' as you draw each one." },

    panda:{ name:"Panda", say:"Bleat", photos:4,
      child:"This is a panda. A panda bleats! Pandas are black and white and love to munch bamboo all day.",
      parent:"Giant pandas are bears from the forests of China that eat mostly bamboo. They make soft bleats and honks to talk to each other. Naming the colours black and white and pretending to munch bamboo together adds words and playful movement.",
      ask:"What colours is the panda? Can you munch bamboo like a panda?",
      later:"At snack time, pretend to munch like a panda and name the colours of your food." },

    alligator:{ name:"Alligator", say:"Hiss", photos:4,
      child:"This is an alligator. An alligator hisses! Alligators have big teeth and love to swim in the water.",
      parent:"Alligators are large reptiles that live in rivers and swamps and rest in the water or the sun for much of the day. An alligator has a wide, rounded mouth, while a crocodile's mouth is narrower and more pointed. They hiss and rumble to each other. Talking gently about big teeth and water keeps it calm and curious, not scary.",
      ask:"Can you hiss like an alligator? Where does the alligator like to swim?",
      later:"At bath time, glide a toy slowly through the water and say 'alligator' together." },

    crocodile:{ name:"Crocodile", say:"Hiss", photos:5,
      child:"This is a crocodile. A crocodile hisses! Crocodiles live in the river and have a long, strong mouth.",
      parent:"Crocodiles are big reptiles that live in warm rivers and lakes. They look a lot like alligators but have a narrower mouth. They hiss and growl to each other. Comparing the crocodile and the alligator together is a lovely early lesson in same and different.",
      ask:"Can you open your mouth wide like a crocodile? Is it the same as the alligator?",
      later:"Look at the crocodile and the alligator together and talk about how they are alike." },

    // Dinosaurs are extinct, so there is no real living footage. With the parent's wishes these
    // use real film of life size moving museum models (animatronics), framed honestly as animals
    // from long ago. The roar is the model's own sound. Never present them as living animals.
    trex:{ name:"T-Rex", say:"Roar", photos:4,
      child:"This is a T-Rex. A T-Rex roars! Dinosaurs lived long, long ago. The T-Rex was big and strong with tiny little arms.",
      parent:"Tyrannosaurus rex was one of the biggest meat eating dinosaurs, alive tens of millions of years ago and known to us only from fossils. The dinosaur here is a life size moving model. Roaring together and saying big and strong turns a giant from long ago into playful words.",
      ask:"Can you do a great big dinosaur roar with me?",
      later:"Stomp around the room like a great big dinosaur and roar together." },

    raptor:{ name:"Raptor", say:"Screech", photos:4,
      child:"This is a raptor. A raptor screeches! Raptors were fast dinosaurs that ran on two legs and had sharp claws.",
      parent:"Raptors, like Velociraptor and its cousins, were small, quick, feathered dinosaurs from long ago. The one here is a moving model. Running on the spot and making a quick screech together links the word to movement and fun.",
      ask:"Can you run fast like a raptor and give a little screech?",
      later:"Have a gentle dinosaur run around the room together and then a big rest." },

    tiger:{ name:"Tiger", say:"Roar", photos:4,
      child:"This is a tiger. A tiger roars! Tigers are big orange cats with black stripes, and they love to swim.",
      parent:"Tigers are the largest wild cats, living in the forests of Asia. Every tiger has its own pattern of stripes, and unlike most cats they love water and are strong swimmers. Naming the colours orange and black and counting stripes together builds words and patterns.",
      ask:"Can you do a big tiger roar with me? Can you find the orange and the black?",
      later:"Draw some stripes together and say 'tiger' as you draw each one." },

    snake:{ name:"Snake", say:"Ssss", photos:4,
      child:"This is a snake. A snake says ssss! Snakes have no legs and slide along the ground.",
      parent:"Snakes are reptiles with long bodies and no legs; they slide along to move and flick their tongue to smell the air. Most snakes are shy and would rather slip away. Wiggling a hand along like a snake while you both say ssss links the word to the movement.",
      ask:"Can you hiss like a snake? Can you wiggle your hand along the floor?",
      later:"Wiggle along the floor like a snake together and say 'ssss'." },

    fish:{ name:"Fish", say:"Blub blub", photos:4,
      child:"This is a fish. Fish go blub blub! Fish live in the water and swim with their fins.",
      parent:"Fish live in water and breathe through gills, swimming with their fins. This little orange-and-white one is a clownfish, which makes its home among the soft, waving arms of a sea anemone. Blowing bubbles and saying blub blub together is a playful first water word.",
      ask:"Can you blow bubbles like a fish? Can you find the orange fish?",
      later:"At bath time, blow bubbles together and say 'fish' and 'blub blub'.",
      nearNow:"If you have a fish tank or pass one in a shop, point and say 'fish' together." },

    dolphin:{ name:"Dolphin", say:"Eee eee", photos:4,
      child:"This is a dolphin. A dolphin clicks and whistles, eee eee! Dolphins are clever and love to leap out of the water.",
      parent:"Dolphins are clever sea mammals that come up to breathe air and 'talk' to each other with clicks and whistles. They live in groups and love to leap and play. Whistling eee eee and pretending to leap together is great for playful sounds and movement.",
      ask:"Can you whistle like a dolphin and leap? Eee eee!",
      later:"Pretend to leap and splash like dolphins together." },

    shark:{ name:"Shark", say:"Swish", photos:4,
      child:"This is a shark. A shark swishes through the water! Sharks are big fish with strong fins. This gentle giant is a whale shark.",
      parent:"Sharks are large fish that have lived in the oceans for millions of years. The biggest of all is the gentle whale shark, which glides slowly and eats tiny sea creatures, not people. Talking calmly about big and gentle keeps it curious, not scary; sweep a hand through the air like a swimming shark together.",
      ask:"Can you swim your hand like a big, gentle shark? Swish, swish!",
      later:"At bath time, glide a hand slowly through the water like a shark." },

    turtle:{ name:"Turtle", say:"Splash", photos:4,
      child:"This is a turtle. A sea turtle swims with big flippers and carries its shell on its back.",
      parent:"Sea turtles are gentle reptiles that live in the ocean and swim with flipper-shaped legs, carrying a hard shell for a home. They come ashore only to lay their eggs in the sand. Tucking in small like a turtle and stretching out to 'swim' together is a lovely movement game.",
      ask:"Can you hide like a turtle in its shell, then swim with big flippers?",
      later:"Curl up small like a turtle, then stretch out and 'swim' together." },

    jellyfish:{ name:"Jellyfish", say:"Wibble wobble", photos:4,
      child:"This is a jellyfish. A jellyfish floats and wobbles, soft and slow. It is see-through like jelly!",
      parent:"Jellyfish are soft, see-through sea animals with no bones and no brain, drifting gently with the ocean currents and trailing soft tentacles. Watching one pulse and float, and wibbling your fingers slowly together, is calm and soothing for a little one.",
      ask:"Can you wibble and float softly like a jellyfish?",
      later:"Wave your arms slowly and 'float' like a jellyfish together." }
  };

  // The correct English term for each animal's voice (shown as the detail-page kicker).
  // The playful onomatopoeia (the `say` field) is kept for the "Can you say ...?" copy game,
  // so the label teaches the real word while the child still copies the fun sound.
  var CALL = {
    dog:"Bark", cat:"Meow", cow:"Moo", sheep:"Bleat", pig:"Oink", horse:"Neigh", donkey:"Bray",
    duck:"Quack", chicken:"Cluck", bird:"Tweet", parakeet:"Chirp", macaw:"Squawk", peacock:"Honk",
    lion:"Roar", elephant:"Trumpet", monkey:"Chatter", bear:"Growl", zebra:"Bray", panda:"Bleat",
    frog:"Croak", alligator:"Hiss", crocodile:"Hiss", alpaca:"Hum", trex:"Roar", raptor:"Screech",
    tiger:"Roar", snake:"Hiss", fish:"Blub", dolphin:"Click", shark:"Swish", turtle:"Splash", jellyfish:"Float"
  };

  // animals whose hero video is real footage of them making their sound, played unmuted
  // (so you see and hear the animal together). The rest use a clean clip muted, with an
  // accurate recorded sound played in sync.
  var VIDEO_SOUND = { dog:1, cat:1, sheep:1, pig:1, chicken:1, monkey:1, bird:1, frog:1, donkey:1 };

  // animals with no real recorded sound file on disk (no honest recording was available).
  // For these the sound button speaks the name and sound word warmly instead of playing
  // a file, and the hero video never tries to load a missing sound.m4a.
  // alpaca has no real recording; the new sea animals (fish, shark, turtle, jellyfish) and the snake
  // have no honest isolated recording on Commons, so their button warmly speaks the name and sound word.
  var NO_SOUND = { alpaca:1, snake:1, fish:1, shark:1, turtle:1, jellyfish:1, tiger:1 };

  // animals whose real call is loud (roars and big squawks). These play a little quieter, and the
  // core adds a short fade-in, so a sudden sound never startles a child held close to the iPad (Calm).
  var LOUD = { bear:1, lion:1, trex:1, raptor:1, macaw:1, peacock:1, dolphin:1 };

  // build the full animal objects (asset paths derived from the key).
  // A version query keeps the browser from showing a stale photo, poster, or clip after a media update.
  var ASSET_V = "?v=11";
  var animals = {};
  Object.keys(ANIMAL_DATA).forEach(function(k){
    var d=ANIMAL_DATA[k], photos=[];
    for(var i=1;i<=d.photos;i++) photos.push("assets/animals/"+k+"/photos/"+k+"-"+i+".jpg"+ASSET_V);
    animals[k]={ key:k, name:d.name, ready:(d.ready!==false), say:d.say, call:(d.call||CALL[k]||d.say),
      thumb:"assets/animals/thumbs/"+k+".jpg"+ASSET_V,
      hero:"assets/animals/"+k+"/hero.mp4"+ASSET_V,
      poster:"assets/animals/"+k+"/poster.jpg"+ASSET_V,
      sound:"assets/animals/"+k+"/sound.m4a"+ASSET_V,
      videoHasSound: !!VIDEO_SOUND[k],
      hasSound: !NO_SOUND[k],
      vol: LOUD[k]?0.6:1,
      photos:photos, child:d.child, parent:d.parent,
      grownup:{ ask:d.ask, later:d.later, near:d.nearNow } };
  });

  /* ----------------------- HOME GRID ----------------------- */
  function renderHome(root){
    var v=el('<div class="view">'); v.appendChild(P.topbar());
    v.appendChild(P.sectionNav("play"));
    if(P.entSubNav) v.appendChild(P.entSubNav("animals"));
    v.appendChild(el(
      '<div class="h-hero">'+
        '<span class="kick">Hello, Chloe</span>'+
        '<h1>Animal <span class="accent">Friends</span></h1>'+
        '<p>Tap an animal to visit its world, watch it move, and hear its real sound.</p>'+
        '<div style="margin-top:18px"><button class="ctl-game"><span class="gico" aria-hidden="true">'+ICON.play+'</span> Play a game</button></div>'+
      '</div>'));
    v.querySelector(".ctl-game").addEventListener("click",function(){ P.go("#/game"); });

    CATEGORIES.forEach(function(cat){
      v.appendChild(el('<div class="section-title">'+cat.label+'<span class="rule"></span></div>'));
      var grid=el('<div class="grid"></div>');
      cat.keys.forEach(function(k){
        var a=animals[k]; if(!a) return;
        if(!a.ready){
          // not openable yet (assets incomplete): a calm "soon" tile, no play chip
          // a real disabled button announces correctly to assistive tech (no ambiguous aria-disabled on a div)
          var soon=el(
            '<button class="tile soon" type="button" data-key="'+k+'" aria-label="'+a.name+', coming soon" disabled>'+
              '<img src="'+a.thumb+'" alt="'+a.name+'" loading="lazy">'+
              '<span class="label">'+a.name+'<span class="soon-tag">Soon</span></span>'+
            '</button>');
          grid.appendChild(soon);
          return;
        }
        var tile=el(
          '<button class="tile" data-key="'+k+'" aria-label="'+a.name+', open">'+
            '<img src="'+a.thumb+'" alt="'+a.name+'" loading="lazy">'+
            '<span class="label">'+a.name+'<span class="play" aria-hidden="true">'+ICON.play+'</span></span>'+
          '</button>');
        tile.addEventListener("click",function(){ P.go("#/animal/"+k); });
        grid.appendChild(tile);
      });
      v.appendChild(grid);
    });
    v.appendChild(el(
      '<footer class="site-foot"><b>Chloe\'s World</b>'+
      '<span>A calm place to learn together, one animal at a time.</span>'+
      '<span class="tiny">Real photos, video, and sounds from Wikimedia Commons and Pixabay.</span></footer>'));
    root.appendChild(v);
  }

  /* --------------------- ANIMAL DETAIL --------------------- */
  function renderDetail(root, key){
    var a=animals[key];
    if(!a || !a.ready){ P.toast((a?a.name:"That animal")+" is coming soon!"); P.go("#/home"); return; }
    P.recordVisit(key);

    var v=el('<div class="view detail">'); v.appendChild(P.topbar());
    var inner=el('<div class="detail-inner"></div>'); v.appendChild(inner);

    // back control (sticky, big)
    var backTop=el('<div class="back"><button class="back-btn">'+ICON.back+' Back to animals</button></div>');
    backTop.querySelector("button").addEventListener("click",function(){ P.stopSound(); P.go("#/home"); });
    inner.appendChild(backTop);

    var nameBlock=el('<div class="name-block"><span class="kicker">'+a.call+'</span><h2 class="animal-name">'+a.name+'</h2></div>');
    inner.appendChild(nameBlock);
    var nameEl=nameBlock.querySelector('.animal-name');
    // a single warm pulse on the WRITTEN name, in time with the spoken name (sound to print link)
    function glowName(){
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      nameEl.classList.remove('say'); void nameEl.offsetWidth; nameEl.classList.add('say');
      // under reduced motion the keyframe and its animationend never run, so the static glow
      // (set in CSS) is cleared on a timer instead, keeping the sound-to-print cue alive
      if(reduce){ setTimeout(function(){ nameEl.classList.remove('say'); }, 900); }
    }
    if(nameEl) nameEl.addEventListener('animationend',function(){ nameEl.classList.remove('say'); });

    /* a) hero video, tap to play, no autoplay, no endless loop */
    var hero=el('<div class="hero"></div>');
    function showPoster(capText){
      hero.innerHTML=
        '<img class="poster" src="'+a.poster+'" alt="'+a.name+' video">'+
        '<button class="playbtn" aria-label="Play '+a.name+' video"><span class="circ">'+ICON.play+'</span></button>'+
        '<span class="cap">'+capText+'</span>';
      hero.querySelector(".playbtn").addEventListener("click",playVideo);
    }
    function playVideo(){
      P.stopSound();
      var vid=document.createElement("video");
      vid.src=a.hero; vid.setAttribute("playsinline",""); vid.setAttribute("webkit-playsinline","");
      vid.controls=false; vid.preload="auto"; vid.poster=a.poster;
      // real footage of the animal making its sound plays with that sound;
      // a clean visual clip plays muted while we sync an accurate recorded sound to it
      vid.muted = !a.videoHasSound; vid.volume = 1;
      hero.innerHTML=""; hero.appendChild(vid);
      var pr=vid.play(); if(pr&&pr.catch) pr.catch(function(){});
      if(!a.videoHasSound && a.hasSound){ P.playSound(a.sound, null, a.vol); }
      // gentle ending: back to poster with a "watch again" prompt (never loops)
      vid.addEventListener("ended",function(){ showPoster("Watch again"); });
    }
    showPoster("Tap to watch");
    inner.appendChild(hero);

    /* b) big sound button, speaks the name + plays the real recording */
    var sbtn=el('<button class="sound-btn"><span class="ic">'+ICON.speaker+'</span><span>Hear the '+a.name+'</span></button>');
    sbtn.addEventListener("click",function(ev){
      P.stopSound(); sbtn.classList.add("playing");
      var r=sbtn.getBoundingClientRect(); P.sparkle(ev.clientX||r.left+r.width/2, ev.clientY||r.top);
      function sayIt(){
        sbtn.classList.remove("playing");
        glowName();   // the written name lights up as it is spoken
        // name and sound word, then a calm invitation to copy it (turn taking), each after the other
        P.speak(a.name+"! "+a.say+"!", 0.95, function(){ P.speak("Can you say "+a.say+"?", 0.9); });
      }
      if(a.hasSound){ P.playSound(a.sound, sayIt, a.vol); }   // real recording first, then name + invitation
      else { sayIt(); }                                       // no recording: warmly speak the name and sound word
    });
    inner.appendChild(sbtn);

    /* c) photo gallery (3-5 real photos), tap to enlarge */
    var gal=el('<div class="gallery"></div>');
    a.photos.forEach(function(src, idx){
      var b=el('<button aria-label="'+a.name+' photo '+(idx+1)+' of '+a.photos.length+'"><img src="'+src+'" alt="'+a.name+'" loading="lazy"></button>');
      b.addEventListener("click",function(){ lightbox(a.photos, idx, a.name); });
      gal.appendChild(b);
    });
    inner.appendChild(el('<div class="section-title" style="font-size:1.2rem">Photos<span class="rule"></span></div>'));
    inner.appendChild(gal);

    /* d) short toddler description, read aloud on tap, + parent note */
    var read=el(
      '<div class="read-card">'+
        '<div class="child-text">'+a.child+'</div>'+
        '<button class="read-btn">'+ICON.speaker+' Read it to me</button>'+
        '<div class="parent-note"><b>For grown-ups.</b> '+a.parent+'</div>'+
      '</div>');
    read.querySelector(".read-btn").addEventListener("click",function(){
      P.stopSound();
      // speak only the short core line (the label and the sound); the fuller text stays on screen
      // for the parent. One idea at a time suits an 18 month old.
      var sentences=a.child.match(/[^.!?]+[.!?]+/g) || [a.child];
      P.speak(sentences.slice(0,2).join(" ").replace(/\s+/g," ").trim(), 0.84);
    });
    inner.appendChild(read);

    /* e) Grown-Up Card, the co-play prompt (Joint Media Engagement) */
    inner.appendChild(grownUpCard(a.grownup));

    /* f) big back control at the bottom too */
    var backBtm=el('<div style="text-align:center;margin:18px 0 6px"><button class="back-btn">'+ICON.back+' Back to animals</button></div>');
    backBtm.querySelector("button").addEventListener("click",function(){ P.stopSound(); P.go("#/home"); });
    inner.appendChild(backBtm);

    root.appendChild(v);
    // no autoplay of speech: the page stays calm and the first sound comes from a deliberate tap.
  }

  /* reusable Grown-Up Card component (exposed for future modules) */
  function grownUpCard(data){
    return el(
      '<div class="grownup">'+
        '<div class="gtag"><span class="dot"></span> Grown-Up Card</div>'+
        '<div class="row"><div class="k">Ask Chloe now</div><div class="v">'+data.ask+'</div></div>'+
        '<div class="row"><div class="k">Try later today</div><div class="v">'+data.later+'</div></div>'+
        (data.near?'<div class="row near"><div class="k">A real one near you</div><div class="v">'+data.near+'</div></div>':'')+
      '</div>');
  }

  // photo viewer: open one photo big, then move between an animal's photos without going back.
  // Move with the keyboard arrows, the on-screen arrows, a swipe, or a tap on the picture.
  function lightbox(photos, index, name){
    if(typeof photos==="string"){ photos=[photos]; index=0; }   // stay safe if called the old way
    var opener=document.activeElement, i=index||0, single=photos.length<2;
    var lb=el(
      '<div class="lightbox" role="dialog" aria-modal="true" aria-label="'+name+' photos">'+
        '<button class="x" aria-label="Close">×</button>'+
        '<button class="lb-nav prev" aria-label="Previous photo"><span>‹</span></button>'+
        '<img alt="'+name+'">'+
        '<button class="lb-nav next" aria-label="Next photo"><span>›</span></button>'+
        '<span class="lb-count" aria-live="polite"></span>'+
      '</div>');
    var img=lb.querySelector("img"), count=lb.querySelector(".lb-count");
    var prev=lb.querySelector(".prev"), next=lb.querySelector(".next");
    if(single){ prev.style.display="none"; next.style.display="none"; count.style.display="none"; }
    function show(n){
      i=(n+photos.length)%photos.length;          // wrap around both ways
      img.src=photos[i]; img.alt=name+" photo "+(i+1)+" of "+photos.length;
      count.textContent=(i+1)+" / "+photos.length;
    }
    function close(){ document.removeEventListener("keydown",onKey); window.removeEventListener("hashchange",close); lb.remove(); try{ opener&&opener.focus&&opener.focus(); }catch(e){} }
    function onKey(e){
      if(e.key==="Escape"||e.key==="Esc"){ close(); return; }
      if(e.key==="Tab"){   // keep focus inside the dialog so aria-modal stays honest
        var f=[].slice.call(lb.querySelectorAll("button")).filter(function(b){ return b.style.display!=="none"; });
        if(f.length){ e.preventDefault(); var ci=f.indexOf(document.activeElement);
          var ni=e.shiftKey?(ci<=0?f.length-1:ci-1):((ci<0||ci>=f.length-1)?0:ci+1); try{ f[ni].focus(); }catch(_e){} }
        return;
      }
      if(single) return;
      if(e.key==="ArrowRight"||e.key==="Right"){ e.preventDefault(); show(i+1); }
      else if(e.key==="ArrowLeft"||e.key==="Left"){ e.preventDefault(); show(i-1); }
    }
    prev.addEventListener("click",function(e){ e.stopPropagation(); show(i-1); });
    next.addEventListener("click",function(e){ e.stopPropagation(); show(i+1); });
    lb.querySelector(".x").addEventListener("click",close);
    // tap the picture: see the next photo (or close, if there is only one). A swipe is not a tap.
    var moved=false, sx=0, sy=0;
    img.addEventListener("click",function(e){ e.stopPropagation(); if(moved){ moved=false; return; } if(single){ close(); } else { show(i+1); } });
    lb.addEventListener("click",function(e){ if(e.target===lb) close(); });   // tap the dark edge to close
    lb.addEventListener("touchstart",function(e){ var t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; },{passive:true});
    lb.addEventListener("touchmove",function(){ moved=true; },{passive:true});
    lb.addEventListener("touchend",function(e){
      if(single||!moved) return;
      var t=e.changedTouches[0], dx=t.clientX-sx, dy=t.clientY-sy;
      if(Math.abs(dx)>40 && Math.abs(dx)>Math.abs(dy)){ show(dx<0?i+1:i-1); }
    },{passive:true});
    document.addEventListener("keydown",onKey);
    window.addEventListener("hashchange",close);   // navigating away (even an iPad edge-swipe back) tears the modal down
    document.body.appendChild(lb);
    try{ lb.querySelector(".x").focus(); }catch(e){}   // move focus into the dialog on open
    show(i);
  }

  /* --------------------- MATCHING GAME --------------------- */
  function shuffle(arr){ for(var i=arr.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }

  function renderGame(root){
    var keys=Object.keys(animals).filter(function(k){ return animals[k].ready; });
    var v=el('<div class="view">'); v.appendChild(P.topbar());
    var inner=el('<div class="detail-inner"></div>'); v.appendChild(inner);
    var back=el('<div class="back"><button class="back-btn">'+ICON.back+' Back to animals</button></div>');
    back.querySelector("button").addEventListener("click",function(){ P.stopSound(); P.go("#/home"); });
    inner.appendChild(back);
    inner.appendChild(el('<h2 class="animal-name" style="font-size:clamp(1.8rem,6vw,2.6rem)">Find the Animal</h2>'));
    var stage=el('<div class="game"></div>'); inner.appendChild(stage);

    // which group each animal belongs to, so distractors can come from the same group
    var catOf={}; CATEGORIES.forEach(function(c){ c.keys.forEach(function(k){ catOf[k]=c.id; }); });
    // alligator and crocodile look almost the same, so never show them in the same round
    function lookalike(a,b){ return (a==="alligator"&&b==="crocodile")||(a==="crocodile"&&b==="alligator"); }

    var token=0;    // guards stale timers so audio and visuals never cross rounds
    var roundNum=0; // start easy with two choices, widen to three after the first correct round
    var wins=0;     // little progress: stars earned this session (shown under the winner)
    function round(){
      token++; var myToken=token, answered=false;
      P.stopSound();
      stage.innerHTML="";
      var nChoices=Math.min(roundNum===0?2:3, keys.length);
      // pick the target: prefer animals Chloe has already visited, so the prompt names something she has seen
      var visited=(P.getProgress&&P.getProgress().visited)||{};
      var seen=keys.filter(function(k){ return visited[k]; });
      var target=shuffle((seen.length>=2?seen:keys).slice())[0];
      var targetName=animals[target].name, targetCat=catOf[target];
      // distractors: same group first (a real same-group discrimination), then others; never a lookalike
      var sameCat=shuffle(keys.filter(function(k){ return k!==target && catOf[k]===targetCat && !lookalike(k,target); }));
      var otherCat=shuffle(keys.filter(function(k){ return k!==target && catOf[k]!==targetCat && !lookalike(k,target); }));
      var chosen=[target];
      [].concat(sameCat,otherCat).forEach(function(k){
        if(chosen.length>=nChoices) return;
        if(chosen.indexOf(k)>-1) return;
        if(chosen.some(function(c){ return lookalike(c,k); })) return;
        chosen.push(k);
      });
      var choices=shuffle(chosen.slice());
      // render the prompt and choices FIRST, so the spoken question always matches what is shown
      stage.appendChild(el('<div class="game-prompt">Can you find the <b>'+targetName+'</b>?</div>'));
      var hint=el('<button class="pill-btn warm" style="margin:0 auto 4px">Say it again</button>');
      hint.addEventListener("click",function(){ P.speak("Can you find the "+targetName+"?"); });
      stage.appendChild(hint);
      var row=el('<div class="game-choices"></div>');
      var cardByKey={};
      choices.forEach(function(k, ci){
        // the image stays alt="" (a meaningful alt would leak the answer); the button gets a generic
        // accessible name so it is at least operable/announced for a screen reader or switch user.
        var card=el('<button class="game-card" aria-label="Choice '+(ci+1)+'"><img src="'+(animals[k].thumb||animals[k].photos[0])+'" alt="" draggable="false"></button>');
        cardByKey[k]=card;
        card.addEventListener("click",function(ev){
          if(answered || myToken!==token) return;
          if(k===target){
            answered=true; wins++;
            // 1) crown the winner: its photo grows and becomes the focus, the rest gently fade
            card.setAttribute("aria-label","Correct, this is the "+targetName);   // tie success to the chosen control
            row.classList.add("celebrate"); card.classList.add("win");
            stage.querySelectorAll(".game-card").forEach(function(c){ c.disabled=true; });
            // 2) one short, soft petal burst from the winner (emitted once, slow drift, never a fountain)
            var r=card.getBoundingClientRect();
            setTimeout(function(){ if(myToken!==token) return;
              P.sparkle(r.left+r.width/2, r.top+r.height/2, {count:11, spread:Math.max(130,r.width), rise:120, life:1500});
            },150);
            // 3) a soft "well done" line + one more lit progress star
            yay.textContent="Yes! This is the "+targetName+"!";
            setTimeout(function(){ if(myToken!==token) return; yay.classList.add("show"); litStars(wins); },300);
            // 4) audio strictly in sequence so nothing collides:
            //    the grow settles -> the animal's REAL sound -> a breath -> soft spoken praise -> next round
            var advanced=false;
            function advance(){ if(advanced || myToken!==token) return; advanced=true;
              row.classList.add("fade");
              setTimeout(function(){ if(myToken===token){ roundNum++; round(); } },420);
            }
            function praise(){ if(myToken!==token) return;
              // soft, slightly higher and slower than normal, for a gentle "Yes! This is the cat!"
              P.speak("Yes! This is the "+targetName+"!", 0.86, advance, 1.34); }
            function afterSound(){ if(myToken!==token) return; setTimeout(praise, 250); }
            var a=animals[target];
            setTimeout(function(){ if(myToken!==token) return;
              if(a.hasSound){ P.playSound(a.sound, afterSound, a.vol); }   // the same real recording as its detail page
              else { afterSound(); }                                       // alpaca etc.: no recording, go straight to praise
            }, 620);
            // master safety net: always reach the next round even if every audio event silently dies
            setTimeout(advance, 5600);
          } else {
            // gentle redirection, never correction: no shake, no "try again". Re-invite and light up the right tile.
            if(myToken!==token) return;
            var rc=cardByKey[target];
            if(rc){ rc.classList.remove("hint"); void rc.offsetWidth; rc.classList.add("hint"); }
            P.speak("Can you find the "+targetName+"?");
          }
        });
        row.appendChild(card);
      });
      stage.appendChild(row);
      // the celebration line + a row of five soft progress stars (lit as Chloe gets them right)
      var yay=el('<div class="game-yay" aria-live="polite"></div>');
      var stars=el('<div class="game-stars" aria-hidden="true"></div>');
      for(var sI=0;sI<5;sI++) stars.appendChild(el('<span class="gs"></span>'));
      function litStars(n){ var gs=stars.querySelectorAll(".gs"); for(var gi=0;gi<gs.length;gi++){ gs[gi].classList.toggle("lit", gi<n); } }
      litStars(wins);
      stage.appendChild(yay); stage.appendChild(stars);
      // speak the question after a tiny beat so it does not collide with the cancel of the previous one
      setTimeout(function(){ if(myToken===token) P.speak("Can you find the "+targetName+"?"); }, 220);
    }
    round();
    root.appendChild(v);
  }

  /* register the module with the platform core */
  P.registerModule({
    id:"animals", title:"Animals",
    animals:animals,
    categories:CATEGORIES,
    renderHome:renderHome,
    renderDetail:renderDetail,
    renderGame:renderGame,
    grownUpCard:grownUpCard   // shared component for future modules
  });
})();
