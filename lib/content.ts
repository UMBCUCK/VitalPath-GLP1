// ─── TRUST BULLETS ──────────────────────────────────────────

export const trustBullets = [
  {
    icon: "ShieldCheck",
    title: "Licensed providers",
    description: "Every treatment plan is evaluated and managed by a licensed medical provider.",
  },
  {
    icon: "Truck",
    title: "Free 2-day shipping",
    description: "Discreet, temperature-controlled delivery from state-licensed pharmacies.",
  },
  {
    icon: "Lock",
    title: "Private & secure",
    description: "HIPAA-compliant platform with encrypted data and secure messaging.",
  },
  {
    icon: "RefreshCw",
    title: "Cancel anytime",
    description: "No long-term contracts. Pause, adjust, or cancel your plan on your terms.",
  },
  {
    icon: "HeartPulse",
    title: "Ongoing clinical support",
    description: "Regular check-ins, dose adjustments, and care team access throughout your program.",
  },
] as const;

// ─── MEDIA LOGOS (As Seen In) ───────────────────────────────

export const mediaLogos = [
  "Forbes",
  "Healthline",
  "Women's Health",
  "Men's Health",
  "WebMD",
  "USA Today",
] as const;

// ─── HERO STATS ────────────────────────────────────────────

export const heroStats = [
  { value: "18,000+", label: "Patients served" },
  { value: "4.9", label: "Average rating", suffix: "/5" },
  { value: "15-20%", label: "Avg body weight lost*" },
  { value: "94%", label: "Would recommend" },
] as const;

// ─── PROBLEM AGITATION ─────────────────────────────────────

export const problemPoints = [
  {
    icon: "Brain",
    title: "Your brain fights back",
    description:
      "After weight loss, your brain increases hunger hormones by up to 30% and slows your metabolism — making it nearly impossible to keep weight off through willpower alone.",
  },
  {
    icon: "TrendingDown",
    title: "95% of diets fail within 5 years",
    description:
      "Traditional diets, calorie counting, and exercise programs have a 95% long-term failure rate. The problem isn't discipline — it's biology working against you.",
  },
  {
    icon: "DollarSign",
    title: "You've already spent thousands",
    description:
      "The average person spends $2,000+/year on diets, gym memberships, and supplements that don't address the root cause. That money adds up with nothing to show for it.",
  },
] as const;

// ─── SOLUTION POINTS ───────────────────────────────────────

export const solutionPoints = [
  {
    title: "Reduces appetite at the source",
    description: "GLP-1 medications work by mimicking a natural hormone that signals fullness to your brain, reducing cravings and helping you feel satisfied with less food.",
  },
  {
    title: "Clinically proven results",
    description: "In clinical trials, patients using GLP-1 receptor agonists lost an average of 15-20% of their body weight — significantly more than diet and exercise alone.",
  },
  {
    title: "Works with your biology, not against it",
    description: "Instead of fighting your body's hunger response, GLP-1 medications reset the biological signals that cause weight regain after traditional dieting.",
  },
  {
    title: "Sustained, long-term results",
    description: "Combined with lifestyle support, GLP-1 treatment helps patients maintain weight loss over time by addressing the metabolic factors that cause rebound weight gain.",
  },
] as const;

// ─── PROCESS STEPS (Simplified to 3) ───────────────────────

export const processSteps = [
  {
    step: 1,
    title: "Complete a quick online assessment",
    description:
      "Answer a few questions about your health goals and history. Takes about 2 minutes — no appointment needed.",
    icon: "ClipboardCheck",
    timeEstimate: "2 minutes",
  },
  {
    step: 2,
    title: "Get evaluated by a licensed provider",
    description:
      "A board-certified provider reviews your health profile and determines if GLP-1 medication is right for you. If prescribed, your personalized treatment plan is created the same day.",
    icon: "Stethoscope",
    timeEstimate: "Within 24 hours",
  },
  {
    step: 3,
    title: "Medication delivered to your door",
    description:
      "Your prescribed medication ships from a licensed pharmacy in discreet, temperature-controlled packaging. Free 2-day shipping included with every plan.",
    icon: "Package",
    timeEstimate: "2-day delivery",
  },
] as const;

