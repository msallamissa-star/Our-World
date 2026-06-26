/* ============================================================
   Module 2, Meal Plans
   A parent-facing daily meal planner for Chloe (about 18 months).
   Built on the family's established 14-day plan and on standard
   toddler nutrition guidance (AAP HealthyChildren.org, CDC, WHO).
   It supplements, it does not replace, the pediatrician.

   Reviewed by an infant-nutrition council (pediatric dietitian,
   pediatric safety, food-allergy, culinary/food-safety, code QA).
   Safety prep is structural on each card; allergens are derived
   from ingredients so a hand mis-tag cannot expose an allergic child.

   Plugs into the same platform core as Animals: { id, title, renderHome }.
   ============================================================ */
(function(){
  "use strict";
  var P = window.ChloePlatform, el = P.el;

  /* ---------------- reference data ---------------- */
  var ALLERGENS = [
    {id:"milk",label:"Milk"},{id:"egg",label:"Egg"},{id:"gluten",label:"Wheat / Gluten"},
    {id:"fish",label:"Fish"},{id:"shellfish",label:"Shellfish"},{id:"sesame",label:"Sesame"},
    {id:"soy",label:"Soy"},{id:"peanut",label:"Peanut"},{id:"treenut",label:"Tree nut"}
  ];
  var CUISINES = [
    {id:"any",label:"Any"},{id:"middle-eastern",label:"Middle Eastern"},
    {id:"mediterranean",label:"Mediterranean"},{id:"international",label:"International"},
    {id:"indian",label:"Indian"},{id:"french",label:"French"},{id:"dutch",label:"Dutch"}
  ];
  var DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var GROUP_LABEL = {protein:"Protein",grain:"Grain",veg:"Veg",fruit:"Fruit",dairy:"Dairy"};

  // derive allergens from ingredient words, so a missed hand tag can never expose an allergic child.
  // (chickpea flour / besan stays gluten-free here, correctly.)
  var ALG_MAP = [
    {a:"milk", w:["whole milk","milk","yogurt","yoghurt","labneh","cheese","gouda","ricotta","cream","butter"]},
    {a:"egg", w:["egg"]},
    {a:"gluten", w:["pita","bread","breadcrumb","pasta","couscous","semolina","wheat","cereal","oats","plain flour"]},
    {a:"fish", w:["salmon","tilapia","sardine","tuna","cod","fish"]},
    {a:"shellfish", w:["shrimp","prawn","crab","lobster","shellfish"]},
    {a:"sesame", w:["tahini","sesame","hummus"]},
    {a:"soy", w:["soy","tofu","edamame"]},
    {a:"peanut", w:["peanut"]},
    {a:"treenut", w:["almond","walnut","cashew","pistachio","hazelnut","pecan"]}
  ];
  function deriveAllergens(ingredients, hand){
    var set={}; (hand||[]).forEach(function(a){ if(a) set[a]=1; });
    var hay=ingredients.join(" ").toLowerCase();
    ALG_MAP.forEach(function(m){ for(var i=0;i<m.w.length;i++){ if(hay.indexOf(m.w[i])>-1){ set[m.a]=1; break; } } });
    return Object.keys(set);
  }

  // gentle, rotating co-play / feeding wisdom from the established plan (shown one at a time)
  var TIPS = [
    "Let Chloe decide how much she eats. You offer good food on a schedule, she chooses the amount.",
    "Pair an iron food with a vitamin C food in the same meal, so her body absorbs more iron.",
    "If she refuses a food, offer it again another day. It can take many tries before a toddler says yes.",
    "Offer water in an open or straw cup with meals. Keep whole milk to about 2 cups a day, never more than 3.",
    "Always sit with her, keep her seated and calm, and never leave her alone with food.",
    "Cut every piece no larger than half an inch, keep it soft, and quarter grapes and cherry tomatoes."
  ];

  /* ---------------- meal database ----------------
     M(id, name, slot, cuisine, level, min, ingredients, allergens, groups, iron, vitC, portion, why, safe?)
     level: "easy"/"simple" (both count as simple) | "involved" (the one a bit more)
     iron: a MEANINGFUL iron source (beef, chicken, lentils, chickpeas, sardines, fortified cereal, egg as minor).
           Salmon and tilapia alone are NOT iron sources (corrected after the dietitian review).
     vitC: includes a vitamin C food, counting a squeeze of lemon (per the source plan).
     safe: a short, structural prep and safety line shown on the card (doneness, bones, quartering). */
  function M(id,name,slot,cuisine,level,min,ing,alg,grp,iron,vitC,portion,why,safe){
    var ingredients=ing.split(",").map(function(s){return s.trim();}).filter(Boolean);
    return { id:id, name:name, slot:slot, cuisine:cuisine, level:level, min:min,
      ingredients:ingredients,
      main:ingredients.slice(0,3).join(", "),   // the card's short "Main" line, from the first ingredients

      allergens:deriveAllergens(ingredients, alg?alg.split(",").map(function(s){return s.trim();}):[]),
      groups:grp.split(",").map(function(s){return s.trim();}),
      iron:!!iron, vitC:!!vitC, portion:portion, why:why, safe:safe||"" };
  }
  var MEALS = [
    /* ---- breakfast ---- */
    M("b1","Iron cereal with whole milk and mashed banana","breakfast","international","easy",5,"iron fortified baby cereal,whole milk,banana","milk,gluten","grain,dairy,fruit",1,0,"3 tbsp cereal, 3 tbsp mashed banana","An iron fortified start. Serve a vitamin C fruit such as strawberries alongside so her body absorbs the iron. The cooking milk counts toward her daily 2 cups."),
    M("b2","Soft scrambled egg with pita and mashed avocado","breakfast","middle-eastern","simple",8,"egg,soft pita,avocado,olive oil","egg,gluten","protein,grain,veg",1,0,"1 egg, a few pita strips, 3 tbsp avocado","Egg gives protein and some iron, avocado adds healthy fats for her brain.","Cook the egg fully until set, not runny."),
    M("b3","Plain yogurt with mashed mango and iron cereal","breakfast","international","easy",4,"plain full fat yogurt,mango,iron fortified baby cereal","milk,gluten","dairy,fruit,grain",1,1,"4 tbsp yogurt, 2 tbsp mango","Mango brings vitamin C that helps her absorb the iron stirred in."),
    M("b4","Oats cooked in whole milk with grated apple","breakfast","international","simple",10,"oats,whole milk,apple,cinnamon","milk,gluten","grain,dairy,fruit",0,0,"3 to 4 tbsp oats, half a grated apple","Warm, soft, and filling, with a pinch of cinnamon and no added sugar. The cooking milk counts toward her daily 2 cups."),
    M("b5","Labneh on soft pita with quartered strawberries","breakfast","middle-eastern","easy",4,"labneh,soft pita,strawberries","milk,gluten","dairy,grain,fruit",0,1,"2 tbsp labneh, 4 quartered strawberries","Creamy calcium plus vitamin C from the strawberries."),
    M("b6","Melted cheese on soft toast fingers with quartered grapes","breakfast","international","easy",6,"cheese,bread,quartered grapes","milk,gluten","dairy,grain,fruit",0,0,"thin melted cheese, 4 quartered grapes","Quick calcium and energy.","Always quarter grapes lengthwise; whole grapes are a top choking hazard."),
    M("b7","Mini veggie omelette muffins","breakfast","mediterranean","involved",20,"egg,zucchini,cheese,olive oil","egg,milk","protein,veg,dairy",1,0,"1 to 2 soft muffins","A hidden veggie baked into soft egg muffins, easy to batch for the week.","Bake the egg fully until set, not runny."),
    M("b8","Banana oat pancakes, no sugar","breakfast","international","involved",15,"banana,egg,oats","egg,gluten","grain,fruit,protein",0,0,"2 small soft pancakes","Just banana, egg, and oats blended and cooked soft, naturally sweet.","Cook through until firm and no longer wet, so the egg is fully done."),
    M("b9","Soft semolina porridge with banana","breakfast","indian","simple",10,"semolina,whole milk,banana","milk,gluten","grain,dairy,fruit",0,0,"3 to 4 tbsp","A smooth, comforting sooji porridge cooked in milk, gently mashed. The cooking milk counts toward her daily 2 cups."),
    M("b10","Mashed sweet potato with a yogurt swirl","breakfast","international","easy",8,"sweet potato,plain full fat yogurt","milk","veg,dairy",0,0,"3 to 4 tbsp","Soft, naturally sweet, and rich in vitamin A for her eyes and skin."),
    M("b11","Soft besan chickpea pancake with grated zucchini","breakfast","indian","involved",18,"chickpea flour,zucchini,olive oil","","protein,veg",1,0,"1 small soft pancake, in strips","A soft savoury chickpea pancake with a hidden vegetable, naturally iron rich and gluten free.","Cook through until firm, then cut into soft strips no larger than half an inch."),

    /* ---- lunch ---- */
    M("l1","Soft shredded chicken and rice with carrot and broccoli","lunch","middle-eastern","simple",15,"chicken,rice,carrot,broccoli","","protein,grain,veg",1,1,"2 to 3 tbsp chicken and rice, 2 tbsp broccoli","Heme iron from chicken with vitamin C from broccoli, a perfect pair.","Poach or steam the chicken until fully cooked, then shred finely."),
    M("l2","Hummus with soft pita and cooked zucchini","lunch","middle-eastern","easy",6,"chickpeas,tahini,lemon,soft pita,zucchini,olive oil","gluten,sesame","protein,grain,veg",1,1,"2 tbsp hummus, soft pita strips","Smooth chickpeas give plant iron, and the lemon's vitamin C helps her absorb it."),
    M("l3","Mujaddara topped with yogurt and quartered cherry tomatoes","lunch","middle-eastern","simple",25,"lentils,rice,olive oil,plain full fat yogurt,quartered cherry tomatoes","milk","protein,grain,veg",1,1,"3 tbsp, with quartered tomatoes","Lentils and rice make a complete protein, tomato adds vitamin C for iron.","Simmer until very soft and quarter the cherry tomatoes lengthwise."),
    M("l4","Flaked salmon with soft rice and peas","lunch","international","simple",15,"salmon,rice,peas","fish","protein,grain,veg",0,0,"1 oz salmon mixed into rice, 2 tbsp peas","Salmon brings protein and omega 3 fats for brain development.","Bake or steam until opaque, cool, flake and check carefully for any bones."),
    M("l5","Lentil and tomato stew with soft rice","lunch","middle-eastern","simple",25,"red split lentils,tomato,onion,olive oil,rice","","protein,grain,veg",1,1,"3 to 4 tbsp","A cosy iron rich stew, the tomato helps her absorb the lentil iron.","Use red split lentils so they cook very soft in the time."),
    M("l6","Soft minced beef and rice with zucchini and tomato","lunch","international","simple",18,"minced beef,rice,zucchini,quartered cherry tomatoes","","protein,grain,veg",1,1,"2 to 3 tbsp, with quartered tomatoes","Beef is one of the best iron sources, with a hidden grated veggie.","Cook the beef through and quarter the cherry tomatoes lengthwise."),
    M("l7","Mashed chickpeas with pita and soft carrot","lunch","middle-eastern","easy",6,"chickpeas,tahini,lemon,soft pita,carrot","gluten,sesame","protein,grain,veg",1,1,"2 tbsp, soft pita strips","A lighter hummus, smooth and quick; the lemon's vitamin C helps her absorb the iron."),
    M("l8","Mashed sardines in soft rice with broccoli","lunch","international","simple",8,"sardines,rice,broccoli","fish","protein,grain,veg",1,1,"1 oz sardines in rice, 2 tbsp broccoli","Tinned sardines are very high in iron and calcium, with broccoli for vitamin C.","Choose sardines tinned in water with no added salt, rinse well, and mash the soft bones fully."),
    M("l9","One pot chicken, veg and lentil pilaf","lunch","indian","involved",30,"chicken,rice,lentils,carrot,peas,cumin","","protein,grain,veg",1,0,"3 to 4 tbsp","A gentle one pot meal with hidden veg, batch cook it for several days.","Cook the chicken through and the lentils very soft."),
    M("l10","Soft pasta with tomato and lentil sauce and cheese","lunch","mediterranean","simple",18,"pasta,tomato,lentils,cheese,olive oil","gluten,milk","grain,protein,veg",1,1,"3 to 4 tbsp small soft pasta","Lentils hidden in the tomato sauce add iron, cheese grated on top.","Cook the pasta very soft and grate the cheese, never cube it."),
    M("l11","Soft moong dal and rice khichdi","lunch","indian","simple",25,"moong dal,rice,turmeric,cumin","","protein,grain",1,0,"3 to 4 tbsp","A soft, soothing dal and rice, easy to digest and naturally iron rich.","Cook until very soft and mash lightly."),
    M("l12","Tilapia flaked into rice with lentils and broccoli","lunch","international","simple",18,"tilapia,rice,lentils,broccoli","fish","protein,grain,veg",1,1,"1 oz fish in rice, 2 tbsp broccoli","The lentils make this an iron meal, with broccoli for vitamin C.","Cook the fish until opaque, cool, flake and check carefully for any bones."),
    M("l13","Soft beef and rice stuffed zucchini","lunch","middle-eastern","involved",35,"minced beef,rice,zucchini,tomato,olive oil","","protein,grain,veg",1,1,"a few soft pieces","Tender beef and rice baked inside soft zucchini, iron with tomato vitamin C.","Bake until very soft and cut into pieces no larger than half an inch."),
    M("l14","Veggie and lentil pasta bake","lunch","mediterranean","involved",35,"pasta,lentils,tomato,cheese,zucchini","gluten,milk","grain,protein,veg",1,1,"3 to 4 tbsp","Lentils baked into a soft tomato pasta with hidden veg, iron rich.","Bake until very soft, grate the cheese, and serve warm not hot."),
    M("l15","Finely minced shrimp with soft lentils and rice","lunch","international","involved",20,"shrimp,lentils,rice,quartered cherry tomatoes","shellfish","protein,grain,veg",1,1,"1 oz shrimp, 2 tbsp lentils","Minced shrimp with soft lentils and rice, iron with tomato vitamin C.","Cook until pink and firm, mince very finely no larger than half an inch, quarter the tomatoes. Introduce shellfish on its own first."),

    /* ---- dinner ---- */
    M("d1","Soft chicken with sweet potato mash and carrot","dinner","international","simple",18,"chicken,sweet potato,carrot,olive oil","","protein,veg",1,0,"2 to 3 tbsp chicken, 3 tbsp mash","An easy warm dinner, iron from chicken and vitamin A from sweet potato.","Cook the chicken through and shred or chop finely."),
    M("d2","Mujaddara with yogurt and soft cucumber","dinner","middle-eastern","simple",10,"lentils,rice,plain full fat yogurt,cucumber","milk","protein,grain,veg",1,0,"3 tbsp, soft cucumber sticks","Make the lentils ahead, dinner comes together in minutes.","Cook the lentils very soft, or use ready cooked. Cut cucumber into soft sticks."),
    M("d3","Salmon with soft mashed potato and peas","dinner","international","simple",18,"salmon,potato,peas,olive oil","fish","protein,veg",0,0,"1 oz salmon, 3 tbsp mash, 2 tbsp peas","Omega 3 and protein in a soft, comforting plate she can scoop.","Bake or steam until opaque, cool, flake and check carefully for any bones."),
    M("d4","Lentil and vegetable stew with soft rice","dinner","middle-eastern","simple",25,"red split lentils,tomato,carrot,zucchini,rice","","protein,grain,veg",1,1,"3 to 4 tbsp","Iron rich and full of soft veg, the tomato boosts iron absorption.","Use red split lentils so they cook very soft in the time."),
    M("d5","Soft minced beef with pasta, tomato and cheese","dinner","mediterranean","simple",18,"minced beef,pasta,tomato,cheese","gluten,milk","protein,grain,veg",1,1,"3 to 4 tbsp small soft pasta","A toddler bolognese, soft and iron rich, grate the cheese on top.","Cook the pasta very soft and grate the cheese, never cube it."),
    M("d6","Mini soft beef meatballs in tomato with couscous","dinner","mediterranean","involved",30,"minced beef,breadcrumbs,tomato,couscous,olive oil","gluten","protein,grain,veg",1,1,"2 to 3 small soft meatballs","Tender little meatballs simmered soft, a lovely weekend dinner to batch.","Simmer until very soft and serve small, no larger than half an inch."),
    M("d7","Soft scrambled egg with cheese, toast and tomato","dinner","international","easy",8,"egg,cheese,bread,tomato","egg,milk,gluten","protein,dairy,veg",1,1,"1 egg, soft toast fingers","A fast no fuss dinner with protein and some iron from the egg, tomato for vitamin C.","Cook the egg fully until set, not runny."),
    M("d8","Tilapia with soft rice, zucchini and lemon","dinner","international","simple",18,"tilapia,rice,zucchini,lemon","fish","protein,grain,veg",0,1,"1 oz fish, 3 tbsp rice","Light and mild, a squeeze of lemon adds vitamin C, no salt.","Cook the fish until opaque, cool, flake and check carefully for any bones."),
    M("d9","Soft chicken and vegetable khichdi","dinner","indian","involved",30,"chicken,rice,moong dal,carrot,peas,turmeric","","protein,grain,veg",1,0,"3 to 4 tbsp","A complete one bowl dinner, soft and gentle, great for batch cooking.","Cook the chicken through and everything very soft."),
    M("d10","Chickpea, tomato and spinach stew with rice","dinner","middle-eastern","simple",25,"tinned chickpeas,tomato,spinach,rice,olive oil","","protein,grain,veg",1,1,"3 to 4 tbsp","Spinach hidden in a soft stew adds iron, tomato helps her absorb it.","Use tinned, pre cooked chickpeas so they are soft in the time, and rinse them well."),
    M("d11","Soft cheese and veg omelette with pita","dinner","mediterranean","easy",8,"egg,cheese,zucchini,soft pita","egg,milk,gluten","protein,dairy,veg",1,0,"half a soft omelette, pita strips","Quick protein with a hidden grated vegetable folded inside.","Cook the egg fully until set, not runny."),
    M("d12","Soft beef and lentil cottage pie","dinner","international","involved",35,"minced beef,lentils,potato,carrot,tomato","","protein,veg",1,1,"3 to 4 tbsp","Beef and lentils under soft mashed potato, a double iron dinner with tomato vitamin C.","Cook until very soft, serve warm not hot in small spoonfuls."),

    /* ---- snacks ---- */
    M("s1","Plain yogurt with mashed berries","snack","international","easy",2,"plain full fat yogurt,berries","milk","dairy,fruit",0,1,"3 to 4 tbsp","Calcium plus vitamin C, an easy any time snack."),
    M("s2","Soft cooked carrot or zucchini sticks","snack","international","easy",8,"carrot,zucchini","","veg",0,0,"a few soft sticks","Cook until soft so they squish easily between her gums."),
    M("s3","Banana in small soft pieces","snack","international","easy",1,"banana","","fruit",0,0,"half a banana, in small soft pieces","The simplest snack, energy and potassium, cut small."),
    M("s4","Grated cheese or thin cheese strips","snack","international","easy",1,"cheese","milk","dairy",0,0,"a small handful","Calcium for strong bones.","Serve cheese grated or in thin strips, never in cubes."),
    M("s5","Soft pita strips with thin hummus","snack","middle-eastern","easy",3,"soft pita,chickpeas,tahini","gluten,sesame","grain,protein",1,0,"a few strips","Spread the hummus thin and smooth, a savoury iron snack."),
    M("s6","Mashed avocado on soft toast fingers","snack","international","easy",4,"avocado,bread","gluten","veg,grain",0,0,"1 to 2 soft fingers","Healthy fats for her growing brain, soft and easy to hold."),
    M("s7","Soft steamed apple or pear with cinnamon","snack","international","easy",8,"apple,pear,cinnamon","","fruit",0,0,"3 to 4 soft pieces","Naturally sweet and gentle on her tummy.","Always steam or cook hard fruit until soft, never serve it raw and hard."),
    M("s8","Soft cooked sweet potato cubes","snack","international","easy",10,"sweet potato","","veg",0,0,"a few soft cubes","Naturally sweet, rich in vitamin A, soft enough to gum."),

    /* ---- Dutch ---- */
    M("du1","Soft Dutch pannenkoek with appelmoes","breakfast","dutch","involved",20,"plain flour,egg,whole milk,apple","gluten,egg,milk","grain,protein,fruit",0,0,"1 small soft pancake with 2 tbsp apple sauce","A thin soft Dutch pannenkoek with appelmoes, a gentle taste of a family favourite, no sugar or syrup.","Cook the pancake through so the egg is fully set, then cut into soft strips. No sugar or syrup."),
    M("du2","Hutspot, potato and carrot mash with soft beef","dinner","dutch","simple",25,"potato,carrot,onion,minced beef,whole milk","milk","protein,veg",1,0,"3 to 4 tbsp","Hutspot is a soft Dutch mash of potato and carrot, with beef stirred in for iron.","Cook the beef through and mash everything very soft."),
    M("du3","Stamppot, potato and spinach mash with mild Gouda","lunch","dutch","simple",20,"potato,spinach,whole milk,gouda cheese","milk","veg,grain,dairy",0,0,"3 to 4 tbsp","Stamppot is a soft Dutch mash of potato and greens, with mild Gouda for calcium.","Mash very soft and grate the Gouda, never cube it."),
    M("du4","Appelmoes, soft Dutch apple sauce with yogurt","snack","dutch","easy",10,"apple,cinnamon,plain full fat yogurt","milk","fruit,dairy",0,0,"3 to 4 tbsp","Appelmoes is a soft Dutch apple sauce, a classic first food, lovely swirled into yogurt.","Cook the apple until very soft, no added sugar."),

    /* ---- French ---- */
    M("fr1","Soft chicken ratatouille with rice","dinner","french","involved",35,"chicken,tomato,zucchini,aubergine,red pepper,rice,olive oil","","protein,veg,grain",1,1,"3 to 4 tbsp","A gentle French ratatouille of soft tomato, courgette, aubergine and pepper, with chicken for iron and tomato and pepper for vitamin C.","Cook the chicken through, peel the pepper and aubergine, and chop or mash everything soft."),
    M("fr2","Vegetable and lentil potage","lunch","french","simple",25,"carrot,potato,leek,red split lentils","","veg,protein",1,0,"3 to 4 tbsp","A smooth French vegetable and lentil potage, soft and warming, with lentils for iron.","Use red split lentils, cook very soft, then blend smooth and serve warm not hot."),
    M("fr3","Soft vegetable gratin","dinner","french","involved",30,"cauliflower,zucchini,cheese,whole milk","milk","veg,dairy",0,0,"3 to 4 tbsp","A soft French vegetable gratin with melted cheese, an easy way to love vegetables.","Bake until very soft, grate the cheese, and serve warm not hot."),
    M("fr4","Fruit compote with yogurt","snack","french","easy",12,"apple,pear,plain full fat yogurt","milk","fruit,dairy",0,0,"3 to 4 tbsp","A soft French fruit compote, naturally sweet with no added sugar, lovely with yogurt.","Cook the fruit until very soft, no added sugar.")
  ];

  /* ---- detailed recipes (ingredients with quantities + prep steps), attached by id ----
     Generated by the recipe workflow and verified by a pediatric dietitian and food-safety
     panel. The card shows the simple ingredients; tapping a card opens the full recipe. */
  var RECIPES = {
 "b1": {
  "ingredients": [
   "20 g iron fortified baby cereal",
   "45 ml whole milk",
   "50 g ripe banana"
  ],
  "steps": [
   "Spoon the cereal into a small bowl.",
   "Warm the whole milk gently, then stir into the cereal until smooth and soft. Add a little more milk if it is too thick.",
   "Mash the ripe banana with a fork until completely lump free.",
   "Swirl the mashed banana through the cereal.",
   "Test the temperature on your wrist and serve just warm, never hot."
  ]
 },
 "b10": {
  "ingredients": [
   "half a small sweet potato (about 80 g), peeled and diced",
   "1 tbsp plain full fat yogurt (about 15 g)",
   "1 tsp full fat milk to loosen if needed",
   "tiny pinch ground cinnamon (optional), no added salt or sugar"
  ],
  "steps": [
   "Steam or boil the sweet potato dice 12 to 15 minutes until very soft and easily crushed when pressed.",
   "Drain and mash completely smooth, adding a little milk if it is stiff.",
   "Cool the mash to warm, not hot, so it will not heat or thin the yogurt.",
   "Spoon into a bowl and swirl the yogurt through the top, with a tiny pinch of cinnamon if using.",
   "Serve about 3 to 4 tbsp."
  ]
 },
 "b11": {
  "ingredients": [
   "3 tbsp chickpea flour / besan (about 25 g)",
   "quarter of a small zucchini, finely grated (about 30 g)",
   "3 to 4 tbsp water to make a thick batter",
   "half tsp olive oil for the pan",
   "tiny pinch ground cumin or turmeric (optional), no added salt"
  ],
  "steps": [
   "Squeeze the excess water from the grated zucchini, then mix it with the besan, optional spice and enough water for a thick batter.",
   "Heat the lightly oiled pan on low and spread one small thin pancake about 8 cm wide.",
   "Cook about 3 minutes, flip, and cook 2 to 3 minutes more until fully set and dry through with no raw batter.",
   "Cool to warm, then cut into half inch wide finger strips.",
   "Serve warm, not hot."
  ]
 },
 "b2": {
  "ingredients": [
   "1 medium egg",
   "Quarter of a soft pita, cut into thin short strips",
   "45 g ripe avocado",
   "1 ml (quarter tsp) olive oil"
  ],
  "steps": [
   "Beat the egg well in a small bowl.",
   "Heat the olive oil in a small pan on low, pour in the egg and stir gently and constantly until fully set, firm and no longer runny.",
   "Break the cooked egg into soft pieces no larger than 1 cm.",
   "Mash the avocado smooth and warm the pita strips briefly so they are soft and easy to gum.",
   "Plate the egg, avocado and pita strips and serve just warm, never hot."
  ]
 },
 "b3": {
  "ingredients": [
   "60 g plain full fat yogurt",
   "30 g ripe mango",
   "7 g iron fortified baby cereal"
  ],
  "steps": [
   "Spoon the plain full fat yogurt into a small bowl.",
   "Mash the ripe mango with a fork until smooth and completely lump free.",
   "Stir the dry cereal into the yogurt until it softens and thickens slightly.",
   "Swirl the mashed mango through.",
   "Serve at cool room temperature, soft and smooth."
  ]
 },
 "b4": {
  "ingredients": [
   "25 g rolled oats",
   "90 ml whole milk",
   "Half a small apple, peeled and grated",
   "Tiny pinch ground cinnamon"
  ],
  "steps": [
   "Combine the oats and whole milk in a small pan.",
   "Cook on low, stirring often, for 4 to 5 minutes until soft and creamy. Add a splash more milk if it is too thick.",
   "Stir in the peeled grated apple and cook 2 to 3 minutes more so the apple is fully soft.",
   "Add the tiny pinch of cinnamon and stir through.",
   "Test on your wrist and serve just warm, soft and smooth, never hot."
  ]
 },
 "b5": {
  "ingredients": [
   "30 g labneh",
   "Quarter of a soft pita, cut into thin short strips",
   "4 strawberries, quartered lengthwise then sliced small"
  ],
  "steps": [
   "Warm the pita briefly so it is soft and easy to gum, then cut into thin short strips.",
   "Spread a thin layer of labneh over the strips, or serve it in a small dish to dip.",
   "Hull the strawberries, quarter them lengthwise, then slice into soft pieces no larger than 1 cm.",
   "Plate the labneh, pita and strawberries together.",
   "Serve just warm to room temperature, soft and small."
  ]
 },
 "b6": {
  "ingredients": [
   "1 thin slice soft bread",
   "15 g grated mild cheese",
   "4 grapes, quartered lengthwise"
  ],
  "steps": [
   "Lightly toast the bread until just soft, not crisp or hard, and trim off the crusts.",
   "Scatter the grated cheese on top and melt gently under a low grill or in a warm pan until just melted, not browned.",
   "Cut into small finger strips no wider than 1 cm.",
   "Quarter each grape lengthwise so there are no round whole pieces.",
   "Let it cool to just warm, then serve the cheese fingers with the quartered grapes."
  ]
 },
 "b7": {
  "ingredients": [
   "1 medium egg",
   "25 g grated zucchini",
   "15 g grated mild cheese",
   "1 ml (quarter tsp) olive oil for greasing"
  ],
  "steps": [
   "Heat the oven to 180 C and lightly grease 2 mini muffin cups with the olive oil.",
   "Squeeze the excess water from the grated zucchini, then beat together with the egg and grated cheese.",
   "Divide between the 2 cups and bake 12 to 15 minutes until fully set and firm in the centre, with no runny egg.",
   "Cool, then run a knife round and lift out. Cut each muffin into soft pieces no larger than 1 cm.",
   "Serve just warm, soft and small, never hot."
  ]
 },
 "b8": {
  "ingredients": [
   "half a small ripe banana (about 50 g)",
   "1 small egg, fully cooked into the batter",
   "2 tbsp fine rolled oats (about 15 g), or oat flour",
   "1 tsp full fat milk if batter is thick",
   "half tsp olive oil or unsalted butter for the pan, no added salt or sugar"
  ],
  "steps": [
   "Mash the banana completely smooth in a bowl so there are no lumps.",
   "Beat in the egg, then stir in the oats and a little milk to a thick pourable batter and let it sit 3 minutes to soften the oats.",
   "Heat the lightly oiled pan on low and spoon two small pancakes about 6 cm wide.",
   "Cook 2 to 3 minutes each side until the egg is fully set right through with no wet or runny batter anywhere.",
   "Cool to warm, then cut into small half inch pieces or thin strips and serve warm, not hot."
  ]
 },
 "b9": {
  "ingredients": [
   "2 tbsp fine semolina / sooji (about 20 g)",
   "120 ml full fat milk (about half a cup)",
   "quarter of a small ripe banana, finely mashed (about 25 g)",
   "half tsp unsalted butter or ghee",
   "tiny pinch ground cardamom (optional), no added sugar or honey"
  ],
  "steps": [
   "Dry roast the semolina in the butter on low for 1 to 2 minutes until it smells nutty, stirring constantly.",
   "Pour in the milk slowly while stirring continuously to stop lumps forming.",
   "Cook on low 3 to 4 minutes until thick and soft, stirring the whole time.",
   "Take off the heat and stir through the mashed banana and the optional pinch of cardamom.",
   "Loosen with a splash of milk if stiff, then cool to warm and serve 3 to 4 tbsp."
  ]
 },
 "d1": {
  "ingredients": [
   "40 g skinless chicken breast",
   "half a small sweet potato (about 70 g)",
   "half a small carrot (about 30 g)",
   "0.5 tsp olive oil",
   "1 tbsp of the cooking water or whole milk to loosen"
  ],
  "steps": [
   "Peel and dice the sweet potato and carrot, then steam or boil 15 to 18 minutes until very soft.",
   "Poach or steam the chicken 12 to 15 minutes until fully cooked through with no pink, then cool and shred or chop very finely.",
   "Mash the sweet potato and carrot with the olive oil and a splash of cooking water or milk until smooth.",
   "Mix the finely chopped chicken through, or serve it alongside the mash.",
   "Cool to warm, not hot, and serve soft in small pieces."
  ]
 },
 "d10": {
  "ingredients": [
   "3 tbsp tinned chickpeas, no added salt, rinsed well",
   "1 small ripe tomato, skinned and deseeded, chopped",
   "1 small handful (about 15 g) fresh spinach leaves, washed",
   "2 tbsp cooked white rice",
   "half tsp olive oil",
   "tiny pinch ground cumin (optional)"
  ],
  "steps": [
   "Warm the olive oil in a small pan and add the chopped skinned tomato. Cook gently 3 to 4 minutes until very soft and pulpy.",
   "Add the rinsed chickpeas and a good splash of water. Simmer 8 to 10 minutes until the chickpeas are very soft, then mash them thoroughly with a fork so none stay whole or firm.",
   "Stir in the spinach and the tiny pinch of cumin. Cook 2 to 3 minutes until the spinach is fully wilted, then chop it finely through the mixture.",
   "Fold through the cooked rice with a little extra water to loosen. Mash again so everything is soft and no piece is larger than 1 cm.",
   "Let it cool until just warm, not hot, then serve 3 to 4 tbsp."
  ]
 },
 "d11": {
  "ingredients": [
   "1 egg",
   "1 tbsp finely grated mild cheese (mild cheddar or similar)",
   "2 tbsp finely grated zucchini",
   "half tsp olive oil or unsalted butter",
   "half a small soft pita bread"
  ],
  "steps": [
   "Squeeze excess water from the grated zucchini with your hands, then beat the egg well in a small bowl.",
   "Stir the grated zucchini and grated cheese into the beaten egg.",
   "Heat the oil in a small non-stick pan on low. Pour in the egg and cook gently, lifting the edges, until fully set with no runny or wet part, about 3 to 4 minutes, flipping once.",
   "Warm the pita until soft and pliable, then cut into thin strips about 1 cm wide.",
   "Cut half the omelette into small soft pieces no larger than 1 cm. Let everything cool to just warm, then serve the omelette pieces with the pita strips."
  ]
 },
 "d12": {
  "ingredients": [
   "30 g lean minced beef",
   "1 tbsp red split lentils, rinsed",
   "half a small potato",
   "quarter of a small carrot, finely grated",
   "1 tbsp skinned deseeded tomato, finely chopped",
   "half tsp olive oil",
   "splash of whole milk for the mash"
  ],
  "steps": [
   "Peel and dice the potato, boil until very soft (about 12 minutes), then mash smooth with a splash of milk and set aside.",
   "Simmer the rinsed lentils in plenty of water for about 15 minutes until completely soft, then drain.",
   "Heat the olive oil in a small pan, add the minced beef and grated carrot, and cook until the beef is fully browned with no pink, breaking it up very finely as it cooks.",
   "Stir in the chopped tomato and cooked lentils with a splash of water. Simmer 5 minutes until soft and saucy, then check the meat is finely broken down with no piece over 1 cm.",
   "Spoon the beef and lentil mixture into a small dish, top with the potato mash, and warm through.",
   "Let it cool until just warm, not hot, then serve 3 to 4 tbsp."
  ]
 },
 "d2": {
  "ingredients": [
   "1.5 tbsp red split lentils, rinsed",
   "1.5 tbsp white rice, rinsed",
   "1 tbsp plain full fat yogurt",
   "5 cm piece cucumber, peeled",
   "0.5 tsp olive oil",
   "pinch ground cumin"
  ],
  "steps": [
   "Simmer the rinsed lentils in unsalted water about 12 minutes, then add the rice and more water and cook 15 minutes more until both are very soft.",
   "Stir in the olive oil and cumin and lightly mash so it is soft and easy to eat.",
   "Peel the cucumber and cut into soft short sticks no thicker than 0.5 cm.",
   "Spoon the mujaddara into a dish with the yogurt on the side or stirred through.",
   "Serve warm, not hot, with the soft cucumber sticks alongside."
  ]
 },
 "d3": {
  "ingredients": [
   "30 g skinless salmon fillet, checked for bones",
   "1 small potato (about 60 g), peeled and diced",
   "2 tbsp frozen peas",
   "1 tsp olive oil",
   "1 tbsp whole milk or cooking water",
   "squeeze of lemon (optional)"
  ],
  "steps": [
   "Boil the diced potato until very soft, about 12 minutes, then drain.",
   "Steam or gently poach the salmon until fully opaque and it flakes easily, about 6 to 8 minutes, then cool and flake, feeling carefully for any bones and removing them.",
   "Boil the peas until very soft, about 4 to 5 minutes, then mash thoroughly so none are left whole and round.",
   "Mash the potato with the olive oil and milk until smooth and lump free.",
   "Fold the flaked salmon and mashed peas through the potato, add a squeeze of lemon if using, and serve warm not hot."
  ]
 },
 "d4": {
  "ingredients": [
   "2 tbsp red split lentils, rinsed",
   "half a small carrot (about 30 g), finely diced",
   "2 tbsp zucchini, finely diced",
   "2 tbsp ripe tomato, skinned, deseeded and chopped",
   "2 tbsp cooked white rice",
   "1 tsp olive oil",
   "pinch of ground cumin (optional)",
   "100 ml unsalted water or no-salt stock"
  ],
  "steps": [
   "Rinse the lentils well, then simmer with the carrot in the water until both are very soft and broken down, about 18 to 20 minutes, adding a little more water if it dries out.",
   "Add the zucchini and tomato and cook another 6 to 8 minutes until everything is meltingly soft.",
   "Stir in the olive oil and a pinch of cumin if using, then mash so the texture is smooth and no piece is over 1 cm.",
   "Fold the cooked rice through to warm it, loosening with a little water if thick.",
   "Cool to warm not hot and serve."
  ]
 },
 "d5": {
  "ingredients": [
   "40 g lean minced beef",
   "3 tbsp small soft pasta (such as orzo or mini shells), cooked very soft",
   "3 tbsp ripe tomato, skinned, deseeded and chopped, or no-salt passata",
   "1 tbsp finely grated mild cheese (such as mozzarella or mild cheddar)",
   "1 tsp olive oil",
   "pinch of dried oregano (optional)"
  ],
  "steps": [
   "Cook the pasta a little longer than the packet says so it is very soft, then drain and, if needed, chop so no piece is over 1 cm.",
   "Warm the olive oil and cook the minced beef gently, breaking it into tiny crumbs, until fully cooked through with no pink.",
   "Add the tomato and oregano if using and simmer 6 to 8 minutes until soft and saucy.",
   "Stir in the pasta to coat, then scatter the grated cheese and stir until just melted.",
   "Cool to warm not hot and serve."
  ]
 },
 "d6": {
  "ingredients": [
   "45 g lean minced beef",
   "1 tbsp fine fresh breadcrumbs",
   "1 tbsp whole milk",
   "3 tbsp ripe tomato, skinned, deseeded and chopped, or no-salt passata",
   "2 tbsp cooked couscous",
   "1 tsp olive oil",
   "pinch of ground cumin (optional)"
  ],
  "steps": [
   "Soak the breadcrumbs in the milk for a minute, then mix into the minced beef and shape into 2 to 3 small soft meatballs no wider than 1.5 cm.",
   "Warm the olive oil and cook the meatballs gently, turning, until fully cooked through with no pink in the centre, about 8 to 10 minutes.",
   "Add the tomato and cumin if using and simmer 5 to 6 minutes until soft and saucy, spooning sauce over the meatballs.",
   "Warm the couscous and fluff it, breaking up any clumps.",
   "Lightly mash the meatballs so there are no round pieces, then serve over the couscous, warm not hot."
  ]
 },
 "d7": {
  "ingredients": [
   "1 egg",
   "1 tbsp finely grated mild cheese (such as mild cheddar)",
   "1 tsp whole milk",
   "half a slice of soft bread",
   "2 tbsp ripe tomato, skinned, deseeded and finely chopped",
   "1 tsp unsalted butter or olive oil"
  ],
  "steps": [
   "Beat the egg with the milk, then cook gently in the butter, stirring, until fully set and no longer runny or wet.",
   "Stir the grated cheese through the hot egg until just melted.",
   "Lightly toast the bread, cut off any crust, and slice into soft fingers no wider than 1 cm.",
   "Stir the finely chopped softened tomato through the egg or serve it alongside.",
   "Cool the egg and toast to warm not hot and serve."
  ]
 },
 "d8": {
  "ingredients": [
   "30 g skinless tilapia fillet, checked for bones",
   "3 tbsp cooked white rice",
   "3 tbsp zucchini, finely diced",
   "1 tsp olive oil",
   "squeeze of lemon"
  ],
  "steps": [
   "Steam or gently poach the tilapia until fully opaque and it flakes easily, about 6 minutes, then cool and flake, feeling carefully for bones and removing them.",
   "Boil or steam the diced zucchini until very soft, about 6 to 8 minutes.",
   "Warm the cooked rice and stir through the olive oil.",
   "Fold the flaked fish and soft zucchini into the rice and add a small squeeze of lemon.",
   "Lightly mash so the texture is soft and even, then serve warm not hot."
  ]
 },
 "d9": {
  "ingredients": [
   "30 g skinless chicken breast, finely chopped",
   "2 tbsp white rice, rinsed",
   "1 tbsp moong dal (split yellow lentils), rinsed",
   "half a small carrot (about 30 g), finely diced",
   "2 tbsp frozen peas",
   "pinch of ground turmeric",
   "1 tsp olive oil or unsalted butter",
   "150 ml unsalted water"
  ],
  "steps": [
   "Rinse the rice and moong dal together, then simmer with the carrot, turmeric and water until everything is very soft and porridge like, about 20 to 25 minutes, adding water if needed.",
   "Add the finely chopped chicken and the peas and cook another 8 to 10 minutes until the chicken is fully cooked through with no pink.",
   "Stir in the olive oil and mash so the peas are broken and no piece is over 1 cm.",
   "Loosen with a little warm water to a soft spoonable texture.",
   "Cool to warm not hot and serve."
  ]
 },
 "du1": {
  "ingredients": [
   "25 g plain flour (about 3 tbsp)",
   "25 g egg, beaten (about half a small egg), cooked fully set",
   "60 ml whole milk (about 4 tbsp)",
   "50 g apple, peeled and cored (about half a small fruit), for the appelmoes",
   "5 g unsalted butter or oil for the pan",
   "1 tbsp water for the apple"
  ],
  "steps": [
   "Make the appelmoes first: simmer the peeled chopped apple with a splash of water until very soft, then mash smooth with no added sugar and set aside.",
   "Whisk the flour, beaten egg and milk into a thin smooth batter with no lumps.",
   "Heat a little butter in a pan over medium heat, pour a thin layer of batter and cook fully on both sides until set right through with no wet or runny egg.",
   "Cool the pancake to warm, then cut or tear into soft bite-size pieces.",
   "Serve with 2 tbsp of the smooth apple sauce, warm not hot."
  ]
 },
 "du2": {
  "ingredients": [
   "60 g potato, peeled (about 1 small one)",
   "30 g carrot, peeled (about half a small one)",
   "10 g onion, finely chopped (about 1 tbsp)",
   "30 g lean minced beef",
   "15 ml whole milk (about 1 tbsp)",
   "5 g unsalted butter or 1 tsp olive oil"
  ],
  "steps": [
   "Peel and cut the potato and carrot into small pieces, then boil with the onion until very soft, about 15 minutes.",
   "Meanwhile cook the minced beef in a little oil until fully browned through with no pink remaining, breaking it into very fine crumbs.",
   "Drain the vegetables and mash with the milk and a little butter until smooth and soft with no firm lumps.",
   "Stir the finely crumbled beef through the mash.",
   "Check the texture is soft and lump-free and serve 3 to 4 tbsp warm not hot."
  ]
 },
 "du3": {
  "ingredients": [
   "70 g potato, peeled (about 1 small one)",
   "20 g fresh spinach (about 1 small handful)",
   "15 ml whole milk (about 1 tbsp)",
   "8 g mild Gouda, finely grated (about 1 tbsp)",
   "5 g unsalted butter"
  ],
  "steps": [
   "Peel and cut the potato into small pieces and boil until very soft, about 15 minutes.",
   "Wilt the spinach in a little water until fully soft, drain well and chop finely.",
   "Drain the potato and mash with the milk and butter until smooth, then stir in the chopped spinach.",
   "Stir the finely grated Gouda through the warm mash until it melts in.",
   "Check it is smooth with no firm lumps and serve 3 to 4 tbsp warm not hot."
  ]
 },
 "du4": {
  "ingredients": [
   "half a small sweet apple (about 60 g), peeled and cored",
   "1 tbsp water",
   "1 small pinch ground cinnamon",
   "2 tbsp plain unsweetened full fat yogurt (about 30 g)"
  ],
  "steps": [
   "Peel, core and chop the apple into small pieces no larger than 1 cm.",
   "Put the apple in a small pan with the water and cinnamon, cover and cook gently for 8 to 10 minutes until very soft.",
   "Mash or lightly blend to a smooth soft sauce, adding a splash more water if needed. Add no sugar or honey.",
   "Let it cool until just warm, then stir or swirl in the yogurt off the heat.",
   "Serve soft and just warm, not hot."
  ]
 },
 "fr1": {
  "ingredients": [
   "40 g skinless chicken breast",
   "2 tbsp ripe tomato (about 40 g), peeled and deseeded",
   "2 tbsp zucchini (about 30 g), peeled",
   "2 tbsp aubergine (about 30 g), peeled",
   "1 tbsp red pepper (about 20 g), skin removed",
   "3 tbsp cooked soft white rice",
   "half tsp olive oil",
   "1 small pinch dried thyme or oregano"
  ],
  "steps": [
   "Dice the zucchini, aubergine, red pepper and tomato into pieces no larger than 1 cm.",
   "Warm the olive oil in a small pan, add all the vegetables and the thyme, cover and cook gently for 12 to 15 minutes until very soft, adding a splash of water if needed. Add no salt.",
   "Meanwhile poach or simmer the chicken until fully cooked through with no pink and the juices run clear, then finely chop or shred into tiny pieces.",
   "Stir the chicken into the soft vegetables and warm together for 2 minutes.",
   "Spoon over the cooked rice, mix gently, and check everything is soft and small with no firm pieces.",
   "Let it cool to just warm before serving."
  ]
 },
 "fr2": {
  "ingredients": [
   "half a small carrot (about 30 g), peeled",
   "1 small potato (about 40 g), peeled",
   "2 tbsp sliced leek, white part only (about 25 g)",
   "1 tbsp red split lentils (about 15 g), rinsed",
   "120 ml water or unsalted vegetable stock",
   "quarter tsp olive oil"
  ],
  "steps": [
   "Chop the carrot, potato and leek into small pieces and rinse the lentils well.",
   "Warm the olive oil in a small pan, add the leek and soften for 2 minutes.",
   "Add the carrot, potato, lentils and water or unsalted stock, cover and simmer for 18 to 20 minutes until everything is very soft and the lentils have broken down.",
   "Blend smooth, adding a little more water for a soft spoonable texture. Add no salt.",
   "Cool until just warm and serve."
  ]
 },
 "fr3": {
  "ingredients": [
   "3 tbsp cauliflower florets (about 50 g)",
   "2 tbsp zucchini (about 30 g), peeled",
   "2 tbsp whole milk (about 30 ml)",
   "1 tbsp finely grated mild cheese (about 10 g)",
   "quarter tsp olive oil or unsalted butter"
  ],
  "steps": [
   "Cut the cauliflower and zucchini into small pieces no larger than 1 cm.",
   "Steam or boil them for 10 to 12 minutes until very soft, then drain well.",
   "Mash the vegetables with the milk and oil or unsalted butter to a soft lumpy puree.",
   "Stir in most of the grated cheese until fully melted through, then scatter the rest over the top.",
   "Warm gently for 1 to 2 minutes so the topping cheese softens and melts into a light gratin, then cool until just warm.",
   "Check there are no firm pieces before serving."
  ]
 },
 "fr4": {
  "ingredients": [
   "quarter small apple (about 30 g), peeled and cored",
   "quarter small ripe pear (about 30 g), peeled and cored",
   "1 tbsp water",
   "2 tbsp plain unsweetened full fat yogurt (about 30 g)"
  ],
  "steps": [
   "Peel, core and chop the apple and pear into small pieces no larger than 1 cm.",
   "Put the fruit in a small pan with the water, cover and cook gently for 8 to 10 minutes until very soft.",
   "Mash or lightly blend to a soft smooth compote, adding no sugar or honey.",
   "Let it cool until just warm, then stir or swirl in the yogurt off the heat.",
   "Serve soft and just warm, not hot."
  ]
 },
 "l1": {
  "ingredients": [
   "40 g cooked chicken breast, finely shredded",
   "3 tbsp cooked soft white rice (about 45 g)",
   "half a small carrot (about 25 g), diced small",
   "2 small broccoli florets (about 30 g)",
   "1 tsp olive oil",
   "1 to 2 tbsp unsalted chicken or vegetable cooking water to moisten"
  ],
  "steps": [
   "Boil or steam the carrot and broccoli 10 to 12 minutes until very soft, then chop to half inch pieces or smaller.",
   "Make sure the chicken is cooked right through, then shred it very fine with no stringy pieces.",
   "Warm the rice, chicken and carrot together with the olive oil and a splash of cooking water until soft and moist.",
   "Stir the soft broccoli in gently or keep it to the side.",
   "Cool to warm and serve 2 to 3 tbsp chicken and rice with 2 tbsp broccoli."
  ]
 },
 "l10": {
  "ingredients": [
   "4 tbsp small soft pasta such as cooked mini shells (about 50 g cooked)",
   "1 small ripe tomato, skinned and chopped (about 50 g)",
   "1 tbsp red split lentils (about 12 g dry)",
   "1 tbsp finely grated mild cheese",
   "1 tsp olive oil",
   "100 ml water"
  ],
  "steps": [
   "Rinse the lentils, add to a pan with the skinned chopped tomato, olive oil and water, and simmer 18 to 20 minutes until very soft, topping up with water if it dries out.",
   "Mash the sauce smooth so the lentils and tomato are fully broken down with no whole lentils.",
   "Cook the small pasta until very soft, a couple of minutes past the packet time, then drain.",
   "Stir the soft pasta through the sauce and mix in the finely grated cheese until melted.",
   "Cut through any larger pasta so nothing is over 1 cm, then serve soft and just warm."
  ]
 },
 "l11": {
  "ingredients": [
   "1.5 tbsp red split lentils (moong dal), rinsed",
   "1.5 tbsp white rice, rinsed",
   "pinch ground turmeric",
   "pinch ground cumin",
   "150 ml water",
   "0.5 tsp olive oil or unsalted butter"
  ],
  "steps": [
   "Rinse the dal and rice together until the water runs clear.",
   "Add to a small pot with the water, turmeric and cumin.",
   "Simmer covered 20 to 25 minutes, stirring now and then, until very soft and porridge-like; add a splash of water if it thickens too much.",
   "Stir in the oil or butter and mash any firm grains with a fork.",
   "Let it cool to warm, not hot, and serve soft."
  ]
 },
 "l12": {
  "ingredients": [
   "30 g skinless tilapia fillet",
   "2 tbsp cooked white rice",
   "1 tbsp red split lentils, rinsed",
   "2 small broccoli florets (about 25 g)",
   "0.5 tsp olive oil",
   "squeeze of lemon"
  ],
  "steps": [
   "Simmer the rinsed lentils in unsalted water 18 to 20 minutes until very soft, then drain.",
   "Steam the broccoli florets 6 to 8 minutes until very soft, then chop into pieces no bigger than 0.5 cm.",
   "Steam or poach the tilapia 6 to 8 minutes until fully opaque and it flakes easily; cool, then flake and check very carefully for bones, removing any you find.",
   "Fork through the cooked rice, lentils and flaked fish with the olive oil and a tiny squeeze of lemon.",
   "Add the broccoli, mix gently and serve warm, not hot."
  ]
 },
 "l13": {
  "ingredients": [
   "1 small zucchini (about 80 g)",
   "30 g lean minced beef",
   "1 tbsp cooked white rice",
   "1 tbsp grated peeled tomato",
   "0.5 tsp olive oil",
   "pinch ground cumin"
  ],
  "steps": [
   "Halve the zucchini lengthwise, scoop a shallow hollow and chop the scooped flesh finely.",
   "Cook the minced beef in the olive oil until fully browned with no pink, breaking it into small pieces, then stir in the rice, grated tomato, chopped zucchini flesh and cumin.",
   "Spoon the filling into the zucchini halves and place in a small pot with a thumb of water.",
   "Cover and simmer 20 to 25 minutes until the zucchini is very soft and easily pierced.",
   "Cool, then cut into soft pieces no bigger than 0.5 cm and serve warm."
  ]
 },
 "l14": {
  "ingredients": [
   "3 tbsp small soft pasta (cooked very soft, about 40 g)",
   "1 tbsp red split lentils, rinsed",
   "2 tbsp grated peeled tomato (no salt)",
   "2 tbsp finely grated zucchini",
   "1 tbsp finely grated mild cheese",
   "0.5 tsp olive oil"
  ],
  "steps": [
   "Simmer the rinsed lentils in unsalted water 18 to 20 minutes until very soft, then drain.",
   "Boil the pasta a few minutes longer than the packet says so it is very soft, then drain and chop into pieces under 0.5 cm.",
   "Soften the grated zucchini and tomato in the olive oil for about 5 minutes, then stir in the lentils.",
   "Fork the pasta through the sauce, spoon into a small dish and top with the grated cheese.",
   "Warm through until the cheese melts, then cool to warm, not hot, and serve."
  ]
 },
 "l15": {
  "ingredients": [
   "30 g raw peeled shrimp, deveined",
   "2 tbsp red split lentils, rinsed",
   "2 tbsp cooked white rice",
   "3 cherry tomatoes, quartered lengthwise",
   "0.5 tsp olive oil",
   "squeeze of lemon"
  ],
  "steps": [
   "Simmer the rinsed lentils in unsalted water 18 to 20 minutes until very soft, then drain.",
   "Mince the raw shrimp very finely, then cook in the olive oil until fully opaque, pink and firm all the way through, about 4 minutes.",
   "Quarter the cherry tomatoes lengthwise so no piece is bigger than 0.5 cm.",
   "Fork the rice, lentils and minced shrimp together with a small squeeze of lemon.",
   "Stir in the tomato and serve soft and warm, not hot."
  ]
 },
 "l2": {
  "ingredients": [
   "3 tbsp cooked or tinned chickpeas (about 45 g), rinsed well, skins slipped off",
   "1 tsp tahini",
   "half tsp lemon juice",
   "1 tsp olive oil, plus extra water to loosen",
   "quarter of a small zucchini (about 30 g), diced",
   "quarter of a small soft pita bread, no added salt"
  ],
  "steps": [
   "Steam or boil the zucchini 8 to 10 minutes until very soft, then dice to half inch pieces.",
   "Blend the chickpeas, tahini, lemon, olive oil and a little water into a smooth thick hummus with no whole chickpeas left.",
   "Warm the pita until soft and pliable, then cut into thin half inch wide strips.",
   "Plate 2 tbsp hummus with the soft pita strips and the soft zucchini alongside.",
   "Serve warm, not hot."
  ]
 },
 "l3": {
  "ingredients": [
   "2 tbsp cooked red split lentils (about 30 g), cooked very soft",
   "2 tbsp cooked soft white rice (about 30 g)",
   "1 tsp olive oil with a little finely chopped soft cooked onion (optional)",
   "1 tbsp plain full fat yogurt (about 15 g)",
   "2 cherry tomatoes, quartered lengthwise then chopped small",
   "tiny pinch ground cumin (optional), no added salt"
  ],
  "steps": [
   "Cook the red split lentils in plenty of water 15 to 20 minutes until completely soft and falling apart, then drain.",
   "Stir the lentils and rice together with the olive oil, soft onion and optional cumin until soft and moist.",
   "Quarter the cherry tomatoes lengthwise and chop them into small soft pieces.",
   "Cool the mujaddara to warm, then spoon over the yogurt and scatter the tomato.",
   "Serve about 3 tbsp."
  ]
 },
 "l4": {
  "ingredients": [
   "30 g cooked salmon fillet (about 1 oz)",
   "3 tbsp cooked white rice",
   "2 tbsp frozen peas",
   "1 tsp unsalted butter or olive oil",
   "1 tsp plain water or unsalted stock to loosen"
  ],
  "steps": [
   "Steam or poach the salmon until fully opaque and it flakes easily, about 8 to 10 minutes, then cool slightly.",
   "Boil the peas until very soft, about 5 minutes, then drain and lightly mash so there are no whole peas.",
   "Flake the salmon with a fork and check very carefully for any bones, removing every one.",
   "Stir the flaked salmon, mashed peas and butter through the warm rice, adding a little water so it is moist.",
   "Mash lightly so no piece is larger than 1 cm, then serve soft, small and just warm."
  ]
 },
 "l5": {
  "ingredients": [
   "2 tbsp red split lentils (about 25 g dry)",
   "1 small ripe tomato, skinned and chopped (about 50 g)",
   "1 tbsp finely chopped onion (about 15 g)",
   "1 tsp olive oil",
   "2 tbsp cooked white rice",
   "150 ml water"
  ],
  "steps": [
   "Rinse the lentils well, then soften the onion in the olive oil over low heat without browning, about 4 minutes.",
   "Add the skinned chopped tomato and cook 2 minutes until pulpy.",
   "Add the rinsed lentils and water, simmer gently 20 to 25 minutes until the lentils are very soft and collapsing, topping up with water if it dries out.",
   "Mash to a smooth, thick stew with no whole lentils, adding a splash of water if needed.",
   "Stir through the cooked rice and serve soft and just warm, not hot."
  ]
 },
 "l6": {
  "ingredients": [
   "35 g lean minced beef",
   "3 tbsp cooked white rice",
   "30 g zucchini, peeled and finely diced (about a quarter of a small one)",
   "3 cherry tomatoes, quartered lengthwise",
   "1 tsp olive oil",
   "2 tbsp water"
  ],
  "steps": [
   "Heat the olive oil over low heat and cook the minced beef fully until no pink remains, breaking it into very small crumbs.",
   "Add the diced zucchini and water, cover and cook 6 to 8 minutes until the zucchini is very soft.",
   "Stir in the cooked rice and warm through, mashing lightly so every piece is under 1 cm.",
   "Quarter the cherry tomatoes lengthwise so no piece is a whole round, then serve them alongside the rice and beef, soft, small and just warm."
  ]
 },
 "l7": {
  "ingredients": [
   "3 tbsp cooked chickpeas, tinned no salt and rinsed (about 45 g)",
   "1 tsp tahini",
   "1 squeeze of lemon juice (about half a tsp)",
   "1 tsp olive oil",
   "1 to 2 tbsp warm water to loosen",
   "Half a small carrot (about 35 g)",
   "Half a small soft pita"
  ],
  "steps": [
   "Boil the carrot until very soft enough to mash, about 12 to 15 minutes, then cool and cut into thin soft strips no thicker than a finger.",
   "Warm the rinsed chickpeas, then mash very smoothly with the tahini, lemon, olive oil and enough warm water to make a soft spread.",
   "Check the mash for any whole chickpeas or skins and break them down fully so the texture is smooth.",
   "Warm the pita until soft and cut into thin finger strips for dipping.",
   "Serve the chickpea mash with the soft pita strips and soft carrot strips, all just warm."
  ]
 },
 "l8": {
  "ingredients": [
   "30 g tinned sardines in water, no salt, drained and rinsed (about 1 oz)",
   "3 tbsp cooked white rice",
   "2 tbsp broccoli florets (about 30 g)",
   "1 tsp olive oil",
   "1 tbsp water to loosen"
  ],
  "steps": [
   "Steam or boil the broccoli until very soft, about 6 to 8 minutes, then chop finely into pieces under 1 cm.",
   "Drain and rinse the sardines, then mash thoroughly so the soft bones are completely broken down and undetectable.",
   "Stir the mashed sardines and olive oil through the warm rice, adding a little water so it is moist.",
   "Fold in the chopped broccoli and mash lightly together so no piece is larger than 1 cm.",
   "Serve soft, small and just warm, not hot."
  ]
 },
 "l9": {
  "ingredients": [
   "30 g cooked chicken breast, finely chopped",
   "2 tbsp cooked white rice",
   "1 tbsp red split lentils (about 12 g dry)",
   "Half a small carrot, finely diced (about 35 g)",
   "1 tbsp frozen peas",
   "1 pinch ground cumin",
   "1 tsp olive oil",
   "150 ml water"
  ],
  "steps": [
   "Rinse the lentils, then warm the olive oil and pinch of cumin gently over low heat for a few seconds until fragrant.",
   "Add the finely diced carrot, lentils and water, simmer 15 to 18 minutes until the carrot and lentils are very soft, topping up with water if needed.",
   "Add the peas and finely chopped cooked chicken, simmer 5 more minutes until everything is tender and the peas are soft.",
   "Stir in the cooked rice and warm through, then mash lightly so no piece is larger than 1 cm.",
   "Serve soft and just warm, not hot."
  ]
 },
 "s1": {
  "ingredients": [
   "3 tbsp plain full fat yogurt",
   "2 tbsp soft ripe berries (raspberries, blueberries or strawberries)"
  ],
  "steps": [
   "Wash the berries well. Quarter any strawberries, and quarter blueberries or any firmer round berries, so no piece is over 1 cm.",
   "Mash the berries thoroughly with a fork until soft and pulpy with no firm chunks.",
   "Stir the mashed berries through the yogurt until evenly mixed.",
   "Serve cool, about 3 to 4 tbsp."
  ]
 },
 "s2": {
  "ingredients": [
   "half a small carrot",
   "quarter of a small zucchini"
  ],
  "steps": [
   "Peel the carrot and cut both the carrot and zucchini into short sticks about 5 cm long and finger thin.",
   "Steam or boil the sticks until soft enough to squash easily between two fingers, about 8 to 10 minutes for carrot, less for zucchini.",
   "Check each stick is fully soft right through; cut any thicker ones thinner so they are easy to gum.",
   "Let them cool to just warm before serving a few sticks."
  ]
 },
 "s3": {
  "ingredients": [
   "half a ripe banana"
  ],
  "steps": [
   "Peel the banana and check it is soft and ripe with no firm parts.",
   "Cut the half banana lengthwise into strips, then across into small pieces no larger than 1 cm.",
   "Lightly squash each piece with a fork so it is easy to gum.",
   "Serve at room temperature straight away so it does not brown."
  ]
 },
 "s4": {
  "ingredients": [
   "20 g mild full fat cheese (mild cheddar or similar)"
  ],
  "steps": [
   "Use mild full fat cheese, never a hard crumbly aged block that breaks into firm chunks.",
   "Grate the cheese on a coarse grater, or slice into very thin short strips no thicker than a few millimetres.",
   "Keep pieces small and thin so they soften easily in the mouth; never serve cheese in cubes.",
   "Serve a small handful at room temperature."
  ]
 },
 "s5": {
  "ingredients": [
   "40 g soft pita bread (about half a small round)",
   "45 g tinned no-salt chickpeas, rinsed (about 3 tbsp)",
   "5 g tahini (about 1 tsp)",
   "5 ml olive oil (about 1 tsp)",
   "a few drops fresh lemon juice",
   "1 to 2 tbsp warm water to thin"
  ],
  "steps": [
   "Drain and rinse the chickpeas well, then peel off any loose skins so they blend smooth.",
   "Blend or mash the chickpeas with the tahini, olive oil and a few drops of lemon, adding warm water a little at a time until very smooth and loose, not stiff.",
   "Warm the pita gently until soft and pliable, never crisp, then cut into short thin strips no wider than a finger.",
   "Serve the strips with a small spoon of the thin hummus to dip, warm not hot."
  ]
 },
 "s6": {
  "ingredients": [
   "30 g ripe avocado (about a quarter)",
   "20 g soft bread (about 1 small slice)",
   "a few drops fresh lemon juice",
   "2 g unsalted butter for the toast, optional"
  ],
  "steps": [
   "Toast the bread lightly so it holds together but stays soft, then trim off the crusts.",
   "Mash the avocado with a few drops of lemon until completely smooth with no lumps.",
   "Spread a thin even layer of avocado over the toast.",
   "Cut into 1 to 2 soft fingers no wider than an adult finger and serve warm not hot."
  ]
 },
 "s7": {
  "ingredients": [
   "50 g apple or pear, peeled and cored (about half a small fruit)",
   "1 tiny pinch ground cinnamon",
   "1 tbsp water for steaming"
  ],
  "steps": [
   "Peel and core the apple or pear, then cut into small pieces.",
   "Steam or simmer in a little water until very soft and easily squashed with a fork, about 8 to 10 minutes.",
   "Drain, then dust with a tiny pinch of cinnamon and stir through.",
   "Let cool to warm, check each piece is soft enough to squash between your fingers, and serve 3 to 4 pieces."
  ]
 },
 "s8": {
  "ingredients": [
   "60 g sweet potato, peeled (about half a small one)",
   "5 ml olive oil, optional (about 1 tsp)",
   "water for boiling or steaming"
  ],
  "steps": [
   "Peel the sweet potato and cut into small cubes.",
   "Steam or boil until very soft and easily squashed, about 10 to 12 minutes.",
   "Drain well and toss with a little olive oil if using.",
   "Let cool to warm and check each cube is soft enough to squash before serving a few cubes."
  ]
 }
};
  /* ---------------- age brackets (pediatrician sourced) ----------------
     Selectable child ages, and the youngest-safe gating per dish. Sources:
     AAP HealthyChildren, CDC, NHS Start for Life, Health Canada, WHO, USDA.
     AGE_POLICY holds the per-bracket textures / avoid / milk guidance and the
     global rules; MINAGE maps each dish to the youngest bracket it suits;
     EXTRA_MEALS are first foods added for 6 to 11 months. */
  var AGE_BRACKETS = [
    { key:"0-5m",   label:"Under 6 months",  short:"0 to 5m"  },
    { key:"6-8m",   label:"6 to 8 months",   short:"6 to 8m"  },
    { key:"9-11m",  label:"9 to 11 months",  short:"9 to 11m" },
    { key:"12-23m", label:"12 to 23 months", short:"1 to 2y"  },
    { key:"24-36m", label:"2 to 3 years",    short:"2 to 3y"  },
    { key:"48-60m", label:"4 to 5 years",    short:"4 to 5y"  }
  ];
  function bracketIdx(key){ for(var i=0;i<AGE_BRACKETS.length;i++) if(AGE_BRACKETS[i].key===key) return i; return 3; }
  var AGE_POLICY = {"brackets":{"6-8m":{"oneLine":"Start solids around 6 months once readiness signs appear, leading with iron-rich smooth purees alongside milk feeds.","textures":["Smooth purees, mashed, or strained foods, very smooth at first","Progress within weeks to thicker, lumpier, mashed textures","Soft cooked finger foods cut big enough to hold in the fist with a bit sticking out","Most fruit and veg cooked soft; ripe banana and avocado can be served raw and mashed"],"avoid":["Honey (botulism risk under 12 months)","Cow's, goat's, sheep's milk as a main drink","Added salt, stock cubes, gravy (keep under 1g salt/day)","Added sugar and sugary foods or drinks","Fruit juice","Whole nuts and seeds","Unpasteurised and mould-ripened soft cheeses","High-mercury fish (shark, swordfish, marlin)","Pate and raw or undercooked shellfish","Salty processed foods (bacon, sausages, crisps, ready meals)"],"milk":"Breast milk or infant formula is the main drink and primary nutrition. No cow's/goat's/sheep's milk as a main drink, though small amounts of full-fat pasteurised cow's milk can be used in cooking or mixed with food from around 6 months. Plain unsweetened yogurt and cheese are fine as foods. No juice; a little water (up to ~1 cup/day) can be offered with meals.","allergens":"Introduce common allergens early, from around 6 months, alongside other first foods rather than delaying. Offer one new allergen at a time in a small amount, then watch over the next few days before adding another. Serve in safe forms: well-cooked egg, smooth thinned peanut/nut butter, never whole nuts. If the baby has severe eczema or known egg allergy, talk to the doctor before introducing peanut.","saltSugar":"No added salt (keep below 1g salt/day, max ~1g/day from 7 months) and no added sugar. No honey before 12 months. Prepare family foods with little or no added salt or sugar."},"9-11m":{"oneLine":"Pincer grasp arrives, so soft self-fed finger foods plus mashed, lumpy, and minced textures, with milk still the main drink.","textures":["Soft finger foods the baby can pick up (pieces smaller than a dime, very soft)","Mashed and lumpy textures, not only smooth purees","Minced, finely chopped, and soft-chopped foods","Soft cooked vegetables and soft fruit pieces","Foods that dissolve with saliva or mash between the gums"],"avoid":["Honey in any form, including baked","Added sugar and sugary drinks (juice, squash, fizzy drinks)","Added salt and salty foods","Cow's milk as the main drink (small amounts in cooking are fine)","Hard, small, round, or sticky foods unless modified","Whole nuts","Shop-bought baby food pouches as a daily staple","Unpasteurised foods and high-mercury fish"],"milk":"Breast milk or first infant formula stays the main drink through the first year (a formula-fed baby needs roughly 400 ml/day alongside solids). Whole cow's milk should not be the main drink before 12 months because it lacks adequate iron and vitamin C; small amounts in cooked food or cereal are fine.","allergens":"Common allergens (egg, peanut, dairy, wheat, sesame, soy, fish, shellfish) should already be in the diet and kept there. Introduce any new allergen one at a time and watch for rash, vomiting, or diarrhea, then keep offering it once tolerated. Serve peanut as smooth thinned peanut butter, never whole or in a thick blob. Children with severe eczema or known allergy should be evaluated first.","saltSugar":"No added salt (immature kidneys cannot handle it) and no added sugars at all; avoid sugary drinks. No honey before 12 months in any form."},"12-23m":{"oneLine":"Whole cow's milk can be the main drink and honey is now safe; the toddler eats soft chopped family foods, 3 meals plus 2 snacks.","textures":["Soft, moist, chopped or mashed family foods rather than purees","Bite-sized finger foods soft enough to squash between finger and thumb","Tender small pieces of meat, flaked fish (bones removed), soft cooked vegetables","Soft fruit cut small; hard raw fruit/veg cooked soft or grated","A range of lumpy and combination textures to build chewing skills"],"avoid":["Added sugars and sugar-sweetened drinks (soda, flavoured milk, sweetened yogurts, juice drinks)","High-sodium and processed foods (lunch meats, sausages, hot dogs, ham, canned/frozen dinners)","Unpasteurised milk, yogurt, cheese, and juice","High-mercury fish (shark, swordfish, king mackerel, marlin, bigeye tuna)","Caffeine (no safe amount under 24 months)","More than 24 oz/day cow's milk; juice over 4 oz/day","Whole nuts, hard candy, gum, popcorn, chips"],"milk":"Whole (full-fat), pasteurised, unflavoured, vitamin-D-fortified cow's milk can become the main drink at 12 months, limited to about 16 to 24 oz/day so it does not crowd out iron-rich food. Children need about 2 dairy servings daily. Continued breastfeeding is encouraged as long as wished. Low-fat/skim milk is generally reserved for age 2+. Fortified soy is the closest plant alternative; never give raw/unpasteurised milk.","allergens":"Keep tolerated allergens (egg, peanut, dairy, wheat, sesame, soy, fish, shellfish) in the diet with regular routine servings to maintain tolerance; do not stop offering them. If any were missed, add one at a time with a day's gap, starting small, watching for reaction. Never whole peanuts or tree nuts; use smooth thinned nut butter or peanut puffs. Diagnosed allergy follows the allergist's plan.","saltSugar":"No added salt (NHS caps ages 1 to 3 at about 2g salt / 0.8g sodium per day). No added sugars; avoid sweetened drinks and yogurts, and serve any sweet foods with meals to protect teeth. Honey is now safe after 12 months but still counts as added sugar. Avoid caffeine entirely."},"24-36m":{"oneLine":"Switch to fat-free or low-fat (1%) milk and full family meals in small cut pieces, with choking foods still modified.","textures":["Chopped, mashed, and bite-sized soft family foods (about a quarter adult portion)","Soft cooked vegetables and soft or cut fruit","Tender, finely cut or shredded meats, poultry, and fish","Soft grains: cooked cereal, rice, pasta, soft bread","Beans, lentils, and tofu, mashed if needed; cheese cut small and yogurt"],"avoid":["Added sugars: sugary drinks, and limit cakes, cookies, sweets","High-sodium and processed foods; do not add salt","High-mercury fish (shark, swordfish, king mackerel, marlin, bigeye tuna)","Unpasteurised milk, cheese, yogurt, or juice","100% fruit juice beyond about 4 oz/day","Caffeine (no safe amount)","Whole nuts, popcorn, hard candy, gum and other hard round foods unless modified"],"milk":"Switch from whole milk to fat-free (skim) or low-fat (1%) cow's milk at age 2, unless the pediatrician advises otherwise. AAP guidance is about 3 servings a day at roughly 1/2 cup each; NHS frames it as at least ~350 ml (about 12 oz) or two dairy servings. Milk and water are the main drinks. Breastfeeding can continue. No unpasteurised milk.","allergens":"Allergens should already be introduced; keep the tolerated ones in the diet regularly (for example peanut and egg at least roughly weekly) to maintain tolerance. Serve in age-safe forms: thinly spread or thinned peanut butter, well-cooked egg, finely cut fish. A diagnosed allergy follows the allergist's avoidance plan.","saltSugar":"No added salt at the table or in cooking; limit high-sodium processed foods. Keep added sugars very low and avoid sugar-sweetened drinks. Honey is permitted now but still counts as added sugar and should be limited. Limit 100% juice to 4 oz/day; water and plain milk preferred."},"48-60m":{"oneLine":"Essentially the full family diet with the caregiver deciding what and when, the child deciding how much, and ongoing choking caution.","textures":["Family textures: the same range of foods as adults, chewing well","Firmer and chewier foods as molars and chewing mature","Mixed-texture and combination dishes (casseroles, stir fries, soups with pieces)","Raw fruits and vegetables if cut and supervised, harder ones still cooked soft or cut thin","No pureeing or mashing needed for typical development"],"avoid":["Sugary drinks and sodas","Excess fruit juice: only 100% juice, limited to 4 oz (about 120 ml) or less per day","Highly processed and fast foods, kept limited","Foods high in added salt","Foods and drinks high in added sugar (sweets, cakes, biscuits, sweetened drinks)","Hard, gooey, or sticky candy and chewing gum","Whole or large pieces of round, hard, or slippery foods served unmodified"],"milk":"Plain water and milk are the recommended drinks. Use low-fat or reduced-fat cow's milk (whole milk only up to age 2). Typical dairy is about 2 to 2.5 cups (roughly 480 to 600 ml) per day per USDA MyPlate; do not exceed this, since excess milk displaces iron-rich foods. Fortified non-dairy alternatives are acceptable. Breast/formula is not required; any continued breastfeeding is a complement.","allergens":"Continue the early-introduction principle: once an allergen (peanut, egg, dairy, tree nuts, soy, wheat, fish, shellfish, sesame) is tolerated, keep it a regular part of the usual diet to maintain tolerance. If one was never introduced, it can still be offered now in a choking-safe form (for example peanut as a thin layer of peanut butter, never whole). A known or suspected allergy follows the GP or allergist plan.","saltSugar":"Keep added salt low (NHS max about 3g salt/day for ages 4 to 6); avoid adding salt and limit salty processed foods. Keep free/added sugars low (NHS limit about 19g, roughly 5 sugar cubes, per day for ages 4 to 6); limit sweets and sweetened drinks, choose water and milk. Honey carries no botulism risk now but still counts as a free sugar and should be limited."}},"globalRules":["No honey in any form, including baked, before 12 months: risk of infant botulism.","No added salt at any age in this planner, and no added sugar before 2 years; keep both low after 2 years.","No cow's, goat's, or sheep's milk as the main drink before 12 months (small amounts in cooking or mixed into food are fine from around 6 months).","No whole nuts, seeds, or hard round/slippery choking-hazard foods before age 4; serve nut butter only thinned or spread thinly, never in lumps or by the spoonful.","Always supervise eating with the child seated upright; never leave a child eating unattended.","Iron is the priority nutrient from 6 months on: offer iron-rich foods daily and pair plant-based iron with vitamin C foods at the same meal.","Introduce common allergens early, one at a time, then keep tolerated allergens in the diet regularly to maintain tolerance.","No fruit juice before 12 months; after 12 months limit 100% juice to no more than 4 oz (about 120 ml) per day.","No high-mercury fish (shark, swordfish, marlin, king mackerel) and no unpasteurised milk, cheese, or juice at any age in this planner.","Children with severe eczema or a known food allergy should be assessed by a doctor before allergen introduction.","Let the child's hunger and fullness cues guide amounts; never force a clean plate.","Remove all bones, pips, and stones, and cut small round foods (grapes, cherry tomatoes) lengthwise; never serve them whole.","Learn baby choking first aid before starting finger foods. Normal gagging is loud and the baby stays pink; true choking is silent or the baby turns blue and needs help at once.","Keep milk from crowding out iron: about 16 to 24 oz (475 to 700 ml) of cow's milk a day from age 1, and offer an iron-rich food at every meal."]};
  var MINAGE = {"b1":"12-23m","b2":"9-11m","b3":"6-8m","b4":"12-23m","b5":"9-11m","b6":"9-11m","b7":"9-11m","b8":"9-11m","b9":"12-23m","b10":"6-8m","b11":"9-11m","l1":"9-11m","l2":"9-11m","l3":"9-11m","l4":"6-8m","l5":"6-8m","l6":"9-11m","l7":"9-11m","l8":"6-8m","l9":"9-11m","l10":"9-11m","l11":"6-8m","l12":"6-8m","l13":"9-11m","l14":"9-11m","l15":"9-11m","d1":"9-11m","d2":"9-11m","d3":"6-8m","d4":"6-8m","d5":"9-11m","d6":"9-11m","d7":"9-11m","d8":"6-8m","d9":"9-11m","d10":"9-11m","d11":"9-11m","d12":"9-11m","s1":"6-8m","s2":"9-11m","s3":"9-11m","s4":"9-11m","s5":"9-11m","s6":"9-11m","s7":"9-11m","s8":"9-11m","du1":"12-23m","du2":"12-23m","du3":"12-23m","du4":"6-8m","fr1":"9-11m","fr2":"6-8m","fr3":"12-23m","fr4":"6-8m"};
  var EXTRA_MEALS = [{"id":"a1","name":"Iron-Fortified Oat Cereal with Mashed Banana","slot":"breakfast","cuisine":"Universal","level":"easy","min":5,"minAge":"6-8m","ingredients":["iron-fortified baby oat cereal","banana","breast milk or formula"],"allergens":["gluten"],"groups":["grain","fruit"],"iron":true,"vitC":false,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Iron-fortified cereal is the easiest way to hit the daily iron target at 6 months, and ripe banana makes it sweet without any added sugar.","safe":"Mix to a smooth, slightly runny puree with no lumps; serve warm, not hot, on a soft-tipped spoon with baby seated upright.","recipe":["1 tablespoon iron-fortified baby oat cereal","3 to 4 tablespoons breast milk or formula","2 tablespoons ripe banana, mashed very smooth"],"steps":["Mash the ripe banana with a fork until completely smooth with no strings or lumps.","Put the oat cereal in a bowl and stir in the warm breast milk or formula a little at a time until smooth.","Stir the mashed banana through the cereal.","Check the temperature on the inside of your wrist, then offer 1 to 2 spoonfuls, letting baby guide how much."]},{"id":"a2","name":"Pureed Beef with Sweet Potato","slot":"lunch","cuisine":"Universal","level":"simple","min":30,"minAge":"6-8m","ingredients":["lean beef","sweet potato","water"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Red meat is one of the best sources of easily absorbed heme iron, and the vitamin C in sweet potato helps lock that iron in.","safe":"Blend to a completely smooth, thin puree with no fibres or strands; loosen with extra water if needed and serve warm on a spoon, baby seated upright.","recipe":["30 g lean beef (such as stewing steak), all fat trimmed","1 small sweet potato (about 100 g), peeled and diced","Water to cover and to thin"],"steps":["Simmer the beef gently in unsalted water until very tender, about 30 to 40 minutes.","Add the diced sweet potato for the last 15 minutes until soft.","Drain, keeping some cooking liquid.","Blend the beef and sweet potato to a very smooth puree, adding cooking water until thin and lump-free.","Cool to warm, test the temperature, and offer 1 to 2 spoonfuls."]},{"id":"a3","name":"Red Lentil and Carrot Puree","slot":"dinner","cuisine":"Universal","level":"simple","min":25,"minAge":"6-8m","ingredients":["red lentils","carrot","water"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Red lentils give plant iron and protein, and the vitamin C in carrot at the same meal boosts how much of that iron baby absorbs.","safe":"Blend or mash to a smooth, soft puree with no whole lentils or firm pieces; thin with water as needed and serve warm, baby seated upright.","recipe":["3 tablespoons dried red lentils, rinsed well","1 medium carrot, peeled and diced","250 ml water (no salt, no stock cube)"],"steps":["Rinse the lentils until the water runs clear.","Put the lentils and carrot in a pan with the water and bring to a boil.","Simmer for about 20 to 25 minutes until the lentils are very soft and collapsing.","Blend to a smooth puree, adding a little cooled boiled water to reach a soft, spoonable texture.","Cool to warm, check the temperature, and offer 1 to 2 spoonfuls."]},{"id":"a4","name":"Plain Full-Fat Yogurt with Mashed Strawberry","slot":"snack","cuisine":"Universal","level":"easy","min":5,"minAge":"6-8m","ingredients":["plain full-fat yogurt","strawberries"],"allergens":["milk"],"groups":["dairy","fruit"],"iron":false,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Plain full-fat yogurt safely introduces the dairy allergen and gives calcium, while strawberry adds vitamin C with no added sugar.","safe":"Use smooth, unsweetened yogurt and mash the strawberry to a smooth seed-free pulp; stir together and serve cool on a spoon, baby seated upright.","recipe":["2 tablespoons plain whole-milk pasteurised yogurt, unsweetened","2 ripe strawberries, hulled"],"steps":["Hull the strawberries and mash them with a fork until smooth and pulpy.","Press through a small sieve if you prefer to remove the tiny seeds.","Stir the mashed strawberry into the plain yogurt.","Offer 1 to 2 spoonfuls, watching for any reaction since this introduces dairy."]},{"id":"a5","name":"Pureed Chicken with Peas","slot":"lunch","cuisine":"Universal","level":"simple","min":25,"minAge":"6-8m","ingredients":["chicken","peas","water"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Chicken provides heme iron and protein, and peas add vitamin C plus a little extra plant iron in one smooth, savoury meal.","safe":"Blend to a smooth, thin puree, pushing through a sieve if any pea skins remain; serve warm on a spoon with baby seated upright.","recipe":["40 g skinless chicken breast or thigh","3 tablespoons frozen or fresh peas","Water to cover and to thin"],"steps":["Simmer the chicken in unsalted water until cooked through and tender, about 15 to 20 minutes.","Add the peas for the last 5 minutes until soft.","Drain, keeping some cooking liquid.","Blend the chicken and peas to a very smooth puree, pushing through a sieve to remove any pea skins, and thin with cooking water.","Cool to warm, test the temperature, and offer 1 to 2 spoonfuls."]},{"id":"a6","name":"Mashed Avocado with Mango","slot":"breakfast","cuisine":"Universal","level":"easy","min":5,"minAge":"6-8m","ingredients":["avocado","mango"],"allergens":[],"groups":["fruit","veg"],"iron":false,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Ripe avocado gives healthy fats for brain growth while mango adds plenty of vitamin C, both served raw and naturally smooth.","safe":"Use very ripe fruit mashed to a completely smooth, lump-free paste; serve fresh and cool on a spoon, baby seated upright.","recipe":["1/4 ripe avocado","2 tablespoons ripe mango flesh"],"steps":["Scoop the ripe avocado flesh into a bowl.","Add the ripe mango flesh.","Mash both together with a fork until completely smooth with no lumps or strings.","Serve straight away, offering 1 to 2 spoonfuls."]},{"id":"a7","name":"Smooth Chickpea and Tomato Puree with Tahini","slot":"dinner","cuisine":"Middle Eastern","level":"simple","min":15,"minAge":"6-8m","ingredients":["chickpeas","tomato","tahini","olive oil"],"allergens":["sesame"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Chickpeas bring plant iron and tahini introduces the sesame allergen early, while ripe tomato adds vitamin C to boost iron absorption.","safe":"Blend to a completely smooth, soft puree with no whole chickpeas or skins; thin with water and serve at room temperature on a spoon, baby seated upright.","recipe":["3 tablespoons cooked or no-salt canned chickpeas, rinsed","2 tablespoons ripe tomato flesh, skin and seeds removed","1 teaspoon smooth tahini","1/2 teaspoon olive oil","Cooled boiled water to thin"],"steps":["Rinse the chickpeas well and rub off any loose skins.","Blend the chickpeas, tomato flesh, tahini and olive oil until completely smooth.","Add cooled boiled water a little at a time until the puree is soft and spoonable with no lumps.","Offer 1 to 2 spoonfuls, watching for any reaction since this introduces sesame."]},{"id":"a8","name":"Pureed Salmon with Potato and Broccoli","slot":"lunch","cuisine":"Universal","level":"simple","min":25,"minAge":"6-8m","ingredients":["salmon","potato","broccoli","water"],"allergens":["fish"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Salmon introduces the fish allergen early and gives iron and omega-3 for brain development, with broccoli adding vitamin C.","safe":"Flake the cooked salmon and check carefully for bones, then blend to a smooth thin puree; serve warm on a spoon, baby seated upright.","recipe":["40 g skinless salmon fillet","1 small potato, peeled and diced","2 small broccoli florets","Water to cover and to thin"],"steps":["Simmer the diced potato in unsalted water until starting to soften, about 8 minutes.","Add the salmon and broccoli and cook until the fish flakes easily and the broccoli is soft, about 8 to 10 minutes.","Drain, keeping some cooking liquid, and carefully check the salmon for any bones, removing them all.","Blend everything to a very smooth puree, thinning with cooking water as needed.","Cool to warm, test the temperature, and offer 1 to 2 spoonfuls, watching for any reaction since this introduces fish."]},{"id":"a9","name":"Well-Cooked Egg with Sweet Potato Mash","slot":"breakfast","cuisine":"Universal","level":"easy","min":15,"minAge":"6-8m","ingredients":["egg","sweet potato","breast milk or formula"],"allergens":["egg"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Well-cooked egg introduces the egg allergen early and adds iron, while vitamin C from sweet potato helps absorption.","safe":"Use fully cooked, firm egg mashed smooth with soft sweet potato into a lump-free puree; serve warm on a spoon, baby seated upright.","recipe":["1 egg, hard-boiled","2 tablespoons cooked sweet potato","1 to 2 tablespoons breast milk or formula"],"steps":["Hard-boil the egg until both white and yolk are fully set, about 10 minutes, then cool and peel.","Steam or boil the sweet potato until very soft.","Mash the sweet potato and a portion of the cooked egg together, loosening with breast milk or formula until completely smooth.","Cool to warm, test the temperature, and offer 1 to 2 spoonfuls, watching for any reaction since this introduces egg."]},{"id":"a10","name":"Iron-Fortified Baby Rice with Pureed Pear","slot":"snack","cuisine":"Universal","level":"easy","min":10,"minAge":"6-8m","ingredients":["iron-fortified baby rice cereal","pear","breast milk or formula"],"allergens":[],"groups":["grain","fruit"],"iron":true,"vitC":true,"portion":"1 to 2 tablespoons to start, follow baby's cues","why":"Iron-fortified rice cereal helps meet the daily iron need and is naturally gluten-free, with soft pear adding gentle sweetness and a little vitamin C.","safe":"Mix to a smooth, slightly runny puree with no lumps and cook the pear soft before mashing; serve warm on a spoon, baby seated upright.","recipe":["1 tablespoon iron-fortified baby rice cereal","1/2 ripe pear, peeled and diced","3 to 4 tablespoons breast milk or formula"],"steps":["Steam or gently cook the diced pear until very soft, then mash or blend smooth.","Put the rice cereal in a bowl and stir in the warm breast milk or formula until smooth.","Stir the pureed pear through the cereal.","Check the temperature on the inside of your wrist, then offer 1 to 2 spoonfuls, letting baby guide how much."]},{"id":"n1","name":"Iron-Rich Lentil and Sweet Potato Mash","slot":"lunch","cuisine":"British","level":"easy","min":20,"minAge":"9-11m","ingredients":["red lentils","sweet potato","broccoli","olive oil"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Red lentils give plant iron and the broccoli's vitamin C helps the baby absorb it.","safe":"Mash to a soft lumpy texture with no firm pieces; serve soft broccoli florets cut small enough to squash between the gums.","recipe":["3 tablespoons dried red lentils, rinsed","1 small sweet potato, peeled and diced","2 small broccoli florets","0.5 teaspoon olive oil","120 ml water, no salt"],"steps":["Add lentils, sweet potato and water to a small pan and bring to a gentle simmer.","Cook 15 minutes until lentils are very soft and starting to break down.","Steam or add the broccoli florets for the last 5 minutes until very soft.","Stir in the olive oil and mash to a soft lumpy texture, leaving a few small soft lumps.","Cool to lukewarm and test temperature before serving."]},{"id":"n2","name":"Soft Scrambled Egg with Tomato","slot":"breakfast","cuisine":"International","level":"easy","min":10,"minAge":"9-11m","ingredients":["egg","tomato","olive oil"],"allergens":["egg"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"1 egg plus a little tomato","why":"Well-cooked egg keeps this common allergen in the diet and gives iron, with tomato adding vitamin C.","safe":"Cook egg fully until firm and soft, no runny parts; serve in soft small curds or finger strips the baby can pick up.","recipe":["1 egg","1 small ripe tomato, skinned and finely chopped","0.5 teaspoon olive oil"],"steps":["Warm the oil in a small non-stick pan over low heat.","Add the chopped tomato and soften for 2 minutes.","Beat the egg and pour in, stirring gently until fully cooked and no liquid egg remains.","Break into soft small curds or let set and cut into soft finger strips.","Cool to lukewarm before serving."]},{"id":"n3","name":"Minced Beef and Pea Mash","slot":"dinner","cuisine":"British","level":"simple","min":25,"minAge":"9-11m","ingredients":["minced beef","potato","peas","olive oil"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Minced beef is one of the best iron sources for babies and peas add vitamin C to boost absorption.","safe":"Cook mince until fully done and very soft, then mash with potato so there are no firm or chewy lumps; lightly crush the peas.","recipe":["2 tablespoons lean minced beef","1 small potato, peeled and diced","2 tablespoons frozen peas","0.5 teaspoon olive oil","120 ml water, no salt"],"steps":["Warm the oil and gently cook the minced beef until browned and fully cooked through.","Add potato and water, simmer 15 minutes until the potato is very soft.","Add peas for the last 5 minutes until soft.","Mash everything together to a soft lumpy texture, crushing the peas so none stay whole and round.","Cool to lukewarm and check no firm pieces of meat remain before serving."]},{"id":"n4","name":"Flaked Salmon and Potato Mash","slot":"lunch","cuisine":"International","level":"simple","min":20,"minAge":"9-11m","ingredients":["salmon","potato","broccoli","olive oil"],"allergens":["fish"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Salmon is a low-mercury fish that keeps this allergen in the diet, with broccoli's vitamin C alongside.","safe":"Flake the cooked salmon carefully and check thoroughly for bones; mash soft so the texture is lumpy but easy to gum.","recipe":["1 small skinless salmon fillet (about 40 g)","1 small potato, peeled and diced","2 small broccoli florets","0.5 teaspoon olive oil"],"steps":["Steam the potato and broccoli until very soft, about 12 minutes.","Steam or poach the salmon for 8 to 10 minutes until cooked through and opaque.","Flake the salmon completely with your fingers, removing every bone.","Mash the potato and broccoli, fold in the flaked salmon and olive oil to a soft lumpy texture.","Cool to lukewarm and double-check for bones before serving."]},{"id":"n5","name":"Soft Pasta with Tomato and Lentil Sauce","slot":"dinner","cuisine":"Italian","level":"simple","min":25,"minAge":"9-11m","ingredients":["pasta","red lentils","tomato","olive oil"],"allergens":["gluten"],"groups":["grain","protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Lentils and the iron in wheat pasta pair with vitamin C from tomato for a hearty iron meal.","safe":"Overcook small pasta shapes until very soft and cut into small pieces; sauce should be thick and lumpy, not runny.","recipe":["3 tablespoons small pasta shapes","2 tablespoons dried red lentils, rinsed","1 ripe tomato, skinned and chopped","0.5 teaspoon olive oil","120 ml water, no salt"],"steps":["Simmer the lentils in the water for 15 minutes until very soft and thick.","Add the chopped tomato and olive oil and cook 5 more minutes into a thick sauce.","Cook the pasta until very soft, a little past al dente, then drain.","Cut the pasta small, stir through the lentil tomato sauce and mash lightly to a lumpy texture.","Cool to lukewarm before serving."]},{"id":"n6","name":"Chicken and Carrot Soft Mince","slot":"lunch","cuisine":"International","level":"simple","min":25,"minAge":"9-11m","ingredients":["chicken","carrot","red pepper","olive oil"],"allergens":[],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Chicken provides iron and protein while red pepper delivers vitamin C to help absorption.","safe":"Mince or finely chop the soft cooked chicken so there are no stringy or firm pieces; vegetables cooked until they mash easily.","recipe":["1 small skinless chicken thigh, diced","1 small carrot, peeled and diced","2 tablespoons finely chopped red pepper","0.5 teaspoon olive oil","120 ml water, no salt"],"steps":["Warm the oil and gently cook the chicken pieces until fully cooked through.","Add carrot, red pepper and water, then simmer 15 minutes until everything is very soft.","Finely chop or pulse the chicken so there are no firm or stringy pieces.","Mash the vegetables and mix with the minced chicken to a soft lumpy texture.","Cool to lukewarm and check for firm pieces before serving."]},{"id":"n7","name":"Yogurt with Mashed Berries and Iron Cereal","slot":"breakfast","cuisine":"International","level":"easy","min":5,"minAge":"9-11m","ingredients":["plain yogurt","strawberries","iron-fortified baby cereal"],"allergens":["milk"],"groups":["dairy","fruit","grain"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Iron-fortified cereal stirred into yogurt with vitamin-C-rich berries makes an easy iron breakfast.","safe":"Use smooth thick yogurt and fully mash the berries so there are no firm round pieces; soft spoonable texture.","recipe":["3 tablespoons plain full-fat unsweetened yogurt","2 ripe strawberries, mashed","1 tablespoon iron-fortified baby cereal"],"steps":["Mash the strawberries thoroughly until no firm round pieces remain.","Stir the iron-fortified cereal into the yogurt until smooth and thickened.","Fold in the mashed strawberries.","Serve cool and spoonable; never add honey or sugar."]},{"id":"n8","name":"Mashed Chickpea and Avocado Spread on Toast Fingers","slot":"snack","cuisine":"Mediterranean","level":"easy","min":10,"minAge":"12-23m","ingredients":["chickpeas","avocado","strawberries","bread"],"allergens":["gluten"],"groups":["protein","fruit","grain"],"iron":true,"vitC":true,"portion":"1 to 2 toast fingers","why":"Chickpeas give plant iron and a squeeze of orange adds vitamin C to help the baby absorb it.","safe":"Mash chickpeas fully so no whole ones remain; toast lightly and cut into finger strips the baby can grip.","recipe":["2 tablespoons cooked chickpeas, no salt","2 tablespoons ripe avocado","2 tablespoons ripe strawberry, mashed","1 slice bread"],"steps":["Mash the chickpeas and avocado together until smooth with no whole chickpeas left.","Mash in the ripe strawberry for vitamin C (no fruit juice before 12 months).","Lightly toast the bread and cut into finger-width strips.","Spread the chickpea avocado mash thinly over the toast fingers.","Serve right away while the toast is soft enough to gum."]},{"id":"n9","name":"Soft Tofu and Vegetable Mash","slot":"dinner","cuisine":"Asian","level":"easy","min":15,"minAge":"9-11m","ingredients":["tofu","carrot","green beans","red pepper","olive oil"],"allergens":["soy"],"groups":["protein","veg"],"iron":true,"vitC":true,"portion":"3 to 4 tablespoons","why":"Tofu is rich in iron and keeps soy in the diet, with red pepper adding vitamin C.","safe":"Use soft tofu mashed to small soft lumps and cook the vegetables until they mash easily with no firm pieces.","recipe":["3 tablespoons soft tofu","1 small carrot, peeled and diced","4 green beans, finely chopped","2 tablespoons finely chopped red pepper","0.5 teaspoon olive oil"],"steps":["Steam the carrot, green beans and red pepper until very soft, about 12 minutes.","Mash the vegetables to a soft lumpy texture.","Add the soft tofu and mash it through with the olive oil into small soft lumps.","Warm gently if needed, then cool to lukewarm before serving."]},{"id":"n10","name":"Banana and Peanut Butter Soft Oat Fingers","slot":"snack","cuisine":"International","level":"simple","min":25,"minAge":"9-11m","ingredients":["banana","oats","peanut butter"],"allergens":["peanut","gluten"],"groups":["fruit","grain"],"iron":true,"vitC":false,"portion":"1 to 2 soft fingers","why":"Soft oat fingers keep peanut in the diet to maintain tolerance, with oats and banana adding iron.","safe":"Thin the peanut butter and blend it in fully so there are no lumps or blobs; bake soft and cut into easy-to-hold fingers.","recipe":["1 ripe banana, mashed","4 tablespoons oats","1 teaspoon smooth peanut butter thinned with 1 teaspoon water"],"steps":["Heat the oven to 180C and line a small tin.","Mash the banana smooth and stir in the oats.","Thin the peanut butter with the water until runny, then mix it fully through so no lumps remain.","Press into the tin and bake 15 to 18 minutes until set but soft.","Cool fully, cut into finger strips, and check the texture is soft enough to gum before serving."]}];
  var SAFEFIX = {"n3":"Fully mash or flatten every pea with a fork so none stays whole and round; whole or half peas are an airway-plug choking hazard regardless of softness. Cook minced beef to 71 C / 160 F checked with a food thermometer, not by colour.","n1":"Mash or flatten every pea so no whole round piece remains. Steam broccoli very soft and either serve as a large stalk the baby holds and gums or cut the floret lengthwise through the stem so it is not a round crown.","n10":"Use this only as a tolerance-maintenance dish once peanut is already established; it is not a first peanut exposure. Keep the bar soft and crumbly, break into small pieces rather than firm fingers, and never serve peanut butter thick, by the spoonful, or as a blob. If your baby has severe eczema or a known egg allergy, talk to your doctor before introducing peanut, as testing may be advised first.","a7":"Sesame (tahini) is a major allergen. On first exposure offer plain chickpea puree and, separately on its own day, a small amount of smooth tahini mixed into an already-tolerated food; serve this combined dish only once both are individually tolerated. Thin generously with breast milk, formula, or water to a loose smooth consistency for the youngest babies.","a8":"This is a first fish exposure. On the first try offer a small amount of the plain cooked salmon alone and watch several days before serving the full combined puree. Cook salmon until it flakes at ~63 C / 145 F and remove every bone.","a9":"Cook the egg fully until white and yolk are firm with no runny or translucent part. Introduce egg on its own day as a single new allergen first. Thin generously with breast milk, formula, or water to a loose smooth puree for the youngest babies, as mashed egg and sweet potato can be pasty.","l4":"Fully mash or flatten every pea so none stays whole and round, and blend smooth for a 6-8m eater (or move to 9-11m if served lumpy). Cook salmon until it flakes and remove every bone. Introduce fish as a single new allergen on its own first.","l8":"Mash the soft edible bones fully so none stays whole. Use lowest-sodium tinned sardines in water available, rinse well, and treat as occasional. Steam and mash or puree broccoli; do not serve a whole floret crown.","l15":"Introduce plain well-cooked finely minced shrimp alone mixed into a food the baby already eats, watch 3 to 5 days, then serve in this combined dish. Cook shrimp until opaque and firm throughout to avoid Vibrio and norovirus.","n8":"Remove the orange juice; no fruit juice before 12 months. For the vitamin-C benefit fold in a little mashed soft fruit such as strawberry or kiwi instead. Use soft bread or lightly toasted fingers that bend rather than snap so they do not form a gummy ball, and mash chickpeas fully.","b6":"Use mild pasteurised lower-salt cheese, grated or in thin strips, never cubed. Lightly toast bread only enough to hold together then let it soften and cut into thin finger strips that bend rather than snap. Quarter grapes lengthwise; never serve whole or halved round."};
  function buildExtra(d){
    return { id:d.id, name:d.name, slot:d.slot, cuisine:d.cuisine, level:d.level, min:d.min,
      ingredients:d.ingredients, main:(d.ingredients||[]).slice(0,3).join(", "),
      allergens:d.allergens||[], groups:d.groups||[], iron:!!d.iron, vitC:!!d.vitC,
      portion:d.portion, why:d.why, safe:d.safe||"", minAge:d.minAge,
      recipe:d.recipe||null, steps:d.steps||null };
  }
  MEALS.forEach(function(m){ var r=(typeof RECIPES!=="undefined")&&RECIPES[m.id]; if(r){ m.recipe=r.ingredients; m.steps=r.steps; } else { m.recipe=null; m.steps=null; } m.minAge=MINAGE[m.id]||"12-23m"; });
  EXTRA_MEALS.forEach(function(d){ MEALS.push(buildExtra(d)); });
  MEALS.forEach(function(m){ if(typeof SAFEFIX!=="undefined" && SAFEFIX[m.id]) m.safe=SAFEFIX[m.id]; });   // pediatric committee safety strengthening

  /* ---------------- preferences (localStorage) ---------------- */
  var PKEY = "chloe_meals_v1";
  function defaults(){ return { age:"12-23m", allergies:[], dislikes:[], cuisine:"any", snacks:2, quick:false, iron:false, favorites:[] }; }
  function loadPrefs(){ try{ var p=JSON.parse(localStorage.getItem(PKEY)); var d=defaults(); for(var k in p){ d[k]=p[k]; } return d; }catch(e){ return defaults(); } }
  function savePrefs(){ try{ localStorage.setItem(PKEY, JSON.stringify(prefs)); }catch(e){} }
  var prefs = loadPrefs();

  /* ---------------- filtering and day generation ---------------- */
  function allowed(m){
    var i;
    // age gate: only show a dish from the youngest bracket it is safe for, upward
    if(m.minAge && bracketIdx(m.minAge) > bracketIdx(prefs.age)) return false;
    for(i=0;i<prefs.allergies.length;i++){ if(m.allergens.indexOf(prefs.allergies[i])>-1) return false; }   // allergens removed FIRST, always
    var hay=(m.name+" "+m.ingredients.join(" ")).toLowerCase();
    for(i=0;i<prefs.dislikes.length;i++){ var d=(prefs.dislikes[i]||"").trim().toLowerCase(); if(d && hay.indexOf(d)>-1) return false; }
    if(prefs.quick && m.min>10) return false;
    if(prefs.cuisine!=="any" && m.cuisine!==prefs.cuisine && m.cuisine!=="international") return false;
    return true;
  }
  function score(m){ return (m.iron?2:0)+(m.vitC?1:0); }   // for iron-first: prefer iron, then iron WITH vitamin C
  function pool(slot){
    var p=MEALS.filter(function(m){ return m.slot===slot && allowed(m); });
    if(prefs.iron) p.sort(function(a,b){ return score(b)-score(a); });
    return p;
  }
  function rot(arr,n,start){ var out=[]; for(var i=0;i<n && arr.length;i++){ out.push(arr[((start+i)%arr.length+arr.length)%arr.length]); } return out; }
  function uniq(arr){ var seen={}, out=[]; arr.forEach(function(m){ if(m&&!seen[m.id]){ seen[m.id]=1; out.push(m); } }); return out; }

  // three options per meal slot: two simple, one a bit more involved, rotating by day so each day differs
  function mealOptions(slot, dayIdx){
    var p=pool(slot);
    var simple=p.filter(function(m){ return m.level!=="involved"; });
    var involved=p.filter(function(m){ return m.level==="involved"; });
    var combo=uniq(rot(simple,2,dayIdx*2).concat(rot(involved,1,dayIdx)));
    if(combo.length<3){ combo=uniq(combo.concat(rot(p,3,dayIdx))); }   // fill if heavy filtering thinned the pool
    return combo.slice(0,3);
  }
  function snackOptions(dayIdx){
    var p=pool("snack"); var n=Math.max(1,Math.min(2,prefs.snacks||2));
    return uniq(rot(p,n,dayIdx*n));
  }

  /* ---------------- shopping list (simple, by aisle) ---------------- */
  var AISLES=[
    {k:"Produce", words:["banana","apple","pear","avocado","mango","berries","strawberr","grapes","tomato","cherry tomato","cucumber","carrot","broccoli","zucchini","courgette","aubergine","eggplant","red pepper","pepper","leek","cauliflower","spinach","sweet potato","potato","peas","onion","lemon","cinnamon","cardamom","turmeric","cumin"]},
    {k:"Protein", words:["chicken","beef","minced beef","salmon","sardines","tilapia","shrimp","egg","lentils","red split lentils","moong dal","chickpeas","tinned chickpeas","chickpea flour"]},
    {k:"Dairy", words:["whole milk","milk","plain full fat yogurt","yogurt","yoghurt","labneh","gouda","cheese","butter","ghee"]},
    {k:"Grains and pantry", words:["iron fortified baby cereal","cereal","oats","rice","soft pita","pita","bread","pasta","couscous","semolina","breadcrumbs","plain flour","flour","tahini","olive oil"]}
  ];
  function aisleOf(ing){
    var s=ing.toLowerCase();
    for(var a=0;a<AISLES.length;a++){ for(var w=0;w<AISLES[a].words.length;w++){ if(s.indexOf(AISLES[a].words[w])>-1) return AISLES[a].k; } }
    return "Other";
  }
  function shoppingFor(title, meals){
    var byAisle={}; var seen={};
    meals.forEach(function(m){ (m.recipe||m.ingredients||[]).forEach(function(ing){
      var key=ing.toLowerCase(); if(seen[key]) return; seen[key]=1;
      var a=aisleOf(ing); (byAisle[a]=byAisle[a]||[]).push(ing);
    }); });
    var order=["Produce","Protein","Dairy","Grains and pantry","Other"];
    var body="";
    order.forEach(function(a){ if(!byAisle[a]) return;
      body+='<div class="shop-aisle"><h4>'+a+'</h4><ul>'+byAisle[a].sort().map(function(x){ return '<li>'+x+'</li>'; }).join("")+'</ul></div>';
    });
    overlay('Shopping list', '<p class="shop-for">'+title+'</p><div class="shop-cols">'+body+'</div>'+
      '<p class="shop-note">Buy fresh, choose low salt and no added sugar, and pick tins of fish in water.</p>');
  }

  /* ---------------- a small modal with a focus trap (shopping + surprise) ---------------- */
  function overlay(heading, innerHtml){
    var opener=document.activeElement;
    var ov=el('<div class="lightbox shop-overlay" role="dialog" aria-modal="true" aria-label="'+heading+'">'+
      '<div class="shop-panel"><button class="x" aria-label="Close">×</button><h3>'+heading+'</h3>'+innerHtml+'</div></div>');
    function close(){ document.removeEventListener("keydown",onKey); window.removeEventListener("hashchange",close); ov.remove(); try{ opener&&opener.focus&&opener.focus(); }catch(e){} }
    function onKey(e){
      if(e.key==="Escape"||e.key==="Esc"){ close(); return; }
      if(e.key==="Tab"){   // keep focus inside the dialog (aria-modal honest)
        var f=[].slice.call(ov.querySelectorAll("button")); if(!f.length) return;
        e.preventDefault(); var ci=f.indexOf(document.activeElement);
        var ni=e.shiftKey?(ci<=0?f.length-1:ci-1):((ci<0||ci>=f.length-1)?0:ci+1); try{ f[ni].focus(); }catch(_e){}
      }
    }
    ov.querySelector(".x").addEventListener("click",close);
    ov.addEventListener("click",function(e){ if(e.target===ov) close(); });
    document.addEventListener("keydown",onKey); window.addEventListener("hashchange",close);
    document.body.appendChild(ov); try{ ov.querySelector(".x").focus(); }catch(e){}
    return { ov:ov, close:close };
  }

  /* ---------------- favorites ---------------- */
  function isFav(id){ return prefs.favorites.indexOf(id)>-1; }
  function toggleFav(id){ var i=prefs.favorites.indexOf(id); if(i>-1) prefs.favorites.splice(i,1); else prefs.favorites.push(id); savePrefs(); }

  /* ---------------- small builders ---------------- */
  var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/></svg>';
  var BASKET='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 5.2 8H2v2h1.1l1.6 9h14.6l1.6-9H22V8h-3.2L17 4h-2.2l1.6 4H7.6L9.2 4zM6 12h12l-1 5H7z"/></svg>';
  var SHIELD='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5zm-1.2 13L7 11.2l1.4-1.4 2.4 2.4 4.4-4.4L16.6 9z"/></svg>';
  var RECIPE_IC='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h8l4 4v16H6zM14 3.5V8h4.5zM8 12h8v1.6H8zm0 3.2h8v1.6H8zm0-6.4h5v1.6H8z"/></svg>';
  function levelBadge(l){ return l==="involved"?'<span class="mb mb-step">A bit more</span>':(l==="easy"?'<span class="mb mb-easy">Easy</span>':'<span class="mb mb-easy">Simple</span>'); }
  function cuisineLabel(c){ for(var i=0;i<CUISINES.length;i++) if(CUISINES[i].id===c) return CUISINES[i].label; return c; }
  function dots(m){ return '<span class="dots">'+m.groups.map(function(g){ return '<span class="dot d-'+g+'" title="'+(GROUP_LABEL[g]||g)+'"></span>'; }).join("")+'</span>'; }
  function algLabel(a){ for(var i=0;i<ALLERGENS.length;i++) if(ALLERGENS[i].id===a) return ALLERGENS[i].label; return a; }
  function flags(m){
    var f="";
    if(m.iron) f+='<span class="mtag t-iron">Iron</span>';
    if(m.vitC) f+='<span class="mtag t-vitc">Vitamin C</span>';
    if(m.allergens.length) f+='<span class="mtag t-alg">Contains: '+m.allergens.map(algLabel).join(", ")+'</span>';
    return f;
  }
  // a short, readable "main ingredients" line from the simple ingredient keywords
  function mainText(m){
    return (m.main||"").split(",").map(function(s){ return s.trim(); }).filter(Boolean)
      .map(function(s,i){ return i===0?(s.charAt(0).toUpperCase()+s.slice(1)):s; }).join(", ");
  }
  // the grid card: a tappable summary. Tap it to open the full recipe.
  function mealCard(m){
    var c=el(
      '<article class="mcard tappable'+(m.level==="involved"?" is-step":"")+'" tabindex="0" role="button" aria-label="'+m.name+', open the recipe and shopping list">'+
        '<button class="fav'+(isFav(m.id)?" on":"")+'" aria-label="Save '+m.name+' to favourites" aria-pressed="'+isFav(m.id)+'">'+HEART+'</button>'+
        '<div class="mtop">'+levelBadge(m.level)+'<span class="mb mb-time">'+m.min+' min</span><span class="mb mb-cui">'+cuisineLabel(m.cuisine)+'</span></div>'+
        '<h4 class="mname">'+m.name+'</h4>'+
        dots(m)+
        '<div class="mmain"><b>Main</b> '+mainText(m)+'</div>'+
        '<div class="mline"><b>Portion</b> '+m.portion+'</div>'+
        (m.safe?'<div class="safe-line"><span class="safe-ic" aria-hidden="true">'+SHIELD+'</span><span><b>Safe prep.</b> '+m.safe+'</span></div>':'')+
        '<div class="mtags">'+flags(m)+'</div>'+
        '<span class="mopen">'+RECIPE_IC+' Tap for the recipe and shopping list</span>'+
      '</article>');
    c.querySelector(".fav").addEventListener("click",function(ev){ ev.stopPropagation(); toggleFav(m.id); var on=isFav(m.id); this.classList.toggle("on",on); this.setAttribute("aria-pressed",on); var r=this.getBoundingClientRect(); P.sparkle(r.left+r.width/2, r.top); });
    function openRecipe(){ recipeDetail(m); }
    c.addEventListener("click", openRecipe);
    c.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); openRecipe(); } });
    return c;
  }

  // tap a card to open the full recipe: ingredients with quantities, how to make it, then the shopping list
  function recipeDetail(m){
    var ing=(m.recipe||[]).map(function(x){ return '<li>'+x+'</li>'; }).join("");
    var steps=(m.steps||[]).map(function(x){ return '<li>'+x+'</li>'; }).join("");
    var html=
      '<div class="mtop">'+levelBadge(m.level)+'<span class="mb mb-time">'+m.min+' min</span><span class="mb mb-cui">'+cuisineLabel(m.cuisine)+'</span></div>'+
      dots(m)+
      '<div class="mline"><b>Portion</b> '+m.portion+'</div>'+
      '<p class="why">'+m.why+'</p>'+
      (m.safe?'<div class="safe-line"><span class="safe-ic" aria-hidden="true">'+SHIELD+'</span><span><b>Safe prep.</b> '+m.safe+'</span></div>':'')+
      (ing?'<div class="recipe-sec"><h4>What goes in</h4><ul class="ing-list">'+ing+'</ul></div>':'')+
      (steps?'<div class="recipe-sec"><h4>How to make it</h4><ol class="step-list">'+steps+'</ol></div>':'')+
      '<div class="mtags">'+flags(m)+'</div>'+
      '<button class="pill-btn warm recipe-shop">'+BASKET+' Shopping list for this meal</button>';
    var o=overlay(m.name, html);
    o.ov.querySelector(".shop-panel").classList.add("recipe-panel");
    o.ov.querySelector(".recipe-shop").addEventListener("click",function(){ o.close(); shoppingFor(m.name,[m]); });
  }

  /* ---------------- the view ---------------- */
  var rootEl, state={ day: (new Date().getDay()+6)%7, openMk:false };
  function remount(){ var y=window.scrollY; mount(rootEl); window.scrollTo(0,y); }
  function chip(label,on){ return '<button class="chip'+(on?" on":"")+'" aria-pressed="'+(on?"true":"false")+'">'+label+'</button>'; }

  // the age selector: the whole menu adjusts to the child's age, with the bracket's guidance shown
  function ageBar(){
    var box=el('<section class="age-bar"></section>');
    box.appendChild(el('<div class="age-head"><b>How old is your little one?</b><span>The whole meal plan adjusts to safe foods and textures for their age.</span></div>'));
    var row=el('<div class="age-row" role="group" aria-label="Child age"></div>');
    AGE_BRACKETS.forEach(function(b){
      var on=prefs.age===b.key;
      var btn=el('<button class="age-pill'+(on?" on":"")+'"'+(on?' aria-current="true"':'')+'><b>'+b.short+'</b><small>'+(b.key==="0-5m"?"milk":(b.key==="12-23m"?"toddler":"")) +'</small></button>');
      btn.addEventListener("click",function(){ prefs.age=b.key; savePrefs(); remount(); });
      row.appendChild(btn);
    });
    box.appendChild(row);
    var g=AGE_POLICY.brackets&&AGE_POLICY.brackets[prefs.age];
    if(g){
      var rules=(AGE_POLICY.globalRules||[]);
      box.appendChild(el('<div class="age-guide">'+
        '<p class="age-one">'+g.oneLine+'</p>'+
        '<div class="age-cols">'+
          (g.textures&&g.textures.length?'<div class="age-col"><h5>Textures now</h5><p>'+g.textures.join(". ")+'</p></div>':'')+
          (g.avoid&&g.avoid.length?'<div class="age-col warn"><h5>Not yet</h5><p>'+g.avoid.slice(0,6).join("; ")+'</p></div>':'')+
          (g.milk?'<div class="age-col"><h5>Milk</h5><p>'+g.milk+'</p></div>':'')+
        '</div>'+
        (rules.length?'<div class="age-always"><h5>Always, at every age</h5><ul>'+rules.map(function(r){ return '<li>'+r+'</li>'; }).join("")+'</ul></div>':'')+
      '</div>'));
    }
    return box;
  }
  function milkOnlyPanel(){
    var g=(AGE_POLICY.brackets&&AGE_POLICY.brackets["6-8m"])||{};
    return el('<section class="milk-only">'+
      '<h3>Just milk for now</h3>'+
      '<p>Before about 6 months, breast milk or infant formula gives your baby everything they need. Solid foods are not recommended yet. Around 6 months, when your baby can sit with support, has good head control and shows interest in food, you can begin first foods.</p>'+
      '<p class="milk-cta">Tap <b>6 to 8 months</b> above when you are ready to start solids.</p>'+
    '</section>');
  }

  function makeItYours(){
    var box=el('<section class="mk'+(state.openMk?" open":"")+'"></section>');
    box.appendChild(el('<button class="mk-head"><span><b>Make it yours</b> allergies, dislikes, cuisine, and more</span><span class="mk-caret">'+(state.openMk?"Hide":"Open")+'</span></button>'));
    var body=el('<div class="mk-body"></div>');

    body.appendChild(el('<div class="mk-row"><div class="mk-k">Allergies to avoid</div><div class="mk-help">Every recipe is checked by its ingredients, so any meal containing this allergen is removed for Chloe.</div></div>'));
    var ag=el('<div class="chiprow"></div>');
    ALLERGENS.forEach(function(a){ var b=el(chip(a.label, prefs.allergies.indexOf(a.id)>-1));
      b.addEventListener("click",function(){ var i=prefs.allergies.indexOf(a.id); if(i>-1) prefs.allergies.splice(i,1); else prefs.allergies.push(a.id); savePrefs(); remount(); });
      ag.appendChild(b); });
    body.appendChild(ag);

    body.appendChild(el('<div class="mk-row"><div class="mk-k">Foods she does not like</div><div class="mk-help">A preference filter, not an allergy tool. Type a food, for example oat milk, and meals with it are hidden. For allergies use the buttons above.</div></div>'));
    var dl=el('<div class="chiprow dislikes"></div>');
    prefs.dislikes.forEach(function(d){ var b=el('<button class="chip on rm" aria-label="Remove '+d+'">'+d+' ×</button>');
      b.addEventListener("click",function(){ prefs.dislikes=prefs.dislikes.filter(function(x){return x!==d;}); savePrefs(); remount(); });
      dl.appendChild(b); });
    var add=el('<form class="dislike-add"><input type="text" placeholder="Type a food and press add" aria-label="Add a disliked food" /><button type="submit" class="chip add">Add</button></form>');
    add.addEventListener("submit",function(e){ e.preventDefault(); var v=this.querySelector("input").value.trim(); if(v && prefs.dislikes.indexOf(v)<0){ prefs.dislikes.push(v); savePrefs(); remount(); } });
    dl.appendChild(add); body.appendChild(dl);

    body.appendChild(el('<div class="mk-row"><div class="mk-k">Cuisine</div></div>'));
    var cg=el('<div class="chiprow"></div>');
    CUISINES.forEach(function(c){ var b=el(chip(c.label, prefs.cuisine===c.id));
      b.addEventListener("click",function(){ prefs.cuisine=c.id; savePrefs(); remount(); }); cg.appendChild(b); });
    body.appendChild(cg);

    body.appendChild(el('<div class="mk-row"><div class="mk-k">More</div></div>'));
    var tg=el('<div class="chiprow"></div>');
    var snk=el('<button class="chip">Snacks per day: '+prefs.snacks+'</button>'); snk.addEventListener("click",function(){ prefs.snacks=prefs.snacks===2?1:2; savePrefs(); remount(); });
    var qk=el(chip("Quick only, 10 min or less", prefs.quick)); qk.addEventListener("click",function(){ prefs.quick=!prefs.quick; savePrefs(); remount(); });
    var ir=el(chip("Iron first", prefs.iron)); ir.addEventListener("click",function(){ prefs.iron=!prefs.iron; savePrefs(); remount(); });
    tg.appendChild(snk); tg.appendChild(qk); tg.appendChild(ir);
    body.appendChild(tg);

    box.appendChild(body);
    box.querySelector(".mk-head").addEventListener("click",function(){ state.openMk=!state.openMk; remount(); });
    return box;
  }

  function slotSection(title, options){
    var sec=el('<section class="slot"></section>');
    var head=el('<div class="slot-head"><h3>'+title+'</h3></div>');
    if(options.length){
      var shop=el('<button class="slot-shop">'+BASKET+' List for '+title.toLowerCase()+'</button>');
      shop.addEventListener("click",function(){ shoppingFor(DAYS[state.day]+" "+title.toLowerCase(), options); });
      head.appendChild(shop);
    }
    sec.appendChild(head);
    if(!options.length){ sec.appendChild(el('<p class="slot-empty">No options match the current filters. Try removing a filter in Make it yours.</p>')); return sec; }
    var grid=el('<div class="meal-cards"></div>');
    options.forEach(function(m){ grid.appendChild(mealCard(m)); });
    sec.appendChild(grid);
    return sec;
  }

  function surprise(){
    var p=MEALS.filter(allowed); if(!p.length){ P.toast("Ease a filter to see a surprise."); return; }
    var pick=p[Math.floor(Math.random()*p.length)];
    var facts=[
      "Toddlers often need to see a new food 10 times or more before they try it. Keep offering, calmly.",
      "A toddler tummy is about the size of her fist, so small portions are normal and plenty.",
      "Eating the rainbow across the week covers most of the vitamins she needs.",
      "She learns to eat by watching you. Sitting and eating together is half the lesson."
    ];
    var fact=facts[Math.floor(Math.random()*facts.length)];
    var html=
      '<div class="surprise-kick">A little surprise for today</div>'+
      '<h4 class="mname" style="margin-top:0">'+pick.name+'</h4>'+
      '<div class="mtop">'+levelBadge(pick.level)+'<span class="mb mb-time">'+pick.min+' min</span><span class="mb mb-cui">'+cuisineLabel(pick.cuisine)+'</span> <span class="mb mb-slot">'+pick.slot+'</span></div>'+
      dots(pick)+
      '<div class="mline"><b>Portion</b> '+pick.portion+'</div>'+
      '<p class="why">'+pick.why+'</p>'+
      (pick.safe?'<div class="safe-line"><span class="safe-ic" aria-hidden="true">'+SHIELD+'</span><span><b>Safe prep.</b> '+pick.safe+'</span></div>':'')+
      '<div class="mtags">'+flags(pick)+'</div>'+
      '<p class="surprise-fact">'+fact+'</p>'+
      '<button class="pill-btn warm shop-from-surprise">'+BASKET+' Shopping list</button>';
    var o=overlay('Surprise me', html); o.ov.querySelector(".shop-panel").classList.add("surprise-panel");
    o.ov.querySelector(".shop-from-surprise").addEventListener("click",function(){ o.close(); shoppingFor(pick.name,[pick]); });
    P.sparkle(window.innerWidth/2, 120);
  }

  function dayTabs(){
    var wrap=el('<div class="day-tabs" aria-label="Day of the week"></div>');
    var today=(new Date().getDay()+6)%7;
    DAYS.forEach(function(d,i){
      var b=el('<button class="day-tab'+(i===state.day?" on":"")+(i===today?" today":"")+'"'+(i===state.day?' aria-current="true"':'')+'><b>'+d.slice(0,3)+'</b>'+(i===today?'<small>today</small>':'')+'</button>');
      b.addEventListener("click",function(){ state.day=i; remount(); });
      wrap.appendChild(b);
    });
    return wrap;
  }
  function plateKeyHtml(){
    return '<div class="plate-key">'+["protein","grain","veg","fruit","dairy"].map(function(g){ return '<span class="pk"><span class="dot d-'+g+'"></span>'+GROUP_LABEL[g]+'</span>'; }).join("")+'</div>';
  }
  function tipBar(){
    var t=TIPS[(state.day)%TIPS.length];
    return el('<div class="tipbar"><span class="tip-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 21h6v-1H9zm3-19a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg></span><span>'+t+'</span></div>');
  }
  function sourcesBlock(){
    return el(
      '<section class="src-note">'+
        '<h3>Built on professional guidance</h3>'+
        '<p>Every meal, portion, and safety note here follows standard toddler nutrition guidance from the <b>American Academy of Pediatrics</b> (HealthyChildren.org), the <b>CDC</b>, and the <b>WHO</b>, is built on the family\'s established 14 day plan, and was reviewed by a pediatric nutrition and safety panel. It is educational and supplements, it does not replace, Chloe\'s pediatrician or a pediatric dietitian.</p>'+
        '<div class="rules">'+
          '<div class="rule"><b>Iron every day</b><span>One iron food daily (fortified cereal, lentils, chickpeas, beef, chicken, sardines, or egg), paired with a vitamin C food so she absorbs it.</span></div>'+
          '<div class="rule"><b>Milk and water</b><span>Whole milk about 2 cups a day, never more than 3, counting milk cooked into food. Offer water in an open or straw cup with meals.</span></div>'+
          '<div class="rule"><b>Safe pieces</b><span>Everything soft and no larger than half an inch. Quarter grapes and cherry tomatoes lengthwise. Cheese grated or thin, never cubed.</span></div>'+
          '<div class="rule"><b>Cook it through</b><span>Egg fully set, not runny. Cook fish until opaque, check carefully for bones, and mash sardine bones fully. Serve warm, not hot.</span></div>'+
          '<div class="rule"><b>None of these</b><span>No honey, no added salt, no added sugar, no whole nuts, no popcorn, no hard round foods, before age two.</span></div>'+
          '<div class="rule"><b>Never alone</b><span>Always sit with her, keep her seated and calm, and never leave her alone with food.</span></div>'+
        '</div>'+
      '</section>');
  }

  function mount(root){
    rootEl=root; root.innerHTML="";
    var v=el('<div class="view">');
    v.appendChild(P.topbar());
    v.appendChild(P.sectionNav("meals"));

    var ab=AGE_BRACKETS[bracketIdx(prefs.age)];
    var hero=el(
      '<div class="h-hero meals-hero">'+
        '<span class="kick">For your little one, '+ab.label.toLowerCase()+'</span>'+
        '<h1>Baby <span class="accent">Meal Plan</span></h1>'+
        '<p>Pick your child\'s age and the whole plan adjusts to safe foods and textures. Three gentle options for every meal, two simple and one a bit more, with snacks and shopping made simple.</p>'+
        '<div class="hero-acts"><button class="ctl-game surprise-btn"><span class="gico" aria-hidden="true">★</span> Surprise me</button></div>'+
      '</div>');
    hero.querySelector(".surprise-btn").addEventListener("click",surprise);
    v.appendChild(hero);

    v.appendChild(ageBar());

    // before about 6 months it is milk only, so we skip the meal machinery entirely
    if(prefs.age==="0-5m"){
      v.appendChild(milkOnlyPanel());
      v.appendChild(sourcesBlock());
      root.appendChild(v);
      return;
    }

    v.appendChild(makeItYours());
    v.appendChild(tipBar());
    v.appendChild(dayTabs());
    v.appendChild(el('<div class="day-head"><h2>'+DAYS[state.day]+'</h2>'+plateKeyHtml()+'</div>'));

    // compute each slot's options ONCE, reuse for the cards, the day shopping list, and the iron check
    var bOpts=mealOptions("breakfast", state.day), lOpts=mealOptions("lunch", state.day),
        dOpts=mealOptions("dinner", state.day), snk=snackOptions(state.day);

    // the sources panel promises iron every day; if filters leave no iron option, say so honestly
    if(!bOpts.concat(lOpts,dOpts).some(function(m){ return m.iron; })){
      v.appendChild(el('<div class="iron-nudge"><b>Heads up.</b> With the current filters, none of today\'s options is an iron rich meal. Iron every day matters at this age, so consider easing a filter, and always pair iron with a vitamin C food.</div>'));
    }

    v.appendChild(slotSection("Breakfast", bOpts));
    v.appendChild(slotSection("Lunch", lOpts));
    v.appendChild(slotSection("Dinner", dOpts));
    v.appendChild(slotSection("Snacks", snk));

    var dayMeals=[bOpts[0], lOpts[0], dOpts[0], snk[0]].filter(Boolean);   // one pick per meal + first snack
    var dayShop=el('<div class="day-shop"><button class="pill-btn warm">'+BASKET+' Shopping list for '+DAYS[state.day]+'</button></div>');
    dayShop.querySelector("button").addEventListener("click",function(){ shoppingFor(DAYS[state.day]+", one pick per meal", dayMeals); });
    v.appendChild(dayShop);

    if(prefs.favorites.length){
      var favMeals=MEALS.filter(function(m){ return isFav(m.id); });
      v.appendChild(el('<div class="section-title">Saved favourites<span class="rule"></span></div>'));
      var fg=el('<div class="meal-cards"></div>'); favMeals.forEach(function(m){ fg.appendChild(mealCard(m)); }); v.appendChild(fg);
    }

    v.appendChild(sourcesBlock());
    root.appendChild(v);
  }

  function renderHome(root){ mount(root); }
  P.registerModule({ id:"meals", title:"Meal Plans", renderHome:renderHome });
})();
