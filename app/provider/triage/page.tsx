/**
 * /provider/triage
 * ─────────────────────────────────────────────────────────────
 * Tier 10.3 — A provider-facing one-screen triage queue. Surfaces the
 * work a provider should do today in priority order:
 *
 *   1. Pending intake reviews (oldest first, SLA hours remaining)
 *   2. Unread patient messages (inbound, unread)
 *   3. Contraindication-flagged profiles needing a deeper look
 *   4. Subscriptions in PAST_DUE (payment attention)
 *   5. Adverse-event reports that need follow-up
 *
 * Designed for speed-of-action: every row has a single "Open" CTA that
 * takes the provider directly to the right detail page.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  MessageCircle,
  ClipboardList,
  CreditCard,
  Activity,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// SLA target (hours) for intake review — drives urgency color on the table
const INTAKE_SLA_HOURS = 24;

export default async function ProviderTriagePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PROVIDER" && session.role !== "ADMIN") redirect("/dashboard");

  const now = new Date();

  // Pull all five queues in parallel.
  // Note: IntakeSubmission uses IntakeStatus enum values (PENDING,
  // UNDER_REVIEW, APPROVED, DENIED, NEEDS_INFO). Eligibility flags live
  // in `eligibilityResult` (ELIGIBLE / NOT_ELIGIBLE / ALTERNATIVE_PATH).
  const [pendingIntakes, unreadMessages, pastDueSubs, adverseEvents] =
    await Promise.all([
      db.intakeSubmission.findMany({
        where: { status: { in: ["PENDING", "UNDER_REVIEW", "NEEDS_INFO"] } },
        orderBy: { createdAt: "asc" },
        take: 20,
        select: {
          id: true,
          createdAt: true,
          eligibilityResult: true,
          userId: true,
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
      db.message.findMany({
        where: { direction: "INBOUND", isRead: false },
        orderBy: { createdAt: "asc" },
        take: 15,
        select: {
          id: true,
          userId: true,
          body: true,
          createdAt: true,
          user: {
            select: { email: true, firstName: true, lastName: true },
          },
        },
      }),
      db.subscription.findMany({
        where: { status: "PAST_DUE" },
        orderBy: { updatedAt: "desc" },
        take: 15,
        select: {
          id: true,
          userId: true,
          status: true,
          currentPeriodEnd: true,
          user: {
            select: { email: true, firstName: true, lastName: true },
          },
        },
      }),
      // AdverseEventReport uses reviewedAt as the "needs review" signal
      // (null = not yet reviewed). reportedAt is the timestamp field.
      db.adverseEventReport
        .findMany({
          where: { reviewedAt: null },
          orderBy: { reportedAt: "asc" },
          take: 10,
          select: {
            id: true,
            reportedAt: true,
            severity: true,
            userId: true,
            user: {
              select: { email: true, firstName: true, lastName: true },
            },
          },
        })
        .catch(() => []),
    ]);

  // "Flagged" here = eligibility flagged as ALTERNATIVE_PATH, meaning the
  // intake passed safety screening but needs a deeper provider review
  // before approval. Admin can drill down for contraindication specifics.
  const contraindicationIntakes = pendingIntakes.filter(
    (i) => i.eligibilityResult === "ALTERNATIVE_PATH",
  );

  function hoursRemaining(createdAt: Date, slaHours: number): number {
    const age = (now.getTime() - createdAt.getTime()) / (60 * 60 * 1000);
    return Math.round((slaHours - age) * 10) / 10;
  }

  function slaBadge(createdAt: Date): React.ReactNode {
    const remaining = hoursRemaining(createdAt, INTAKE_SLA_HOURS);
    if (remaining <= 0)
      return <Badge variant="destructive" className="text-[10px]">SLA breach · {Math.abs(remaining)}h over</Badge>;
    if (remaining <= 4)
      return <Badge variant="warning" className="text-[10px]">{remaining}h left</Badge>;
    return <Badge variant="secondary" className="text-[10px]">{remaining}h left</Badge>;
  }

  function fullName(u: { firstName: string | null; lastName: string | null; email: string } | null): string {
    if (!u) return "—";
    return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email;
  }

  const totalItems =
    pendingIntakes.length +
    unreadMessages.length +
    pastDueSubs.length +
    adverseEvents.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Triage queue</h1>
          <p className="text-sm text-graphite-400">
            {totalItems} items across 4 queues · sorted oldest-first within each
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-teal" />
          <span className="text-xs font-semibold text-teal">
            Intake SLA: {INTAKE_SLA_HOURS}h
          </span>
        </div>
      </div>

      {/* 1 — Contraindication-flagged intakes (highest priority) */}
      {contraindicationIntakes.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Contraindication-flagged intakes · {contraindicationIntakes.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QueueTable>
              {contraindicationIntakes.map((i) => (
                <tr key={i.id} className="text-navy">
                  <td className="py-2.5">
                    <p className="text-sm font-semibold">{fullName(i.user)}</p>
                    <p className="text-[11px] text-graphite-400">{i.user.email}</p>
                  </td>
                  <td className="py-2.5 text-xs text-graphite-500">
                    {new Date(i.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5">{slaBadge(i.createdAt)}</td>
                  <td className="py-2.5 text-right">
                    <Link
                      href={`/provider/intakes/${i.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      Review <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </QueueTable>
          </CardContent>
        </Card>
      )}

      {/* 2 — Other pending intakes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-teal" />
            Pending intakes ·{" "}
            {pendingIntakes.length - contraindicationIntakes.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingIntakes.length - contraindicationIntakes.length === 0 ? (
            <p className="py-4 text-center text-sm text-graphite-400">
              No unflagged intakes waiting.
            </p>
          ) : (
            <QueueTable>
              {pendingIntakes
                .filter((i) => !contraindicationIntakes.includes(i))
                .map((i) => (
                  <tr key={i.id} className="text-navy">
                    <td className="py-2.5">
                      <p className="text-sm font-semibold">{fullName(i.user)}</p>
                      <p className="text-[11px] text-graphite-400">{i.user.email}</p>
                    </td>
                    <td className="py-2.5 text-xs text-graphite-500">
                      {new Date(i.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5">{slaBadge(i.createdAt)}</td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/provider/intakes/${i.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                      >
                        Review <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </QueueTable>
          )}
        </CardContent>
      </Card>

      {/* 3 — Unread patient messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-teal" />
            Unread patient messages · {unreadMessages.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unreadMessages.length === 0 ? (
            <p className="py-4 text-center text-sm text-graphite-400">Inbox zero.</p>
          ) : (
            <QueueTable>
              {unreadMessages.map((m) => (
                <tr key={m.id} className="text-navy align-top">
                  <td className="py-2.5">
                    <p className="text-sm font-semibold">{fullName(m.user)}</p>
                    <p className="text-[11px] text-graphite-400">
                      {m.user?.email}
                    </p>
                  </td>
                  <td className="py-2.5 text-xs text-graphite-500 line-clamp-2 max-w-xs">
                    {m.body}
                  </td>
                  <td className="py-2.5 text-xs text-graphite-500 whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      href={`/provider/messages?user=${m.userId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      Reply <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </QueueTable>
          )}
        </CardContent>
      </Card>

      {/* 4 — Past-due subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-red-500" />
            Past-due subscriptions · {pastDueSubs.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastDueSubs.length === 0 ? (
            <p className="py-4 text-center text-sm text-graphite-400">
              No past-due subs right now.
            </p>
          ) : (
            <QueueTable>
              {pastDueSubs.map((s) => (
                <tr key={s.id} className="text-navy">
                  <td className="py-2.5">
                    <p className="text-sm font-semibold">{fullName(s.user)}</p>
                    <p className="text-[11px] text-graphite-400">{s.user?.email}</p>
                  </td>
                  <td className="py-2.5 text-xs text-graphite-500">
                    {s.currentPeriodEnd
                      ? new Date(s.currentPeriodEnd).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-2.5">
                    <Badge variant="destructive" className="text-[10px]">
                      Past due
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      href={`/admin/subscriptions?search=${encodeURIComponent(s.user?.email ?? "")}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </QueueTable>
          )}
        </CardContent>
      </Card>

      {/* 5 — Adverse events */}
      {adverseEvents.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-600" />
              Adverse event reports · {adverseEvents.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QueueTable>
              {adverseEvents.map((a) => (
                <tr key={a.id} className="text-navy">
                  <td className="py-2.5">
                    <p className="text-sm font-semibold">{fullName(a.user)}</p>
                    <p className="text-[11px] text-graphite-400">{a.user?.email}</p>
                  </td>
                  <td className="py-2.5">
                    <Badge
                      variant={
                        a.severity === "SEVERE" || a.severity === "LIFE_THREATENING"
                          ? "destructive"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {a.severity}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-xs text-graphite-500">
                    {new Date(a.reportedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      href={`/admin/adverse-events?id=${a.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      Review <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </QueueTable>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-graphite-400">
        Queues refresh on every page load. Clear work from the top — SLA breaches
        auto-escalate nightly via the admin digest.
      </p>
    </div>
  );
}

// Lightweight inline table wrapper — kept local so this page is self-contained.
function QueueTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-navy-100/30">{children}</tbody>
      </table>
    </div>
  );
}
