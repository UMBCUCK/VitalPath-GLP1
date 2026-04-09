# VitalPath API Documentation

Base URL: `http://localhost:3000` (dev) or your Vercel deployment URL

## Authentication

All protected routes require a `vp-session` cookie (set automatically on login/register).

### POST /api/auth/register
Create new account. Sets session cookie.
```json
{ "email": "user@example.com", "password": "min8chars", "firstName": "Jane", "lastName": "Doe" }
→ { "user": { "id": "...", "email": "...", "role": "PATIENT" } }
```

### POST /api/auth/login
Sign in. Rate limited: 5/min per IP.
```json
{ "email": "user@example.com", "password": "..." }
→ { "user": { "id": "...", "email": "...", "role": "PATIENT|ADMIN|PROVIDER" } }
```

### POST /api/auth/logout
Destroys session cookie. → `{ "ok": true }`

### GET /api/auth/me
Returns current user. 401 if not authenticated.
→ `{ "user": { "id", "email", "firstName", "lastName", "role", "profile" } }`

## Patient APIs (require auth)

### POST /api/progress
Log daily progress. Auto-calculates BMI if weight provided.
```json
{ "weightLbs": 198, "proteinG": 125, "waterOz": 88, "moodRating": 4, "medicationTaken": true }
→ { "entry": { "id": "...", ... } }
```

### GET /api/progress?days=90
Fetch progress entries for the last N days.

### POST /api/messages
Send message to care team.
```json
{ "subject": "Question", "body": "Message text..." }
→ { "message": { "id": "..." } }
```

### GET /api/messages
Fetch messages + unread count. → `{ "messages": [...], "unreadCount": 3 }`

### GET /api/notifications
Fetch notifications. → `{ "notifications": [...], "unreadCount": 5 }`

### PATCH /api/notifications
Mark notifications as read.
```json
{ "ids": "all" }  // or { "ids": ["id1", "id2"] }
```

### GET /api/referrals
Get referral code, history, earnings. Auto-creates code if none exists.

### POST /api/referrals
Send referral invite. `{ "email": "friend@example.com" }`

### POST /api/user/profile
Update profile. `{ "firstName": "Jane", "lastName": "Doe", "phone": "555-0123" }`

### POST /api/subscription/cancel
Cancel active subscription. Sends save offer email.

### POST /api/subscription/pause
Pause subscription. `{ "months": 1 }` (max 3)

### POST /api/subscription/upgrade
Change plan. `{ "targetPlanSlug": "complete" }`

### GET /api/photos
List user's progress photos.

### POST /api/photos
Upload photo (multipart form data). Fields: `file` (image), `type` (FRONT|SIDE|BACK)

## Public APIs

### POST /api/intake
Submit medical intake (creates user if needed, triggers telehealth service).
Full IntakeValues schema — see `lib/funnel.ts`.

### POST /api/lead
Capture lead. `{ "email": "...", "name": "...", "source": "footer" }`

### GET /api/recipes
List published recipes. Optional: `?category=BREAKFAST`

### GET /api/search?q=protein
Search blog posts, recipes, FAQs, pages. Returns categorized results.

### POST /api/coupons/validate
Validate coupon code. `{ "code": "WELCOME20", "planSlug": "premium" }`
→ `{ "valid": true, "coupon": { "code", "type", "valuePct", "firstMonthOnly" } }`

### POST /api/checkout/track
Track checkout abandonment. `{ "email": "...", "planSlug": "premium" }`

## Stripe

### POST /api/stripe/checkout
Create checkout session. Reads prices from Product table.
```json
{ "planSlug": "premium", "interval": "monthly|quarterly|annual", "addOnSlugs": ["meal-plans"], "email": "..." }
→ { "url": "https://checkout.stripe.com/..." }  // or mock URL if no Stripe key
```

### POST /api/stripe/webhook
Stripe webhook handler. Events: checkout.session.completed, subscription.*, invoice.*

### POST /api/stripe/test-webhook
DEV ONLY. Simulates checkout completion. Creates User + Subscription + Order.

## Admin APIs (require ADMIN role)

### GET/POST/PUT/DELETE /api/admin/products
Full CRUD for products. PUT: `{ "id": "...", "name": "...", "priceMonthly": 39700 }`

### GET/POST/PUT /api/admin/recipes
Recipe management. POST creates, PUT updates.

### PUT /api/admin/settings
Update referral settings. `{ "defaultPayoutCents": 5000, "payoutType": "CREDIT" }`

### POST /api/admin/intakes/approve
Provider approves intake. `{ "intakeId", "userId", "medication": { "medicationName", "dose", "frequency" } }`

### POST /api/admin/intakes/deny
Provider denies intake. `{ "intakeId": "..." }`

## Lifecycle (cron-triggered)

### POST /api/lifecycle?trigger=refill_reminders
Sends reminders 7 days before next refill.

### POST /api/lifecycle?trigger=milestone_check
Checks weight loss milestones (5/10/15/20/25/30/40/50 lbs).

### POST /api/lifecycle?trigger=quiz_abandonment
Sends recovery emails 24hr after quiz start without completion.

### POST /api/lifecycle?trigger=reactivation
Win-back emails for users canceled 30-90 days ago.

### POST /api/lifecycle?trigger=checkout_abandonment
Recovery emails for checkout visitors who didn't purchase.

Protected by `X-Cron-Secret` header in production.
