"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  userId: string;
  direction: string;
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: Date;
}

interface Thread {
  user: { id: string; firstName: string | null; lastName: string | null; email: string };
  messages: Message[];
  unread: number;
}

export function ProviderMessagesClient({ threads }: { threads: Thread[] }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(threads[0]?.user.id || null);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);

  const selected = threads.find((t) => t.user.id === selectedUserId);

  async function sendReply() {
    if (!reply.trim() || !selectedUserId) return;
    // Create an INBOUND message (from provider to patient)
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply, subject: "Provider Response" }),
    });
    setSent(true);
    setReply("");
    setTimeout(() => setSent(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Patient Messages</h2>
        <p className="text-sm text-graphite-400">{threads.length} conversations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Thread list */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-sm">Patients</CardTitle></CardHeader>
          <CardContent className="space-y-1 p-3">
            {threads.map((t) => (
              <button
                key={t.user.id}
                onClick={() => setSelectedUserId(t.user.id)}
                className={cn("flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", selectedUserId === t.user.id ? "bg-atlantic/5" : "hover:bg-navy-50/50")}
              >
                <User className="mt-0.5 h-4 w-4 text-graphite-400" />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", selectedUserId === t.user.id ? "font-bold text-atlantic" : "font-medium text-navy")}>
                    {[t.user.firstName, t.user.lastName].filter(Boolean).join(" ") || t.user.email}
                  </p>
                  <p className="text-[10px] text-graphite-400 truncate">{t.messages[0]?.body.substring(0, 50)}...</p>
                </div>
                {t.unread > 0 && <Badge variant="default" className="text-[9px] shrink-0">{t.unread}</Badge>}
              </button>
            ))}
            {threads.length === 0 && <p className="py-4 text-center text-xs text-graphite-300">No messages</p>}
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">
              {selected ? [selected.user.firstName, selected.user.lastName].filter(Boolean).join(" ") || selected.user.email : "Select a patient"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected?.messages.reverse().map((m) => (
              <div key={m.id} className={cn("flex gap-2", m.direction === "OUTBOUND" && "flex-row-reverse")}>
                <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", m.direction === "OUTBOUND" ? "bg-navy-100" : "bg-atlantic/10")}>
                  {m.direction === "OUTBOUND" ? <User className="h-3.5 w-3.5 text-navy" /> : <Stethoscope className="h-3.5 w-3.5 text-atlantic" />}
                </div>
                <div className={cn("max-w-[70%] rounded-xl px-3 py-2", m.direction === "OUTBOUND" ? "bg-navy-50" : "bg-atlantic/5")}>
                  {m.subject && <p className="text-[10px] font-bold text-navy">{m.subject}</p>}
                  <p className="text-xs text-graphite-600 leading-relaxed">{m.body}</p>
                  <p className="mt-1 text-[9px] text-graphite-300">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}

            {selected && (
              <div className="mt-4 flex gap-2 border-t border-navy-100/40 pt-4">
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="flex-1 rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlantic/30 min-h-[60px] resize-y" placeholder="Type your response..." />
                <Button onClick={sendReply} disabled={!reply.trim()} className="self-end gap-1 bg-atlantic hover:bg-atlantic/90">
                  <Send className="h-3.5 w-3.5" /> {sent ? "Sent!" : "Reply"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
