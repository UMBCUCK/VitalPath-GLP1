/**
 * VitalPath E2E Test Suite
 * Run against a running dev server: npx tsx scripts/e2e-test.ts
 * Requires: npm run dev running on port 3000
 */

const BASE = process.env.TEST_URL || "http://localhost:3000";
let passed = 0;
let failed = 0;
let cookie = "";

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`  ✗ ${name}: ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Cookie: cookie, ...(opts.headers as Record<string, string> || {}) },
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return { status: res.status, data: await res.json().catch(() => null) };
}

async function run() {
  console.log(`\nVitalPath E2E Test Suite`);
  console.log(`Server: ${BASE}\n`);

  // ─── AUTH ───────────────────────────────────────────────
  console.log("Auth:");

  const testEmail = `e2e_${Date.now()}@test.com`;

  await test("Register new user", async () => {
    const { status, data } = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: testEmail, password: "Test1234!", firstName: "E2E", lastName: "User" }),
    });
    assert(status === 200, `Status ${status}: ${JSON.stringify(data)}`);
    assert(data.user?.email === testEmail, "Email mismatch");
  });

  await test("Login as new user", async () => {
    const { status, data } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: testEmail, password: "Test1234!" }),
    });
    assert(status === 200, `Status ${status}`);
    assert(data.user?.role === "PATIENT", "Not PATIENT role");
  });

  await test("Get current user", async () => {
    const { status, data } = await api("/api/auth/me");
    assert(status === 200, `Status ${status}`);
    assert(data.user?.email === testEmail, "Wrong user");
  });

  await test("Login as admin", async () => {
    const { data } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "admin@vitalpath.com", password: "admin123" }),
    });
    assert(data.user?.role === "ADMIN", "Not ADMIN");
  });

  await test("Login as provider", async () => {
    const { data } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "dr.chen@vitalpath.com", password: "provider1" }),
    });
    assert(data.user?.role === "PROVIDER", "Not PROVIDER");
  });

  await test("Login as demo patient", async () => {
    const { data } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "jordan@example.com", password: "demo1234" }),
    });
    assert(data.user?.role === "PATIENT", "Not PATIENT");
  });

  await test("Rate limiting (login)", async () => {
    // Should not 429 on first few attempts
    const { status } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "bad@email.com", password: "wrong" }),
    });
    assert(status === 401, `Expected 401 got ${status}`);
  });

  // ─── PROGRESS ──────────────────────────────────────────
  console.log("\nProgress:");

  await test("Log progress entry", async () => {
    const { status, data } = await api("/api/progress", {
      method: "POST",
      body: JSON.stringify({ weightLbs: 197.5, proteinG: 125, waterOz: 88, moodRating: 4 }),
    });
    assert(status === 200, `Status ${status}: ${JSON.stringify(data)}`);
    assert(data.entry?.weightLbs === 197.5, "Weight mismatch");
  });

  await test("Fetch progress entries", async () => {
    const { status, data } = await api("/api/progress?days=30");
    assert(status === 200, `Status ${status}`);
    assert(Array.isArray(data.entries), "Not an array");
  });

  // ─── MESSAGES ──────────────────────────────────────────
  console.log("\nMessages:");

  await test("Send message", async () => {
    const { status, data } = await api("/api/messages", {
      method: "POST",
      body: JSON.stringify({ subject: "E2E Test", body: "This is an automated test message." }),
    });
    assert(status === 200, `Status ${status}`);
    assert(data.message?.id, "No message ID");
  });

  await test("Fetch messages", async () => {
    const { status, data } = await api("/api/messages");
    assert(status === 200, `Status ${status}`);
    assert(data.messages?.length > 0, "No messages");
  });

  // ─── NOTIFICATIONS ────────────────────────────────────
  console.log("\nNotifications:");

  await test("Fetch notifications", async () => {
    const { status, data } = await api("/api/notifications");
    assert(status === 200, `Status ${status}`);
    assert(typeof data.unreadCount === "number", "No unreadCount");
  });

  // ─── REFERRALS ────────────────────────────────────────
  console.log("\nReferrals:");

  await test("Fetch referral data", async () => {
    const { status, data } = await api("/api/referrals");
    assert(status === 200, `Status ${status}`);
    assert(data.code, "No referral code");
  });

  // ─── COUPONS ──────────────────────────────────────────
  console.log("\nCoupons:");

  await test("Validate WELCOME20 coupon", async () => {
    const { data } = await api("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code: "WELCOME20", planSlug: "premium" }),
    });
    assert(data.valid === true, "Coupon not valid");
    assert(data.coupon?.valuePct === 20, "Wrong discount");
  });

  await test("Reject invalid coupon", async () => {
    const { data } = await api("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code: "FAKE123" }),
    });
    assert(data.valid === false, "Should be invalid");
  });

  // ─── SEARCH ───────────────────────────────────────────
  console.log("\nSearch:");

  await test("Search for 'protein'", async () => {
    const { data } = await api("/api/search?q=protein");
    const total = Object.values(data.results || {}).flat().length;
    assert(total > 0, `No results (got ${total})`);
  });

  // ─── RECIPES ──────────────────────────────────────────
  console.log("\nRecipes:");

  await test("Fetch recipes", async () => {
    const { data } = await api("/api/recipes");
    assert(data.recipes?.length >= 10, `Only ${data.recipes?.length} recipes`);
  });

  // ─── CHECKOUT ─────────────────────────────────────────
  console.log("\nCheckout:");

  await test("Checkout mock fallback", async () => {
    const { data } = await api("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ planSlug: "premium", interval: "monthly" }),
    });
    assert(data.url?.includes("success"), `No mock URL: ${data.url}`);
  });

  await test("Checkout abandonment tracking", async () => {
    const { data } = await api("/api/checkout/track", {
      method: "POST",
      body: JSON.stringify({ email: "abandon@test.com", planSlug: "premium" }),
    });
    assert(data.ok === true, "Track failed");
  });

  // ─── PROFILE ──────────────────────────────────────────
  console.log("\nProfile:");

  await test("Update profile", async () => {
    const { data } = await api("/api/user/profile", {
      method: "POST",
      body: JSON.stringify({ firstName: "Jordan", lastName: "Updated" }),
    });
    assert(data.ok === true, "Update failed");
  });

  // ─── ADMIN ────────────────────────────────────────────
  console.log("\nAdmin (requires admin login):");

  await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: "admin@vitalpath.com", password: "admin123" }),
  });

  await test("Admin fetch products", async () => {
    const { status, data } = await api("/api/admin/products");
    assert(status === 200, `Status ${status}`);
    assert(data.products?.length >= 9, `Only ${data.products?.length} products`);
  });

  await test("Admin fetch recipes", async () => {
    const { status, data } = await api("/api/admin/recipes");
    assert(status === 200, `Status ${status}`);
    assert(data.recipes?.length >= 10, `Only ${data.recipes?.length}`);
  });

  await test("Admin update settings", async () => {
    const { data } = await api("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ defaultPayoutCents: 5000 }),
    });
    assert(data.ok === true, "Settings update failed");
  });

  // ─── WEBHOOK ──────────────────────────────────────────
  console.log("\nWebhook:");

  await test("Test webhook simulation", async () => {
    const { data } = await api("/api/stripe/test-webhook", { method: "POST" });
    assert(data.success === true, `Webhook failed: ${JSON.stringify(data)}`);
    assert(data.created?.userId, "No user created");
  });

  // ─── LOGOUT ───────────────────────────────────────────
  console.log("\nLogout:");

  await test("Logout", async () => {
    const { data } = await api("/api/auth/logout", { method: "POST" });
    assert(data.ok === true, "Logout failed");
  });

  // ─── RESULTS ──────────────────────────────────────────
  console.log(`\n${"═".repeat(40)}`);
  console.log(`  PASSED: ${passed}`);
  console.log(`  FAILED: ${failed}`);
  console.log(`  TOTAL:  ${passed + failed}`);
  console.log(`${"═".repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => { console.error("Suite error:", e); process.exit(1); });
