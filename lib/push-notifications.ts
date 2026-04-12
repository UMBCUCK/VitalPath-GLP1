import { db } from "@/lib/db";

// ─── Subscribe to Push ─────────────────────────────────────
export async function subscribeToPush(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  deviceInfo?: string
) {
  return db.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      isActive: true,
      deviceInfo: deviceInfo || null,
    },
    update: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      isActive: true,
      deviceInfo: deviceInfo || null,
    },
  });
}

// ─── Unsubscribe ───────────────────────────────────────────
export async function unsubscribeFromPush(endpoint: string) {
  return db.pushSubscription.updateMany({
    where: { endpoint },
    data: { isActive: false },
  });
}

// ─── Send Push Notification ────────────────────────────────
// Stores notification in DB for the user. In production, integrate with web-push
// library or a push service (Firebase, OneSignal, etc.) to send the actual push
// message to the browser. For now, we create a Notification record that the
// client can poll and the service worker can display.
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  link?: string
) {
  // Get active subscriptions for the user
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId, isActive: true },
  });

  // Create a notification record in the database
  const notification = await db.notification.create({
    data: {
      userId,
      type: "SYSTEM",
      title,
      body,
      link: link || "/dashboard",
    },
  });

  // In production, you would loop over subscriptions and send via web-push:
  // for (const sub of subscriptions) {
  //   await webpush.sendNotification(
  //     { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
  //     JSON.stringify({ title, body, link })
  //   );
  // }

  return { notification, subscriptionCount: subscriptions.length };
}

// ─── Get User Subscriptions ────────────────────────────────
export async function getUserPushSubscriptions(userId: string) {
  return db.pushSubscription.findMany({
    where: { userId, isActive: true },
  });
}
