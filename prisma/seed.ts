import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const isClean = process.argv.includes("--clean");

async function main() {
  if (isClean) {
    console.log("Cleaning database...");
    // Delete in dependency order
    await prisma.complianceAuditLog.deleteMany();
    await prisma.adverseEventReport.deleteMany();
    await prisma.consentRecord.deleteMany();
    await prisma.providerCredential.deleteMany();
    await prisma.adminAuditLog.deleteMany();
    await prisma.analyticsEvent.deleteMany();
    await prisma.mealPlanItem.deleteMany();
    await prisma.mealPlan.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.progressPhoto.deleteMany();
    await prisma.progressEntry.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.referralCode.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.subscriptionItem.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.treatmentPlan.deleteMany();
    await prisma.intakeSubmission.deleteMany();
    await prisma.quizSubmission.deleteMany();
    await prisma.upsellOffer.deleteMany();
    await prisma.bundleItem.deleteMany();
    await prisma.patientProfile.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.claim.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.resultStory.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.comparisonPage.deleteMany();
    await prisma.stateAvailability.deleteMany();
    await prisma.calculatorSetting.deleteMany();
    await prisma.referralSetting.deleteMany();
    await prisma.adminAlert.deleteMany();
    await prisma.campaign.deleteMany();
    await prisma.adminSavedView.deleteMany();
    console.log("✓ Database cleaned\n");
  }

  console.log("Seeding database...");

  // ─── Admin User ──────────────────────────────────────────
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vitalpath.com" },
    update: {},
    create: {
      email: "admin@vitalpath.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });
  console.log("Admin user:", admin.email);

  // ─── Provider User ──────────────────────────────────────
  const providerPassword = await hash("provider1", 12);
  const provider = await prisma.user.upsert({
    where: { email: "dr.chen@vitalpath.com" },
    update: {},
    create: {
      email: "dr.chen@vitalpath.com",
      passwordHash: providerPassword,
      firstName: "Sarah",
      lastName: "Chen",
      role: "PROVIDER",
    },
  });
  console.log("Provider user: dr.chen@vitalpath.com");

  // ─── Provider Credentials ──────────────────────────────
  const credentialStates = ["TX", "CA", "FL", "NY", "IL", "PA", "OH", "GA", "NC", "VA"];
  for (const st of credentialStates) {
    await prisma.providerCredential.upsert({
      where: { userId_licenseState: { userId: provider.id, licenseState: st } },
      update: {},
      create: {
        userId: provider.id,
        licenseNumber: `MD-${st}-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseState: st,
        licenseType: "MD",
        deaNumber: `FC${Math.floor(1000000 + Math.random() * 9000000)}`,
        npiNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        expiresAt: new Date(Date.now() + 365 * 86400000),
        verifiedAt: new Date(),
        isActive: true,
      },
    });
  }
  console.log(`Seeded ${credentialStates.length} provider credentials for Dr. Chen`);

  // ─── Demo Patient ───────────────────────────────────────
  const patientPassword = await hash("demo1234", 12);
  const patient = await prisma.user.upsert({
    where: { email: "jordan@example.com" },
    update: {},
    create: {
      email: "jordan@example.com",
      passwordHash: patientPassword,
      firstName: "Jordan",
      lastName: "Miller",
      role: "PATIENT",
    },
  });

  await prisma.patientProfile.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      heightInches: 68,
      weightLbs: 198,
      goalWeightLbs: 175,
      state: "TX",
    },
  });

  // Demo progress entries (90 days of data)
  const startWeight = 215;
  const entries = [];
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayProgress = (90 - i) / 90;
    const weight = startWeight - dayProgress * 17 + (Math.random() - 0.5) * 1.5;
    entries.push({
      userId: patient.id,
      date,
      weightLbs: Math.round(weight * 10) / 10,
      proteinG: Math.floor(80 + Math.random() * 60),
      waterOz: Math.floor(50 + Math.random() * 50),
      moodRating: Math.floor(3 + Math.random() * 3),
      energyRating: Math.floor(3 + Math.random() * 3),
      medicationTaken: Math.random() > 0.1,
      waistInches: i % 14 === 0 ? 38 - dayProgress * 3 : null,
      hipsInches: i % 14 === 0 ? 42 - dayProgress * 1.5 : null,
      bmi: (weight / (68 * 68)) * 703,
    });
  }

  // Delete existing entries and recreate
  await prisma.progressEntry.deleteMany({ where: { userId: patient.id } });
  await prisma.progressEntry.createMany({ data: entries });
  console.log(`Seeded ${entries.length} progress entries for demo patient`);

  // Demo referral code
  await prisma.referralCode.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      code: "VP-JORDAN42",
      tier: "STANDARD",
      totalReferred: 3,
      totalEarned: 15000,
    },
  });

  // Demo notifications
  await prisma.notification.createMany({
    data: [
      { userId: patient.id, type: "REFILL_REMINDER", title: "Refill ships in 5 days", body: "Your next refill is scheduled. Make sure your shipping info is current.", link: "/dashboard/treatment" },
      { userId: patient.id, type: "MILESTONE", title: "15 lbs lost!", body: "You've reached a major milestone. Keep building momentum.", link: "/dashboard/progress" },
      { userId: patient.id, type: "CHECK_IN", title: "Weekly check-in available", body: "Complete your weekly check-in to keep your care team updated.", link: "/dashboard/progress" },
    ],
  });

  // ─── State Availability ──────────────────────────────────
  const stateData: Record<string, { name: string; available: boolean; requiresPhysicalExam?: boolean; requiresPreexistingRelationship?: boolean; informedConsentRequirement?: string; cpomRestrictions?: string }> = {
    AL: { name: "Alabama", available: true }, AK: { name: "Alaska", available: false },
    AZ: { name: "Arizona", available: true }, AR: { name: "Arkansas", available: false },
    CA: { name: "California", available: true, cpomRestrictions: "CPOM state — providers must operate under MSO structure" },
    CO: { name: "Colorado", available: true }, CT: { name: "Connecticut", available: true },
    DE: { name: "Delaware", available: false }, FL: { name: "Florida", available: true },
    GA: { name: "Georgia", available: true }, HI: { name: "Hawaii", available: false },
    ID: { name: "Idaho", available: false }, IL: { name: "Illinois", available: true },
    IN: { name: "Indiana", available: true, informedConsentRequirement: "EVERY_VISIT" },
    IA: { name: "Iowa", available: false }, KS: { name: "Kansas", available: false },
    KY: { name: "Kentucky", available: false }, LA: { name: "Louisiana", available: false },
    ME: { name: "Maine", available: false }, MD: { name: "Maryland", available: true },
    MA: { name: "Massachusetts", available: true, informedConsentRequirement: "INITIAL_ONLY" },
    MI: { name: "Michigan", available: true }, MN: { name: "Minnesota", available: true },
    MS: { name: "Mississippi", available: false }, MO: { name: "Missouri", available: false },
    MT: { name: "Montana", available: false }, NE: { name: "Nebraska", available: false },
    NV: { name: "Nevada", available: true }, NH: { name: "New Hampshire", available: false },
    NJ: { name: "New Jersey", available: true }, NM: { name: "New Mexico", available: false },
    NY: { name: "New York", available: true, cpomRestrictions: "CPOM state — requires professional corporation or authorized entity" },
    NC: { name: "North Carolina", available: true }, ND: { name: "North Dakota", available: false },
    OH: { name: "Ohio", available: true }, OK: { name: "Oklahoma", available: false },
    OR: { name: "Oregon", available: true }, PA: { name: "Pennsylvania", available: true },
    RI: { name: "Rhode Island", available: false }, SC: { name: "South Carolina", available: false },
    SD: { name: "South Dakota", available: false }, TN: { name: "Tennessee", available: true },
    TX: { name: "Texas", available: true, cpomRestrictions: "CPOM state — requires compliant MSO/PC arrangement", informedConsentRequirement: "INITIAL_ONLY" },
    UT: { name: "Utah", available: false }, VT: { name: "Vermont", available: false },
    VA: { name: "Virginia", available: true }, WA: { name: "Washington", available: true },
    WV: { name: "West Virginia", available: false }, WI: { name: "Wisconsin", available: false },
    WY: { name: "Wyoming", available: false }, DC: { name: "District of Columbia", available: false },
  };
  for (const [code, info] of Object.entries(stateData)) {
    await prisma.stateAvailability.upsert({
      where: { stateCode: code },
      update: {
        stateName: info.name,
        isAvailable: info.available,
        requiresPhysicalExam: info.requiresPhysicalExam ?? false,
        requiresPreexistingRelationship: info.requiresPreexistingRelationship ?? false,
        informedConsentRequirement: info.informedConsentRequirement ?? "STANDARD",
        cpomRestrictions: info.cpomRestrictions ?? null,
      },
      create: {
        stateCode: code,
        stateName: info.name,
        isAvailable: info.available,
        requiresPhysicalExam: info.requiresPhysicalExam ?? false,
        requiresPreexistingRelationship: info.requiresPreexistingRelationship ?? false,
        informedConsentRequirement: info.informedConsentRequirement ?? "STANDARD",
        cpomRestrictions: info.cpomRestrictions ?? null,
      },
    });
  }
  console.log(`Seeded ${Object.keys(stateData).length} states (all 50 + DC)`);

  // ─── Products ────────────────────────────────────────────
  const products = [
    { name: "Essential", slug: "essential", description: "Provider-guided treatment with medication, if prescribed.", type: "MEMBERSHIP" as const, category: "WEIGHT_MANAGEMENT" as const, priceMonthly: 29700, features: ["Licensed provider evaluation","Personalized treatment plan","Medication, if prescribed","24-48hr shipping","Secure messaging","Monthly check-ins","Basic progress tracking","Refill coordination"], sortOrder: 1 },
    { name: "Premium", slug: "premium", description: "Everything in Essential plus nutrition, tracking, and coaching.", type: "MEMBERSHIP" as const, category: "WEIGHT_MANAGEMENT" as const, priceMonthly: 39700, badge: "Most Popular", features: ["Everything in Essential","Weekly meal plans & recipes","Grocery list generator","Progress photo vault","Bi-weekly coaching","Hydration & protein tracking","Priority support"], sortOrder: 2 },
    { name: "Complete", slug: "complete", description: "The full system: treatment, nutrition, supplements, coaching.", type: "MEMBERSHIP" as const, category: "WEIGHT_MANAGEMENT" as const, priceMonthly: 52900, badge: "Best Value", features: ["Everything in Premium","Supplement bundles","Weekly coaching","Lab coordination","Maintenance planning"], sortOrder: 3 },
    { name: "Metabolic Support Bundle", slug: "metabolic-support", type: "ADDON" as const, category: "METABOLIC_SUPPORT" as const, priceMonthly: 3900, isAddon: true, sortOrder: 10 },
    { name: "Protein & Hydration Bundle", slug: "protein-hydration", type: "ADDON" as const, category: "HYDRATION_PROTEIN" as const, priceMonthly: 3400, isAddon: true, sortOrder: 11 },
    { name: "Digestive Comfort Bundle", slug: "digestive-comfort", type: "ADDON" as const, category: "DIGESTIVE" as const, priceMonthly: 2900, isAddon: true, sortOrder: 12 },
    { name: "Meal Plans & Recipes", slug: "meal-plans", type: "CONTENT" as const, category: "MEAL_PLANS" as const, priceMonthly: 1900, isAddon: true, sortOrder: 13 },
    { name: "Premium Coaching", slug: "coaching-upgrade", type: "COACHING" as const, category: "COACHING" as const, priceMonthly: 4900, isAddon: true, sortOrder: 14 },
    { name: "Lab Membership", slug: "lab-membership", type: "LAB" as const, category: "LABS" as const, priceMonthly: 2900, isAddon: true, sortOrder: 15 },
  ];

  for (const p of products) {
    const { features, ...data } = p;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, features: features || [] },
      create: { ...data, features: features || [] },
    });
  }
  console.log(`Seeded ${products.length} products`);

  // ─── Recipes ─────────────────────────────────────────────
  const recipes = [
    { title: "Greek Yogurt Power Bowl", slug: "greek-yogurt-power-bowl", category: "BREAKFAST" as const, calories: 380, proteinG: 32, carbsG: 35, fatG: 12, fiberG: 5, prepMinutes: 5, cookMinutes: 0, servings: 1, difficulty: "easy", ingredients: ["1 cup Greek yogurt (plain, 2%)","1 scoop vanilla protein powder","1/4 cup mixed berries","1 tbsp honey","2 tbsp granola","1 tbsp chia seeds"], instructions: ["Add yogurt to a bowl.","Mix in protein powder until smooth.","Top with berries, granola, chia seeds, and a drizzle of honey."], tips: "Use frozen berries for a thicker, colder bowl. Add more protein powder if you need to hit higher targets." },
    { title: "Grilled Chicken Quinoa Bowl", slug: "grilled-chicken-quinoa-bowl", category: "LUNCH" as const, calories: 520, proteinG: 45, carbsG: 42, fatG: 16, fiberG: 7, prepMinutes: 10, cookMinutes: 15, servings: 1, difficulty: "easy", ingredients: ["6 oz chicken breast","1/2 cup cooked quinoa","1 cup mixed greens","1/4 avocado, sliced","1/4 cup cherry tomatoes","2 tbsp lemon vinaigrette","Salt and pepper to taste"], instructions: ["Season chicken with salt and pepper.","Grill or pan-sear chicken for 6-7 minutes per side.","Build bowl: quinoa base, greens, sliced chicken, avocado, tomatoes.","Drizzle with vinaigrette."], tips: "Meal prep the chicken and quinoa in batches for quick assembly." },
    { title: "Lemon Herb Salmon with Asparagus", slug: "lemon-herb-salmon-asparagus", category: "DINNER" as const, calories: 480, proteinG: 42, carbsG: 12, fatG: 28, fiberG: 4, prepMinutes: 10, cookMinutes: 18, servings: 1, difficulty: "medium", ingredients: ["6 oz salmon fillet","1 bunch asparagus, trimmed","1 lemon, sliced","2 cloves garlic, minced","1 tbsp olive oil","Fresh dill","Salt and pepper"], instructions: ["Preheat oven to 400°F.","Place salmon and asparagus on a lined sheet pan.","Drizzle with olive oil, top with garlic, lemon slices, and dill.","Season with salt and pepper.","Bake 15-18 minutes until salmon flakes easily."], tips: "Don't overcook — salmon continues cooking after you remove it from the oven." },
    { title: "Protein Berry Smoothie", slug: "protein-berry-smoothie", category: "SMOOTHIE" as const, calories: 340, proteinG: 35, carbsG: 30, fatG: 8, fiberG: 6, prepMinutes: 5, cookMinutes: 0, servings: 1, difficulty: "easy", ingredients: ["1 scoop vanilla protein powder","1 cup unsweetened almond milk","1/2 cup frozen mixed berries","1/2 banana","1 tbsp almond butter","1/2 cup ice"], instructions: ["Add all ingredients to blender.","Blend on high for 60 seconds until smooth.","Pour and serve immediately."], tips: "Freeze bananas in advance for an extra-thick smoothie." },
    { title: "Turkey & Avocado Lettuce Wraps", slug: "turkey-avocado-lettuce-wraps", category: "LUNCH" as const, calories: 420, proteinG: 38, carbsG: 14, fatG: 24, fiberG: 8, prepMinutes: 10, cookMinutes: 0, servings: 2, difficulty: "easy", tierRequired: "premium", ingredients: ["8 oz sliced turkey breast","1 avocado, sliced","4 large butter lettuce leaves","1/4 cup diced tomato","2 tbsp mustard","Salt and pepper"], instructions: ["Lay out lettuce leaves as wraps.","Layer turkey, avocado, and tomato on each leaf.","Add mustard, season with salt and pepper.","Roll up and serve."], tips: "These travel well — wrap in foil for a portable lunch." },
    { title: "Lean Beef Stir Fry", slug: "lean-beef-stir-fry", category: "DINNER" as const, calories: 510, proteinG: 44, carbsG: 28, fatG: 22, fiberG: 5, prepMinutes: 10, cookMinutes: 12, servings: 2, difficulty: "medium", tierRequired: "premium", ingredients: ["12 oz sirloin steak, sliced thin","2 cups broccoli florets","1 bell pepper, sliced","2 tbsp low-sodium soy sauce","1 tbsp sesame oil","2 cloves garlic, minced","1 tsp fresh ginger, grated"], instructions: ["Heat sesame oil in a large skillet or wok over high heat.","Stir-fry beef strips for 2-3 minutes. Remove and set aside.","Add broccoli and bell pepper. Cook 4-5 minutes.","Add garlic and ginger, cook 30 seconds.","Return beef to pan, add soy sauce. Toss to combine."], tips: "Slice beef against the grain for maximum tenderness." },
    { title: "Cottage Cheese & Fruit Plate", slug: "cottage-cheese-fruit-plate", category: "SNACK" as const, calories: 220, proteinG: 28, carbsG: 18, fatG: 4, fiberG: 2, prepMinutes: 3, cookMinutes: 0, servings: 1, difficulty: "easy", ingredients: ["1 cup low-fat cottage cheese","1/2 cup fresh pineapple chunks","1/4 cup blueberries","1 tbsp sunflower seeds","Pinch of cinnamon"], instructions: ["Scoop cottage cheese onto a plate.","Arrange fruit around cottage cheese.","Sprinkle with seeds and cinnamon."], tips: "A perfect high-protein snack that takes under 3 minutes." },
    { title: "Baked Chicken Thighs with Sweet Potato", slug: "baked-chicken-sweet-potato", category: "DINNER" as const, calories: 540, proteinG: 42, carbsG: 38, fatG: 20, fiberG: 6, prepMinutes: 10, cookMinutes: 35, servings: 2, difficulty: "medium", tierRequired: "complete", ingredients: ["4 bone-in chicken thighs","2 medium sweet potatoes, cubed","1 tbsp olive oil","1 tsp smoked paprika","1 tsp garlic powder","1 tsp dried rosemary","Salt and pepper"], instructions: ["Preheat oven to 425°F.","Toss sweet potatoes with half the oil and seasonings.","Place chicken thighs on sheet pan with sweet potatoes.","Drizzle remaining oil on chicken.","Bake 30-35 minutes until chicken reaches 165°F."], tips: "Skin-on thighs stay juicier. Remove skin before eating for lower fat." },
    { title: "Shrimp & Vegetable Soup", slug: "shrimp-vegetable-soup", category: "LUNCH" as const, calories: 280, proteinG: 32, carbsG: 18, fatG: 8, fiberG: 5, prepMinutes: 10, cookMinutes: 15, servings: 2, difficulty: "easy", ingredients: ["12 oz shrimp, peeled","4 cups low-sodium chicken broth","1 cup zucchini, diced","1 cup spinach","1/2 cup diced tomatoes","2 cloves garlic, minced","1 tsp Italian seasoning","Salt and pepper"], instructions: ["Heat broth in a large pot over medium heat.","Add garlic and Italian seasoning.","Add zucchini and tomatoes. Simmer 8 minutes.","Add shrimp. Cook 3-4 minutes until pink.","Stir in spinach until wilted. Season to taste."], tips: "Light but high-protein — perfect for days when appetite is low on GLP-1 medication." },
    { title: "Egg White Veggie Scramble", slug: "egg-white-veggie-scramble", category: "BREAKFAST" as const, calories: 260, proteinG: 30, carbsG: 10, fatG: 10, fiberG: 3, prepMinutes: 5, cookMinutes: 8, servings: 1, difficulty: "easy", ingredients: ["6 egg whites","1 whole egg","1/4 cup diced bell pepper","1/4 cup spinach","2 tbsp diced onion","1 oz feta cheese","Cooking spray","Salt and pepper"], instructions: ["Heat a non-stick pan with cooking spray over medium heat.","Sauté vegetables 2-3 minutes.","Add egg whites and whole egg. Scramble gently.","Top with feta cheese. Season to taste."], tips: "Add hot sauce for flavor without calories." },
    { title: "Tuna Salad Stuffed Avocado", slug: "tuna-salad-stuffed-avocado", category: "LUNCH" as const, calories: 390, proteinG: 35, carbsG: 12, fatG: 24, fiberG: 8, prepMinutes: 8, cookMinutes: 0, servings: 1, difficulty: "easy", ingredients: ["1 can (5 oz) tuna in water, drained","1 large avocado, halved","2 tbsp plain Greek yogurt","1 tbsp diced celery","1 tsp lemon juice","Salt, pepper, paprika"], instructions: ["Mix tuna with Greek yogurt, celery, and lemon juice.","Season with salt and pepper.","Spoon mixture into avocado halves.","Sprinkle with paprika."], tips: "Greek yogurt replaces mayo for extra protein and less fat." },
    { title: "Chicken Bone Broth Sipping Cup", slug: "chicken-bone-broth-sipping-cup", category: "SNACK" as const, calories: 50, proteinG: 10, carbsG: 0, fatG: 1, fiberG: 0, prepMinutes: 2, cookMinutes: 3, servings: 1, difficulty: "easy", ingredients: ["1.5 cups chicken bone broth","Pinch of turmeric","Pinch of black pepper","Fresh ginger slice (optional)"], instructions: ["Heat bone broth in a small saucepan or microwave.","Add turmeric and pepper.","Pour into a mug and sip."], tips: "Ideal when appetite is very low — provides protein and hydration with minimal volume." },
  ];

  for (const r of recipes) {
    const { ingredients, instructions, tips, ...data } = r;
    await prisma.recipe.upsert({
      where: { slug: data.slug },
      update: { ...data, ingredients, instructions, tips, isPublished: true, isGlp1Friendly: true },
      create: { ...data, ingredients, instructions, tips, isPublished: true, isGlp1Friendly: true },
    });
  }
  console.log(`Seeded ${recipes.length} recipes`);

  // ─── Claims ──────────────────────────────────────────────
  const claims = [
    { text: "Provider-guided care built for real-life consistency", category: "NON_NUMERIC_SUPPORT" as const, status: "APPROVED" as const, allowedChannels: ["homepage","pricing","ad","email"], numericClaim: false, riskLevel: "LOW" as const, requiresFootnote: false, requiresLegalReview: false, requiresMedicalReview: false },
    { text: "Personalized treatment plans for eligible adults", category: "NON_NUMERIC_SUPPORT" as const, status: "APPROVED" as const, allowedChannels: ["homepage","pricing","ad","email","sms"], numericClaim: false, riskLevel: "LOW" as const, requiresFootnote: false, requiresLegalReview: false, requiresMedicalReview: false },
    { text: "Medication ships within 24-48 hours of provider approval", category: "OPERATIONAL_TRUST" as const, status: "APPROVED" as const, allowedChannels: ["homepage","pricing","checkout","email"], numericClaim: false, riskLevel: "LOW" as const, requiresFootnote: false, requiresLegalReview: false, requiresMedicalReview: false },
  ];

  await prisma.claim.deleteMany();
  await prisma.claim.createMany({ data: claims });
  console.log(`Seeded ${claims.length} claims`);

  // ─── Referral Settings ───────────────────────────────────
  await prisma.referralSetting.deleteMany();
  await prisma.referralSetting.create({
    data: { defaultPayoutCents: 5000, payoutType: "CREDIT", bonusTiers: [{ referrals: 5, bonusCents: 1000 },{ referrals: 10, bonusCents: 2500 }], isActive: true },
  });
  console.log("Seeded referral settings");

  // ─── Treatment Plan ──────────────────────────────────────
  await prisma.treatmentPlan.deleteMany({ where: { userId: patient.id } });
  await prisma.treatmentPlan.create({
    data: {
      userId: patient.id, status: "ACTIVE", providerName: "Dr. Sarah Chen", providerVendor: "openloop",
      medicationName: "Compounded Semaglutide", medicationDose: "0.5mg", medicationFreq: "Weekly injection",
      is503A: true, prescribedAt: new Date(Date.now() - 75 * 86400000),
      nextRefillDate: new Date(Date.now() + 10 * 86400000),
      nextCheckInDate: new Date(Date.now() + 4 * 86400000),
      notes: "Started at 0.25mg, titrated to 0.5mg at week 4. Tolerating well.",
    },
  });
  console.log("Seeded treatment plan");

  // ─── Coupons ─────────────────────────────────────────────
  await prisma.coupon.deleteMany();
  await prisma.coupon.createMany({ data: [
    { code: "WELCOME20", type: "PERCENTAGE", valuePct: 20, maxUses: 1000, firstMonthOnly: true, isActive: true },
    { code: "LAUNCH50", type: "FIXED_AMOUNT", valueCents: 5000, maxUses: 100, isActive: true },
    { code: "FREEMONTH", type: "FREE_MONTH", maxUses: 50, isActive: true },
  ]});
  console.log("Seeded 3 coupons");

  // ─── Blog Posts ──────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({ data: [
    { title: "What to Expect in Your First Month on a GLP-1 Program", slug: "what-to-expect-first-month-glp1", excerpt: "Starting a GLP-1 treatment program comes with changes.", content: "<h2>Week 1: Getting Started</h2><p>After your provider prescribes your medication, it typically ships within 24-48 hours.</p><h2>Weeks 2-4: Building Momentum</h2><p>Most patients settle into a routine by week three.</p>", category: "medication", isPublished: true, publishedAt: new Date("2026-04-04") },
    { title: "High-Protein Recipes for When Your Appetite Changes", slug: "high-protein-recipes-appetite-changes", excerpt: "When medication affects your appetite, getting enough protein becomes critical.", content: "<p>Protein is essential during weight management.</p>", category: "nutrition", isPublished: true, publishedAt: new Date("2026-04-01") },
    { title: "Compounded Medications: What You Should Know", slug: "understanding-compounded-medications", excerpt: "A clear explanation of compounded medications.", content: "<p>Compounded medications are not FDA-approved.</p>", category: "education", isPublished: true, publishedAt: new Date("2026-03-28") },
    { title: "The Complete Hydration Guide", slug: "hydration-guide", excerpt: "Why hydration matters more during GLP-1 treatment.", content: "<p>Hydration supports metabolism and recovery.</p>", category: "lifestyle", isPublished: true, publishedAt: new Date("2026-03-25") },
    { title: "Building Habits That Outlast the Medication", slug: "building-habits", excerpt: "Building daily habits that sustain progress long-term.", content: "<p>The goal is lasting behavior change.</p>", category: "lifestyle", isPublished: true, publishedAt: new Date("2026-03-20") },
    { title: "Understanding GLP-1 Medications", slug: "understanding-glp1", excerpt: "How GLP-1 receptor agonists work.", content: "<p>GLP-1 medications work by mimicking natural hormones.</p>", category: "medication", isPublished: true, publishedAt: new Date("2026-03-15") },
    { title: "Protein Intake Guide During Weight Management", slug: "protein-intake-guide", excerpt: "How much protein you need and why it matters.", content: "<p>Adequate protein preserves lean muscle mass.</p>", category: "nutrition", isPublished: true, publishedAt: new Date("2026-03-10") },
    { title: "Managing Common Side Effects", slug: "managing-side-effects", excerpt: "Practical strategies for managing side effects.", content: "<p>Most side effects are manageable with the right approach.</p>", category: "medication", isPublished: true, publishedAt: new Date("2026-03-05") },
    { title: "Exercise During GLP-1 Treatment", slug: "exercise-during-treatment", excerpt: "What type of exercise is best during treatment.", content: "<p>Exercise supports both weight loss and muscle preservation.</p>", category: "lifestyle", isPublished: true, publishedAt: new Date("2026-02-28") },
    { title: "Transitioning to Maintenance", slug: "transitioning-to-maintenance", excerpt: "How to plan for the maintenance phase.", content: "<p>Maintenance planning starts before you reach your goal.</p>", category: "lifestyle", isPublished: true, publishedAt: new Date("2026-02-20") },
  ]});
  console.log("Seeded 10 blog posts");

  // ─── Comparison Pages ────────────────────────────────────
  await prisma.comparisonPage.deleteMany();
  await prisma.comparisonPage.createMany({ data: [
    { slug: "vitalpath-vs-hims", title: "VitalPath vs Hims", heroHeadline: "How VitalPath compares to Hims", heroDescription: "Both platforms offer telehealth weight management.", features: JSON.stringify([{feature:"Meal plans",us:true,them:false},{feature:"Coaching",us:true,them:false},{feature:"Progress tracking",us:true,them:false},{feature:"Provider evaluation",us:true,them:true}]), keyDifferences: JSON.stringify(["VitalPath includes structured nutrition support.","VitalPath offers regular coaching check-ins."]), isPublished: true },
    { slug: "compounded-vs-brand-glp1", title: "Compounded vs Brand GLP-1", heroHeadline: "Understanding compounded vs brand", features: JSON.stringify([{feature:"FDA-approved",us:"No",them:"Yes"},{feature:"Licensed provider",us:true,them:true}]), isPublished: true },
    { slug: "vitalpath-vs-calibrate", title: "VitalPath vs Calibrate", heroHeadline: "How VitalPath compares to Calibrate", features: JSON.stringify([{feature:"Meal plans",us:true,them:false}]), isPublished: true },
    { slug: "vitalpath-vs-found", title: "VitalPath vs Found", heroHeadline: "How VitalPath compares to Found", features: JSON.stringify([{feature:"Recipe library",us:true,them:false}]), isPublished: true },
    { slug: "vitalpath-vs-noom", title: "VitalPath vs Noom", heroHeadline: "How VitalPath compares to Noom", features: JSON.stringify([{feature:"Medical treatment",us:true,them:false}]), isPublished: true },
  ]});
  console.log("Seeded 5 comparison pages");

  // ─── Mock Stripe Price IDs ───────────────────────────────
  const allProducts = await prisma.product.findMany();
  for (const p of allProducts) {
    await prisma.product.update({
      where: { id: p.id },
      data: {
        stripePriceIdMonthly: p.stripePriceIdMonthly || `price_${p.slug}_monthly_mock`,
        stripePriceIdQuarterly: p.stripePriceIdQuarterly || `price_${p.slug}_quarterly_mock`,
        stripePriceIdAnnual: p.stripePriceIdAnnual || `price_${p.slug}_annual_mock`,
        stripeProductId: p.stripeProductId || `prod_${p.slug}_mock`,
      },
    });
  }
  console.log("Set mock Stripe price IDs");

  // ─── Admin Alerts (demo) ──────────────────────────────────
  await prisma.adminAlert.deleteMany();
  await prisma.adminAlert.createMany({
    data: [
      { type: "PAYMENT_FAILED", severity: "WARNING", title: "Payment failed for Jordan Miller", body: "Subscription past due - retry recommended", link: "/admin/payments" },
      { type: "CREDENTIAL_EXPIRING", severity: "INFO", title: "Provider license expiring in 28 days", body: "Dr. Sarah Chen - TX license", link: "/admin/providers" },
      { type: "INTAKE_QUEUE_HIGH", severity: "INFO", title: "3 intakes pending review", link: "/admin/customers" },
    ],
  });
  console.log("Admin alerts seeded");

  // ─── Campaigns (demo) ──────────────────────────────────────
  await prisma.campaign.deleteMany();
  await prisma.campaign.createMany({
    data: [
      { name: "Win-Back Q1", type: "REACTIVATION", status: "ACTIVE", trigger: "Canceled 30-60 days ago", offerText: "Come back for 20% off", emailSubject: "We miss you!", sentCount: 145, openedCount: 67, clickedCount: 23, convertedCount: 8, revenueGenerated: 318400, startedAt: new Date("2026-01-15") },
      { name: "Past Due Recovery", type: "RECOVERY", status: "ACTIVE", trigger: "Payment failed 3+ days", emailSubject: "Update your payment method", sentCount: 52, openedCount: 38, clickedCount: 19, convertedCount: 14, revenueGenerated: 556200, startedAt: new Date("2026-02-01") },
      { name: "Premium Upgrade", type: "UPGRADE", status: "PAUSED", trigger: "Essential plan for 60+ days", offerText: "Upgrade to Premium", emailSubject: "Unlock Premium features", sentCount: 89, openedCount: 41, clickedCount: 15, convertedCount: 4, revenueGenerated: 159600, startedAt: new Date("2026-03-01"), pausedAt: new Date("2026-03-20") },
      { name: "Monthly Check-in", type: "ENGAGEMENT", status: "DRAFT", trigger: "Active 30+ days, no progress logged in 7d", emailSubject: "How's your journey going?" },
    ],
  });
  console.log("Campaigns seeded");

  console.log("\n✅ Seed complete!");
  console.log("  Admin login:   admin@vitalpath.com / admin123");
  console.log("  Patient login:  jordan@example.com / demo1234");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