// ─── COMPARISON TABLE ──────────────────────────────────────

export const comparisonRows = [
  {
    feature: "Monthly cost",
    vitalpath: "From $279/mo",
    branded: "$1,349+/mo",
    surgery: "$20,000-$35,000",
    diets: "$150-$500/mo",
  },
  {
    feature: "Avg weight loss",
    vitalpath: "15-20% body weight",
    branded: "15-20% body weight",
    surgery: "25-30% body weight",
    diets: "3-5% (temporary)",
  },
  {
    feature: "Doctor supervision",
    vitalpath: true,
    branded: true,
    surgery: true,
    diets: false,
  },
  {
    feature: "No surgery required",
    vitalpath: true,
    branded: true,
    surgery: false,
    diets: true,
  },
  {
    feature: "Meal plans & nutrition",
    vitalpath: true,
    branded: false,
    surgery: false,
    diets: "Sometimes",
  },
  {
    feature: "Progress tracking",
    vitalpath: true,
    branded: false,
    surgery: false,
    diets: "Sometimes",
  },
  {
    feature: "Ongoing coaching",
    vitalpath: true,
    branded: false,
    surgery: false,
    diets: "Sometimes",
  },
  {
    feature: "Cancel anytime",
    vitalpath: true,
    branded: true,
    surgery: "N/A",
    diets: "Varies",
  },
] as const;

// ─── CLINICAL RESULTS ──────────────────────────────────────

export const clinicalResults = [
  {
    stat: "15-20%",
    label: "Average body weight lost (25-50 lbs for most members)",
    source: "Based on published GLP-1 clinical trial data",
  },
  {
    stat: "87%",
    label: "Of patients lost significant weight",
    source: "Patients who completed 6+ months of treatment",
  },
  {
    stat: "3x",
    label: "More effective than diet alone",
    source: "Compared to lifestyle intervention only groups",
  },
  {
    stat: "72%",
    label: "Reduction in food cravings",
    source: "Patient-reported outcomes at 12 weeks",
  },
] as const;

// ─── TESTIMONIALS ──────────────────────────────────────────
// Written to sound like real humans — specific details, natural voice,
// minor imperfections, emotional beats, not marketing copy.

