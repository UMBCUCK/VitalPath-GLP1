#!/bin/bash
# VitalPath Deployment Script
# Run: bash scripts/deploy.sh

set -e

echo "🚀 VitalPath Deployment"
echo "========================"
echo ""

# Step 1: Switch to PostgreSQL
echo "1. Switching schema to PostgreSQL..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma
echo "   ✓ Schema switched to PostgreSQL"

# Step 2: Generate Prisma client
echo "2. Generating Prisma client..."
npx prisma generate
echo "   ✓ Client generated"

# Step 3: Push schema to database
echo "3. Pushing schema to database..."
npx prisma db push
echo "   ✓ Schema pushed"

# Step 4: Seed database
echo "4. Seeding database..."
npx tsx prisma/seed.ts
echo "   ✓ Database seeded"

# Step 5: Create Stripe products (if STRIPE_SECRET_KEY is set)
if [ -n "$STRIPE_SECRET_KEY" ]; then
  echo "5. Creating Stripe products..."
  npx tsx scripts/create-stripe-products.ts
  echo "   ✓ Stripe products created"
else
  echo "5. Skipping Stripe (no STRIPE_SECRET_KEY)"
fi

# Step 6: Build
echo "6. Building for production..."
npm run build
echo "   ✓ Build complete"

echo ""
echo "✅ Deployment ready!"
echo ""
echo "Next steps:"
echo "  1. Set environment variables on Vercel"
echo "  2. Run: npx vercel --prod"
echo "  3. Add Stripe webhook: https://your-domain/api/stripe/webhook"
echo ""
echo "Demo credentials:"
echo "  Admin:   admin@vitalpath.com / admin123"
echo "  Patient: jordan@example.com / demo1234"
