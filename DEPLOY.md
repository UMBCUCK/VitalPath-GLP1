# VitalPath Production Deployment Guide

## Prerequisites
- [Vercel account](https://vercel.com) (free tier works)
- [Neon account](https://neon.tech) (free tier: 512MB storage)
- [Stripe account](https://dashboard.stripe.com) (test mode)
- [Resend account](https://resend.com) (free tier: 100 emails/day)
- Git repository (push this project to GitHub first)

---

## Step 1: Create Neon Database (2 min)

1. Go to [neon.tech](https://neon.tech) → Create Project
2. Name: `vitalpath-prod`
3. Region: `US East (Ohio)` (matches Vercel iad1)
4. Copy the connection string — looks like:
   ```
   postgresql://neondb_owner:AbCdEf123@ep-cool-river-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Switch to PostgreSQL & Push Schema (2 min)

```bash
# Switch schema
bash scripts/switch-to-postgres.sh

# Set the Neon URL
export DATABASE_URL='postgresql://...your-neon-url...'

# Generate client + push schema
npx prisma generate
npx prisma db push

# Seed data
npx tsx prisma/seed.ts
```

Expected output:
```
Seeded: admin, patient, 91 progress, 24 states, 9 products, 12 recipes, 3 claims, treatment plan, 3 coupons, 10 blog posts, 5 comparisons, mock Stripe IDs
```

## Step 3: Create Stripe Products (2 min)

```bash
# Get your Stripe TEST secret key from: https://dashboard.stripe.com/test/apikeys
export STRIPE_SECRET_KEY='sk_test_...'

# Create products + prices in Stripe, store IDs in database
npx tsx scripts/create-stripe-products.ts
```

This creates 9 products with monthly/quarterly/annual prices and stores the real price IDs in your Neon database.

## Step 4: Deploy to Vercel (3 min)

### Option A: CLI
```bash
npx vercel
```

### Option B: GitHub (recommended)
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Next.js

### Set Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | Your Neon connection string | Yes |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` output | Yes |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Yes |
| `STRIPE_SECRET_KEY` | `sk_test_...` from Stripe | For checkout |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` from Stripe | For checkout |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook setup | For webhooks |
| `RESEND_API_KEY` | `re_...` from Resend | For emails |
| `EMAIL_FROM` | `care@yourdomain.com` | For emails |
| `CRON_SECRET` | Any random string | For lifecycle |

### Trigger Redeploy
After setting env vars, redeploy for them to take effect.

## Step 5: Set Up Stripe Webhook (1 min)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Signing Secret → add as `STRIPE_WEBHOOK_SECRET` env var

## Step 6: Set Up Resend (1 min)

1. Go to [resend.com](https://resend.com) → API Keys
2. Create an API key → add as `RESEND_API_KEY`
3. For production email: add and verify your domain in Resend
4. For testing: Resend provides a sandbox domain

## Step 7: Production Smoke Test

Visit your live URL and run through:

```
✓ Homepage loads with all sections
✓ Login: admin@vitalpath.com / admin123
✓ Admin dashboard shows real metrics
✓ Admin analytics has charts
✓ Login: jordan@example.com / demo1234
✓ Dashboard shows "Welcome, Jordan!" with real progress
✓ Progress page has 2 Recharts with real data
✓ Meals page shows 12 recipes from DB
✓ Treatment shows Dr. Sarah Chen + Semaglutide
✓ Checkout → Stripe hosted page (test mode)
✓ Blog shows 10 articles from DB
✓ Calculators (BMI, TDEE) work
✓ Mobile: zero overflow at 375px
```

## Step 8: Custom Domain (optional)

1. Vercel Dashboard → Domains → Add
2. Add your domain + configure DNS
3. Update `NEXT_PUBLIC_APP_URL` to match
4. Redeploy

## Step 9: Monitoring

- **Vercel Analytics**: Enable in Vercel Dashboard → Analytics
- **PostHog**: Set `NEXT_PUBLIC_POSTHOG_KEY` for event tracking
- **Web Vitals**: Already instrumented via `lib/web-vitals.ts`

---

## Ongoing Operations

### Database Migrations
```bash
# After schema changes:
npx prisma db push     # for development
npx prisma migrate dev # for versioned migrations
```

### HIPAA Data Export
```bash
npx tsx scripts/export-user-data.ts user@example.com
# Exports all user data to exports/ directory
```

### Switching Back to Local Dev
```bash
bash scripts/switch-to-sqlite.sh
# Edit .env: DATABASE_URL="file:./dev.db"
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

### Lifecycle Email Crons
Configured in `vercel.json`:
- **6:00 AM UTC**: Refill reminders (7 days before next refill)
- **10:00 AM UTC**: Milestone checks (5/10/15/20/25/30/40/50 lb milestones)
- **2:00 PM UTC**: Quiz abandonment recovery (24hr after start)

Protected by `X-Cron-Secret` header — set `CRON_SECRET` env var.

---

## Credentials

| Account | Email | Password | Role |
|---------|-------|----------|------|
| Admin | admin@vitalpath.com | admin123 | ADMIN |
| Demo Patient | jordan@example.com | demo1234 | PATIENT |

**Change these passwords before real launch.**

## Security Checklist

- [x] JWT auth with bcrypt (12 rounds) + httpOnly cookies
- [x] Middleware route protection (dashboard → auth, admin → ADMIN role)
- [x] Rate limiting on /api/auth/login (5/min per IP)
- [x] HSTS header (production only)
- [x] CSP header with Stripe/PostHog/GA4 whitelist (production only)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] X-Powered-By removed
- [x] FLoC opt-out
- [ ] Change demo passwords to strong random values
- [ ] Enable Vercel DDoS protection
- [ ] Set up database backup schedule in Neon
