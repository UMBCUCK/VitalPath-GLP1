#!/bin/bash
# Switch back to SQLite for local development
# Usage: bash scripts/switch-to-sqlite.sh

set -e

echo "Switching to SQLite..."
sed -i 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
echo "✓ Schema switched to SQLite"
echo ""
echo "Make sure .env has: DATABASE_URL=\"file:./dev.db\""
echo "Then run: npx prisma db push && npx tsx prisma/seed.ts"
