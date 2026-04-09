# VitalPath Demo Walkthrough

**Duration:** ~10 minutes
**Credentials:**
- Patient: `jordan@example.com` / `demo1234`
- Admin: `admin@vitalpath.com` / `admin123`
- Provider: `dr.chen@vitalpath.com` / `provider1`

---

## Investor Quick Pitch (30 seconds)

> VitalPath is a premium recurring-revenue telehealth platform for weight management. We're not just selling medication — we're selling a complete system: provider-guided care + meal plans + coaching + tracking + supplements + referrals. Our average plan is $397/month with 6 upsellable add-ons. Annual plans lock in 20% higher LTV. The smart upsell engine recommends add-ons based on actual user behavior (e.g., low protein → meal plans). We have 5 automated lifecycle campaigns recovering churned users and abandoned carts. The claim engine ensures every marketing statement is compliance-reviewed before publish. Vendor-agnostic architecture lets us swap telehealth, pharmacy, and email providers without touching business logic.

---

## Part 1: Marketing Site (2 min)

### Homepage
1. Open **/** — the homepage shows a premium medical-trust design
2. **Talking points:** Hero with provider-guided messaging, trust bar (5 badges), 4-step process, 6 value props, 3 pricing tiers, calculator preview, testimonials with disclosure, FAQ accordion
3. Note the **search bar** in the header (Cmd+K to open)
4. Note the **JSON-LD structured data** (MedicalBusiness schema)

### Key Marketing Pages
5. Click **Pricing** — 3 tiers with feature comparison table + 6 add-ons
6. Visit **/calculators/bmi** — enter 5'8", 210 lbs to see BMI result with category
7. Visit **/blog** — 10 articles from database with category badges
8. Visit **/compare** — 5 competitor comparison pages from database
9. Visit **/states** — 24 available states with interactive grid
10. Visit **/eligibility** — who qualifies + contraindication screening info

---

## Part 2: Patient Funnel (2 min)

### Quiz Flow
11. Click **"Take the Assessment"** from homepage
12. Walk through 4 steps: weight range, goals, eating habits, support preferences
13. The recommendation engine scores answers and suggests a plan

### Checkout
14. Visit **/checkout?plan=premium** — shows billing toggle (Monthly / Quarterly / Annual)
15. Note savings badges: "Save 10%" quarterly, "Save 20%" annual
16. Type **WELCOME20** in promo code — validates against real database, shows 20% off
17. Add-ons are selectable with live order summary

---

## Part 3: Patient Dashboard (3 min)

### Login
18. Go to **/login** — sign in as `jordan@example.com` / `demo1234`
19. Dashboard shows: "Welcome, Jordan!" with real weight progress bar

### Progress
20. Click **Progress** — 2 Recharts (weight trend + measurements) from 91 real entries
21. Click **"Log Today"** — quick log form for weight, protein, water, mood
22. The daily log table shows recent entries with protein/water targets

### Treatment
23. Click **Treatment** — shows "Compounded Semaglutide 0.5mg" from Dr. Sarah Chen
24. Next refill date, check-in date, dose titration timeline, shipment tracking

### Meals & Recipes
25. Click **Meals & Recipes** — 12 real recipes from database
26. Click any recipe card to expand — shows ingredients, step-by-step instructions, macros
27. Toggle **"Grocery List"** — aggregated ingredients with checkboxes
28. Category filter: Breakfast, Lunch, Dinner, Snack, Smoothie

### Weekly Check-In
29. Click **Check-In** — 4-step flow: weight, mood/energy, medication, questions
30. Submits to progress API + sends care team message

### Other Dashboard Pages
31. **Messages** — threaded conversation view with care team
32. **Photos** — progress photo gallery with before/after compare mode
33. **Referrals** — unique referral link (VP-JORDAN42), earnings tracker, invite form
34. **Settings** — account info, notifications, cancellation save flow (3 save offers)
35. Note **notification bell** in header with unread count

---

## Part 4: Admin Panel (3 min)

### Login
36. Go to **/login** — sign in as `admin@vitalpath.com` / `admin123`
37. Admin sidebar shows 16 pages

### Analytics & Revenue
38. Click **Analytics** — revenue chart + conversion funnel from real database
39. Click **Revenue** — LTV, ARPU, MRR, plan mix pie chart, coupon ROI
40. Click **Retention** — cohort chart, feature adoption rates, churn risk indicators

### Content Management
41. Click **Products** — 9 products from database with inline editing + active toggle
42. Click **Customers** — real patient list with intake status, subscription status, weight lost
43. Click **Claims Engine** — 3 marketing claims with approval workflow, risk levels, channel controls
44. Click **Recipes** — 12 recipes with nutrition data, difficulty, tier access
45. Click **Blog** — 10 articles with publish toggles
46. Click **Coupons** — 3 coupons (WELCOME20, LAUNCH50, FREEMONTH)
47. Click **States** — 50-state toggle grid (24 currently available)

### Advanced
48. Click **SEO Pipeline** — 8 topic suggestions with keyword volume + internal link map
49. Click **Meal Plans** — weekly meal plan builder with recipe dropdowns
50. Click **Emails** — 9 lifecycle email templates rendered with live preview
51. Click **Settings** — vendor config, feature flags, compliance toggles, referral tier payouts

---

## Key Selling Points to Highlight

- **Compliance-first:** Claim engine, FDA disclaimers, "medication, if prescribed" language throughout
- **Beyond medication:** Meal plans, recipes, coaching, tracking — not just a prescription funnel
- **Real database:** Everything shown is from actual DB records, not mocked
- **Swappable vendors:** Telehealth (OpenLoop/Wheel), pharmacy (503A/503B), email (Resend) — all adapter pattern
- **Revenue layers:** 3 tiers + 6 add-ons + referrals + coupons + annual upsell
- **Retention system:** Onboarding checklist, weekly check-ins, cancellation save flow (pause/downgrade/discount)
- **SEO ready:** Dynamic sitemap, JSON-LD, blog, comparison pages, calculator hub

## Technical Highlights

- Next.js 15 App Router with server components
- 149 source files, 54 pages, 20 API routes
- 32 Prisma models, SQLite local / PostgreSQL production
- JWT auth with bcrypt + middleware route protection
- Rate limiting, HSTS, CSP security headers
- A/B testing infrastructure + Web Vitals monitoring
- Lifecycle email trigger API (cron-ready)
- PWA manifest for mobile installability
