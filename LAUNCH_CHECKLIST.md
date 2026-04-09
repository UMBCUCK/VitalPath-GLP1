# VitalPath v1.0 Launch Checklist

## Pre-Launch (Must Complete)

### Database
- [ ] Create Neon PostgreSQL database (neon.tech)
- [ ] Switch schema: `bash scripts/switch-to-postgres.sh`
- [ ] Push schema: `npx prisma db push`
- [ ] Seed data: `npx tsx prisma/seed.ts`
- [ ] **Change demo passwords** (admin123, demo1234, provider1) to strong random values
- [ ] Set up Neon database branching for staging

### Stripe
- [ ] Create Stripe test account or switch to live mode
- [ ] Run: `npx tsx scripts/create-stripe-products.ts` (creates 9 products + prices)
- [ ] Set env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- [ ] Set `STRIPE_WEBHOOK_SECRET` from Stripe dashboard
- [ ] Test full checkout flow end-to-end

### Email
- [ ] Create Resend account (resend.com)
- [ ] Add and verify sending domain
- [ ] Set `RESEND_API_KEY` and `EMAIL_FROM`
- [ ] Send test welcome email — verify HTML rendering
- [ ] Preview all 9 templates at /admin/email-preview

### Deployment
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Set all environment variables (see DEPLOY.md)
- [ ] Set `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Set `NEXTAUTH_SECRET` (run: `openssl rand -base64 32`)
- [ ] Set `CRON_SECRET` for lifecycle triggers
- [ ] Trigger first deploy
- [ ] Verify homepage loads on production URL

### Domain
- [ ] Add custom domain to Vercel
- [ ] Configure DNS (CNAME or A record)
- [ ] Verify SSL certificate is active
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Verify sitemap.xml uses correct domain

## Security Review

- [ ] All demo passwords changed
- [ ] HSTS header active (check: `curl -I https://yourdomain.com`)
- [ ] CSP header active
- [ ] Rate limiting working on /api/auth/login
- [ ] Admin routes return 403 for non-admin
- [ ] Dashboard routes redirect to /login for unauthenticated
- [ ] Provider routes require PROVIDER role
- [ ] Cookies have Secure flag on HTTPS
- [ ] No API keys in client-side code
- [ ] HIPAA BAA signed with hosting provider

## Compliance Review

- [ ] Claim engine has all marketing claims reviewed and approved
- [ ] FDA disclaimer visible on all medication-related pages
- [ ] "Compounded medications are not FDA-approved" — prominent
- [ ] "Medication, if prescribed" qualifier used consistently
- [ ] Eligibility framed as provider-determined
- [ ] Results gallery has disclosure on every testimonial
- [ ] HIPAA Notice of Privacy Practices published
- [ ] Terms of Service reviewed by legal
- [ ] Privacy Policy reviewed by legal
- [ ] Telehealth consent form reviewed by legal

## Monitoring

- [ ] Enable Vercel Analytics (Web Vitals)
- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` for event tracking
- [ ] Verify PostHog receives page_view events
- [ ] Set up error alerting (Vercel → Slack/email)
- [ ] Test lifecycle crons fire correctly

## Smoke Test (Production)

- [ ] Homepage loads with all sections
- [ ] Quiz flow completes (4 steps)
- [ ] Intake form submits
- [ ] Checkout → Stripe → Success page
- [ ] Login as patient → dashboard shows real data
- [ ] Login as admin → analytics shows data
- [ ] Login as provider → patients list
- [ ] Blog shows articles
- [ ] Calculators work (BMI, TDEE, Protein, Hydration)
- [ ] Mobile: zero overflow at 375px
- [ ] Search (Cmd+K) returns results
- [ ] Coupon WELCOME20 validates

## Post-Launch

- [ ] Monitor error rate for 24 hours
- [ ] Check Stripe webhook delivery success rate
- [ ] Verify email delivery (Resend dashboard)
- [ ] Review Web Vitals scores
- [ ] Set up weekly database backup
- [ ] Plan first content update (blog + recipes)
