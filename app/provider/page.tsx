import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, MessageCircle, TrendingUp, Clock, AlertTriangle } from "lucide-react";

export default function ProviderDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Provider Dashboard</h2>
        <p className="text-sm text-graphite-400">Patient management and clinical tools</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Assigned Patients</p><p className="text-xl font-bold text-navy">24</p></div></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50/20"><CardContent className="flex items-center gap-3 p-4"><ClipboardCheck className="h-5 w-5 text-amber-500" /><div><p className="text-xs text-graphite-400">Pending Intakes</p><p className="text-xl font-bold text-navy">3</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><MessageCircle className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Unread Messages</p><p className="text-xl font-bold text-navy">7</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Avg Weight Loss</p><p className="text-xl font-bold text-navy">14.2 lbs</p></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending intake reviews */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-amber-500" /> Pending Intake Reviews</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Riley K.", state: "GA", bmi: 32.4, submitted: "2 hours ago" },
              { name: "Quinn S.", state: "TX", bmi: 29.1, submitted: "5 hours ago" },
              { name: "Jamie T.", state: "WA", bmi: 35.8, submitted: "1 day ago", flag: "Contraindication noted" },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between rounded-xl border border-navy-100/40 p-4">
                <div>
                  <p className="text-sm font-medium text-navy">{p.name}</p>
                  <p className="text-xs text-graphite-400">{p.state} · BMI {p.bmi} · {p.submitted}</p>
                  {p.flag && (
                    <div className="mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span className="text-[10px] text-amber-600">{p.flag}</span>
                    </div>
                  )}
                </div>
                <Badge variant="warning">Review</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent check-ins */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-teal" /> Recent Check-Ins</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Jordan M.", weight: "198 lbs", mood: 4, medication: true, time: "Today" },
              { name: "Taylor R.", weight: "183 lbs", mood: 5, medication: true, time: "Today" },
              { name: "Alex C.", weight: "221 lbs", mood: 3, medication: true, time: "Yesterday" },
              { name: "Morgan L.", weight: "167 lbs", mood: 4, medication: false, time: "Yesterday" },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-xl bg-navy-50/30 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{c.name}</p>
                  <p className="text-xs text-graphite-400">{c.weight} · Mood {c.mood}/5 · {c.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!c.medication && <Badge variant="warning" className="text-[9px]">Missed dose</Badge>}
                  <Badge variant={c.medication ? "success" : "warning"} className="text-[9px]">{c.medication ? "Adherent" : "Flag"}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Patient message inbox */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageCircle className="h-4 w-4 text-teal" /> Recent Patient Messages</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { from: "Jordan M.", subject: "Dose Adjustment Request", preview: "I'd like to discuss a dose change...", time: "1h ago", unread: true },
            { from: "Casey D.", subject: "Side effect question", preview: "I've been experiencing some nausea after...", time: "3h ago", unread: true },
            { from: "Taylor R.", subject: "Re: Weekly check-in", preview: "Thank you! The new meal plan is working...", time: "5h ago", unread: false },
          ].map((m) => (
            <div key={m.from + m.subject} className={`flex items-start gap-3 rounded-xl px-4 py-3 ${m.unread ? "bg-atlantic/5" : "hover:bg-navy-50/30"} transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${m.unread ? "font-bold text-navy" : "font-medium text-graphite-600"}`}>{m.from}</p>
                  {m.unread && <div className="h-2 w-2 rounded-full bg-atlantic" />}
                </div>
                <p className="text-xs font-medium text-navy mt-0.5">{m.subject}</p>
                <p className="text-xs text-graphite-400 truncate">{m.preview}</p>
              </div>
              <span className="text-[10px] text-graphite-300 shrink-0">{m.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
