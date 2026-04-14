// Centralized Unsplash image constants — single source of truth for all homepage photos.
// To swap any image, change the URL here. All components import from this file.
//
// IMAGE STRATEGY (beating MEDVi):
// - Warm, natural lighting (golden hour feel)
// - Genuine expressions (mid-laugh, candid, not posed)
// - Diverse: ages 28-65, multiple ethnicities, both genders
// - Environmental context (kitchen, park, home office — not blank backgrounds)
// - Aspirational but relatable (healthy-looking, not fitness models)
// - Cohesive visual narrative: struggle → hope → confidence → transformation

function unsplash(id: string, w: number, q = 80) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

function unsplashFace(id: string, w: number, q = 75) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=faces&w=${w}&q=${q}`;
}

// Tiny SVG blur placeholders (color-matched to image tones)
const BLUR_WARM = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNlMmRhZDAiLz48L3N2Zz4=";
const BLUR_COOL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNkMGU1ZTMiLz48L3N2Zz4=";
const BLUR_NEUTRAL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiNlMGUwZTAiLz48L3N2Zz4=";
const BLUR_DARK = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiMxYTI3NDQiLz48L3N2Zz4=";

// ─── HERO ──────────────────────────────────────────────────
// Confident, warm, natural — someone who looks like they've found something that works
export const heroImage = {
  src: "/hero-glp1-pens.png.png", // GLP-1 pen image — file is in public/hero-glp1-pens.png.png
  alt: "GLP-1 weight loss medication injection pens",
  width: 600,
  height: 600,
  blurDataURL: BLUR_COOL,
};

// ─── BEFORE / AFTER (lifestyle progression — low energy → high energy) ───
// These tell a visual story: reflective/sedentary → active/confident
// NOT fake transformations — clearly lifestyle imagery with proper disclosure
export const beforeAfterImages = [
  {
    // Jessica T., 38 — mom who found her energy again
    before: { src: unsplash("photo-1499557354967-2b2d8910bcca", 400, 75), alt: "Woman in quiet, reflective moment at home" },
    after: { src: unsplash("photo-1552508744-1696d4464960", 400, 75), alt: "Woman laughing outdoors in golden light" },
  },
  {
    // David K., 56 — got his health markers back on track
    before: { src: unsplash("photo-1504439468489-c8920d796a29", 400, 75), alt: "Man resting at home in thoughtful moment" },
    after: { src: unsplash("photo-1486218119243-13883505764c", 400, 75), alt: "Man walking confidently outdoors in nature" },
  },
  {
    // Robert J., 62 — retired firefighter, playing with grandkids
    before: { src: unsplash("photo-1496345875659-11f7dd282d1d", 400, 75), alt: "Older man in quiet everyday moment" },
    after: { src: unsplash("photo-1559963110-71b394e7494d", 400, 75), alt: "Active older man enjoying outdoor walk in park" },
  },
  {
    // Lisa C., 52 — menopausal weight gone, feels like herself again
    before: { src: unsplash("photo-1544717305-2782549b5136", 400, 75), alt: "Woman in contemplative moment" },
    after: { src: unsplash("photo-1494790108377-be9c29b29330", 400, 75), alt: "Radiant woman smiling with confidence" },
  },
  {
    // Rachel W., 33 — post-baby weight, fits into old jeans
    before: { src: unsplash("photo-1524250502761-1ac6f2e30d43", 400, 75), alt: "Young woman in casual home setting" },
    after: { src: unsplash("photo-1506863530036-1efeddceb993", 400, 75), alt: "Young woman stretching outdoors feeling free" },
  },
];
export const beforeAfterBlur = { before: BLUR_NEUTRAL, after: BLUR_COOL };

// ─── TESTIMONIAL AVATARS ─────────────────────────────────
// Diverse, warm, candid headshots — look like real people, not stock models
// Larger (128px) for more prominent display in review cards
export const testimonialAvatars = [
  { src: unsplashFace("photo-1494790108377-be9c29b29330", 128), alt: "Jessica T." },    // 0: Jessica T., 38 — warm smile
  { src: unsplashFace("photo-1507003211169-0a1dd7228f2d", 128), alt: "Marcus D." },     // 1: Marcus D., 45 — friendly, approachable
  { src: unsplashFace("photo-1438761681033-6461ffad8d80", 128), alt: "Rachel W." },     // 2: Rachel W., 33 — young, natural
  { src: unsplashFace("photo-1472099645785-5658abf4ff4e", 128), alt: "David K." },      // 3: David K., 56 — mature, confident
  { src: unsplashFace("photo-1573496359142-b8d87734a5a2", 128), alt: "Priya S." },      // 4: Priya S., 41 — professional, warm
  { src: unsplashFace("photo-1500648767791-00dcc994a43e", 128), alt: "Chris B." },       // 5: Chris B., 48 — casual, real
  { src: unsplashFace("photo-1534528741775-53994a69daeb", 128), alt: "Amanda R." },      // 6: Amanda R., 29 — youthful, bright
  { src: unsplashFace("photo-1566492031773-4f4e44671857", 128), alt: "Robert J." },      // 7: Robert J., 62 — distinguished, kind
  { src: unsplashFace("photo-1580489944761-15a19d654956", 128), alt: "Nicole M." },      // 8: Nicole M., 36 — natural beauty
  { src: unsplashFace("photo-1506794778202-cad84cf45f1d", 128), alt: "James L." },       // 9: James L., 43 — confident professional
  { src: unsplashFace("photo-1558898479-33c0057a5d12", 128), alt: "Lisa C." },           // 10: Lisa C., 52 — vibrant, experienced
  { src: unsplashFace("photo-1519345182560-3f2917c472ef", 128), alt: "Anthony V." },     // 11: Anthony V., 34 — casual, genuine
];

// ─── PROVIDER HEADSHOTS ────────────────────────────────────
// Clinical but warm — white coat or stethoscope visible, genuine smile
export const providerImages = [
  { src: unsplashFace("photo-1559839734-2b71ea197ec2", 200), alt: "Dr. Sarah Chen, Board-Certified Internal Medicine" },
  { src: unsplashFace("photo-1612349317150-e413f6a5b16d", 200), alt: "Dr. James Walker, Board-Certified Family Medicine" },
  { src: unsplashFace("photo-1551836022-d5d88e9218df", 200), alt: "Dr. Maria Rodriguez, Board-Certified Endocrinology" },
];

// ─── VIDEO TESTIMONIAL THUMBNAILS ──────────────────────────
// People in "talking to camera" or interview-style poses — more authentic for video
export const videoThumbnails = [
  { src: unsplash("photo-1552508744-1696d4464960", 800, 75), alt: "Jessica T. sharing her weight loss story", blurDataURL: BLUR_DARK },
  { src: unsplash("photo-1486218119243-13883505764c", 800, 75), alt: "David K. discussing his health transformation", blurDataURL: BLUR_DARK },
  { src: unsplash("photo-1506863530036-1efeddceb993", 800, 75), alt: "Amanda R. talking about her experience", blurDataURL: BLUR_DARK },
];
export const videoThumbnailsMini = [
  { src: unsplash("photo-1552508744-1696d4464960", 200, 70), alt: "Jessica T. thumbnail" },
  { src: unsplash("photo-1486218119243-13883505764c", 200, 70), alt: "David K. thumbnail" },
  { src: unsplash("photo-1506863530036-1efeddceb993", 200, 70), alt: "Amanda R. thumbnail" },
];

// ─── MEDICATION SECTION ────────────────────────────────────
// Clean, clinical medication/vial on neutral background
export const medicationImage = {
  src: unsplash("photo-1585435557343-3b092031a831", 400), // Medical injection pen
  alt: "Medical injection pen for GLP-1 weight loss medication",
  blurDataURL: BLUR_COOL,
};

// ─── PERSONA SECTION ───────────────────────────────────────
// Larger, more relatable images showing the persona's lifestyle context
export const personaImages = [
  { src: unsplashFace("photo-1438761681033-6461ffad8d80", 128), alt: "Person who has tried every diet" },     // Serial dieter
  { src: unsplashFace("photo-1559839734-2b71ea197ec2", 128), alt: "Health-motivated professional" },          // Health-motivated
  { src: unsplashFace("photo-1507003211169-0a1dd7228f2d", 128), alt: "Busy professional on the go" },         // Busy professional
];

// ─── MEDICATION SHOWCASE (product-style cards) ─────────────
export const medicationShowcaseImages = {
  semaglutide: {
    src: unsplash("photo-1587854692152-cbe660dbde88", 500), // Medical vial, clinical setting
    alt: "Semaglutide vial — compounded GLP-1 medication",
    blurDataURL: BLUR_COOL,
  },
  tirzepatide: {
    src: unsplash("photo-1576091160550-2173dba999ef", 500), // Pharmaceutical supplies
    alt: "Tirzepatide — dual GIP/GLP-1 medication",
    blurDataURL: BLUR_COOL,
  },
};

// ─── CTA SECTION (final conversion push) ───────────────────
export const ctaBackgroundImage = {
  src: unsplash("photo-1506126613408-eca07ce68773", 1200, 70),
  alt: "",
  blurDataURL: BLUR_DARK,
};

// ─── PROBLEM SECTION ───────────────────────────────────────
export const problemImage = {
  src: unsplash("photo-1499557354967-2b2d8910bcca", 500),
  alt: "Person reflecting on their health journey",
  blurDataURL: BLUR_WARM,
};

// ─── PROCESS SECTION (3 steps) ─────────────────────────────
export const processImages = [
  { src: unsplash("photo-1516321318423-f06f85e504b3", 400, 75), alt: "Person completing online health assessment on phone" },
  { src: unsplashFace("photo-1559839734-2b71ea197ec2", 400, 75), alt: "Licensed medical provider reviewing health profile" },
  { src: unsplash("photo-1586528116311-ad8dd3c8310d", 400, 75), alt: "Medication package ready for delivery" },
];

// ─── GUARANTEE SECTION ─────────────────────────────────────
export const guaranteeImage = {
  src: unsplash("photo-1576091160399-112ba8d25d1d", 600, 75),
  alt: "Caring healthcare team supporting patients",
  blurDataURL: BLUR_WARM,
};

// ─── SOLUTION SECTION ──────────────────────────────────────
// Doctor-patient consultation or wellness coaching scene
export const solutionImage = {
  src: unsplash("photo-1576091160399-112ba8d25d1d", 600, 75), // Healthcare consultation, warm and professional
  alt: "Licensed provider consulting with a patient about their treatment plan",
  width: 600,
  height: 340,
  blurDataURL: BLUR_WARM,
};
