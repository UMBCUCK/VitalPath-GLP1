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
    {
      title: "What to Expect in Your First Month on a GLP-1 Program",
      slug: "what-to-expect-first-month-glp1",
      excerpt: "The first four weeks on a GLP-1 program are different for everyone, but there are patterns worth knowing before you start.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-04-04"),
      seoTitle: "What to Expect in Your First Month on GLP-1 | Week-by-Week Guide",
      seoDescription: "A realistic, week-by-week guide to your first month on a GLP-1 program — what's normal, what isn't, and how to set yourself up for success.",
      content: `<h2>Before Your Medication Arrives</h2>
<p>Most people spend the first few days after approval doing two things: reading everything they can find online (some of it helpful, a lot of it alarming), and checking their tracking number every few hours. That's completely normal. What's also normal is that the first week feels anticlimactic — the dose is intentionally low to help your body adjust, and you probably won't notice much happening.</p>
<p>Use this window to prepare. Stock your kitchen with easy-to-digest protein sources — Greek yogurt, eggs, cottage cheese, rotisserie chicken. Clear out foods you know cause you problems. Not because you're going on a restrictive diet, but because the last thing you want when you're queasy in week two is to reach for a bag of chips that makes it worse.</p>

<h2>Week 1: Lower Expectations (In a Good Way)</h2>
<p>Your starting dose — typically 0.25mg for semaglutide or 2.5mg for tirzepatide — is not a therapeutic dose. It's a calibration dose. The goal is to introduce the medication to your system gently, not to produce dramatic results. Most people lose somewhere between zero and three pounds in week one. Some people lose nothing and still feel nauseous. Some people feel nothing at all and wonder if the medication is real.</p>
<p>Both experiences are within normal range. Weight loss on GLP-1 medications is not linear, and the first week rarely resembles the months that follow.</p>
<p>Common week-one experiences:</p>
<ul>
  <li>Mild nausea, usually in the hours after injection</li>
  <li>Reduced appetite — sometimes dramatically so</li>
  <li>Fatigue, especially if you're eating significantly less</li>
  <li>Constipation (drink more water than you think you need)</li>
</ul>
<p>The nausea tends to peak around day three and then gradually fade. If it doesn't fade by week two, contact your care team — that's what they're there for.</p>

<h2>Weeks 2–4: Finding Your Rhythm</h2>
<p>By week three, most patients have settled into a routine. The nausea, if it was present, has usually become manageable. Appetite suppression becomes more reliable — the medical term for what's happening is "food noise" reduction, which describes how GLP-1 medications quiet the constant background chatter about food that many people with obesity experience. For some patients, this effect is genuinely life-changing in a way they weren't expecting.</p>
<p>This is also when the first real weight loss typically shows up. Most people are down six to ten pounds by the end of month one, though individual variation is significant. Factors like starting weight, how strictly you're tracking protein, and baseline activity level all influence the number on the scale.</p>
<p>One thing worth noting: scale weight and actual fat loss don't always move together at first. Water weight shifts — especially as you reduce carbohydrate intake, which is common when appetite decreases — can make early losses look bigger or smaller than they really are. Focus less on the daily number and more on the weekly average.</p>

<h2>What's Not Normal and Worth Calling About</h2>
<p>GLP-1 side effects have a reputation that's somewhat exaggerated by online forums. Most people tolerate the medication well. But there are a few things that genuinely warrant reaching out to your care team:</p>
<ul>
  <li>Severe abdominal pain that doesn't resolve (rare but can indicate pancreatitis)</li>
  <li>Persistent vomiting making it difficult to stay hydrated</li>
  <li>Nausea that doesn't improve after two weeks at starting dose</li>
  <li>Symptoms of low blood sugar if you're also on diabetes medications</li>
</ul>
<p>The more common experience is manageable discomfort that improves with dose adjustments and eating strategies. Your provider isn't just there to write the prescription — use them.</p>

<h2>The Mindset Piece</h2>
<p>Here's something that doesn't get said enough: GLP-1 medications work best when you treat them as a physiological assist, not a complete solution. The medication reduces your appetite and helps regulate blood sugar and hunger hormones. It does not choose what you eat, build your exercise habits, or manage your relationship with food. That's still on you — but the medication makes it considerably easier.</p>
<p>Patients who do best in the first month are the ones who use the reduced appetite as an opportunity to build better patterns, not just eat less of the same things. Small meals with high protein. Movement that feels sustainable. Sleep. These aren't magic ingredients, but they compound alongside the medication in a way that shows up clearly in your results by month three and beyond.</p>`,
    },
    {
      title: "High-Protein Recipes for When Your Appetite Changes",
      slug: "high-protein-recipes-appetite-changes",
      excerpt: "When medication reduces your appetite, getting enough protein requires more intentionality — and the right recipes make all the difference.",
      category: "nutrition",
      isPublished: true,
      publishedAt: new Date("2026-04-01"),
      seoTitle: "High-Protein Recipes for GLP-1 Patients | Eating Enough on Small Appetite",
      seoDescription: "Struggling to get enough protein when you're not hungry on GLP-1? These high-protein recipes are designed for reduced appetite and easy digestion.",
      content: `<h2>The Problem With Eating Less</h2>
<p>GLP-1 medications are remarkably effective at reducing appetite. So effective, in fact, that many patients undereat — especially protein. When you're only hungry for a small amount of food, you need to make every bite count. The target most providers recommend is 0.7 to 1 gram of protein per pound of lean body mass. For someone at 200 pounds, that's 120 to 140 grams of protein daily — which is a lot to get through small meals.</p>
<p>The recipes below are specifically designed for this situation. They're calorie-efficient for protein, easy to digest (important when nausea is a factor), and require minimal prep for days when you're not feeling up to cooking.</p>

<h2>Cottage Cheese Power Bowl</h2>
<p>Cottage cheese has had a genuine renaissance lately, and for good reason — a cup of full-fat cottage cheese has about 25 grams of protein, mild flavor, and a texture that's easy on a sensitive stomach. This bowl takes five minutes to assemble.</p>
<p><strong>Ingredients:</strong> 1 cup cottage cheese, ½ cup cherry tomatoes (halved), 2 tbsp everything bagel seasoning, 1 soft-boiled egg, 1 tbsp olive oil, fresh dill if you have it.</p>
<p>Total protein: approximately 32 grams. Eat it cold. Keep a batch in the fridge for days when cooking feels like too much.</p>

<h2>Greek Yogurt Chicken Salad</h2>
<p>Traditional chicken salad is made with mayo, which is fine, but swapping in Greek yogurt doubles the protein content of the dressing and adds probiotics that can help with the digestive changes that come with GLP-1 treatment.</p>
<p><strong>Ingredients:</strong> 2 cups shredded rotisserie chicken, ½ cup full-fat Greek yogurt, 1 tbsp Dijon mustard, 1 stalk celery (finely diced), salt and pepper, squeeze of lemon. Mix and serve over lettuce or with cucumber slices if bread feels like too much.</p>
<p>Total protein: approximately 45 grams per serving. Make a big batch — it keeps for four days and gets better after a day in the fridge.</p>

<h2>Egg and Turkey Scramble</h2>
<p>This is a five-minute breakfast that clears the protein target before 9am. The key is using a mix of whole eggs and egg whites to get the protein density without the volume of a large meal.</p>
<p><strong>Ingredients:</strong> 2 whole eggs, 3 egg whites, 2 oz cooked turkey sausage (crumbled), ¼ cup shredded cheddar, salt and pepper, hot sauce optional.</p>
<p>Cook the egg whites first until just set, then add whole eggs and scramble gently over medium-low heat. Add turkey and cheese at the end. This keeps the texture soft, which matters if nausea is a concern in the morning.</p>
<p>Total protein: approximately 38 grams.</p>

<h2>Protein-First Smoothie</h2>
<p>Some days solid food just isn't happening. A protein smoothie built around real ingredients (not just protein powder) gives you the nutrients without requiring much appetite.</p>
<p><strong>Ingredients:</strong> 1 scoop unflavored whey or casein protein, ½ cup full-fat Greek yogurt, ½ frozen banana, 1 cup unsweetened almond milk, 1 tbsp almond butter, ice.</p>
<p>Blend until smooth. Drink it slowly. The fat in the almond butter and yogurt slows absorption and keeps you full longer than a protein-powder-only shake. Total protein: approximately 35 grams.</p>

<h2>Baked Salmon with Herb Yogurt Sauce</h2>
<p>For patients who can manage a real dinner, salmon is one of the most protein-dense foods that also happens to be genuinely satisfying in small portions. A four-ounce piece of salmon has about 28 grams of protein and takes 12 minutes to bake.</p>
<p><strong>For the salmon:</strong> Season with olive oil, garlic powder, lemon zest, salt and pepper. Bake at 400°F for 12 minutes. <strong>For the sauce:</strong> Mix ½ cup Greek yogurt, 1 tbsp dill, 1 tsp lemon juice, pinch of salt. Serve the sauce cold over hot salmon.</p>
<p>This combination adds another 8 grams of protein from the yogurt sauce, brings the total to about 36 grams for a meal that takes under 15 minutes start to finish.</p>

<h2>The General Principle</h2>
<p>You'll notice most of these recipes lean on cottage cheese, Greek yogurt, eggs, and lean meats. That's intentional. These foods are high in protein relative to their volume, they're generally easy to digest, and they don't require much appetite to get through. On the days when you can only eat one small meal, these are the foods to reach for first.</p>
<p>Track your protein for a few weeks. Most patients are surprised to find they're hitting 70-80 grams when they thought they were doing well, not the 120+ grams their body actually needs during active weight loss.</p>`,
    },
    {
      title: "Compounded Semaglutide: Is It Safe? An Honest Answer",
      slug: "compounded-semaglutide-safety",
      excerpt: "The compounded vs brand debate generates more heat than light. Here's what the evidence actually says about safety, quality, and what to look for.",
      category: "education",
      isPublished: true,
      publishedAt: new Date("2026-04-08"),
      seoTitle: "Is Compounded Semaglutide Safe? What Patients Need to Know",
      seoDescription: "A clear-eyed look at compounded semaglutide safety — the difference between 503A and 503B pharmacies, quality standards, and how to evaluate your provider.",
      content: `<h2>The Honest Starting Point</h2>
<p>Compounded semaglutide is legal, widely prescribed, and for most patients sourced from legitimate pharmacies — genuinely safe. It is also, as the FDA has noted, not FDA-approved, produced in facilities that don't undergo the same manufacturing oversight as brand-name drugs, and varying in quality depending on where it comes from. Both of these things are true simultaneously, which is why the online debate is so muddled.</p>
<p>The question isn't really "is compounded semaglutide safe?" in the abstract. It's "is the specific compounded semaglutide I'm getting, from this specific pharmacy, prepared under what standards?" That's a more useful question — and one you can actually answer.</p>

<h2>What Compounding Actually Means</h2>
<p>Pharmaceutical compounding is the practice of combining, mixing, or altering drug ingredients to create a customized medication. Compounding pharmacies have existed for decades, primarily serving patients with specific dosing needs, allergies to commercial formulations, or access to medications that are commercially unavailable or in shortage.</p>
<p>Semaglutide entered the compounding market at scale in 2022-2023 because Ozempic and Wegovy were — and in many regions remain — genuinely unavailable due to demand far exceeding supply. When a branded drug is officially on the FDA shortage list, compounding pharmacies are permitted to produce copies of it. That's the regulatory basis for compounded semaglutide's current widespread availability.</p>

<h2>503A vs 503B: The Distinction That Actually Matters</h2>
<p>Not all compounding pharmacies operate under the same rules. The FDA distinguishes between two categories:</p>
<p><strong>503A pharmacies</strong> compound medications for individual patients with a valid prescription. They're licensed by state pharmacy boards, not federally registered. Quality control standards vary by state. Most compounding pharmacies are 503A.</p>
<p><strong>503B outsourcing facilities</strong> are federally registered, subject to FDA inspections, required to follow Current Good Manufacturing Practice (CGMP) standards — the same manufacturing standards applied to commercial drug production. They compound medications in bulk (not patient-by-patient) and supply healthcare providers and practices directly.</p>
<p>This distinction matters a lot for quality assurance. A 503B facility that has passed FDA inspection is operating under a meaningful quality standard. A 503A pharmacy, depending on the state and the specific pharmacy, may or may not have robust internal QC processes. Neither is inherently unsafe — but they're not equivalent.</p>

<h2>What the FDA's Concerns Are (and Aren't)</h2>
<p>The FDA has issued warnings about compounded semaglutide products containing semaglutide sodium and semaglutide acetate rather than the semaglutide base used in FDA-approved products. These are different chemical forms of the same active ingredient, and the FDA's concern is that the safety and efficacy data from clinical trials was generated with the specific semaglutide base formulation — not with these salt forms. Whether these salt forms are actually harmful in practice isn't definitively established, but it's a legitimate scientific concern.</p>
<p>Separately, the FDA has taken action against specific bad actors — compounders selling products labeled as semaglutide that contained little or no active ingredient, or that were contaminated. These cases get coverage because they're alarming, but they represent a small fraction of compounding activity.</p>

<h2>How to Evaluate Your Source</h2>
<p>If you're getting compounded semaglutide, these are the questions worth asking:</p>
<ul>
  <li>Is the pharmacy 503B registered? (You can verify this on the FDA's website)</li>
  <li>Can the pharmacy provide a Certificate of Analysis (COA) for their semaglutide batches? A COA documents the potency, purity, and sterility testing for that specific batch.</li>
  <li>Does the prescribing platform have an established relationship with specific pharmacies and vet their quality standards?</li>
  <li>Is the price suspiciously low? Legitimate 503B compounding is not cheap — production costs for sterile injectables are real. If someone is offering semaglutide at $80/month, something in the supply chain is being cut.</li>
</ul>
<p>At VitalPath, we source exclusively from 503B CGMP-compliant pharmacies with current Certificates of Analysis on file. We're happy to share those details with patients who ask.</p>

<h2>The Bottom Line</h2>
<p>Compounded semaglutide from a reputable 503B pharmacy, prescribed through a legitimate telehealth provider, is a reasonable and widely-used option for people who can't afford or can't access brand-name Wegovy or Ozempic. It is not exactly the same as the brand product, and it's worth understanding what that means — but it's not inherently dangerous.</p>
<p>The most important thing you can do is get it from a provider who's transparent about their sourcing, not the cheapest option you found on a wellness Instagram account.</p>`,
    },
    {
      title: "The Complete Hydration Guide for GLP-1 Patients",
      slug: "hydration-guide",
      excerpt: "Hydration is more complicated on GLP-1 than most patients realize — and getting it wrong is one of the most common causes of side effects.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-03-25"),
      seoTitle: "Hydration Guide for GLP-1 Patients | How Much Water on Semaglutide",
      seoDescription: "Why hydration matters more on GLP-1 medications, how much water you actually need, and how to stay hydrated when you're barely hungry.",
      content: `<h2>Why GLP-1 Medications Change Your Hydration Needs</h2>
<p>There are a few mechanisms at work here. First, GLP-1 medications slow gastric emptying — food and liquid move through your stomach more slowly than usual. This is part of how they create satiety, but it also means that large volumes of liquid at once can contribute to nausea. Second, as you eat less, you lose a meaningful amount of water that would otherwise come from food. Fruits, vegetables, and even grains contain substantial water. When your appetite drops and your meals shrink, that water disappears from your diet.</p>
<p>Third — and this one surprises people — if you're losing weight quickly in the early weeks, you're burning through glycogen stores. Each gram of glycogen is stored with about three grams of water. As that glycogen depletes, the water goes with it. This is why the scale can drop dramatically in the first week or two and then slow: you've shed a lot of water weight, not necessarily the same amount of fat.</p>

<h2>How Much Water Do You Actually Need</h2>
<p>The "eight glasses a day" guidance is not especially scientific and doesn't account for body weight, activity level, or medication. A more useful starting point: half your body weight in ounces. At 180 pounds, that's 90 ounces — a little over eleven cups of water. That feels like a lot when you're already feeling full and nauseous.</p>
<p>The practical approach: stop trying to drink large amounts at once and instead sip consistently throughout the day. Keep a water bottle visible. Set a timer if you need to. Small amounts frequently is far more manageable than attempting to drink two liters at once and making the nausea worse.</p>

<h2>Electrolytes Matter More Than You Think</h2>
<p>Water alone isn't the complete picture. When you're losing weight rapidly and eating significantly less, your electrolyte intake drops. Sodium, potassium, and magnesium are all affected. Symptoms of electrolyte imbalance — headaches, muscle cramps, fatigue, dizziness — are often misattributed to the medication when they're actually a hydration problem.</p>
<p>A few practical strategies: add a pinch of sea salt to your water or use a low-sugar electrolyte packet. Eat potassium-rich foods when you can — avocado, banana, spinach. Magnesium glycinate supplementation (200-400mg at bedtime) helps many patients with the muscle cramps and sleep disruption that can accompany rapid weight loss.</p>
<p>You don't need expensive electrolyte drinks. A little salt in your water and attention to food variety covers most of this.</p>

<h2>Signs You're Not Drinking Enough</h2>
<ul>
  <li>Urine is dark yellow or amber (pale yellow is the target)</li>
  <li>Constipation — this is probably the most common sign and also one of the most fixable</li>
  <li>Headaches, especially in the afternoon</li>
  <li>Fatigue that doesn't improve with rest</li>
  <li>Nausea that feels worse than usual (dehydration amplifies GLP-1 nausea significantly)</li>
</ul>
<p>If you're dealing with constipation — which affects a substantial portion of GLP-1 patients, particularly in the first few months — increased water intake is the first intervention to try before anything else. Many patients reach for fiber supplements before simply drinking more water. Try water first.</p>

<h2>What to Drink</h2>
<p>Plain water is fine and doesn't need to be complicated. That said, if plain water is boring and you're not drinking enough because of that, flavor it. Cucumber, lemon, mint, electrolyte packets, or sparkling water all work. Herbal tea counts. Coffee in moderate amounts counts (the mild diuretic effect of caffeine is overstated — studies show regular coffee drinkers remain adequately hydrated).</p>
<p>What to be cautious about: high-sugar beverages, which can worsen nausea and spike blood sugar in counterproductive ways. Alcohol, which is a real diuretic and interacts with GLP-1 in ways that deserve their own discussion. And protein shakes with large amounts of artificial sweeteners, which some patients find worsen GI symptoms.</p>

<h2>The One Practical Change That Helps Most</h2>
<p>Drink 8-12 ounces of water first thing in the morning, before coffee, before food, before checking your phone. The body is mildly dehydrated after sleep and the habit takes about two weeks to form. Patients who do this consistently report fewer side effects, better energy, and less constipation — and the evidence on morning hydration for GI health is genuinely solid.</p>`,
    },
    {
      title: "Building Habits That Outlast the Medication",
      slug: "building-habits",
      excerpt: "The medication lowers the difficulty. What you do with that window determines whether the results last.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-03-20"),
      seoTitle: "Building Lasting Habits on GLP-1 Treatment | Long-Term Weight Loss",
      seoDescription: "GLP-1 medications make behavior change easier — but only if you use the window to actually build habits. Here's a practical framework that works.",
      content: `<h2>What the Medication Actually Does to Your Brain</h2>
<p>GLP-1 receptor agonists don't just reduce appetite. They quiet what researchers call "food noise" — the constant preoccupation with food, the background planning about what to eat next, the emotional pull toward certain foods that has nothing to do with actual hunger. For many patients, particularly those who have struggled with weight their entire adult lives, the experience of this quieting is remarkable. Some describe it as finally being able to think about something else.</p>
<p>This creates a genuine window for behavior change that doesn't exist without the medication. Habits are easier to form when the competing pull of food urges is reduced. That window is real — but it doesn't last forever, and it certainly doesn't last if you stop the medication without having used it to build something durable.</p>

<h2>The Habits That Actually Move the Needle</h2>
<p>Not all habits are equal. The research on long-term weight maintenance after GLP-1 treatment — and after any significant weight loss, frankly — points to a consistent set of behaviors that differentiate people who maintain versus those who regain. They're not sexy. They're not complicated. But they compound.</p>
<p><strong>Daily protein tracking.</strong> Not obsessive calorie counting — just protein. Hitting 100-130g of protein daily preserves muscle mass, keeps you fuller on smaller meals, and has a meaningful thermic effect (your body burns more calories digesting protein than fat or carbs). This single habit, maintained consistently, does more for long-term outcomes than most other interventions.</p>
<p><strong>Resistance training, twice a week minimum.</strong> Not because cardio doesn't matter, but because muscle mass is the primary driver of resting metabolic rate. Every pound of muscle you preserve or add burns an additional six to ten calories per day at rest. Over a year, that adds up substantially. On GLP-1, where you're losing weight quickly, the risk of losing muscle alongside fat is real — resistance training is the primary tool to prevent it.</p>
<p><strong>A consistent sleep schedule.</strong> Sleep deprivation directly elevates ghrelin (the hunger hormone) and suppresses leptin (the satiety hormone) — the exact hormonal environment you're trying to correct with GLP-1. Patients who sleep poorly consistently report worse outcomes at 12 months than patients who sleep well, controlling for other factors. This one is often overlooked.</p>

<h2>The Habit Formation Window</h2>
<p>Habits take longer to form than the "21 days" myth suggests. The research puts it closer to 66 days for moderate-complexity behaviors, with a wide range depending on the individual and the habit. The point is: month two or three of treatment, when side effects have faded and you're in the best stretch of appetite suppression, is the prime window to lock in behaviors that will carry you after the medication reduces in effect or ends.</p>
<p>A practical framework: pick two behaviors to build each month. Not ten. Not five. Two. Track them with a simple habit tracker — even just a calendar with checkboxes. The habits that tend to stick are the ones with the lowest friction. Protein shake first thing in the morning before leaving the house. Walk after dinner, not in the morning when schedule complications might derail it. The specificity of when and where matters as much as what.</p>

<h2>What Happens When You Stop Thinking About the Scale</h2>
<p>Outcomes data on long-term weight management consistently shows that scale-focused patients have worse results than behavior-focused patients. The patients who maintain their weight at two and three years are not the ones who weighed themselves most frequently — they're the ones who had the clearest grip on their daily behaviors and adjusted those behaviors when they drifted, rather than panicking about the number and reverting to restriction cycles.</p>
<p>The medication makes this easier by reducing the emotional charge around food. Use that reduced charge to build a relationship with eating that's based on what you're putting into your body and how it's serving you — not on deprivation, points, or willpower. That relationship is what carries you past the medication.</p>

<h2>Planning for the Long Term Before You Get There</h2>
<p>Talk to your provider about long-term plans before you're in the maintenance phase, not during it. Questions worth discussing at the six-month mark: What does tapering look like? What behaviors need to be locked in before dose reduction? What's the plan if weight starts creeping back? Having these conversations while you're feeling good and confident — not while you're panicking about a gain — leads to much better decisions.</p>
<p>The patients who do best over three to five years are the ones who treated GLP-1 as the beginning of a process, not a quick fix with a definitive end point. The medication gives you the physiological conditions to change. Everything else is up to you.</p>`,
    },
    {
      title: "Understanding GLP-1 Medications: How They Work and Why",
      slug: "understanding-glp1",
      excerpt: "A plain-language explanation of GLP-1 receptor agonists — the mechanism, why they're different from previous weight loss drugs, and what the evidence actually shows.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-03-15"),
      seoTitle: "How GLP-1 Medications Work | Semaglutide and Tirzepatide Explained",
      seoDescription: "Plain-language explanation of GLP-1 medications — how they reduce appetite, what the clinical trial data shows, and why they're different from past weight loss drugs.",
      content: `<h2>What GLP-1 Actually Is</h2>
<p>GLP-1 stands for glucagon-like peptide 1, which is a hormone your body produces naturally in the gut — specifically in cells of the small intestine — after you eat. Its job is to signal fullness to the brain, stimulate insulin release from the pancreas, and slow the movement of food through the stomach. It's part of the body's normal post-meal regulatory system.</p>
<p>The problem with natural GLP-1 is that it breaks down quickly. The half-life of the hormone your body produces is about two minutes — not long enough to have sustained effects on appetite regulation. GLP-1 receptor agonists, the class of medications that includes semaglutide (the active ingredient in Ozempic and Wegovy) and tirzepatide (Mounjaro and Zepbound), are designed to mimic GLP-1's effects but with a much longer half-life — measured in days rather than minutes.</p>

<h2>The Three Main Mechanisms</h2>
<p><strong>Brain signaling.</strong> GLP-1 receptors are distributed throughout the brain, including in areas that regulate appetite, reward, and satiety. When activated, they reduce hunger signals and — importantly — reduce the hedonic component of eating, meaning food is less psychologically rewarding. This is the mechanism behind the "food noise" reduction that many patients report. It's not that food tastes bad; it's that the urgency and preoccupation around eating quiets.</p>
<p><strong>Gastric emptying.</strong> GLP-1 slows how quickly the stomach empties its contents into the small intestine. This extends the sensation of fullness after a meal and reduces post-meal glucose spikes. It's also the main reason GLP-1 medications cause nausea in some patients — food sitting in the stomach longer than usual can trigger the sensation.</p>
<p><strong>Insulin regulation.</strong> GLP-1 stimulates insulin release from the pancreas in a glucose-dependent manner — meaning it only prompts insulin secretion when blood sugar is elevated. This makes it much safer in terms of hypoglycemia risk compared to older diabetes medications that stimulate insulin regardless of blood sugar levels.</p>

<h2>What the Clinical Trials Actually Show</h2>
<p>The STEP trial program for semaglutide (conducted between 2018 and 2021, published in the New England Journal of Medicine) enrolled nearly 5,000 participants across multiple trials. The headline result from STEP 1: patients on weekly semaglutide 2.4mg lost an average of 14.9% of body weight over 68 weeks versus 2.4% in the placebo group. That's approximately 33 pounds for someone starting at 220.</p>
<p>The SURMOUNT program for tirzepatide produced even larger average results — in SURMOUNT-1, patients lost a mean of 20.9% of body weight at the highest dose (15mg) over 72 weeks. These are trial conditions, which means rigorous participant monitoring, dietary counseling, and lifestyle support — but even discounting for those conditions, the effect sizes are genuinely large by the standards of weight management research.</p>
<p>To put these in context: the most effective weight loss drug available before this class was topiramate/phentermine, which achieved roughly 8-10% average body weight reduction. Older medications like orlistat showed around 3-5%. The magnitude of GLP-1 results in controlled trials is meaningfully different from anything that preceded them.</p>

<h2>How Tirzepatide Differs from Semaglutide</h2>
<p>Tirzepatide is sometimes described as a "dual agonist" — it activates both GLP-1 receptors and GIP receptors (glucose-dependent insulinotropic polypeptide, another gut hormone). The addition of GIP receptor activity appears to amplify both the weight loss and the glycemic effects, which is why the average weight loss in tirzepatide trials exceeds semaglutide trials. Whether this difference matters for any individual patient depends on their specific physiology, and both medications are considered first-line options.</p>

<h2>Why These Medications Are Different From What Came Before</h2>
<p>The history of weight loss pharmacology is mostly a history of dangerous failures — fen-phen caused heart valve damage and was pulled in 1997, rimonabant caused severe psychiatric side effects, Qsymia and Contrave produce modest results with significant tolerability issues. The safety profile of GLP-1 medications is genuinely different. The most common side effects are gastrointestinal and generally transient. The serious adverse events from trials — pancreatitis, gallbladder disease — are rare and often not clearly attributable to the medication versus the underlying conditions that accompany obesity.</p>
<p>This doesn't mean they're without risk, and your provider's evaluation exists for good reasons. But the risk-benefit profile for appropriately selected patients is favorable in a way that previous weight loss medications simply weren't.</p>`,
    },
    {
      title: "How Much Protein Do You Need on GLP-1? A Practical Guide",
      slug: "protein-intake-guide",
      excerpt: "The standard protein recommendations don't apply when you're losing weight rapidly on medication. Here's what the research says you actually need.",
      category: "nutrition",
      isPublished: true,
      publishedAt: new Date("2026-03-10"),
      seoTitle: "Protein Intake on GLP-1: How Much You Need and Why | VitalPath",
      seoDescription: "Protein requirements increase significantly during GLP-1 treatment. Learn how much protein to eat, when to eat it, and the best sources for small appetites.",
      content: `<h2>Why Protein Matters More on GLP-1 Than Off It</h2>
<p>Losing weight quickly — which is what GLP-1 medications facilitate — creates a specific nutritional challenge. When you lose weight, you lose a mix of fat mass and lean mass. The ratio depends heavily on how much protein you're eating and whether you're doing resistance exercise. At inadequate protein intake and no resistance training, studies suggest that roughly 25-40% of rapid weight loss comes from lean tissue, not fat. That's muscle, bone density, and organ tissue — and once it's gone, rebuilding it is considerably harder than it was to lose.</p>
<p>The physiological reason: muscle protein is a readily available energy source. When you're in a significant calorie deficit — which many GLP-1 patients are, eating 800-1200 calories without realizing it — the body will break down muscle to meet energy needs unless there's sufficient dietary protein signaling otherwise.</p>

<h2>The Numbers: Standard vs GLP-1 Context</h2>
<p>The RDA for protein is 0.36 grams per pound of body weight. This is a minimum to prevent deficiency, not an optimal target for weight loss. Most sports nutrition and obesity medicine guidelines recommend 0.7 to 1.0 grams per pound of lean body mass for weight loss contexts. For someone at 200 pounds with a moderate body fat percentage (roughly 150 pounds of lean mass), that's 105-150 grams of protein daily.</p>
<p>In practice, many patients on GLP-1 are eating 600-1000 calories per day at peak appetite suppression. At those intake levels, hitting 120+ grams of protein is nearly impossible without being intentional about it. You have to actively prioritize protein at every eating opportunity.</p>

<h2>Timing: Does It Matter</h2>
<p>Protein timing matters somewhat, but not as much as total daily protein. The exception is the muscle protein synthesis window after resistance exercise — consuming 25-40 grams of protein within about two hours of strength training helps maximize the adaptive response. This matters more as you get further into treatment and are trying to build or maintain muscle alongside fat loss.</p>
<p>Beyond that: spreading protein across three or four eating occasions is marginally better than consuming it all at once, because the body can only efficiently process about 30-40 grams of protein for muscle synthesis in a single sitting. Excess is used for energy or excreted. Front-loading protein earlier in the day (breakfast and lunch) is helpful for many patients because GLP-1-driven nausea sometimes worsens in the evening, making it harder to eat a full dinner.</p>

<h2>Best Protein Sources for Small Appetites</h2>
<p>The goal is protein density — maximum grams of protein per calorie and per volume of food. When you can only eat a small amount, these are your best options:</p>
<ul>
  <li><strong>Egg whites:</strong> 26g protein per cup, nearly pure protein</li>
  <li><strong>Nonfat Greek yogurt:</strong> 17-20g per cup, also provides probiotics</li>
  <li><strong>Cottage cheese (full fat):</strong> 25g per cup, more calorie-efficient than Greek yogurt</li>
  <li><strong>Canned tuna or salmon:</strong> 25-30g per 3oz can, shelf-stable and convenient</li>
  <li><strong>Chicken breast:</strong> 26g per 3oz — shredded rotisserie is the easiest form</li>
  <li><strong>Edamame:</strong> 17g per cup, one of the best plant-based options</li>
  <li><strong>Whey protein concentrate:</strong> 20-25g per scoop — useful as a supplement when food intake is very low</li>
</ul>

<h2>A Note on Plant-Based Protein</h2>
<p>Plant proteins have lower bioavailability than animal proteins (your body absorbs a smaller percentage of the protein content). Estimates vary, but plant-based protein may require 20-30% higher intake to achieve the same muscle-preserving effect. This is manageable — it just means the targets above are slightly higher if you're vegetarian or vegan. Pairing complementary proteins (rice + legumes, for instance) addresses the amino acid completeness issue but not the bioavailability difference. Soy and pea protein are the closest to animal protein in terms of bioavailability among plant sources.</p>

<h2>The Practical Takeaway</h2>
<p>Get a rough protein count for three days without changing anything. Most patients discover they're hitting 50-80 grams when they thought they were doing well. Add one protein-first strategy — a protein-heavy breakfast, a Greek yogurt snack, a scoop of whey in your afternoon coffee — and repeat the count. The gap is usually more fixable than it initially appears.</p>`,
    },
    {
      title: "Managing Side Effects on GLP-1: What Works and What Doesn't",
      slug: "managing-side-effects",
      excerpt: "Most GLP-1 side effects are manageable — but the strategies that actually work are specific. Here's what to do about the most common ones.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-03-05"),
      seoTitle: "Managing GLP-1 Side Effects: Nausea, Constipation, Fatigue | Practical Guide",
      seoDescription: "Practical strategies for managing GLP-1 side effects — nausea, constipation, fatigue, and more. What actually works based on patient experience and clinical guidance.",
      content: `<h2>The Realistic Overview</h2>
<p>Across the STEP and SURMOUNT clinical trials, gastrointestinal side effects were the most common reason for discontinuation — but discontinuation rates were still relatively low (around 5-8% in most trials). The majority of patients who experience nausea, constipation, or other GI effects manage through them. The key is knowing that most side effects are worst at dose initiation and dose increases, typically fade within one to two weeks, and are meaningfully reducible with specific strategies.</p>
<p>This guide focuses on the common ones. If you're experiencing anything severe — persistent vomiting, significant abdominal pain, difficulty staying hydrated — that's a conversation for your care team, not a blog post.</p>

<h2>Nausea</h2>
<p>Nausea is the most commonly reported side effect, affecting roughly 30-40% of patients at some point. It's caused by the gastric slowing effect — food sitting in the stomach longer than usual. A few strategies that actually help:</p>
<p><strong>Eat smaller, more frequent meals.</strong> The single most effective intervention. A large meal on a sluggish stomach is a reliable nausea trigger. Four small meals beats two large ones during the first few weeks.</p>
<p><strong>Eat slowly and stop before full.</strong> The satiety signal from GLP-1 is slower than the satiety signal from a full stomach. Many patients overeat past the point of comfortable fullness because the "stop eating" signal is delayed. Eat at half your normal pace and stop when you're 70% satisfied.</p>
<p><strong>Avoid foods that are reliably worse.</strong> High-fat foods, fried foods, and very spicy foods worsen nausea significantly. Not permanently — just until your system adjusts. The patients who report the worst nausea are almost always the ones who tried to eat a burger or pizza in week two.</p>
<p><strong>Ginger.</strong> Ginger tea, ginger chews, and ginger capsules all have reasonably good evidence for nausea reduction. They're not a cure but they genuinely help.</p>
<p><strong>Timing the injection.</strong> Some patients find nausea is worse when they inject in the morning (nausea peaks when the drug is most active, which is in the hours after injection). Switching to evening injections means you sleep through the peak. This works for many people but not all.</p>

<h2>Constipation</h2>
<p>Constipation affects a large percentage of patients — estimates range from 15-30% — and is caused by the same gastric slowing mechanism that causes nausea. It tends to be persistent rather than acute, which makes it more of a management challenge.</p>
<p>The first intervention: water. Significantly more water than you think you need. Many patients reach for fiber supplements or laxatives before adequately hydrating, which is the wrong order of operations. Try 2-3 liters of water daily for one week before adding anything else.</p>
<p>If water alone isn't enough: MiraLax (polyethylene glycol) is the recommended over-the-counter option — it's gentle, doesn't cause urgency, and is safe for regular use. Magnesium citrate at 300-400mg before bed helps many patients and also has benefits for sleep and muscle cramps.</p>
<p>Fiber supplements help some patients and worsen bloating in others. If you try fiber, psyllium husk is generally better tolerated than inulin-based supplements and has good evidence for constipation management.</p>

<h2>Fatigue</h2>
<p>Fatigue in the first few weeks is usually a combination of eating significantly less, the body adjusting to hormonal changes, and sometimes dehydration. It's real but generally temporary.</p>
<p>What helps: maintaining protein intake even when appetite is very low (fatigue is worse with inadequate protein), staying hydrated, and keeping electrolytes up (particularly sodium, potassium, and magnesium). Low-grade fatigue that persists past the first month warrants a conversation about whether your calorie intake is too low.</p>

<h2>Acid Reflux / GERD</h2>
<p>The slowed gastric emptying that reduces hunger can also worsen acid reflux. If you're already prone to GERD, GLP-1 may exacerbate it, particularly if you're eating close to bedtime or lying down after meals.</p>
<p>Practical management: don't eat within two hours of bed, elevate the head of your bed slightly, avoid the foods that typically trigger your reflux. Over-the-counter H2 blockers (famotidine) or PPIs (omeprazole) can be used short-term if symptoms are problematic. If reflux is significantly disrupting your treatment, talk to your provider — dose timing and other adjustments can sometimes help.</p>

<h2>Injection Site Reactions</h2>
<p>Minor redness, irritation, or bruising at the injection site is common and not concerning. Rotating injection sites helps. The abdomen, outer thigh, and upper arm are all approved injection sites — use them in rotation rather than injecting the same spot each week.</p>
<p>If you notice a nodule or lump forming under the skin at an injection site, rotate away from that area and mention it to your provider. Lipohypertrophy (fatty tissue accumulation) can develop with repeated injections at the same site and reduces medication absorption.</p>`,
    },
    {
      title: "Exercise During GLP-1 Treatment: What to Do and What to Avoid",
      slug: "exercise-during-treatment",
      excerpt: "Exercise recommendations for GLP-1 patients are different from standard weight loss guidance — here's what's supported by evidence and what most patients get wrong.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-02-28"),
      seoTitle: "Exercise on GLP-1: Best Workouts for Semaglutide and Tirzepatide Patients",
      seoDescription: "What kind of exercise is best during GLP-1 treatment? How to protect muscle mass, what to avoid, and how to structure your workout routine for best results.",
      content: `<h2>The Core Problem: Losing Muscle With the Fat</h2>
<p>In the STEP-1 trial, patients lost an average of 15% of their body weight. What that number doesn't tell you is the composition of that loss. Research using DEXA scanning (which measures body composition precisely) has found that roughly 20-40% of weight lost on GLP-1 medications without exercise and adequate protein is lean mass — muscle, bone density, connective tissue.</p>
<p>That matters for more than aesthetics. Muscle is metabolically active — it's the primary tissue responsible for resting calorie burn. Lose muscle and you lower your resting metabolic rate, which is the mechanism behind the weight regain that follows when medication stops. The patients who maintain their results long-term are almost always the ones who preserved muscle during active weight loss.</p>
<p>Exercise is the primary tool for doing that. But not all exercise is equally effective for this purpose.</p>

<h2>Resistance Training: The Non-Negotiable</h2>
<p>If you can only do one type of exercise on GLP-1 treatment, make it resistance training. This means lifting weights, using resistance bands, doing bodyweight exercises — anything that creates progressive mechanical load on muscle tissue. Cardio does not preserve muscle effectively. Walking is beneficial for many reasons but will not prevent muscle loss in the context of significant calorie restriction.</p>
<p>The minimum effective dose for muscle preservation: two sessions per week, with three being better. Each session should work all major muscle groups (legs, back, chest, shoulders, arms) through a full range of motion. The weight doesn't have to be heavy — the key is progressive overload, meaning you're gradually increasing the challenge over time.</p>
<p>For patients new to resistance training, bodyweight exercises are a genuinely viable starting point. Squats, push-ups, rows (using a table edge or suspension trainer), and hip hinges train all the major patterns without requiring equipment or gym access.</p>

<h2>Cardio: Useful But Secondary</h2>
<p>Cardiovascular exercise supports heart health, improves insulin sensitivity, and burns additional calories — all useful during GLP-1 treatment. But it should be secondary to resistance training, not the primary mode.</p>
<p>The reason most patients reach for cardio first is that it feels more directly connected to weight loss (you see the calorie burn number on a treadmill, which is satisfying). But the evidence on long-term weight management points clearly to muscle mass preservation and metabolic rate as the more important variable.</p>
<p>Walking specifically: regular walking (30 minutes daily or 8,000+ steps) has excellent evidence for metabolic health, blood sugar regulation, and mood — all relevant during GLP-1 treatment. It's low-impact enough that even patients with significant joint pain can usually do it, and consistent daily movement compounds meaningfully over months.</p>

<h2>Timing: When to Work Out on Injection Days</h2>
<p>Many patients find that injection day — particularly in the first few weeks — isn't their best workout day. Nausea tends to be higher in the hours after injection, and exercising while nauseous is unpleasant and often counterproductive. A few options: inject in the evening so the peak nausea occurs during sleep, or do lighter activity on injection days and save harder workouts for the following day.</p>
<p>Exercise on an empty stomach (fasted training) is fine for most patients and can be beneficial for fat oxidation during steady-state cardio. However, fasted resistance training performed while eating significantly less than usual isn't ideal for muscle preservation — have at least 20-30g of protein before a strength session if you can manage it.</p>

<h2>What to Avoid</h2>
<p>Excessive cardio at very low calorie intake is the primary concern. Patients who are eating 700-900 calories and also doing 60-90 minutes of cardio daily are creating an unsustainable deficit and accelerating lean mass loss. More exercise is not better when baseline intake is already very low.</p>
<p>High-intensity exercise during the first few weeks of treatment — while the body is adjusting and nausea is common — often leads to injury or exercise aversion that's hard to reverse. Build gradually. Two low-intensity resistance sessions per week in month one beats three high-intensity sessions that leave you feeling terrible and discouraged.</p>

<h2>The Long Game</h2>
<p>Exercise during GLP-1 treatment should be thought of as infrastructure, not just a weight loss accelerant. The patients who maintain results at two and three years aren't the ones who exercised most aggressively during active weight loss — they're the ones who found forms of movement they actually continued after the treatment period ended. Build a sustainable practice, not a 90-day program.</p>`,
    },
    {
      title: "How to Transition to Maintenance After GLP-1 Treatment",
      slug: "transitioning-to-maintenance",
      excerpt: "Most weight regain happens in the 12 months after stopping GLP-1. Here's what the evidence says about why — and how to be in the minority that keeps the weight off.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-02-20"),
      seoTitle: "GLP-1 Maintenance Phase: How to Keep Weight Off After Treatment",
      seoDescription: "What happens when GLP-1 treatment ends, why weight regain is so common, and the specific strategies that help patients maintain their results long-term.",
      content: `<h2>What the Research Shows About Weight Regain</h2>
<p>The data on weight maintenance after stopping GLP-1 medications is sobering but important to know. In the STEP 4 trial, participants who had been on semaglutide for 20 weeks were randomized to either continue the medication or switch to placebo. Over the following 48 weeks, the placebo group regained approximately two-thirds of their lost weight. At 12 months, the difference in weight between the two groups was roughly 14 percentage points of body weight.</p>
<p>Similar patterns appear in tirzepatide's SURMOUNT-4 trial. The pattern is consistent: stopping the medication, without behavioral and physiological preparation, tends to reverse a significant portion of the weight loss within a year.</p>
<p>This isn't a character flaw or failure of willpower. GLP-1 medications work partly by overriding hunger hormones that are elevated in people with obesity. When the medication stops, those hormones return to their pre-treatment levels. The body is doing exactly what it evolved to do in response to what it perceives as caloric insufficiency.</p>

<h2>Who Keeps the Weight Off</h2>
<p>Not everyone regains. Long-term follow-up data and clinical observation consistently identify characteristics of patients who maintain the majority of their weight loss after treatment ends. They're not particularly different in terms of genetics or metabolism. The differences are mostly behavioral and structural.</p>
<p>They built consistent eating habits during treatment — not temporary diets but actual patterns around protein intake, meal timing, and food quality that didn't require constant mental effort. They built exercise habits, specifically resistance training, that became genuinely routine. They maintained regular contact with healthcare providers or support systems. And they planned for maintenance before reaching their goal weight, not after.</p>

<h2>The Physiological Case for Ongoing Treatment</h2>
<p>It's worth saying plainly: the strongest predictor of maintained weight loss is continuing the medication. For patients whose providers and insurance situation allow it, long-term maintenance dosing — often at lower doses than the treatment phase — has the best outcomes data. The biological case for this is clear: obesity involves dysregulated hunger hormones and metabolic set points, and treating a chronic condition chronically (rather than temporarily) is medically sound.</p>
<p>That said, not everyone has the access, insurance coverage, or desire for ongoing medication. The rest of this is for those patients.</p>

<h2>A Practical Maintenance Framework</h2>
<p><strong>Taper gradually, not abruptly.</strong> Stopping GLP-1 suddenly after a high dose gives the body an abrupt hormonal shock. Talk to your provider about tapering over several weeks — reducing to a lower maintenance dose first, then discontinuing. This moderates the appetite rebound.</p>
<p><strong>Increase protein intake as you taper.</strong> Higher protein intake (above 120g/day) provides some appetite regulation through multiple pathways — thermogenesis, satiety signaling, and stable blood sugar. It doesn't replicate the medication effect, but it dampens the appetite rebound compared to lower protein intake.</p>
<p><strong>Maintain resistance training, non-negotiably.</strong> Muscle mass is the most important determinant of resting metabolic rate, and it's the structural factor most predictive of long-term maintenance. The patients who gain weight back fastest after stopping GLP-1 are those who didn't build muscle during treatment.</p>
<p><strong>Set behavioral monitoring, not weight monitoring.</strong> Track your protein intake and workout frequency rather than your weight. When behaviors drift — and they will, periodically — catch it early and correct it. Don't wait for scale weight to become alarming.</p>

<h2>When Weight Starts Coming Back</h2>
<p>Some weight regain after stopping GLP-1 is normal and expected — partly from restored glycogen and fluid balance, not fat. What you're watching for is sustained gain over multiple weeks driven by behavioral changes (increased appetite, less activity).</p>
<p>Address it early. Have a plan with your provider before you stop treatment: at what point do you revisit medication, what do you do first, who do you contact. Having that conversation proactively, while you're feeling good and empowered, leads to much better outcomes than having it reactively during a stressful regain period.</p>`,
    },
    // ─── 12 NEW POSTS ───
    {
      title: "Hair Loss on Semaglutide: What's Actually Happening (It's Not the Drug)",
      slug: "hair-loss-on-semaglutide",
      excerpt: "Hair shedding is one of the most alarming surprises for GLP-1 patients. The cause isn't the medication — and understanding it makes it a lot less scary.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-04-10"),
      seoTitle: "Hair Loss on Semaglutide: Why It Happens and When It Stops",
      seoDescription: "Experiencing hair loss on semaglutide or GLP-1? You're not alone — and it's probably not the medication. Learn about telogen effluvium and what to do about it.",
      content: `<h2>The First Thing to Know: Semaglutide Doesn't Cause Hair Loss</h2>
<p>This surprises a lot of people because the timing correlation is obvious — patients start semaglutide, lose significant weight, and then three to four months later notice their hair thinning or coming out in larger amounts than usual. The logical conclusion is that the medication is responsible.</p>
<p>The actual culprit is rapid weight loss itself, not GLP-1. The condition is called telogen effluvium, and it occurs after any significant physical stressor — major surgery, severe illness, childbirth, or yes, rapid weight loss. It's one of the most common forms of hair shedding in adults and, importantly, it's temporary.</p>

<h2>What Telogen Effluvium Actually Is</h2>
<p>Hair grows in cycles. At any given time, about 85-90% of your hair follicles are in the active growth phase (anagen) and 10-15% are in the resting phase (telogen), preparing to shed. A significant physical stressor can shock a large percentage of follicles from the growth phase into the resting phase simultaneously. About three months later — which is how long the telogen phase lasts — all those follicles shed their hair at once.</p>
<p>The three-month delay is why the timing feels so confusing. The event that triggered the hair loss happened months before you noticed it. By the time the shedding starts, you've been on the medication long enough that it seems like the obvious cause.</p>
<p>This pattern — stressor, three-month delay, shedding — has been documented for decades and is well understood. It's the same reason women commonly experience notable hair shedding about three months after giving birth.</p>

<h2>What to Expect</h2>
<p>Telogen effluvium typically begins two to four months after the triggering event (rapid weight loss) and lasts two to six months. For most patients, the shedding resolves completely on its own as the hair cycle normalizes. The follicles themselves aren't damaged — they're just temporarily in the resting phase — so hair regrowth generally follows the shedding period without intervention.</p>
<p>In practice, this means patients who started losing weight in month one typically notice hair changes around months four through six. By months eight to ten, shedding has usually returned to normal and regrowth is underway. It's not a quick process, but it does resolve.</p>

<h2>What Actually Helps</h2>
<p>You can't stop telogen effluvium once it's started — the follicles are already in the resting phase. But you can support the best possible regrowth and reduce the severity by addressing nutrient deficiencies that often accompany rapid weight loss:</p>
<p><strong>Iron and ferritin.</strong> This is the most important one. Iron deficiency — even without clinical anemia — is strongly associated with hair loss. Patients on GLP-1 medications who are eating significantly less are at real risk for suboptimal iron intake. Ask your provider for a ferritin level if you're concerned; a level below 50 ng/mL is associated with hair loss even when hemoglobin is normal.</p>
<p><strong>Biotin.</strong> The evidence for biotin supplementation for hair loss in people without a deficiency is weak. But biotin deficiency is a real thing that can accompany rapid weight loss, and supplementation is low-risk. 2500-5000 mcg daily is the typical recommendation.</p>
<p><strong>Zinc.</strong> Zinc deficiency is associated with hair loss and is common in people eating significantly less. A standard multivitamin or zinc supplement (15-30mg daily with food) covers this.</p>
<p><strong>Protein.</strong> Hair is made of keratin, a protein. Inadequate protein intake during weight loss is directly associated with worse hair shedding outcomes. This is another reason to prioritize hitting your protein targets even when appetite is low.</p>

<h2>When to Actually Be Concerned</h2>
<p>Telogen effluvium is diffuse — you lose hair evenly across the scalp, not in patches. If you're noticing patchy hair loss, complete loss in specific areas, or hair loss accompanied by other symptoms like scalp irritation or changes in hair texture, that's worth a dermatology evaluation. Alopecia areata, thyroid conditions, and other causes of hair loss require different treatment.</p>
<p>Also worth noting: if shedding continues beyond six months without improvement, have your thyroid checked. Both hypothyroidism and hyperthyroidism cause hair loss, and GLP-1 treatment can unmask or influence thyroid function in some patients.</p>
<p>For the vast majority of patients, though: it's telogen effluvium, it's temporary, and it will pass.</p>`,
    },
    {
      title: "Why You're Not Losing Weight on GLP-1 (And What to Actually Do)",
      slug: "not-losing-weight-on-glp1",
      excerpt: "GLP-1 medications are highly effective on average — but not for everyone, and not without the right conditions. Here are the most common reasons people plateau or see minimal results.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-04-07"),
      seoTitle: "Why Am I Not Losing Weight on GLP-1? Common Reasons and Solutions",
      seoDescription: "Not losing weight on semaglutide or tirzepatide? There are specific, fixable reasons this happens. Learn what to check and how to get back on track.",
      content: `<h2>The Honest Starting Point</h2>
<p>GLP-1 medications produce substantial average weight loss in clinical trials — 15-20% of body weight over 12-18 months. But "average" conceals enormous variation. In STEP-1, somewhere around 10% of participants lost less than 5% of their body weight despite being on semaglutide for over a year. Being in that group doesn't mean the medication isn't working — it means something in the individual equation needs to change.</p>
<p>There's usually a fixable reason. Here are the most common ones.</p>

<h2>The Dose Isn't Therapeutic Yet</h2>
<p>This is the most frequently overlooked explanation: the medication isn't at a therapeutic dose. Semaglutide titrates from 0.25mg (a calibration dose, not a therapeutic one) up to 2.4mg over several months. Tirzepatide titrates from 2.5mg to a target of 10-15mg. Significant appetite suppression and weight loss often don't kick in until higher doses.</p>
<p>Patients who are only a few weeks into treatment, still at 0.5mg or 0.25mg, should not be evaluating efficacy yet. If you've been at a lower dose for a long time without titrating up — sometimes because of tolerability, sometimes because of inertia in the treatment process — talk to your provider about whether dose increase is appropriate.</p>

<h2>You're Eating Around the Medication</h2>
<p>GLP-1 medications reduce appetite and food noise — the background craving and preoccupation with eating. They don't lock calories in a vault. Patients who notice that the medication quiets their normal hunger but find themselves eating anyway — out of boredom, habit, stress, or social context — can fully compensate for the calorie deficit the medication was supposed to create.</p>
<p>This is more common than it sounds. Appetite suppression is one of several eating drivers, and for people with eating patterns rooted in emotion or habit rather than hunger, the medication may reduce one factor but not others. If this resonates, working with a therapist who specializes in eating behavior alongside your medical treatment isn't a sign of failure — it's actually one of the stronger predictors of good long-term outcomes.</p>

<h2>Your Protein Intake Is Too Low</h2>
<p>Here's a counterintuitive mechanism: inadequate protein intake slows weight loss by accelerating lean mass loss, which reduces resting metabolic rate. Patients who are eating 800 calories but only getting 40-50 grams of protein daily are losing a significant amount of muscle with their fat. As that muscle disappears, the body becomes less metabolically efficient, and weight loss slows.</p>
<p>The fix is straightforward — hit 100-130g of protein daily, every day — but it requires intentional effort when appetite is suppressed. See the protein and recipe guides elsewhere on this site for practical approaches.</p>

<h2>Alcohol Intake</h2>
<p>Alcohol is calorie-dense (7 calories per gram), essentially stops fat burning while being metabolized, and — interestingly — is affected by GLP-1 in complex ways. Some patients find that alcohol hits harder on GLP-1 (lower tolerance, stronger effect) while others don't. More importantly, a few drinks per week, if they weren't previously counted, can easily account for 300-700 calories of untracked intake that undermines the medication's effect.</p>
<p>If weight loss has stalled, track alcohol honestly for two weeks. This one change has moved the needle for many patients who were otherwise doing everything right.</p>

<h2>An Underlying Medical Condition</h2>
<p>Hypothyroidism, in particular, is significantly associated with reduced GLP-1 response. The thyroid regulates metabolic rate, and if it's underactive — especially if untreated or undertreated — weight loss on any intervention will be slower. PCOS (polycystic ovary syndrome) involves insulin resistance that can blunt GLP-1 response. Cushing's syndrome, though rare, causes weight gain that's resistant to most interventions.</p>
<p>If you're doing everything right and still not responding, ask your provider to check TSH (thyroid), fasting insulin, and A1c. These are simple blood tests and can identify conditions that need to be addressed alongside the GLP-1 treatment.</p>

<h2>Your Sleep and Stress Levels</h2>
<p>Sleep deprivation raises cortisol and ghrelin (hunger hormone) while lowering leptin (satiety hormone) — the exact hormonal environment that GLP-1 is working against. Chronic stress has similar effects. Patients with severe sleep disruption or high baseline stress often experience blunted GLP-1 efficacy because the competing hormonal environment is too strong.</p>
<p>This doesn't mean you need to fix your sleep to start benefiting from GLP-1. But it does mean sleep and stress management aren't peripheral wellness add-ons — they're directly relevant to how well the medication works.</p>

<h2>A Practical Protocol for Stalled Weight Loss</h2>
<p>If you've been on GLP-1 for six or more weeks at a therapeutic dose and have lost less than 3% of body weight: track your food intake for seven days (without changing anything), assess your protein, log alcohol, check your injection technique, and get a thyroid and metabolic panel. Bring that data to your next provider appointment. The answer is almost always in one of those places.</p>`,
    },
    {
      title: "What Happens to Your Body When You Stop GLP-1 Medication",
      slug: "stopping-glp1-what-happens",
      excerpt: "Most patients regain significant weight after stopping GLP-1 — but understanding exactly why it happens points to what you can do about it.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-04-05"),
      seoTitle: "What Happens When You Stop GLP-1 Medication | Weight Regain and How to Prevent It",
      seoDescription: "What happens when you stop semaglutide or tirzepatide? The science behind weight regain after GLP-1 and practical strategies to protect your results.",
      content: `<h2>The Honest Data</h2>
<p>In the STEP-4 trial, participants who had lost an average of 10.6% of their body weight on semaglutide and then switched to placebo regained 6.9 percentage points of body weight over the following 48 weeks. That's roughly two-thirds of the lost weight, in about a year. Tirzepatide's SURMOUNT-4 trial showed similar patterns when the active drug was replaced with placebo after successful weight loss.</p>
<p>This is often framed as a failure — or used to argue that GLP-1 medications "don't work" because the results aren't permanent. That framing misunderstands obesity as a disease. Weight regain after stopping obesity treatment is medically expected for the same reason blood pressure rises after stopping antihypertensives. It doesn't mean the treatment was ineffective; it means obesity is a chronic condition that responds to ongoing treatment.</p>
<p>That said: not everyone regains. And understanding what actually happens physiologically makes it possible to prepare.</p>

<h2>The Physiology of Why Weight Returns</h2>
<p>When you lose significant weight, several things change in your body's hormonal environment — in ways that actively promote weight regain. Leptin, the satiety hormone produced by fat cells, drops as fat mass decreases. Ghrelin, the hunger hormone, increases. Peptide YY, another satiety signal, decreases. These changes are collectively called "metabolic adaptation" and they persist for years after weight loss — independent of whether medication was involved.</p>
<p>GLP-1 medications counteract these changes while they're active. The medication overrides the elevated ghrelin, supplements the reduced GLP-1 and GIP signaling, and maintains the satiety signaling that the body's own hormones are no longer providing. Stop the medication, and these hormonal countermeasures disappear. The body's evolved response to what it perceives as underweight — increase hunger, reduce satiety, slow metabolism — reasserts itself.</p>

<h2>What Stopping Feels Like</h2>
<p>Many patients describe the return of food noise in the first few weeks after stopping as jarring after months of relative quiet. Hunger is stronger. Cravings return. The psychological ease around eating that the medication provided is gone. Food is louder in your head again.</p>
<p>This is uncomfortable but not a sign that something has gone wrong — it's the expected physiological response. The question is what happens next. Patients who have built strong behavioral habits during treatment — consistent protein intake, regular resistance training, structured eating patterns — have much more capacity to manage the hormonal shift than patients who relied entirely on the appetite suppression without building those foundations.</p>

<h2>The Impact on Muscle Mass</h2>
<p>Weight regained after stopping GLP-1 is predominantly fat, not muscle. The lean mass you preserved or built during treatment mostly stays. This matters because the metabolic rate difference between someone who regained 15 lbs of fat and someone who regained 15 lbs of muscle is substantial — the former has lower metabolic capacity than before treatment, while the latter maintains similar metabolic rate to end-of-treatment.</p>
<p>This is the strongest argument for prioritizing muscle preservation during active treatment. It's not just about how you look at goal weight — it directly affects what happens to your body composition after the medication ends.</p>

<h2>Strategies That Actually Reduce Regain</h2>
<p>The research and clinical experience consistently point to several factors that differentiate patients with minimal regain from those with significant regain:</p>
<p><strong>Taper the dose over 8-12 weeks rather than stopping abruptly.</strong> A gradual reduction gives the appetite-regulating system time to partially adjust rather than experiencing a sharp hormonal shift. Talk to your provider about this before your planned stop date.</p>
<p><strong>Increase protein intake during and after taper.</strong> High protein intake provides some appetite regulation through non-GLP-1 pathways — thermogenesis, satiety signaling, stable blood sugar. Patients eating 130+ grams of protein daily show better maintenance outcomes than those at standard intake.</p>
<p><strong>Intensify resistance training in the three months before stopping.</strong> Building additional muscle during the last phase of treatment provides a metabolic buffer against the post-medication environment.</p>
<p><strong>Have a monitoring and response plan.</strong> Decide in advance: if you regain more than X pounds over Y weeks, what's the response? Reconnect with your provider? Restart medication? Adjust diet? Having this plan in place while you're healthy and motivated — not reactive — makes the response faster and less emotionally charged when you need it.</p>

<h2>Long-Term Medication: The Strongest Option</h2>
<p>For many patients, the best answer to "what happens when you stop GLP-1" is: don't stop. Long-term maintenance dosing, often at lower doses than the treatment phase, produces the best weight maintenance outcomes and has a safety profile that supports extended use. Insurance coverage and cost remain barriers for many patients, but this is worth a direct conversation with your provider about options.</p>`,
    },
    {
      title: "GLP-1 for PCOS: How Semaglutide Helps More Than Just Weight",
      slug: "glp1-for-pcos",
      excerpt: "PCOS and GLP-1 medications are a specific combination that deserves its own conversation. The benefits go well beyond the number on the scale.",
      category: "education",
      isPublished: true,
      publishedAt: new Date("2026-04-03"),
      seoTitle: "GLP-1 for PCOS: Semaglutide Benefits for Insulin Resistance and Hormones",
      seoDescription: "How GLP-1 medications like semaglutide benefit PCOS patients — insulin resistance, androgen levels, menstrual regularity, and fertility outcomes.",
      content: `<h2>Understanding the PCOS-Insulin Resistance Connection</h2>
<p>Polycystic ovary syndrome is one of the most common endocrine disorders in women of reproductive age, affecting somewhere between 8 and 13% depending on which diagnostic criteria are used. Despite the name, PCOS isn't primarily a disease of the ovaries — it's fundamentally a metabolic disorder with hormonal consequences.</p>
<p>The central pathophysiology in most patients is insulin resistance. Cells throughout the body respond poorly to insulin, so the pancreas compensates by producing more of it. Elevated insulin has two relevant consequences for PCOS: it stimulates the ovaries to produce excess testosterone and other androgens, and it disrupts the pituitary signals that regulate the menstrual cycle. The resulting elevated androgens cause the symptoms most people associate with PCOS — irregular or absent periods, acne, excess body hair, and in many patients, difficulty losing weight despite significant effort.</p>
<p>This is exactly the mechanism that GLP-1 medications address.</p>

<h2>How GLP-1 Medications Target PCOS Specifically</h2>
<p>GLP-1 receptor agonists reduce insulin resistance through multiple pathways — they improve insulin sensitivity in peripheral tissues, reduce post-meal glucose spikes, and lower overall insulin levels. In patients with PCOS, this reduction in circulating insulin directly reduces the ovarian androgen production that drives many of the condition's symptoms.</p>
<p>Clinical data supports this: several small trials and observational studies have found that semaglutide and liraglutide treatment in PCOS patients produces reductions in free testosterone and DHEAS (adrenal androgen) beyond what would be explained by weight loss alone. A 2022 review in the journal Reproductive BioMedicine Online summarized evidence showing improved androgen profiles in PCOS patients on GLP-1 therapy.</p>
<p>The implications are significant. Lower androgens mean reduced acne, reduced hirsutism, and potentially improved ovarian function and menstrual regularity — outcomes that matter to patients independent of weight loss.</p>

<h2>Menstrual Cycle Effects</h2>
<p>Insulin resistance disrupts the hypothalamic-pituitary-ovarian (HPO) axis — the hormonal communication system that regulates the menstrual cycle. Elevated insulin interferes with the precise LH and FSH signaling needed for regular ovulation. Many PCOS patients have irregular cycles, prolonged cycles, or complete absence of menstruation (amenorrhea) as a result.</p>
<p>As insulin resistance improves with GLP-1 treatment — whether through weight loss, direct metabolic effects, or both — menstrual regularity often follows. Studies have reported cycle regularity improvements in 30-60% of PCOS patients on GLP-1 therapy, though responses vary widely based on how severe the underlying insulin resistance is and how much weight is lost.</p>
<p>Important caveat: improved ovulation means improved fertility. Patients who are not seeking pregnancy should use reliable contraception if there is any chance of sexual activity — the restoration of regular cycles can catch patients off guard, particularly those who were previously using irregular periods as natural contraception (not reliable under any circumstances, but especially not in PCOS).</p>

<h2>Fertility and Pregnancy Considerations</h2>
<p>For patients actively trying to conceive, GLP-1 medications have shown benefit in improving ovulatory function and metabolic environment for implantation. However, GLP-1 medications are not recommended during pregnancy and should be stopped when pregnancy is confirmed (typically one to two months before trying to conceive, given the half-life of these medications). This is a discussion to have with both your GLP-1 prescriber and your OB/GYN or reproductive endocrinologist.</p>

<h2>The Weight Loss Difference in PCOS</h2>
<p>One underappreciated aspect of PCOS and weight management: insulin resistance makes weight loss genuinely harder, not just psychologically but physiologically. Elevated insulin promotes fat storage, particularly visceral fat. The reduced calorie sensitivity that many PCOS patients experience — needing to eat significantly less than a similar person without PCOS to achieve the same weight loss — is real and documented.</p>
<p>GLP-1 medications address this by improving the hormonal environment for weight loss, not just reducing appetite. Patients with PCOS often respond particularly well to GLP-1 treatment because the medication is specifically targeting their primary metabolic dysfunction, not just layering appetite suppression on top of an otherwise unchanged metabolic situation.</p>

<h2>What to Discuss With Your Provider</h2>
<p>If you have PCOS and are considering GLP-1 treatment: ask about baseline androgen levels (free testosterone, DHEAS, SHBG) and a fasting insulin panel before starting treatment. These give you a clear before-and-after measure of the metabolic impact beyond just weight. They're also useful for your provider in monitoring treatment progress and informing dosing decisions.</p>
<p>GLP-1 treatment for PCOS isn't a cure — the underlying predisposition to insulin resistance doesn't disappear — but the results in well-selected patients go well beyond what the scale shows.</p>`,
    },
    {
      title: "How to Protect Your Muscle Mass on GLP-1 Medications",
      slug: "muscle-preservation-glp1",
      excerpt: "The single most important thing you can do to protect your long-term results on GLP-1 is preserve your muscle. Here's a practical guide to doing it right.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-03-30"),
      seoTitle: "Muscle Preservation on GLP-1: How to Avoid Muscle Loss on Semaglutide",
      seoDescription: "How to prevent muscle loss while losing weight on GLP-1 medications. Protein targets, resistance training protocols, and what the research actually shows.",
      content: `<h2>Why This Is the Most Important Part of Your Treatment</h2>
<p>Here's a fact that doesn't get enough attention in GLP-1 discussions: how much muscle you preserve during treatment largely determines your metabolic rate after treatment. Muscle tissue is the primary driver of resting calorie burn — roughly six to ten calories per pound of muscle per day, compared to about two calories per pound of fat. Lose 20 pounds of muscle alongside 40 pounds of fat, and your resting metabolism may drop by 120-200 calories per day. That doesn't sound like much until you realize it compounds over months and years.</p>
<p>This is one of the key mechanisms behind the "GLP-1 weight regain" story. Many patients who regain weight after stopping medication do so faster than expected because they lost significant lean mass during treatment, leaving a slower resting metabolism and reduced capacity to handle normal calorie intake. The medication did its job — but the lack of attention to muscle preservation created a structural vulnerability.</p>

<h2>The Numbers: What You're Aiming For</h2>
<p>Protein target: 0.7 to 1.0 grams per pound of lean body mass. For most patients, this works out to somewhere between 100 and 150 grams of protein per day. The research on this target is fairly consistent across sports medicine and obesity medicine literature — below 0.7g/lb, meaningful lean mass loss occurs during significant calorie restriction. Above 1.0g/lb, returns diminish and the extra protein is largely used for energy.</p>
<p>Resistance training frequency: two to four sessions per week. Each session should work all major muscle groups through a full range of motion. The training volume matters more than the weight load — two sets to near-failure is effective for muscle preservation even at moderate weights. Three sets produces meaningfully better results if you can manage it.</p>

<h2>Progressive Overload: The Principle That Makes Resistance Training Work</h2>
<p>Muscles adapt to the specific demands placed on them. If you do the same workout at the same weight for 12 months, your muscles will be exactly where they were at month two — they've adapted and are no longer being challenged. Progressive overload means gradually increasing the challenge over time: more weight, more reps, less rest, or more total sets.</p>
<p>For patients new to resistance training, this doesn't need to be complicated. Start with what you can do, track it, and aim to do slightly more each week. Adding five pounds to a squat, adding two reps to a push-up set — these small progressions compound significantly over the 12-18 months of a treatment period.</p>

<h2>Creatine: The Most Evidence-Backed Supplement for This Purpose</h2>
<p>Creatine monohydrate is one of the most studied sports supplements in existence, and its evidence for muscle preservation during calorie restriction is genuinely strong. It works by increasing phosphocreatine availability in muscle cells, enabling better performance in resistance training sessions and promoting muscle protein synthesis.</p>
<p>Several studies specifically on weight-loss contexts — not just athletes — show that creatine supplementation during calorie restriction preserves lean mass better than placebo. The standard dose is 3-5 grams daily, taken at any time. There's no need to "load" at higher doses, and cheap generic creatine monohydrate powder is identical to expensive branded versions. The only meaningful side effect is that creatine causes some water retention in muscle tissue — which can appear as the scale not moving as fast as expected in the first week or two, even while fat loss continues.</p>

<h2>Timing Your Workouts</h2>
<p>The anabolic window — the period after resistance exercise when protein synthesis is elevated — is most active for about two hours post-workout. Consuming 25-40 grams of protein within this window is associated with better muscle adaptation compared to waiting hours to eat. This doesn't mean you need a protein shake immediately post-workout, but it does mean planning your post-workout nutrition rather than arriving home hours later and realizing you haven't eaten.</p>
<p>On days when appetite is suppressed, a liquid protein source after training is often more manageable than whole food — Greek yogurt, a protein shake, or even chocolate milk (which has an excellent protein-to-carbohydrate ratio for post-workout recovery).</p>

<h2>Signs You're Losing Too Much Muscle</h2>
<p>Body weight alone doesn't tell you what you're losing. Indicators that lean mass loss may be excessive include: strength declining week over week rather than holding or improving, feeling unusually fatigued with normal activity levels, visible muscle flattening in areas you were previously maintaining, and very rapid weight loss (more than 1.5-2% of body weight per week) that's not explained by water fluctuation.</p>
<p>If these signs are present, the two primary interventions are more protein and less aggressive calorie restriction — even if appetite is low, eating more isn't a failure if what you're eating is mostly protein.</p>`,
    },
    {
      title: "Semaglutide Week-by-Week: A Realistic 3-Month Timeline",
      slug: "semaglutide-timeline-first-3-months",
      excerpt: "What does the first three months on semaglutide actually look like? A realistic, week-by-week timeline of what to expect — the good, the rough, and the turning points.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-03-26"),
      seoTitle: "Semaglutide Timeline: Week-by-Week Results for First 3 Months",
      seoDescription: "A detailed week-by-week timeline of what to expect on semaglutide — when side effects peak, when weight loss starts, and when things really start to change.",
      content: `<h2>Before We Get Into the Timeline: Individual Variation Is Real</h2>
<p>There is no universal semaglutide experience. Some patients sail through the first month with minimal side effects and lose 12 pounds. Others struggle with nausea for six weeks and only see three pounds move. Both are within the range of normal. The timeline below represents the most common pattern — the median experience, roughly. If yours looks different, that doesn't mean something is wrong.</p>

<h2>Week 1 (0.25mg): The Calibration Phase</h2>
<p>Your first injection is a 0.25mg dose, which is deliberately below the therapeutic range. Its job is to introduce the medication to your system gently, not to produce weight loss. Most patients feel a slight reduction in appetite and possibly some mild nausea — usually in the hours after injection — but nothing dramatic.</p>
<p>Weight change in week one: anywhere from zero to four pounds. The lower end of this range is more common than the higher end. If you're expecting dramatic results and see two pounds after day seven, that's normal. If you see zero, also normal.</p>
<p>What to focus on: establishing your injection routine (same day, same approximate time, rotating sites), drinking enough water, and eating smaller meals.</p>

<h2>Weeks 2–4 (Still 0.25mg): Side Effects Peak, Then Fade</h2>
<p>Weeks two and three are typically when nausea is most significant, if it's going to be present at all. The medication is becoming more established in your system and the gastric slowing effect is pronounced. Most patients learn their trigger foods during this period — usually anything greasy, fried, or very rich. Avoiding those foods isn't forever; it's just while you're adjusting.</p>
<p>Fatigue is common, particularly if you've significantly reduced your calorie intake. This is worth taking seriously — persistent fatigue at very low intake is a sign to eat more protein and increase electrolytes, not to eat less.</p>
<p>By week four, nausea typically fades for most patients. Not for everyone, and not completely — but the acute phase usually passes. Total weight loss by end of week four: typically two to six pounds, though individual range is wide.</p>

<h2>Month 2 (0.5mg): The Medication Starts Working</h2>
<p>The dose increase to 0.5mg (which occurs after the first four weeks if tolerated) usually brings the most noticeable increase in appetite suppression. Patients commonly describe a significant reduction in food noise during this period — the background preoccupation with food, the planning ahead about what to eat next, just quiets.</p>
<p>Side effects often resurface briefly when the dose increases, then settle again. This pattern repeats at each dose escalation — it's not a sign that the medication isn't working, just that the system is adjusting.</p>
<p>Weight loss typically accelerates in month two. The average patient on semaglutide has lost somewhere between eight and fifteen pounds by the end of month two, but meaningful variation around that average is common. This is also when many patients start to see results that register visually — in clothes, in how they feel physically, in energy levels.</p>

<h2>Month 3 (1.0mg and Beyond): Finding Your Stride</h2>
<p>By month three, most patients are in their best period of treatment. Side effects have settled, appetite suppression is well-established, and the behavioral patterns that the medication makes easier — smaller meals, better food choices, more consistent movement — have often started to feel natural.</p>
<p>The dose increase to 1.0mg (and in some protocols, continuing toward higher doses) brings further efficacy gains for many patients. The weight loss rate varies but tends to be in the range of one to two pounds per week during an active loss phase, occasionally more.</p>
<p>By the end of month three, patients who started at 0.25mg and titrated normally are often down 15-25 pounds total. This is the period that most closely resembles what the clinical trials describe — the peak efficacy window before natural plateau effects begin to slow the rate.</p>

<h2>The Variables That Change Your Timeline</h2>
<p>Starting weight: heavier patients have more total weight to lose and often see larger absolute numbers in the early months, even when the percentage is similar. Age and sex: older patients and women typically respond slightly more slowly than younger patients and men, though these effects are modest. Activity level: patients who establish consistent resistance training show better lean mass preservation and often better total weight loss. Protein intake: the single most controllable variable — patients consistently tracking 120g+ of protein show better outcomes at three months than those eating lower protein.</p>
<p>The other variable worth mentioning is compliance with the titration schedule. Some providers rush titration; some go very slowly. The titration schedule exists for a reason — it balances efficacy against tolerability — and deviating significantly from it in either direction can affect the month-three experience.</p>`,
    },
    {
      title: "What to Eat on Semaglutide: Foods That Help vs Foods That Hurt",
      slug: "what-to-eat-on-semaglutide",
      excerpt: "The medication changes how your body responds to food — some foods work with it, and some make the side effects significantly worse. Here's what to know.",
      category: "nutrition",
      isPublished: true,
      publishedAt: new Date("2026-03-22"),
      seoTitle: "What to Eat on Semaglutide | Best Foods for GLP-1 Treatment",
      seoDescription: "The best and worst foods to eat on semaglutide and other GLP-1 medications. Practical guidance for reducing nausea and maximizing weight loss results.",
      content: `<h2>How Semaglutide Changes Your Relationship With Food</h2>
<p>The gastric slowing effect of semaglutide — the same mechanism that creates satiety — also changes how your body responds to specific foods. High-fat, heavy meals that might have been fine before treatment can now reliably trigger nausea. Very spicy food irritates a stomach that's already slower-moving than usual. Carbonated drinks can cause uncomfortable bloating when gas can't move through the GI tract as quickly as usual.</p>
<p>This doesn't mean you can never eat these things again. It means the first few months require more attention to how specific foods make you feel, and adjusting accordingly. Think of it less as a diet and more as a period of recalibration.</p>

<h2>Foods That Work Well With the Medication</h2>
<p><strong>Soft, easily digestible proteins.</strong> Eggs (especially scrambled or soft-boiled), Greek yogurt, cottage cheese, fish, and white-meat chicken are ideal. They're high in protein — the nutrient you most need — and easy on a sluggish stomach. The texture and preparation matter: poached eggs are better than a heavily seasoned frittata; grilled salmon is better than deep-fried fish.</p>
<p><strong>Non-starchy vegetables.</strong> Cooked spinach, zucchini, cucumber, and soft-cooked broccoli are nutrient-dense and low in calories without the bulk that can trigger fullness uncomfortably quickly. Raw cruciferous vegetables (broccoli, Brussels sprouts, cabbage) can increase bloating and gas for some patients — the same amount of nutrition is available from cooked versions with less GI disruption.</p>
<p><strong>Avocado and olive oil.</strong> Healthy fats in reasonable amounts are fine and important. The distinction is between small amounts of nutrient-dense fats and large amounts of processed or fried fats. Half an avocado on eggs or a drizzle of olive oil on vegetables is different from a side of french fries — both in nutrition and in how the stomach handles them.</p>
<p><strong>Plain, starchy foods as stabilizers.</strong> When nausea is significant, plain crackers, white rice, or toast serve as stabilizing foods. These aren't nutritionally optimal but they're not harmful in small amounts and they help many patients manage the nausea well enough to eat the protein-rich foods that matter more.</p>

<h2>Foods That Consistently Make Things Worse</h2>
<p><strong>High-fat, greasy, or fried foods.</strong> These are the most consistent nausea triggers for patients in the first few months of treatment. Fat slows gastric emptying, and on a stomach that's already emptying slowly, a heavily fatty meal can sit uncomfortably for hours. This isn't permanent intolerance — most patients reintroduce these foods without issue after the adjustment period — but in the first two to three months, it's worth avoiding them proactively.</p>
<p><strong>Very spicy food.</strong> Capsaicin (the compound responsible for spicy heat) can irritate the GI tract under normal circumstances. On GLP-1, with slower motility, the irritation is prolonged. Many patients who love spicy food find they need to dial it back significantly during early treatment.</p>
<p><strong>Carbonated beverages.</strong> Carbonation introduces gas into a digestive system that's moving more slowly than usual. The result for many patients is uncomfortable bloating and early satiety from gas pressure rather than actual food. Switching to still water during active treatment avoids this entirely.</p>
<p><strong>Alcohol.</strong> Alcohol deserves its own consideration. GLP-1 receptors are present in the brain's reward system, and some patients find that alcohol's effect is stronger (lower tolerance), while others experience reduced cravings. The practical concern is that alcohol is calorie-dense, disrupts sleep, and can worsen dehydration — all counterproductive to treatment goals.</p>
<p><strong>Ultra-processed, high-sugar foods.</strong> Semaglutide's appetite suppression is most effective at reducing hunger for real food. Hyper-palatable processed foods — designed specifically to override satiety signals — can be eaten even when the medication is otherwise working well. If weight loss is stalling, this is often why.</p>

<h2>Building Your Meals Around the Medication</h2>
<p>The most practical framework: protein first at every meal. Eat your protein before you get full and move to other foods after. When appetite is very low, use that limited appetite on the highest-value nutrients — protein, then vegetables, then complex carbohydrates. Treat starchy carbs and fats as complement foods rather than main events.</p>
<p>Meal size matters as much as meal content. Four smaller meals are almost always better tolerated than two large ones. The stomach handles a smaller bolus more easily, and multiple small meals spread protein absorption more optimally throughout the day.</p>
<p>A reasonable template: morning protein (eggs, Greek yogurt, protein shake), mid-morning small snack if hungry (cottage cheese, string cheese), lunch with lean protein and cooked vegetables, afternoon protein snack if needed, dinner with fish or chicken and easily digestible vegetables. This isn't a rigid diet — it's a framework that distributes protein, avoids large boluses, and gives the GI system a break between meals.</p>`,
    },
    {
      title: "The Real Cost of Semaglutide in 2026: What You'll Actually Pay",
      slug: "semaglutide-cost-2026",
      excerpt: "The price range for semaglutide spans from $150 to over $1,300 per month depending on how you access it. Here's a transparent breakdown of what actually drives the difference.",
      category: "education",
      isPublished: true,
      publishedAt: new Date("2026-03-18"),
      seoTitle: "Semaglutide Cost 2026: Brand vs Compounded, With and Without Insurance",
      seoDescription: "How much does semaglutide actually cost in 2026? A transparent breakdown of Ozempic, Wegovy, and compounded semaglutide pricing — with and without insurance.",
      content: `<h2>The Wide Range and Why It Exists</h2>
<p>The cost of semaglutide treatment ranges from roughly $150 to $1,300+ per month depending on three factors: brand versus compounded, insurance coverage, and which provider channel you use. Understanding these factors helps you find the most cost-effective path without compromising on quality or medical oversight.</p>

<h2>Brand-Name Pricing (Ozempic and Wegovy)</h2>
<p>Ozempic (semaglutide 0.5mg, 1mg, and 2mg — approved for type 2 diabetes) and Wegovy (semaglutide 2.4mg — approved specifically for weight management) are manufactured by Novo Nordisk. Without insurance, the list price for Wegovy is approximately $1,349 per month. Ozempic, used off-label for weight management, runs $800-$1,000 per month at list price.</p>
<p>With commercial insurance: coverage for Ozempic for weight management (off-label use) is increasingly restricted, and many plans that cover it require prior authorization and step therapy. Wegovy coverage is explicitly a weight management drug, but many employer health plans do not cover weight management medications at all, even when medically appropriate. Medicare Part D does not cover GLP-1s for weight management (only for diabetes).</p>
<p>Novo Nordisk's savings card for Wegovy reduces cost to $0/month for eligible commercially insured patients, and approximately $650/month for cash-pay patients through their patient support program. Eligibility requirements apply.</p>

<h2>Compounded Semaglutide Pricing</h2>
<p>Compounded semaglutide through telehealth providers typically costs between $150 and $450 per month, with the range driven primarily by which pharmacy is used, the dose, and whether the provider charges a separate consultation fee.</p>
<p>The lower end of this range ($150-200/month) is typically available through direct-to-consumer telehealth platforms that use high-volume compounding partnerships. The higher end ($350-450/month) often comes from higher-quality 503B pharmacy sources, more comprehensive clinical oversight, or bundled coaching and nutrition services.</p>
<p>At VitalPath, our pricing is structured to include the comprehensive support — nutrition guidance, coaching check-ins, progress tracking, and provider access — not just the medication itself. The medication alone is only as effective as what you do around it.</p>

<h2>What Insurance Actually Covers (and Doesn't)</h2>
<p>The insurance landscape for GLP-1 weight management is complex and changing. A few clear realities as of 2026:</p>
<p>Commercial insurance coverage for Wegovy is inconsistent. Some plans cover it without prior authorization; many require documentation of BMI and comorbidities; some exclude it entirely. You won't know until you check with your specific plan.</p>
<p>Ozempic for weight management is off-label and increasingly being rejected by plans that previously covered it, as insurers distinguish between diabetes treatment (covered) and weight management (often not covered).</p>
<p>Employer self-insured plans are the most variable. Some progressive employers have added explicit GLP-1 coverage to attract talent; many have explicitly excluded it to control pharmacy spend.</p>
<p>If insurance coverage matters to your decision: call your insurer before starting treatment, get the prior authorization requirements in writing, and have your provider document your comorbidities carefully. A BMI of 30 with hypertension and prediabetes is a much stronger authorization case than BMI of 30 alone.</p>

<h2>The Hidden Costs</h2>
<p>The medication cost is only part of the picture. Provider visits, lab work, and monitoring add to the total. At minimum, you should expect annual metabolic panels and periodic HbA1c testing. For patients using brand-name product, specialty pharmacy fees and shipping costs can add to the nominal price.</p>
<p>On the other side: weight loss treatment often reduces other healthcare spending over time. Improved metabolic markers reduce long-term cardiovascular medication needs; resolved sleep apnea eliminates CPAP costs; reduced joint pain decreases orthopedic care. These savings are real but not immediate.</p>

<h2>Thinking About Cost as an Investment</h2>
<p>The framing of medication cost versus what it's competing with matters. A month of GLP-1 treatment at $299 versus a month of not treating obesity — and accumulating the downstream costs of untreated metabolic disease — is a different calculation than GLP-1 treatment versus a slightly cheaper alternative that produces worse outcomes. The question is whether the treatment is worth it relative to alternatives, not just whether the number is low in absolute terms.</p>
<p>For patients who've tried other approaches and not achieved durable results, the medication cost-benefit ratio is typically favorable when the comprehensive treatment picture is considered.</p>`,
    },
    {
      title: "Alcohol and GLP-1: What the Research Actually Shows",
      slug: "alcohol-and-glp1",
      excerpt: "The relationship between GLP-1 medications and alcohol is more interesting — and more important — than most patients realize.",
      category: "lifestyle",
      isPublished: true,
      publishedAt: new Date("2026-03-14"),
      seoTitle: "Alcohol and GLP-1 Medications: What You Need to Know | Semaglutide and Drinking",
      seoDescription: "How does GLP-1 medication affect alcohol tolerance? What the research says about drinking on semaglutide, tirzepatide, and other GLP-1 medications.",
      content: `<h2>The Unexpected Finding From Clinical Practice</h2>
<p>When GLP-1 medications became widely prescribed for weight management, clinicians started noticing something unexpected: a meaningful subset of patients reported reduced desire to drink alcohol, not just reduced appetite for food. This observation was striking enough that researchers began studying it directly — and the results have been interesting.</p>
<p>GLP-1 receptors aren't just in the gut and the parts of the brain that regulate hunger. They're also distributed in the mesolimbic reward system — the dopamine pathways involved in addiction, pleasure, and motivated behavior. Animal studies (and a growing number of human observations) suggest that GLP-1 receptor activation dampens the rewarding properties of alcohol in a way that can reduce craving and consumption.</p>
<p>This is actively being studied as a potential treatment for alcohol use disorder. A 2023 study published in JAMA Psychiatry found that patients on GLP-1 medications had significantly lower rates of hospital visits for alcohol-related problems compared to matched controls not on the medication. It's not definitive evidence, but it's consistent with the biological mechanism.</p>

<h2>The Other Effect: Alcohol Hits Harder</h2>
<p>There's a second effect, and it goes in the opposite direction. Many patients report that alcohol affects them more strongly on GLP-1 — the same amount they used to drink produces a stronger or faster effect. This is almost certainly related to the gastric slowing that makes food stay in the stomach longer.</p>
<p>Alcohol absorbed on a stomach that empties more slowly behaves differently. The absorption is somewhat delayed compared to normal, but when it does absorb, it may hit in a more concentrated way. The practical result: patients who have a drink or two with dinner may feel noticeably more affected than they expect based on their pre-medication experience.</p>
<p>This matters for safety — driving, and other situations where accurate judgment about impairment is important. It matters for social situations where patients may not realize they're more affected than they appear. And it matters for anyone who uses tolerance as a guide to how much they've consumed.</p>

<h2>Calorie and Weight Loss Considerations</h2>
<p>Alcohol is calorie-dense (7 calories per gram — nearly as much as fat, which is 9 calories per gram) and has a specific metabolic effect: the body prioritizes alcohol metabolism over all other fuel sources, essentially stopping fat burning while alcohol is being processed.</p>
<p>A few drinks per week can easily represent 300-600 calories of intake that isn't being tracked. For patients wondering why weight loss has slowed, alcohol is frequently the answer. This isn't a reason to never drink — it's a reason to account for it honestly if you're evaluating your results.</p>

<h2>Medical Considerations Specific to GLP-1</h2>
<p><strong>Pancreatitis risk.</strong> Both alcohol use and GLP-1 medications are independently associated with pancreatitis (though the GLP-1 link is debated in newer data). Heavy alcohol use combined with GLP-1 treatment may compound this risk. This is most relevant for patients with a history of pancreatitis or heavy alcohol use — moderate social drinking is a different risk profile entirely.</p>
<p><strong>Blood sugar effects.</strong> For patients who are also managing diabetes or prediabetes, alcohol can cause hypoglycemia hours after consumption by inhibiting gluconeogenesis (the liver's ability to produce glucose). Combined with the glucose-lowering effects of GLP-1 treatment, this warrants attention. Eating when drinking, and monitoring blood sugar if you're a diabetic patient on GLP-1, is important.</p>
<p><strong>Dehydration.</strong> Alcohol is a diuretic. During a period when hydration is already more important than usual (GLP-1 patients need more water than before treatment due to reduced food intake and metabolic changes), alcohol-related dehydration compounds the challenge.</p>

<h2>The Practical Guidance</h2>
<p>Moderate alcohol consumption (defined as up to one drink per day for women and two for men) isn't contraindicated on GLP-1 treatment for most patients. The practical guidance is simpler than the biology:</p>
<p>Drink less than you used to, because the effect is stronger. Account for calories if you're evaluating weight loss results. Don't drink on an empty stomach — the effect is particularly pronounced without food to slow absorption further. Be aware that what you feel on one drink may be what you used to feel on two. And if you're finding that you're drinking more than intended, or that stopping is difficult, this is worth discussing with your provider — the GLP-1 cravings reduction effect may work in your favor, but support is available regardless.</p>`,
    },
    {
      title: "GLP-1 and the Weight Loss Plateau: Why It Happens and How to Break Through",
      slug: "glp1-weight-loss-plateau",
      excerpt: "Almost every GLP-1 patient hits a plateau. It's not a failure — it's physiology. Here's what's happening and what you can actually do about it.",
      category: "medication",
      isPublished: true,
      publishedAt: new Date("2026-03-08"),
      seoTitle: "GLP-1 Weight Loss Plateau: Why It Happens and How to Break Through",
      seoDescription: "Hit a GLP-1 plateau? Most semaglutide and tirzepatide patients do. Learn what's causing it and the specific strategies that get the scale moving again.",
      content: `<h2>Why Plateaus Are Biologically Expected</h2>
<p>At some point — usually between months three and six for most GLP-1 patients — weight loss slows dramatically or stops. The scale doesn't move for two weeks. Then three. Patients often interpret this as the medication "stopping working," which causes significant anxiety and sometimes leads to counterproductive changes.</p>
<p>The plateau is not a malfunction. It's the body responding normally to the reality of weighing significantly less than it did. Here's the mechanism: as body weight decreases, total daily energy expenditure decreases — you simply require fewer calories to maintain a lower body weight. If your food intake stays constant, the calorie deficit that was producing weight loss gradually narrows. Eventually the deficit reaches zero, and weight stabilizes. This would happen on any weight loss intervention, not just GLP-1.</p>
<p>The additional factor specific to GLP-1 treatment: metabolic adaptation. As you lose weight, leptin levels drop and hunger hormones (ghrelin) rise — even with medication working. The medication blunts these effects but doesn't eliminate them. Over months, the body partially adjusts even to the GLP-1 signal, which is why early weight loss is typically faster than later weight loss.</p>

<h2>The First Thing to Check: Dose</h2>
<p>If you're plateaued and not yet at the maximum therapeutic dose for your medication, the first conversation to have is about dose increase. Most patients see meaningful renewed weight loss after titrating up — from 0.5mg to 1.0mg of semaglutide, for instance, or from 5mg to 10mg of tirzepatide. The plateau may simply be indicating that the current dose is no longer producing sufficient physiological effect for your current body weight, and the solution is more medication rather than more restriction.</p>
<p>Don't attempt to self-adjust dose — discuss this with your provider. Dose titration should be done systematically, and your provider will weigh your tolerability history and response pattern before recommending changes.</p>

<h2>Evaluate What's Happening With Protein</h2>
<p>Protein intake typically drifts lower as treatment progresses — appetite suppression can make it feel like enough to eat very small amounts, and protein targets slip. When lean mass decreases (as it does when protein intake is inadequate), resting metabolic rate drops. A patient who has lost ten pounds of muscle alongside thirty pounds of fat now burns several hundred fewer calories at rest than they did at the start of treatment. This slows apparent weight loss even if fat loss is continuing.</p>
<p>Quantify your protein for a week. Not estimated — actually tracked. Most patients find they're hitting 60-80 grams when they need 120-140. Restoring protein intake to target, in the context of a plateau, often restores weight loss momentum within two to three weeks.</p>

<h2>Resistance Training and Its Role in Breaking Plateaus</h2>
<p>Muscle is the metabolic engine. Adding muscle — or even maintaining it better than you were — increases resting energy expenditure, which widens the calorie deficit again. Patients who introduce consistent resistance training during a plateau often see the scale respond within a month, not because exercise burns that many calories directly but because the muscle adaptation effect compounds over time.</p>
<p>Progressive overload is key: if you've been doing the same workout for months, your body has adapted to it. Increasing weight, reps, or exercise complexity is required to continue producing adaptations.</p>

<h2>Recalibrate Intake Honestly</h2>
<p>Calorie intake typically increases subtly over time without patients realizing it. Portions that feel "the same" are often slightly larger. Eating behaviors that were suppressed in months one and two — snacking, finishing kids' food, mindless eating while working — can creep back in. Tracking food intake for a week, without changing anything initially, often reveals where the extra calories are coming from.</p>
<p>This isn't about blame or moral judgment around food. It's reconnaissance. You can't fix a problem you can't see.</p>

<h2>When a Plateau Means the Body Is Protecting Itself</h2>
<p>If you've been on GLP-1 for several months and have lost a significant percentage of body weight, a plateau may reflect your body approaching its new set point — the weight at which your physiology is comfortably stable. Trying to push far below this set point with aggressive restriction rarely works and often produces the muscle loss and fatigue that make long-term maintenance harder.</p>
<p>The conversation with your provider at a plateau isn't just "how do I break through this" — it's also "is this an appropriate weight to aim to maintain, and what does long-term strategy look like from here?" That's a different and more useful question.</p>`,
    },
    {
      title: "Type 2 Diabetes and GLP-1: Managing Blood Sugar While You Lose Weight",
      slug: "glp1-type2-diabetes",
      excerpt: "GLP-1 medications originally emerged as diabetes drugs, not weight loss drugs. Understanding that origin clarifies why they're so effective for people with T2D — and what to watch for.",
      category: "education",
      isPublished: true,
      publishedAt: new Date("2026-03-02"),
      seoTitle: "GLP-1 for Type 2 Diabetes and Weight Loss | Semaglutide Blood Sugar Guide",
      seoDescription: "How GLP-1 medications manage blood sugar and produce weight loss in type 2 diabetes patients. What to monitor, how they interact with other medications, and what results to expect.",
      content: `<h2>The Diabetes Origin of GLP-1 Medications</h2>
<p>It's easy to think of semaglutide and tirzepatide as weight loss drugs that also happen to help with blood sugar. The actual history is the reverse: Ozempic was FDA-approved as a type 2 diabetes medication in 2017, years before Wegovy's weight management approval in 2021. The weight loss effects were observed in the diabetes trials and subsequently studied in dedicated weight management trials.</p>
<p>This history matters because GLP-1 medications were designed and optimized for glucose regulation first. Their mechanism — stimulating insulin release in response to elevated blood sugar, suppressing glucagon, slowing gastric emptying — was built around the pathophysiology of type 2 diabetes. The weight loss is, in important ways, a downstream effect of fixing the metabolic dysfunction that drives both conditions simultaneously.</p>

<h2>Why T2D Patients Often Respond Especially Well</h2>
<p>Type 2 diabetes involves, at its core, insulin resistance — cells that don't respond adequately to insulin signals, causing the pancreas to overproduce insulin and eventually lose the capacity to keep blood sugar controlled. GLP-1 medications address insulin resistance directly, not just by augmenting insulin production but by improving the sensitivity of cells to the insulin that's already there.</p>
<p>Additionally, the glucagon suppression effect — GLP-1 reduces the liver's release of glucose into the bloodstream — has an outsized effect in T2D patients, where glucagon regulation is often disrupted. And the improvement in post-meal glucose spikes, driven by both the insulin effect and the gastric slowing, addresses one of the primary mechanisms of long-term diabetes complications.</p>
<p>The practical result: T2D patients on GLP-1 medications often see A1c improvements of 1.5-2.5 percentage points, alongside the weight loss, which is clinically significant for long-term complication prevention.</p>

<h2>Monitoring Blood Sugar During Treatment</h2>
<p>If you're managing type 2 diabetes alongside GLP-1 treatment, blood sugar monitoring becomes more important, not less, in the first few months. As weight loss improves insulin sensitivity and as the medication itself lowers blood sugar, the blood sugar targets that previously guided your management may need adjustment.</p>
<p>Specifically: patients on sulfonylureas (glipizide, glimepiride, glyburide) or insulin alongside GLP-1 are at meaningful risk for hypoglycemia, because GLP-1 is adding to an already-active glucose-lowering effect. This needs to be managed carefully — typically by reducing sulfonylurea or insulin doses before starting GLP-1, not after hypoglycemia occurs. Your prescribing provider should address this proactively.</p>
<p>Metformin, the most commonly prescribed first-line diabetes medication, does not cause hypoglycemia by itself and generally works well alongside GLP-1 treatment. The combination is considered standard first-line therapy for T2D with obesity in most clinical guidelines.</p>

<h2>What Changes to Watch For</h2>
<p>As weight decreases and metabolic health improves, your other diabetes medications may need to be adjusted downward. This is a good problem to have — it means the treatment is working — but it requires monitoring. Continuing a full dose of metformin or other medications that were calibrated to a higher baseline blood sugar may produce blood sugars that are unnecessarily low once weight loss and GLP-1 effects combine.</p>
<p>Track your fasting blood sugar at least weekly if you're on other diabetes medications. A fasting reading consistently below 80 mg/dL is a signal to contact your provider about adjustments. CGM (continuous glucose monitoring) data is particularly valuable for T2D patients on GLP-1 — it shows the full daily glucose pattern rather than just isolated readings.</p>

<h2>The Long-Term Picture for T2D on GLP-1</h2>
<p>The SUSTAIN and LEADER cardiovascular outcomes trials showed that GLP-1 medications reduce the risk of major adverse cardiovascular events — heart attack, stroke, cardiovascular death — in patients with T2D and established cardiovascular disease. This cardiovascular benefit is separate from the blood sugar effect and may persist independently. It's one of the strongest pieces of evidence supporting long-term GLP-1 use in appropriately selected T2D patients.</p>
<p>For patients whose T2D was primarily driven by obesity, significant weight loss on GLP-1 can bring fasting glucose and A1c into the normal range — sometimes called "remission" of type 2 diabetes. This doesn't mean the diabetes is gone or that medication can be stopped without monitoring, but it represents a meaningful change in disease status that has real implications for long-term health.</p>`,
    },
  ]});
  console.log("Seeded 22 blog posts");
  ]});
  console.log("Seeded 10 blog posts");

  // ─── Comparison Pages ────────────────────────────────────
  await prisma.comparisonPage.deleteMany();
  await prisma.comparisonPage.createMany({ data: [
    {
      slug: "vitalpath-vs-hims",
      title: "VitalPath vs Hims Weight Loss",
      heroHeadline: "VitalPath vs Hims: GLP-1 Medication vs a Complete Weight Loss Program",
      heroDescription: "Hims offers GLP-1 medication access at a low entry price — but medication alone is only part of sustainable weight loss. Here's how the two programs compare on clinical depth, support, and outcomes.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: true },
        { feature: "Licensed provider evaluation", us: true, them: true },
        { feature: "Comprehensive medical intake", us: true, them: "Abbreviated" },
        { feature: "Structured weekly meal plans", us: true, them: false },
        { feature: "High-protein recipe library", us: true, them: false },
        { feature: "Grocery list generator", us: true, them: false },
        { feature: "Progress photo vault", us: true, them: false },
        { feature: "Body measurement tracking", us: true, them: false },
        { feature: "Coaching check-ins", us: true, them: false },
        { feature: "Protein & hydration tracking", us: true, them: false },
        { feature: "Maintenance transition planning", us: true, them: false },
        { feature: "Women-specific protocols", us: true, them: "Limited" },
      ]),
      keyDifferences: JSON.stringify([
        "Hims built its brand on men's health and sexual wellness — weight management is a newer extension. VitalPath was purpose-built around GLP-1 weight management from day one.",
        "VitalPath includes structured nutrition support (meal plans, recipes, grocery lists) as core to the program. On GLP-1 medication, what you eat matters more than ever — protein intake and food choices directly affect lean mass retention and side effects.",
        "VitalPath provides regular coaching check-ins designed around building sustainable habits. Hims primarily focuses on medication delivery; behavioral support is limited.",
        "VitalPath's clinical intake includes comprehensive contraindication screening, emergency contact collection, and HIPAA-compliant records — consistent with full telehealth medical standards.",
      ]),
      isPublished: true,
    },
    {
      slug: "compounded-vs-brand-glp1",
      title: "Compounded vs Brand GLP-1 Medication",
      heroHeadline: "Compounded vs Brand GLP-1: What's the Difference and Which Is Right for You?",
      heroDescription: "Wegovy and Zepbound list at $1,000–$1,400/month. Compounded semaglutide and tirzepatide from licensed pharmacies cost $150–$450/month. The active molecules are the same — but there are real differences worth understanding.",
      features: JSON.stringify([
        { feature: "FDA-approved drug", us: "No (compounded)", them: "Yes" },
        { feature: "Same active molecule", us: true, them: true },
        { feature: "Licensed provider required", us: true, them: true },
        { feature: "503B outsourcing facility sourcing", us: true, them: "N/A (manufacturer)" },
        { feature: "Typical monthly cost", us: "$279–$599", them: "$935–$1,349" },
        { feature: "Insurance coverage for weight loss", us: "No", them: "Rare (<25% of plans)" },
        { feature: "Available during brand shortage", us: "Yes (while on FDA shortage list)", them: "Limited" },
        { feature: "Certificate of analysis available", us: true, them: "N/A" },
        { feature: "Custom dosing flexibility", us: true, them: "Fixed manufacturer doses" },
      ]),
      keyDifferences: JSON.stringify([
        "The active molecule in compounded semaglutide is chemically identical to Wegovy and Ozempic — it binds the same GLP-1 receptor and produces the same physiological effects. FDA approval refers to the manufacturer's proprietary formulation, not the molecule itself.",
        "Quality varies significantly in the compounded market. A legitimate 503B outsourcing facility operates under FDA inspection and meets pharmaceutical-grade standards. VitalPath only works with registered 503B facilities and provides certificates of analysis on request.",
        "Brand-name medications have extensive long-term safety data from large trials. Compounded versions from quality 503B facilities have the same active molecule but a shorter independent safety record. For the vast majority of patients, this is not a clinically meaningful distinction when the pharmacy source is verified.",
        "The FDA has flagged unapproved salt forms of semaglutide (semaglutide sodium, semaglutide acetate) as potentially unsafe — these differ from the approved base form. Always confirm your provider sources the correct molecular form.",
      ]),
      isPublished: true,
    },
    {
      slug: "vitalpath-vs-calibrate",
      title: "VitalPath vs Calibrate",
      heroHeadline: "VitalPath vs Calibrate: Comparing Two Medically-Supervised Weight Loss Programs",
      heroDescription: "Calibrate built its model around GLP-1 medication plus metabolic coaching. VitalPath takes a similar evidence-based approach with different pricing and support structure. Here's an honest comparison.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: true },
        { feature: "All-inclusive pricing", us: true, them: false },
        { feature: "Meal plans & recipes included", us: true, them: false },
        { feature: "Licensed provider evaluation", us: true, them: true },
        { feature: "Metabolic coaching", us: true, them: true },
        { feature: "Progress photo tracking", us: true, them: false },
        { feature: "Body measurement tracking", us: true, them: true },
        { feature: "Grocery list generator", us: true, them: false },
        { feature: "No insurance required for medication", us: true, them: "Previously required" },
        { feature: "Maintenance transition planning", us: true, them: true },
      ]),
      keyDifferences: JSON.stringify([
        "Calibrate's original model required insurance to cover the medication cost, limiting access for the majority of patients whose insurance doesn't cover GLP-1 for weight management. VitalPath uses compounded medication to make treatment accessible regardless of insurance status.",
        "VitalPath pricing is all-inclusive — your monthly fee covers provider evaluation, medication, shipping, and care team access. Calibrate's pricing structure has historically separated program costs from medication costs, making total cost harder to calculate upfront.",
        "Both programs recognize that medication alone isn't sufficient for long-term success. VitalPath's nutrition support (meal plans, recipes, grocery lists) is integrated into the platform, not an additional service.",
        "Calibrate has undergone significant business changes including layoffs and restructuring. VitalPath is purpose-built and operationally stable.",
      ]),
      isPublished: true,
    },
    {
      slug: "vitalpath-vs-found",
      title: "VitalPath vs Found Weight Care",
      heroHeadline: "VitalPath vs Found: Medical Weight Loss With Different Levels of Nutritional Support",
      heroDescription: "Found (formerly Joyn) offers medication-based weight management with behavioral health coaching. VitalPath adds structured nutrition tools and a patient dashboard that Found doesn't include. Here's the comparison.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: true },
        { feature: "Licensed provider evaluation", us: true, them: true },
        { feature: "Structured weekly meal plans", us: true, them: false },
        { feature: "Recipe library (100+ high-protein)", us: true, them: false },
        { feature: "Grocery list generator", us: true, them: false },
        { feature: "Progress photo vault", us: true, them: false },
        { feature: "Body measurement tracking", us: true, them: "Limited" },
        { feature: "Behavioral health coaching", us: true, them: true },
        { feature: "Non-GLP-1 medication options", us: false, them: true },
        { feature: "Referral program", us: true, them: false },
        { feature: "Maintenance transition support", us: true, them: "Limited" },
      ]),
      keyDifferences: JSON.stringify([
        "Found offers a broader range of weight management medications including non-GLP-1 options (metformin, naltrexone/bupropion combinations). VitalPath focuses on GLP-1 treatment, which has the strongest clinical outcomes data for significant weight loss.",
        "VitalPath includes structured nutrition support as a core program component — meal plans designed around GLP-1 side effect management, protein targets, and metabolic health. Found's nutritional guidance is more general.",
        "Found's behavioral health coaching model draws on psychology and habit formation. VitalPath's coaching is clinically-oriented, with check-ins focused on medication response, protein intake, activity, and physiological progress markers.",
        "VitalPath's integrated patient dashboard consolidates weight tracking, body measurements, progress photos, and provider messaging in one platform. Found's tooling is more medication-management focused.",
      ]),
      isPublished: true,
    },
    {
      slug: "vitalpath-vs-noom",
      title: "VitalPath vs Noom",
      heroHeadline: "VitalPath vs Noom: Medical Treatment vs Behavioral Psychology for Weight Loss",
      heroDescription: "Noom built its reputation on psychology-based behavior change for weight management. VitalPath is built around GLP-1 medical treatment. These are fundamentally different approaches — and they work best for different people.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: "Noom Med add-on" },
        { feature: "Licensed medical provider evaluation", us: true, them: "Limited" },
        { feature: "Comprehensive contraindication screening", us: true, them: false },
        { feature: "Structured meal plans", us: true, them: "Basic" },
        { feature: "Psychology-based curriculum", us: false, them: true },
        { feature: "Food logging & color system", us: false, them: true },
        { feature: "Progress photo tracking", us: true, them: false },
        { feature: "Body measurement tracking", us: true, them: false },
        { feature: "Coaching check-ins", us: true, them: true },
        { feature: "Compounded medication option", us: true, them: false },
        { feature: "HIPAA-grade medical records", us: true, them: "Partial" },
      ]),
      keyDifferences: JSON.stringify([
        "Noom's core program is behavioral: it uses a psychology-informed curriculum and a food color-coding system to change eating patterns. This works well for some people, particularly those without significant physiological drivers of weight gain. For patients with insulin resistance, PCOS, or BMI above 35, the behavioral approach alone often isn't sufficient.",
        "Noom added medication access through 'Noom Med' — but medication is an overlay on a behavioral platform, not the foundation. VitalPath is built around medical treatment from the ground up, with clinical protocols, contraindication screening, and provider oversight that matches the medication's clinical profile.",
        "VitalPath uses compounded GLP-1 medications that cost $279–$599/month all-inclusive. Noom Med's medication pricing adds on top of the behavioral program subscription, and the total cost can be comparable to or exceed VitalPath depending on the plan.",
        "The honest answer: if you want behavioral tools and don't need or want medication, Noom is a reasonable choice. If medication-based treatment is the goal, VitalPath's clinical infrastructure is better suited to that purpose.",
      ]),
      isPublished: true,
    },
    {
      slug: "vitalpath-vs-ro",
      title: "VitalPath vs Ro Body",
      heroHeadline: "VitalPath vs Ro Body: Which Platform Is Right for You?",
      heroDescription: "Both VitalPath and Ro Body offer GLP-1 treatment through telehealth. Here's how they compare on clinical oversight, support, nutrition tools, and pricing.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: true },
        { feature: "Licensed provider evaluation", us: true, them: true },
        { feature: "Structured meal plans & recipes", us: true, them: false },
        { feature: "Progress photo tracking", us: true, them: false },
        { feature: "Body measurement tracking", us: true, them: false },
        { feature: "Bi-weekly coaching check-ins", us: true, them: false },
        { feature: "Grocery list generator", us: true, them: false },
        { feature: "Referral program", us: true, them: false },
        { feature: "Protein & hydration tracking", us: true, them: false },
        { feature: "Emergency contact collection", us: true, them: false },
      ]),
      keyDifferences: JSON.stringify([
        "VitalPath includes structured nutrition support — meal plans, recipes, and grocery lists — as part of the treatment program, not as an add-on.",
        "VitalPath provides bi-weekly coaching check-ins to help patients build habits that support long-term maintenance, not just short-term weight loss.",
        "VitalPath's patient dashboard includes body measurement and progress photo tracking that helps patients see changes beyond the scale.",
        "Ro Body's primary focus is medication access; VitalPath treats medication as one component of a broader lifestyle program.",
      ]),
      isPublished: true,
    },
    {
      slug: "vitalpath-vs-weightwatchers",
      title: "VitalPath vs WeightWatchers (WW)",
      heroHeadline: "VitalPath vs WeightWatchers: Medical Treatment vs Points",
      heroDescription: "WeightWatchers has expanded into GLP-1 medication, but the programs are built very differently. Here's an honest comparison of both approaches.",
      features: JSON.stringify([
        { feature: "GLP-1 medication access", us: true, them: "Add-on only" },
        { feature: "Licensed medical provider", us: true, them: "Limited" },
        { feature: "Clinical intake & evaluation", us: true, them: false },
        { feature: "HIPAA-compliant medical records", us: true, them: "Partial" },
        { feature: "Personalized treatment plan", us: true, them: false },
        { feature: "Structured nutrition program", us: true, them: true },
        { feature: "Coaching & support", us: true, them: true },
        { feature: "No points or tracking system required", us: true, them: false },
        { feature: "Progress photo vault", us: true, them: false },
        { feature: "Emergency contact & safety screening", us: true, them: false },
      ]),
      keyDifferences: JSON.stringify([
        "VitalPath is a medically-supervised program built around GLP-1 treatment from the ground up. WeightWatchers added medication as an overlay to a points-based behavioral program.",
        "VitalPath includes a comprehensive clinical intake with FDA-required contraindication screening. The medical oversight is built into the platform architecture.",
        "WeightWatchers' long history with behavioral weight loss support is genuine — but the integration with GLP-1 medication is relatively new and the clinical infrastructure differs from a purpose-built telehealth provider.",
        "VitalPath's pricing is transparent and all-inclusive. WeightWatchers' medication access involves a separate prescription service with its own pricing layer.",
      ]),
      isPublished: true,
    },
  ]});
  console.log("Seeded 7 comparison pages (with rich content)");

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
