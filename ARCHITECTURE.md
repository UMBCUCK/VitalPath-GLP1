# VitalPath Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  Marketing ← MarketingShell (header/footer)                  │
│  Dashboard ← Dashboard layout (sidebar/bell/badges)          │
│  Admin     ← Admin layout (sidebar)                          │
│  Provider  ← Provider layout (sidebar)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ fetch() / form submissions
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP ROUTER                        │
│                                                              │
│  Middleware ──── JWT verification ──── Route protection       │
│   /dashboard/* → requires auth                               │
│   /admin/*     → requires ADMIN                              │
│   /provider/*  → requires PROVIDER or ADMIN                  │
│                                                              │
│  Server Components ──── Direct Prisma queries (no waterfall)  │
│  Client Components ──── fetch() to API routes                │
│  API Routes ──── 28 endpoints (auth, CRUD, Stripe, lifecycle)│
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Prisma  │ │ Services │ │ Stripe   │
    │  ORM     │ │  Layer   │ │  SDK     │
    │          │ │          │ │          │
    │ 32 models│ │Telehealth│ │Checkout  │
    │ SQLite/  │ │Pharmacy  │ │Webhooks  │
    │ Postgres │ │Email     │ │Subscript.│
    └────┬─────┘ └────┬─────┘ └──────────┘
         │            │
         ▼            ▼
    ┌──────────┐ ┌──────────────────────┐
    │ Database │ │   External Services   │
    │ SQLite/  │ │ OpenLoop (telehealth) │
    │ Neon PG  │ │ Pharmacy (503A/503B)  │
    │          │ │ Resend (email)        │
    └──────────┘ │ PostHog (analytics)   │
                 │ GA4 / Meta CAPI       │
                 └──────────────────────┘
```

## User Flows

```
ACQUISITION:
  Homepage → Quiz (4 steps) → Plan Recommendation → Pricing
       ↓                                              ↓
  Calculator Hub (SEO)                          Checkout Page
  Blog (10 posts, SEO)                    ↓               ↓
  Comparison Pages (5, SEO)         Stripe Hosted    Mock Fallback
                                    Checkout          (/success)
                                         ↓
                                    Webhook fires
                                         ↓
                                    User + Subscription + Order created
                                         ↓
                                    Welcome email sent
                                         ↓
                                    Dashboard (onboarding checklist)

TREATMENT:
  Intake Form (3 steps) → IntakeSubmission in DB
       ↓
  Provider Reviews (Approve/Deny)
       ↓ (approve)
  TreatmentPlan created → Medication prescribed
       ↓
  Pharmacy order → Shipment tracking
       ↓
  Refill reminders (cron) → Dose adjustments (messaging)

RETENTION:
  Dashboard → Progress logging → Streak badges
       ↓
  Smart upsell engine (6 rules) → Contextual add-on offers
       ↓
  Milestone sharing → Social proof
       ↓
  Weekly check-in → Care team messaging
       ↓
  Cancellation → Save flow (pause/downgrade/discount)
       ↓ (if canceled)
  Win-back campaign (30-90 days later)
```

## Data Model (32 tables)

```
Users & Auth:        User, Session, PatientProfile
Funnel:              QuizSubmission, IntakeSubmission, Lead
Products:            Product, BundleItem
Subscriptions:       Subscription, SubscriptionItem
Orders:              Order, OrderItem, UpsellOffer
Treatment:           TreatmentPlan
Tracking:            ProgressEntry, ProgressPhoto
Content:             Recipe, MealPlan, MealPlanItem, BlogPost, ComparisonPage
Social:              ResultStory, Message, Notification
Referrals:           ReferralCode, Referral, Coupon
Compliance:          Claim, StateAvailability
Config:              CalculatorSetting, ReferralSetting
Analytics:           AnalyticsEvent, AdminAuditLog
```

## Service Abstraction

All external services use adapter pattern with mock fallback:

```typescript
// lib/services/telehealth.ts
createTelehealthService()  // returns OpenLoopAdapter or MockAdapter
// lib/services/pharmacy.ts
createPharmacyService()    // returns GenericAdapter or MockAdapter
// lib/services/email.ts
createEmailService()       // returns ResendAdapter or MockAdapter
```

Switch by setting env vars: `TELEHEALTH_VENDOR`, `PHARMACY_VENDOR`, `RESEND_API_KEY`

## Cron Jobs (Vercel)

| Schedule | Trigger | Action |
|----------|---------|--------|
| Daily 6am UTC | refill_reminders | Email + notification 7 days before refill |
| Daily 10am UTC | milestone_check | Check 5/10/15/.../50 lb milestones |
| Daily 2pm UTC | quiz_abandonment | Recovery email 24hr after quiz start |
| Monday 8am UTC | reactivation | Win-back for 30-90 day churned users |
| Every 4hr | checkout_abandonment | Recovery for checkout visitors |