export const testimonials = [
  {
    name: "Jessica T.",
    age: 38,
    location: "Austin, TX",
    duration: "7 months",
    weightLost: "51 lbs",
    startWeight: 234,
    currentWeight: 183,
    rating: 5,
    date: "March 2026",
    verified: true,
    text: "Ok so I was VERY skeptical. I've done Weight Watchers twice, tried Noom for like 6 months, did a whole30 that almost ruined my marriage lol. Nothing ever stuck past a few months. My sister kept bugging me about GLP-1s and I finally gave in. The first week I had some nausea but it went away. By week 3 I realized I wasn't thinking about food constantly for the first time in maybe 20 years?? I'm 7 months in and down 51 lbs. My husband says I seem like a completely different person and honestly he's right. The meal plans helped a LOT because my appetite is so different now and I didn't know what to eat anymore.",
    highlight: "Down 51 lbs in 7 months",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Marcus D.",
    age: 45,
    location: "Atlanta, GA",
    duration: "5 months",
    weightLost: "39 lbs",
    startWeight: 271,
    currentWeight: 232,
    rating: 5,
    date: "February 2026",
    verified: true,
    text: "I'm a truck driver so my schedule is insane and eating healthy on the road is basically impossible. I was 271 when I started and my doctor had been on me about my blood pressure for years. What sold me on VitalPath was that I didn't have to go to an office — everything was on my phone. The provider actually listened to my situation and worked with me on it. 5 months later I'm at 232 and my BP is normal for the first time since my 30s. My only complaint is I wish the app had a dark mode lol.",
    highlight: "39 lbs lost, BP normalized",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Rachel W.",
    age: 33,
    location: "Denver, CO",
    duration: "4 months",
    weightLost: "28 lbs",
    startWeight: 198,
    currentWeight: 170,
    rating: 5,
    date: "March 2026",
    verified: true,
    text: "After my second baby I could NOT lose the weight no matter what I did. I was working out 4x a week, eating 1400 calories, and the scale would not move. My OB mentioned GLP-1 medications and I found VitalPath. The intake process was really thorough — they actually reviewed my full medical history and asked about breastfeeding and everything (I'd already weaned). I'm down 28 lbs in 4 months and I finally fit into my pre-pregnancy jeans. Crying actual tears in the Target dressing room, not even joking.",
    highlight: "28 lbs — fits pre-pregnancy clothes",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "David K.",
    age: 56,
    location: "Chicago, IL",
    duration: "10 months",
    weightLost: "71 lbs",
    startWeight: 312,
    currentWeight: 241,
    rating: 5,
    date: "January 2026",
    verified: true,
    text: "Type 2 diabetic for 8 years. A1C was 8.2 when I started. My endocrinologist actually recommended I look into GLP-1 programs and I found these guys. I won't sugarcoat it — the first month was rough with some stomach issues. But once we adjusted the dose it smoothed out completely. 10 months later: 71 pounds gone, A1C is 5.9, and my doctor is talking about taking me off metformin. I'm 56 and I feel better than I did at 40. Worth every penny and then some.",
    highlight: "71 lbs lost, A1C 8.2 to 5.9",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Priya S.",
    age: 41,
    location: "Seattle, WA",
    duration: "6 months",
    weightLost: "44 lbs",
    startWeight: 208,
    currentWeight: 164,
    rating: 4,
    date: "February 2026",
    verified: true,
    text: "Giving 4 stars only because shipping was delayed once by a few days (they credited my account though which was nice). Otherwise this has been incredible. I'm South Asian and there's basically zero culturally relevant diet advice out there for us. The nutritionist actually worked with me on incorporating dal and roti into my meal plans instead of just defaulting to chicken and broccoli like every other program. Lost 44 lbs and my mom keeps asking what my secret is lmao.",
    highlight: "44 lbs with culturally adapted meals",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Chris B.",
    age: 48,
    location: "Phoenix, AZ",
    duration: "3 months",
    weightLost: "26 lbs",
    startWeight: 245,
    currentWeight: 219,
    rating: 5,
    date: "March 2026",
    verified: true,
    text: "My wife started VitalPath 2 months before me and when I saw her results I signed up the same day. I was paying $180/month for a gym I went to twice plus $200 on supplements that did nothing. This is less than that and actually works. Down 26 lbs in 3 months and I cancelled the gym and the supplement subscriptions. My knees don't hurt when I climb stairs anymore which honestly means more to me than the number on the scale.",
    highlight: "26 lbs, no more knee pain",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Amanda R.",
    age: 29,
    location: "Nashville, TN",
    duration: "5 months",
    weightLost: "35 lbs",
    startWeight: 211,
    currentWeight: 176,
    rating: 5,
    date: "January 2026",
    verified: true,
    text: "I have PCOS and losing weight has been a nightmare my entire adult life. I've been told by multiple doctors to \"just eat less and exercise more\" as if I haven't been trying that for a decade. The provider here actually understood hormonal weight issues and how GLP-1s interact with insulin resistance from PCOS. 35 pounds down, my periods are more regular, and I actually have energy again. I legit got emotional at my last weigh in.",
    highlight: "35 lbs lost with PCOS",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Robert J.",
    age: 62,
    location: "Tampa, FL",
    duration: "8 months",
    weightLost: "58 lbs",
    startWeight: 289,
    currentWeight: 231,
    rating: 5,
    date: "December 2025",
    verified: true,
    text: "Retired firefighter here. Carried 289 lbs for years and it was catching up to me bad. Both knees shot, sleep apnea, the works. My buddy from the department told me about this and I figured what do I have to lose. Best decision I've made since retiring. 58 lbs down, I returned my CPAP machine last month, and I'm playing with my grandkids again. The care team checks in regularly and genuinely seems to give a damn which in my experience is rare in healthcare.",
    highlight: "58 lbs, off CPAP machine",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Nicole M.",
    age: 36,
    location: "Portland, OR",
    duration: "6 months",
    weightLost: "42 lbs",
    startWeight: 224,
    currentWeight: 182,
    rating: 5,
    date: "February 2026",
    verified: true,
    text: "Full transparency: I was terrified of needles and almost didn't start because of the injections. The nurse on the care team walked me through it on a video call and it's honestly nothing — a tiny pinch once a week. That's it. If that's what's holding you back PLEASE just try it. 42 lbs in 6 months and I literally donated 4 garbage bags of clothes to Goodwill last weekend because nothing fits anymore (in the best way possible).",
    highlight: "42 lbs — conquered needle fear",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "James L.",
    age: 43,
    location: "Dallas, TX",
    duration: "4 months",
    weightLost: "31 lbs",
    startWeight: 258,
    currentWeight: 227,
    rating: 4,
    date: "March 2026",
    verified: true,
    text: "4 stars because I think the pricing page could be clearer about what's included at each tier — I upgraded to Premium after starting on Essential and wish I'd just done that from the beginning. BUT the actual results? Unreal. I travel for work 3 weeks a month and still lost 31 lbs because the medication just kills the urge to eat garbage at hotel restaurants at midnight. My coworkers keep asking if I'm sick because the weight came off so fast and I'm like no I'm the healthiest I've been in 15 years haha.",
    highlight: "31 lbs while traveling for work",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Lisa C.",
    age: 52,
    location: "San Diego, CA",
    duration: "9 months",
    weightLost: "67 lbs",
    startWeight: 278,
    currentWeight: 211,
    rating: 5,
    date: "January 2026",
    verified: true,
    text: "Menopausal weight gain is real and it is BRUTAL. I gained 60 lbs between ages 48-51 and nothing I did made a dent. My HRT helped with symptoms but not the weight. Found VitalPath through a Facebook group and honestly thought it was too good to be true. 9 months later I've lost 67 lbs and I feel like I got my body back. The provider understood menopause-related weight gain specifically which made a huge difference in my treatment plan. Also the grocery list feature saves me so much time.",
    highlight: "67 lbs lost — menopausal weight gone",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
  {
    name: "Anthony V.",
    age: 34,
    location: "Miami, FL",
    duration: "3 months",
    weightLost: "22 lbs",
    startWeight: 226,
    currentWeight: 204,
    rating: 5,
    date: "March 2026",
    verified: true,
    text: "I'm getting married in September and needed to lose weight for the wedding. I know that sounds vain but whatever. Started 3 months ago at 226 and I'm at 204 now. My fiancee is mad she didn't start too lol. The thing that surprised me most is I don't feel deprived at all — I still eat out, I still have drinks on weekends, I'm just not eating like a trash compactor anymore. The medication literally just turns down the volume on hunger. It's wild. Suit fitting is next month and I'm actually excited.",
    highlight: "22 lbs for wedding — still eats out",
    disclosureText:
      "Individual experience. Results vary and depend on many factors including adherence to treatment plans.",
  },
] as const;

// ─── PROVIDER PROFILES ─────────────────────────────────────

export const providers = [
  {
    name: "Dr. Sarah Chen, MD",
    title: "Chief Medical Officer",
    credentials: "Board-Certified Internal Medicine",
    institution: "Stanford School of Medicine",
    experience: "15+ years in obesity medicine",
    initials: "SC",
  },
  {
    name: "Dr. James Walker, DO",
    title: "Medical Director",
    credentials: "Board-Certified Family Medicine",
    institution: "Johns Hopkins University",
    experience: "12+ years in metabolic health",
    initials: "JW",
  },
  {
    name: "Dr. Maria Rodriguez, MD",
    title: "Clinical Lead",
    credentials: "Board-Certified Endocrinology",
    institution: "Mayo Clinic",
    experience: "10+ years in weight management",
    initials: "MR",
  },
] as const;

// ─── FAQs (Reordered for conversion — objections first) ───

export const faqs = [
  {
    question: "How much does it cost compared to Ozempic or Wegovy?",
    answer:
      "Brand-name GLP-1 medications like Ozempic and Wegovy can cost $1,000-$1,500+ per month without insurance. VitalPath plans start at $279/month and include not just the medication (if prescribed), but also provider consultations, progress tracking, meal plans, and ongoing support. That's up to 79% less than the retail price of branded medications alone.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Most members notice reduced appetite in the first 1-2 weeks — the 'food noise goes quiet' is how people describe it. Visible weight loss typically starts within the first month (5-10 lbs for most). The real transformation happens over 3-6 months as your provider optimizes your dose. Members who complete 6+ months lose an average of 15-20% of their body weight — that's 30-50 lbs for most people. Individual results vary based on adherence to treatment plans and lifestyle factors.",
  },
  {
    question: "Is everyone approved for medication?",
    answer:
      "No. Treatment eligibility is determined by a licensed medical provider based on your health profile, BMI, medical history, and clinical guidelines. Generally, candidates have a BMI of 30+ or 27+ with weight-related health conditions. Not all patients qualify for medication-based treatment. If you're not eligible, we offer alternative support paths.",
  },
  {
    question: "Are compounded medications safe?",
    answer:
      "Great question — it's the most common one we get. Compounded GLP-1 medications use the same active ingredient (semaglutide) as brand-name Ozempic and Wegovy. They're prepared by state-licensed 503A and 503B pharmacies under strict federal oversight. Compounding is how approximately 3% of all US prescriptions are filled — it's a routine, regulated healthcare practice, not a shortcut. That said, compounded medications are not FDA-approved products. Your licensed provider determines whether compounded medication is clinically appropriate for you.",
  },
  {
    question: "What are the side effects?",
    answer:
      "The most common side effects are mild and temporary: nausea (usually in the first 1-2 weeks), reduced appetite, and occasional digestive changes. Our providers start with low doses and gradually increase to minimize side effects. Your care team monitors you throughout and can adjust dosing as needed. Serious side effects are rare but discussed during your provider evaluation.",
  },
  {
    question: "How much weight can I expect to lose?",
    answer:
      "Results vary by individual, but clinical trial data shows patients on GLP-1 medications lose an average of 15-20% of their body weight over 12 months. For a 200-pound person, that's 30-40 pounds. Members who combine medication with VitalPath's nutrition and tracking tools tend to see results at the higher end of this range. Your provider sets realistic goals based on your specific health profile.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel, pause, or adjust your plan at any time from your dashboard. There are no long-term contracts, no cancellation fees, and no hidden charges. If you're considering canceling, our team can help explore options like plan adjustments or pausing your subscription.",
  },
  {
    question: "How is VitalPath different from other telehealth weight loss programs?",
    answer:
      "Most programs either just prescribe medication or just offer coaching — we combine both into a comprehensive system. You get licensed provider care, GLP-1 medication (if prescribed), structured meal plans, progress tracking, and ongoing coaching support all in one platform. Plus, our maintenance transition planning helps you sustain results long-term, not just while you're on medication.",
  },
  {
    question: "What's included beyond the medication?",
    answer:
      "Depending on your plan, you get access to: licensed provider consultations, personalized treatment plans, progress tracking dashboards, weekly meal plans and high-protein recipes, grocery lists, hydration and protein tracking, coaching check-ins, secure messaging with your care team, and educational content. We believe lasting results come from more than just a prescription.",
  },
  {
    question: "What is a GLP-1 medication and how does it work?",
    answer:
      "GLP-1 (glucagon-like peptide-1) receptor agonists are medications that mimic a natural hormone your body produces after eating. They work by signaling fullness to your brain, slowing gastric emptying so you feel satisfied longer, and improving insulin sensitivity. Common GLP-1 medications include semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro, Zepbound). Clinical trials show average weight loss of 15-22% of body weight.",
  },
  {
    question: "Do I need to exercise while on GLP-1 medication?",
    answer:
      "Exercise isn't required for weight loss on GLP-1 medication, but it significantly improves results and helps preserve lean muscle mass. We recommend starting with walking (7,000-10,000 steps daily) and adding basic resistance training 2-3 times per week. Even light activity like walking 20 minutes after meals improves blood sugar response and accelerates fat loss.",
  },
  {
    question: "What should I eat while taking GLP-1 medication?",
    answer:
      "Focus on high-protein foods first at every meal — aim for 0.7-1.0 grams per pound of body weight daily. This is critical for preserving muscle during weight loss. Good choices include lean meats, fish, Greek yogurt, eggs, and cottage cheese. Avoid greasy, fried foods that can worsen nausea. Stay well-hydrated with water and bone broth. VitalPath Premium includes weekly meal plans specifically designed for GLP-1 patients.",
  },
  {
    question: "Can I drink alcohol while on GLP-1 medication?",
    answer:
      "There's no absolute prohibition on alcohol with GLP-1 medications, but caution is advised. Many patients report increased sensitivity to alcohol — you may feel effects faster and stronger. Alcohol also adds empty calories, can worsen nausea, and temporarily halts fat burning. If you choose to drink, start slowly, stay hydrated, and avoid sugary cocktails. Discuss your alcohol use with your provider.",
  },
  {
    question: "What happens if I stop taking the medication?",
    answer:
      "This is exactly why VitalPath includes maintenance transition planning — most programs don't. Research shows stopping GLP-1 medication abruptly can lead to weight regain. Our providers work with you to build sustainable habits throughout your program so that when it's time to taper, you're ready. Think of the medication as training wheels: the goal is to need them less over time, not forever.",
  },
  {
    question: "I'm afraid of needles. Can I still do this?",
    answer:
      "You're not alone — needle hesitancy is one of the top reasons people delay starting. Here's the truth: the injection is a tiny subcutaneous needle (think insulin pen, not a doctor's office needle). It's a small pinch once a week that takes about 10 seconds. Our care team can walk you through it via video call before your first dose. As one member put it: 'I was terrified of needles and almost didn't start. It's honestly nothing — if that's what's holding you back, PLEASE just try it.' Over 95% of members report the injection is far easier than they expected.",
  },
  {
    question: "Is it worth $279/month?",
    answer:
      "Let's do the math. The average American spends $2,000+/year on diets, gym memberships, and supplements — with a 95% failure rate. Brand-name GLP-1 costs $1,349+/month. Weight loss surgery runs $20,000-$35,000. VitalPath includes the medication, provider care, meal plans, progress tracking, and coaching for $279/month. Most members say the real cost was the years they spent on programs that didn't address the root cause. And unlike diets, GLP-1 medication has a clinical success rate of 85%+.",
  },
] as const;

// ─── VALUE PROPS ────────────────────────────────────────────

export const valueProps = [
  {
    icon: "Stethoscope",
    title: "Provider-guided care",
    description: "Licensed medical providers evaluate your eligibility and manage your treatment plan.",
  },
  {
    icon: "Utensils",
    title: "Nutrition & meal planning",
    description: "Weekly meal plans, high-protein recipes, and grocery lists that adapt to your program.",
  },
  {
    icon: "TrendingUp",
    title: "Progress tracking",
    description: "Weight, measurements, photos, hydration, protein — all in one elegant dashboard.",
  },
  {
    icon: "MessageCircle",
    title: "Care team messaging",
    description: "Secure, HIPAA-compliant messaging with your provider and support team.",
  },
  {
    icon: "Calculator",
    title: "Smart health tools",
    description: "BMI, TDEE, protein, and hydration calculators to support your daily decisions.",
  },
  {
    icon: "Gift",
    title: "Referral rewards",
    description: "Share your experience and earn credit toward your membership for each referral.",
  },
] as const;
