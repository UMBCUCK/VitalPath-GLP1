#!/bin/bash
# Switch VitalPath from SQLite to PostgreSQL for production deployment
# Usage: bash scripts/switch-to-postgres.sh

set -e

echo "Switching to PostgreSQL..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma
echo "✓ Schema switched to PostgreSQL"

echo ""
echo "Now set your DATABASE_URL and run:"
echo "  export DATABASE_URL='postgresql://user:pass@host/db?sslmode=require'"
echo "  npx prisma generate"
echo "  npx prisma db push"
echo "  npx tsx prisma/seed.ts"
echo "  npx tsx scripts/create-stripe-products.ts  # optional"
echo "  npm run build"
