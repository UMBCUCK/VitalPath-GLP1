# VitalPath — Premium Telehealth Weight Management Platform

## Quick Start (Local Development)
```bash
npm install
npx prisma db push            # creates SQLite dev.db
npx tsx prisma/seed.ts         # seeds all demo data
npm run dev                    # http://localhost:3000
```

## Demo Credentials
- **Admin:** admin@naturesjourneyhealth.com / Hunter2!
- **Patient:** jordan@example.com / demo1234

## Project Stats
- 124 source files, 47 pages, 16 API routes
- 32 Prisma models, 24 components, 15 lib modules
- Live SQLite database with ~250 seeded records
- Zero console errors across all routes

## Architecture

### Stack
- Next.js 15 (App Router), React 19, TypeScript (strict)
- Tailwind CSS 3.4, shadcn/ui components, Framer Motion, Recharts
- Prisma ORM — SQLite (local dev) / PostgreSQL (production)
- Stripe subscriptions, React Hook Form + Zod, bcryptjs + jose

### Directory Structure
```
app/
  page.tsx                    # Homepage with 9 marketing sections
  admin/                      # Admin panel (12 pages, requireAdmin gate)
    analytics/                # Revenue charts, funnel, metrics from DB
    claims/                   # Claim engine with approval workflow
    coupons/                  # Coupon CRUD with validation API
    customers/                # Real customer data with intake queue
    meal-plans/               # Weekly meal plan builder
    products/                 # Product catalog with inline editing
    recipes/                  # Recipe CMS with nutrition data
    referrals/                # Referral leaderboard and conversions
    settings/                 # Vendor config, feature flags, compliance
    states/                   # State availability toggle grid
    blog/                     # Blog CMS with publish toggles
  dashboard/                  # Patient dashboard (7 pages, requireAuth gate)
    progress/                 # Recharts weight/measurement charts from DB
    treatment/                # Medication, provider, refill, shipment tracking
    meals/                    # Recipe cards, grocery lists, favorites
    messages/                 # Threaded HIPAA-compliant messaging
    photos/                   # Progress photo gallery with compare mode
    referrals/                # Referral link, invite, earnings tracker
    settings/                 # Account, notifications, cancellation save flow
  api/                        # 16 REST endpoints
    auth/{login,register,logout,me}/
    stripe/{checkout,webhook,test-webhook}/
    {lead,intake,progress,referrals,notifications,messages,photos,recipes}/
    coupons/validate/
  (marketing pages)           # 20 pages with MarketingShell wrapper
    pricing, how-it-works, faq, eligibility, results, referrals,
    states, maintenance, meals, blog, blog/[slug], compare/[slug],
    calculators/{bmi,tdee,protein,hydration}, legal/{terms,privacy,hipaa}
  checkout/                   # In-app checkout with plan selector + coupon
  quiz/                       # 4-step assessment with plan recommendation
  intake/                     # 3-step medical intake with contraindication screening
  success/                    # Post-checkout with upsell modal
  login, register/            # Auth pages
components/
  ui/                         # Button, Card, Badge, Input, Progress
  marketing/                  # Hero, Trust, Process, Pricing, FAQ, CTA, BillingToggle
  layout/                     # SiteHeader, SiteFooter, MarketingShell, MobileStickyCta
  shared/                     # SectionShell, SectionHeading, Disclaimer
  seo/                        # OrganizationJsonLd, FAQPageJsonLd, ArticleJsonLd
  checkout/                   # UpsellModal
  dashboard/                  # NotificationBell
lib/
  auth.ts                     # JWT auth with bcryptjs + jose
  db.ts                       # Prisma client singleton
  stripe.ts                   # Stripe server instance
  analytics.ts                # PostHog + GA4 + Meta CAPI event tracking (40+ events)
  dashboard-data.ts           # 6 parallel DB queries for dashboard
  admin-data.ts               # Admin dashboard/customer/product queries
  pricing.ts, content.ts, funnel.ts, site.ts, utils.ts
  services/
    telehealth.ts             # OpenLoop/Wheel/mock adapter
    pharmacy.ts               # 503A/503B/brand/mock adapter
    email.ts                  # Resend/mock adapter
    lifecycle-emails.ts       # Welcome, abandonment, refill, milestone, save offer
middleware.ts                 # Route protection for /dashboard/* and /admin/*
```

### Auth System
Custom JWT auth. Passwords hashed with bcryptjs (12 rounds). Sessions stored as httpOnly cookies (`vp-session`), signed with jose HS256. Middleware protects dashboard (requires auth) and admin (requires ADMIN role).

### Vendor Abstraction
Telehealth, pharmacy, and email services use adapter pattern with mock implementations for local dev. Swap by setting env vars: `TELEHEALTH_VENDOR`, `PHARMACY_VENDOR`, `RESEND_API_KEY`.

### Compliance
- **Claim Engine**: 6 categories, approval workflow, risk levels, channel restrictions, footnote/modal/legal/medical review flags
- Copy follows safe high-converting patterns — no fake scarcity, unverified claims, or FDA implications
- Compounded medications clearly distinguished from branded drugs
- Eligibility framed as provider-determined throughout
- HIPAA consent, telehealth consent, treatment consent in intake
- JSON-LD MedicalBusiness schema on homepage

## Env Vars
See `.env.example` for all 30+ variables. Only `DATABASE_URL` and `NEXTAUTH_SECRET` required for local dev.

## Deploying to Vercel

### 1. Switch to PostgreSQL
```bash
# Option A: Use the pre-made PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Option B: Manual edit
# Change provider = "sqlite" to provider = "postgresql" in prisma/schema.prisma
```

### 2. Set up database
Create a PostgreSQL database on Neon (neon.tech) or Supabase (supabase.com). Copy the connection string.

### 3. Configure Vercel
Set these environment variables in Vercel dashboard:
```
DATABASE_URL=postgresql://...        # From Neon/Supabase
NEXTAUTH_SECRET=<generate-a-secret>  # openssl rand -base64 32
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 4. Deploy
```bash
npx vercel
# Or connect GitHub repo to Vercel for automatic deploys
```

### 5. Initialize production database
```bash
DATABASE_URL=postgresql://... npx prisma db push
DATABASE_URL=postgresql://... npx tsx prisma/seed.ts
```

### 6. Stripe webhook
Add your Vercel URL as a Stripe webhook endpoint:
- URL: `https://your-domain.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

## Testing the Full Flow
```bash
# Dev-only: simulate a checkout.session.completed webhook
curl -X POST http://localhost:3000/api/stripe/test-webhook
# Creates: User + PatientProfile + Subscription + Order + Notification
```

## Key Design Decisions
- **MarketingShell pattern**: Marketing pages wrap with header/footer, dashboard/admin have isolated layouts
- **Server components**: Dashboard and admin pages fetch data server-side for zero waterfall
- **Progressive enhancement**: Quiz/intake work with JavaScript, persist to localStorage, then submit to DB
- **Dual database**: SQLite for zero-config local dev, PostgreSQL for production (one line change)
