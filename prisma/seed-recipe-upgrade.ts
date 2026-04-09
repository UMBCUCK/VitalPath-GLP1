/**
 * Recipe Content Upgrade — 5-Star Quality
 * Enriches all 12 recipes with detailed descriptions, step-by-step tips,
 * GLP-1 context, and weight-loss portion guidance.
 *
 * Run: npx tsx prisma/seed-recipe-upgrade.ts
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Upgrading recipes to 5-star quality...\n");

  const upgrades = [
    {
      slug: "greek-yogurt-power-bowl",
      description: "A creamy, protein-packed breakfast bowl that takes 5 minutes and delivers 32g of protein. The cold temperature and smooth texture make it perfect for GLP-1 patients who experience morning nausea. Customize toppings based on what you have.",
      ingredients: [
        "1 cup plain Greek yogurt (2% or nonfat — 17g protein)",
        "1 scoop vanilla whey protein powder (25g protein)",
        "1/4 cup fresh or frozen mixed berries (blueberries, raspberries, strawberries)",
        "1 tbsp chia seeds (adds fiber and omega-3s)",
        "1 tbsp raw honey or sugar-free sweetener",
        "2 tbsp low-sugar granola (optional — adds crunch)",
      ],
      instructions: [
        "Add Greek yogurt to a medium bowl. Use plain, not flavored — flavored yogurt has 2-3x more sugar.",
        "Add protein powder and stir vigorously until completely smooth. Start with a fork, then switch to a spoon. No lumps should remain — if the mix is too thick, add 1 tbsp of almond milk.",
        "Top with berries. If using frozen, let them sit 2-3 minutes to partially thaw — they'll release juice and create a natural sauce.",
        "Sprinkle chia seeds evenly over the top. These expand in liquid and will keep you feeling full longer.",
        "Drizzle honey in a thin stream over everything. Finish with granola if using — add it last so it stays crunchy.",
      ],
      tips: "PRO TIP: Make this the night before in a mason jar for grab-and-go mornings. The chia seeds will expand overnight and create a thicker, pudding-like texture. For GLP-1 patients: if your appetite is very low, cut the portion in half — 190 cal and 16g protein is still a solid start to the day. Swap berries for banana slices if you need more calories.",
      tags: JSON.stringify(["breakfast", "no-cook", "5-minute", "high-protein", "meal-prep-friendly", "glp-1-friendly"]),
    },
    {
      slug: "grilled-chicken-quinoa-bowl",
      description: "A restaurant-quality grain bowl with 45g of protein that meal preps beautifully. The quinoa provides complete plant protein alongside the chicken, and the avocado adds healthy fats that keep you satisfied. Takes 25 minutes start to finish.",
      ingredients: [
        "6 oz boneless, skinless chicken breast (31g protein)",
        "1/2 cup dry quinoa (makes ~1 cup cooked — 8g protein)",
        "2 cups mixed greens (spinach, arugula, or spring mix)",
        "1/4 ripe avocado, sliced (healthy fats for satiety)",
        "1/4 cup cherry tomatoes, halved",
        "1 tbsp extra virgin olive oil",
        "1 tbsp fresh lemon juice",
        "1/2 tsp garlic powder",
        "Salt, pepper, and dried oregano to taste",
      ],
      instructions: [
        "Cook quinoa: Rinse 1/2 cup quinoa under cold water for 30 seconds (removes bitter coating). Combine with 1 cup water in a small pot, bring to boil, reduce to low, cover, and cook 15 minutes. Fluff with fork.",
        "While quinoa cooks, prep the chicken. Pat dry with paper towel (KEY for getting a good sear — wet chicken steams instead of browning). Season both sides generously with garlic powder, oregano, salt, and pepper.",
        "Heat olive oil in a skillet over medium-high heat until it shimmers (about 2 minutes). Place chicken in pan — you should hear a strong sizzle. Don't move it for 6 minutes.",
        "Flip chicken. Cook another 5-6 minutes until internal temp reaches 165°F. If you don't have a thermometer, press the thickest part — it should feel firm, not squishy. Let rest 5 minutes before slicing (this keeps the juices in).",
        "Build the bowl: Quinoa base → greens → sliced chicken arranged on top → avocado slices and tomatoes around the edges.",
        "Dress with lemon juice and a drizzle of olive oil. Season with a final pinch of salt and pepper.",
      ],
      tips: "MEAL PREP HACK: Cook 4 chicken breasts and 2 cups quinoa on Sunday. Store separately in containers — assembled bowls get soggy, but components keep 4-5 days. GLP-1 TIP: If you can only eat half, save the rest for a second meal. This recipe intentionally has enough protein for a full meal — half still gives you 22g. WEIGHT LOSS NOTE: Skip the avocado to save 80 calories, or add extra for more healthy fats if you're under your daily target.",
      tags: JSON.stringify(["lunch", "meal-prep", "high-protein", "complete-meal", "glp-1-friendly"]),
    },
    {
      slug: "lemon-herb-salmon-asparagus",
      description: "One-pan salmon and asparagus that looks like fine dining but takes 28 minutes. Salmon provides 42g of protein PLUS omega-3 fatty acids that reduce inflammation and support heart health during weight loss. The lemon-dill combination is a classic for a reason.",
      ingredients: [
        "6 oz fresh or thawed salmon fillet (skin-on recommended — crisps up beautifully)",
        "1 bunch asparagus (about 12 spears), woody ends trimmed",
        "1 lemon — half sliced into thin rounds, half reserved for juice",
        "2 cloves garlic, finely minced",
        "1 tbsp extra virgin olive oil",
        "2-3 sprigs fresh dill (or 1 tsp dried dill)",
        "Salt and freshly ground black pepper",
        "Pinch of red pepper flakes (optional — adds gentle warmth)",
      ],
      instructions: [
        "Preheat oven to 400°F. Line a sheet pan with parchment paper or aluminum foil for easy cleanup.",
        "Trim asparagus: Hold each spear at both ends and bend — it will snap naturally where the woody part meets the tender part. Discard the tough ends.",
        "Arrange asparagus in a single layer on the pan. Drizzle with half the olive oil, season with salt and pepper, and toss to coat.",
        "Pat salmon dry with paper towel. This is crucial — moisture on the surface prevents browning and creates steam instead of a nice sear. Place salmon skin-side down on the pan next to (not on top of) the asparagus.",
        "Drizzle remaining olive oil over salmon. Top with minced garlic, lemon slices placed directly on the fish, and fresh dill sprigs. Season with salt, pepper, and optional red pepper flakes.",
        "Bake 15-18 minutes. The salmon is done when it flakes easily with a fork and the thickest part is slightly translucent in the center (it will continue cooking for 2 minutes after you remove it — this prevents overcooking).",
        "Squeeze reserved lemon half over everything. Serve immediately — the asparagus should be tender-crisp, not mushy.",
      ],
      tips: "DON'T OVERCOOK IT: Salmon goes from perfect to dry in about 2 minutes. Pull it when the center is still slightly translucent — carryover heat finishes the job. BUYING TIP: Wild-caught salmon has more omega-3s. Sockeye and king salmon have the richest flavor. If budget is a concern, frozen salmon fillets are just as nutritious. GLP-1 PORTION NOTE: This is a full-size dinner portion. If appetite is reduced, eat 4 oz of salmon (28g protein) and save the rest for tomorrow's salad topping.",
      tags: JSON.stringify(["dinner", "sheet-pan", "omega-3", "one-pan", "high-protein", "glp-1-friendly"]),
    },
    {
      slug: "protein-berry-smoothie",
      description: "The fastest way to get 35g of protein when solid food doesn't sound appealing. This smoothie is specifically designed for GLP-1 patients on low-appetite days — it's cold, smooth, easy to sip, and nutrient-dense. Tastes like a berry milkshake, not a chalky protein drink.",
      ingredients: [
        "1 scoop vanilla whey protein powder (25g protein — use a brand you've tested and like)",
        "1 cup unsweetened almond milk (or oat milk for creamier texture)",
        "1/2 cup frozen mixed berries (frozen makes it thick — don't use fresh)",
        "1/2 medium banana (frozen is even better — freeze ripe bananas in chunks)",
        "1 tbsp almond butter or peanut butter (adds healthy fats + creaminess)",
        "1/2 cup ice (skip if using all frozen fruit)",
        "Optional: 1 tbsp chia seeds or flax meal for extra fiber",
      ],
      instructions: [
        "Add almond milk to blender FIRST (always liquid first — prevents protein powder from clumping at the bottom and burning out your blender motor).",
        "Add protein powder on top of the liquid. Let it sink in for 5 seconds — this prevents the powder from flying up and coating the sides of the blender.",
        "Add frozen berries, banana, and almond butter. The frozen fruit goes on top so the liquid can reach the blades.",
        "Blend on high for 45-60 seconds until completely smooth. If too thick, add 2 tbsp more almond milk. If too thin, add more ice or frozen banana.",
        "Pour into a tall glass or travel cup. If meal prepping, pour into a mason jar and refrigerate — shake well before drinking (separates slightly after 2-3 hours).",
      ],
      tips: "THE SECRET TO A GREAT PROTEIN SMOOTHIE: Freeze your bananas. Peel ripe bananas, break into chunks, freeze on a parchment-lined tray, then transfer to a freezer bag. This makes your smoothie thick like a milkshake without extra ice diluting the flavor. GLP-1 ESSENTIAL: This is your best friend on days when eating feels impossible. 35g of protein in a form that goes down easy. Sip it over 20-30 minutes if needed — it doesn't have to be chugged. MAKE IT A MEAL: Add 1/4 cup oats + 1 tbsp chia seeds = 420 cal and 40g protein.",
      tags: JSON.stringify(["smoothie", "5-minute", "no-cook", "glp-1-essential", "low-appetite-day", "high-protein"]),
    },
    {
      slug: "turkey-avocado-lettuce-wraps",
      description: "Fresh, crunchy, and loaded with 38g of protein — these lettuce wraps are the perfect light lunch when bread sounds too heavy. Zero cooking required. The butter lettuce leaves act as natural cups that hold everything together. Ready in 10 minutes flat.",
      ingredients: [
        "8 oz sliced deli turkey breast (look for low-sodium, no added nitrates — 32g protein)",
        "1 ripe avocado, sliced into 8 pieces",
        "4 large butter lettuce leaves (wash and pat dry — they need to be dry to hold fillings)",
        "1/4 cup diced Roma tomato (1 small tomato)",
        "2 tbsp Dijon or yellow mustard",
        "Optional: thin cucumber slices, a few red onion rings, sprouts",
        "Salt and freshly cracked black pepper",
      ],
      instructions: [
        "Wash butter lettuce leaves carefully — they tear easily. Pat completely dry with paper towels. Wet lettuce = soggy wraps.",
        "Lay out 4 leaves as cups on a plate or cutting board. If any have holes, double-layer with a second leaf underneath.",
        "Divide turkey evenly among the 4 leaves (2 oz per wrap). Layer the slices rather than bunching them — this distributes protein evenly and makes each bite consistent.",
        "Add 2 avocado slices to each wrap. Place them alongside the turkey, not on top — this prevents them from making the lettuce slippery.",
        "Add diced tomato and any optional toppings. Drizzle mustard over the fillings.",
        "Season with salt and pepper. To eat: fold the bottom of the lettuce up first, then the sides — like a taco. Or just pick up and eat like an open-face taco.",
      ],
      tips: "TRAVEL HACK: Pack components separately in a bento-style container — lettuce, turkey, avocado (with lemon juice to prevent browning), and toppings. Assemble when ready to eat. Stays fresh 6-8 hours refrigerated. GLP-1 MEAL STRATEGY: These are ideal on days when your stomach feels sensitive — the cool, fresh ingredients are gentle on digestion. If 4 wraps is too much, make 2 and save the rest. Each wrap has ~105 calories and 9.5g protein. UPGRADE: Add a slice of Swiss cheese to each wrap for +7g protein per wrap.",
      tags: JSON.stringify(["lunch", "no-cook", "10-minute", "low-carb", "glp-1-friendly", "portable"]),
    },
    {
      slug: "lean-beef-stir-fry",
      description: "A high-protein, veggie-loaded stir fry with 44g of protein per serving. Thin-sliced sirloin cooks in 2 minutes, making this faster than takeout. The sesame-soy sauce creates restaurant-quality flavor without excess sodium. Makes 2 servings for easy meal prep.",
      ingredients: [
        "12 oz sirloin steak, sliced as thin as possible against the grain (tip: partially freeze for 20 min to make slicing easier)",
        "2 cups broccoli florets, cut into bite-size pieces",
        "1 large bell pepper (any color), sliced into thin strips",
        "2 tbsp low-sodium soy sauce (or coconut aminos for soy-free)",
        "1 tbsp toasted sesame oil (the dark kind — more flavor so you need less)",
        "2 cloves garlic, minced",
        "1 tsp fresh ginger, grated (or 1/2 tsp ground ginger)",
        "Optional: 1 tsp sriracha for heat, sesame seeds for garnish",
      ],
      instructions: [
        "Prep everything before you start cooking — stir fry moves fast and there's no time to chop mid-cook. Slice the beef, cut the broccoli, slice the pepper, mince the garlic, grate the ginger. Line everything up near the stove.",
        "Heat sesame oil in a large skillet or wok over HIGH heat. The pan needs to be smoking-hot — this is the secret to restaurant-style stir fry. A lukewarm pan steams the meat instead of searing it.",
        "Add beef strips in a SINGLE LAYER. Don't crowd the pan — work in 2 batches if needed. Cook 1 minute without touching (let it sear), flip, cook 1 more minute. Remove to a plate immediately. The beef should be browned outside, pink inside — it'll finish cooking when you add it back.",
        "Same pan, add broccoli and bell pepper. Stir-fry 4-5 minutes until broccoli is bright green and slightly charred but still has bite. Don't add water — you want sear marks, not steamed vegetables.",
        "Push vegetables to the edges. Add garlic and ginger to the center of the pan. Cook 30 seconds until fragrant — garlic burns fast, so keep it moving.",
        "Return beef to the pan. Pour soy sauce over everything and toss to combine. Cook 30 more seconds just to coat everything. Remove from heat immediately.",
        "Divide between 2 plates. Garnish with sesame seeds and sriracha if using. Serve over cauliflower rice (low-carb) or regular rice (more calories).",
      ],
      tips: "THE THIN-SLICE SECRET: Put the steak in the freezer for 15-20 minutes before slicing. It firms up enough to cut paper-thin slices, which cook instantly and stay tender. Cut AGAINST the grain (perpendicular to the muscle lines) — this shortens the fibers and makes every bite melt in your mouth. WEIGHT LOSS VERSION: Serve over riced cauliflower instead of rice to save 150 calories. GLP-1 NOTE: This makes 2 generous servings. On reduced-appetite days, eat one portion and refrigerate the other — it reheats well in a hot pan (microwave makes it rubbery).",
      tags: JSON.stringify(["dinner", "meal-prep", "high-protein", "quick", "glp-1-friendly"]),
    },
    {
      slug: "cottage-cheese-fruit-plate",
      description: "The highest-protein snack you can make in under 3 minutes. 28g of protein from a single cup of cottage cheese — more than most protein bars. The pineapple adds natural sweetness while the sunflower seeds provide satisfying crunch. Perfect between meals or as a late-night protein boost.",
      ingredients: [
        "1 cup low-fat cottage cheese (2% — better flavor than nonfat, still high protein at 28g)",
        "1/2 cup fresh pineapple chunks (canned in juice works too — drain well)",
        "1/4 cup fresh blueberries",
        "1 tbsp raw sunflower seeds or pumpkin seeds (pepitas)",
        "Pinch of ground cinnamon",
        "Optional: drizzle of honey or everything bagel seasoning for savory version",
      ],
      instructions: [
        "Scoop cottage cheese into the center of a plate or shallow bowl. Use the back of the spoon to create a slight well in the middle — this gives the toppings a place to sit.",
        "Arrange pineapple chunks on one side and blueberries on the other. The visual presentation matters — you eat with your eyes first, and a pretty plate makes you feel like you're having a treat, not diet food.",
        "Sprinkle seeds evenly across the top for crunch in every bite.",
        "Dust with cinnamon. Cinnamon isn't just flavor — it has been shown to help stabilize blood sugar, which supports weight management.",
      ],
      tips: "THE COTTAGE CHEESE SECRET: Not all cottage cheese is equal. Good Cultureand Daisy are consistently creamy. If you don't love the texture, blend it for 10 seconds in a blender — it becomes smooth like ricotta. SAVORY VERSION: Skip the fruit. Top with diced cucumber, cherry tomatoes, everything bagel seasoning, and a crack of black pepper — 28g protein, under 200 calories. GLP-1 SNACK STRATEGY: This is your best snack option because it's almost pure protein. On days when you can only eat 2 meals, having this between them ensures you don't miss your protein target. Keep pre-portioned containers in the fridge for instant access.",
      tags: JSON.stringify(["snack", "no-cook", "3-minute", "high-protein", "glp-1-essential"]),
    },
    {
      slug: "baked-chicken-sweet-potato",
      description: "Comfort food that happens to be a perfectly balanced weight-loss meal. Crispy-skinned chicken thighs with roasted sweet potatoes — 42g of protein and loaded with vitamin A, potassium, and fiber. One sheet pan, 45 minutes, and your kitchen smells incredible.",
      ingredients: [
        "4 bone-in, skin-on chicken thighs (about 1.5 lbs total — thighs have more flavor than breast and stay juicier)",
        "2 medium sweet potatoes, peeled and cut into 3/4-inch cubes",
        "1 tbsp olive oil, divided",
        "1 tsp smoked paprika (smoked is key — regular paprika is bland in comparison)",
        "1 tsp garlic powder",
        "1 tsp dried rosemary (crush between your fingers as you add it to release oils)",
        "Salt and freshly ground black pepper",
        "Optional: fresh parsley for garnish",
      ],
      instructions: [
        "Preheat oven to 425°F — the high heat is essential for crispy chicken skin and caramelized sweet potatoes. Place your sheet pan in the oven while it preheats (hot pan = better browning on contact).",
        "Toss sweet potato cubes with half the olive oil, half the paprika, half the garlic powder, and a generous pinch of salt. Spread on the HOT pan in a single layer — don't pile them up or they'll steam instead of roast.",
        "Pat chicken thighs dry with paper towels (both sides). Season the skin side with remaining olive oil, paprika, garlic powder, rosemary, salt, and pepper. Rub the seasoning into the skin.",
        "Nestle chicken thighs skin-side UP among the sweet potatoes. Don't place chicken on top of potatoes — each piece needs contact with the hot pan.",
        "Bake 30-35 minutes. The chicken is done when the skin is deeply golden and crispy, and internal temperature reaches 165°F at the thickest part (not touching bone). Sweet potatoes should be fork-tender with caramelized edges.",
        "Let chicken rest 5 minutes before serving — this redistributes juices so the meat stays moist when you cut into it.",
      ],
      tips: "CRISPY SKIN SECRET: Dry skin = crispy skin. After patting dry, you can even leave chicken uncovered in the fridge for 1-2 hours before cooking — the cold air dries the surface further. WEIGHT LOSS NOTE: The skin adds about 50 calories per thigh. If you're strictly counting, remove it after cooking (it keeps the meat moist during baking even if you don't eat it). Serving = 2 thighs + half the sweet potatoes per person. GLP-1 PORTION GUIDE: Eat 1 thigh with sweet potatoes if appetite is reduced — that's still 21g protein and 270 calories. Refrigerate extras — this reheats better than almost any meal.",
      tags: JSON.stringify(["dinner", "sheet-pan", "comfort-food", "meal-prep", "high-protein", "glp-1-friendly"]),
    },
    {
      slug: "shrimp-vegetable-soup",
      description: "A light but protein-rich soup that's ideal for GLP-1 patients — warm, easy to digest, hydrating, and packed with 32g of protein per bowl. Ready in 25 minutes. The broth counts toward your daily hydration goal, and the shrimp cooks in just 3 minutes so it stays tender, not rubbery.",
      ingredients: [
        "12 oz raw shrimp, peeled and deveined (fresh or thawed frozen — pat dry)",
        "4 cups low-sodium chicken broth (or bone broth for extra protein — adds 10g per cup)",
        "1 medium zucchini, diced into 1/2-inch cubes",
        "2 cups fresh baby spinach (stems removed)",
        "1/2 cup canned diced tomatoes (fire-roasted adds smoky depth)",
        "2 cloves garlic, minced",
        "1 tsp Italian seasoning (or equal parts basil, oregano, thyme)",
        "1 tbsp olive oil",
        "Salt, pepper, and red pepper flakes to taste",
        "Fresh lemon wedge for serving",
      ],
      instructions: [
        "Heat olive oil in a large pot over medium heat. Add garlic and cook 30 seconds — just until fragrant, not browned. Burnt garlic turns bitter.",
        "Add broth, Italian seasoning, and diced tomatoes. Bring to a gentle simmer (small bubbles, not a rolling boil — aggressive boiling makes broth cloudy).",
        "Add zucchini. Simmer 6-8 minutes until fork-tender but not mushy. Zucchini should hold its shape.",
        "Add shrimp in a single layer. Cook exactly 3 minutes — shrimp turns from gray to pink and curls into a C-shape. Overcooked shrimp curls into an O-shape and becomes rubbery. Pull the pot off heat as soon as they're pink.",
        "Stir in spinach. The residual heat wilts it in 30 seconds — no additional cooking needed.",
        "Season with salt, pepper, and red pepper flakes. Squeeze a lemon wedge over each bowl before eating — the acid brightens every flavor.",
      ],
      tips: "THE 3-MINUTE SHRIMP RULE: Set a timer. Shrimp goes from perfectly cooked to overcooked in about 60 seconds. When in doubt, pull them early — they continue cooking in the hot broth. HYDRATION BONUS: Each bowl has about 16 oz of liquid that counts toward your daily water goal. GLP-1 PATIENTS: This is the ultimate low-appetite-day meal. It's warm, gentle on the stomach, hydrating, and delivers 32g of protein without requiring you to chew through a full plate of food. Sip it slowly over 20-30 minutes. MAKE IT A MEAL PREP: This soup freezes beautifully for up to 3 months. Portion into individual containers.",
      tags: JSON.stringify(["lunch", "soup", "hydrating", "glp-1-essential", "low-appetite-day", "freezer-friendly"]),
    },
    {
      slug: "egg-white-veggie-scramble",
      description: "A classic high-protein breakfast that delivers 30g of protein for only 260 calories. The one whole egg adds richness while the whites keep calories low. The vegetables add volume, fiber, and micronutrients without significant calories — eat a big plate and still lose weight.",
      ingredients: [
        "6 egg whites (from ~6 large eggs, or use liquid egg whites from a carton for convenience)",
        "1 whole egg (adds color, flavor, and healthy fats)",
        "1/4 cup diced bell pepper (any color — red and orange are sweetest)",
        "1/4 cup fresh baby spinach, roughly chopped",
        "2 tbsp diced white or yellow onion",
        "1 oz feta cheese, crumbled (or shredded mozzarella for milder flavor)",
        "Non-stick cooking spray or 1 tsp butter",
        "Salt, pepper, and optional hot sauce",
      ],
      instructions: [
        "Crack eggs: Separate whites from yolks for 6 eggs. Keep 1 whole egg. Whisk all whites + the whole egg together with a pinch of salt until slightly frothy. SHORTCUT: Use 3/4 cup liquid egg whites from a carton + 1 whole egg.",
        "Heat a non-stick pan over MEDIUM heat (not high — high heat makes eggs rubbery). Coat with cooking spray or melt butter.",
        "Sauté vegetables first: Add bell pepper and onion. Cook 2-3 minutes until slightly softened. This step matters — raw vegetables in scrambled eggs have an unpleasant crunch.",
        "Pour in the egg mixture. Let it sit undisturbed for 30 seconds until the edges start to set. Then use a spatula to gently push the eggs from the edges toward the center, creating large soft curds.",
        "When eggs are 80% set but still slightly wet on top, add spinach and feta. Fold gently — the residual heat finishes cooking the eggs and wilts the spinach. IMPORTANT: Remove from heat while eggs still look slightly underdone. They continue cooking on the hot plate.",
        "Plate immediately. Season with pepper and hot sauce if desired. Hot sauce adds tons of flavor for zero calories.",
      ],
      tips: "THE SOFT SCRAMBLE SECRET: Low heat + remove early. Gordon Ramsay's #1 rule: take eggs off heat while they still look slightly wet. They firm up in the 60 seconds between pan and your mouth. PROTEIN MATH: 6 whites = 21g protein (0 fat), 1 whole egg = 6g protein (5g fat), feta = 4g protein. Total: 31g. WEIGHT LOSS VOLUME HACK: Add more vegetables — mushrooms, tomatoes, zucchini — to make the plate bigger without adding significant calories. You can eat a mountain of scrambled eggs with veggies and still be under 300 calories. GLP-1 TIP: If mornings are rough, prep the vegetables the night before. Having them pre-chopped in the fridge means breakfast is a 5-minute operation.",
      tags: JSON.stringify(["breakfast", "quick", "high-protein", "low-calorie", "glp-1-friendly"]),
    },
    {
      slug: "tuna-salad-stuffed-avocado",
      description: "Mayo-free tuna salad served in avocado halves — 35g of protein, healthy fats from the avocado, and zero cooking required. Greek yogurt replaces mayo for a tangier flavor with 2x the protein and half the fat. This is the kind of lunch that makes you forget you're eating for weight loss.",
      ingredients: [
        "1 can (5 oz) chunk light tuna in water, well drained (press with fork to remove all liquid)",
        "1 large ripe avocado, halved and pitted",
        "2 tbsp plain Greek yogurt (not mayo — more protein, better tang)",
        "1 stalk celery, finely diced (adds crucial crunch)",
        "1 tsp fresh lemon juice (prevents avocado browning + brightens tuna flavor)",
        "Salt, freshly ground black pepper, and a pinch of paprika for color",
        "Optional: 1 tsp Dijon mustard, diced red onion, fresh dill",
      ],
      instructions: [
        "Drain the tuna thoroughly. Open can, press lid down on the tuna to squeeze out water, then dump into a bowl and press again with a fork. Watery tuna = watery salad.",
        "Add Greek yogurt, lemon juice, and Dijon (if using). Mix with a fork until evenly combined. The yogurt should coat the tuna, not pool at the bottom.",
        "Fold in diced celery (and red onion/dill if using). Season generously with salt and pepper. Taste and adjust — tuna salad should be well-seasoned since avocado is mild.",
        "Cut avocado in half lengthwise, twist to separate, remove pit. If the pit hole is small, scoop out a bit more avocado to create a deeper cup for the tuna.",
        "Spoon tuna mixture into both avocado halves, mounding it generously on top.",
        "Sprinkle with paprika for color. Eat with a spoon, directly from the avocado skin — no plate needed.",
      ],
      tips: "AVOCADO RIPENESS TEST: Press gently near the stem. It should give slightly, like a ripe peach. Too firm = unripe (will taste grassy). Too soft = overripe (brown and mushy inside). MEAL PREP NOTE: Make the tuna salad ahead and store in an airtight container for up to 3 days. Don't cut the avocado until ready to eat — it browns quickly. Squeeze lemon juice over the exposed flesh if you must prep ahead. WEIGHT LOSS MATH: This entire meal is 390 calories with 35g protein. The healthy fats from avocado keep you full 3-4 hours. For strict calorie cutting, use only half the avocado (305 cal, same protein). GLP-1 PATIENTS: The cool temperature and creamy texture make this an excellent option when warm food is unappealing.",
      tags: JSON.stringify(["lunch", "no-cook", "10-minute", "high-protein", "healthy-fats", "glp-1-friendly"]),
    },
    {
      slug: "chicken-bone-broth-sipping-cup",
      description: "The ultimate GLP-1 essential — when your appetite is near zero but you still need protein and hydration. 10g of protein per cup with practically zero effort. Bone broth is warm, savory, and goes down like tea. This is your insurance policy on the hardest appetite days.",
      ingredients: [
        "1.5 cups high-quality chicken bone broth (look for brands with 10g+ protein per cup — Kettle & Fire, Bonafide are good options)",
        "Pinch of ground turmeric (anti-inflammatory — gives a golden color)",
        "Pinch of freshly ground black pepper (activates turmeric's curcumin by 2000%)",
        "1 thin slice fresh ginger (optional — helps with nausea, a common GLP-1 side effect)",
        "Optional: squeeze of lemon, pinch of garlic powder, dash of soy sauce",
      ],
      instructions: [
        "Pour bone broth into a microwave-safe mug or small saucepan. If using a saucepan, warm over medium-low heat.",
        "Add turmeric and black pepper. Stir to combine. Drop in the ginger slice if using (it infuses as the broth heats).",
        "Heat until steaming but not boiling — about 2 minutes in microwave or 3-4 minutes on stovetop. Boiling destroys some of the collagen protein.",
        "Remove ginger slice. Sip slowly like tea. Hold the warm mug — the warmth in your hands is comforting and encourages you to drink more.",
      ],
      tips: "WHY BONE BROTH IS YOUR GLP-1 BEST FRIEND: It gives you protein (10g/cup), hydration (counts toward daily water goal), warmth (comforting when nauseous), collagen (supports skin elasticity during weight loss — helps prevent 'Ozempic face'), and electrolytes (sodium, potassium). DAILY STRATEGY: Keep 2-3 cartons of bone broth in your pantry at all times. On days when you can't eat a full meal, drink 3 cups throughout the day = 30g protein just from broth. That's a safety net. UPGRADE: Whisk in 1 egg for egg drop soup — adds 6g protein and makes it more filling. COST TIP: Make your own by simmering chicken bones (from a rotisserie chicken), water, apple cider vinegar, and vegetables for 12-24 hours in a slow cooker. Freeze in ice cube trays for single servings.",
      tags: JSON.stringify(["snack", "3-minute", "hydrating", "glp-1-essential", "nausea-friendly", "zero-effort"]),
    },
  ];

  for (const recipe of upgrades) {
    await prisma.recipe.update({
      where: { slug: recipe.slug },
      data: {
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tips: recipe.tips,
        tags: recipe.tags,
      },
    });
    console.log(`  ✓ ${recipe.slug}`);
  }

  console.log(`\n✅ Upgraded ${upgrades.length} recipes to 5-star quality!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
