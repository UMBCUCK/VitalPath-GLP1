"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Shield, User, Stethoscope, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
}

// Demo messages for display before DB wiring
const demoMessages: Message[] = [
  { id: "1", direction: "INBOUND", subject: "Welcome to your care team", body: "Hi Jordan! I'm Dr. Sarah, your assigned provider. I've reviewed your intake and everything looks good. Your treatment plan is being finalized and your medication will ship within 24-48 hours. Feel free to message me anytime with questions.", isRead: true, createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "2", direction: "OUTBOUND", subject: null, body: "Thank you Dr. Sarah! I had a quick question — should I take the medication in the morning or evening?", isRead: true, createdAt: new Date(Date.now() - 5 * 86400000 + 3600000).toISOString() },
  { id: "3", direction: "INBOUND", subject: null, body: "Great question! Most patients find taking it in the morning works best. Take it at the same time each week. If you experience any nausea, taking it before bed can help. Let me know how your first dose goes!", isRead: true, createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "4", direction: "INBOUND", subject: "Week 2 check-in", body: "Hi Jordan, it's been about two weeks since you started. How are you feeling? Any side effects to report? Your tracking shows great consistency with logging — keep it up! Let me know if you'd like to adjust anything.", isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          { id: data.message?.id || Date.now().toString(), direction: "OUTBOUND", subject: null, body: newMessage, isRead: true, createdAt: new Date().toISOString() },
          ...prev,
        ]);
        setNewMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 2000);
      }
    } catch {
      // fallback: add locally
      setMessages((prev) => [
        { id: Date.now().toString(), direction: "OUTBOUND", subject: null, body: newMessage, isRead: true, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  }

  const unread = messages.filter((m) => !m.isRead && m.direction === "INBOUND").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Messages</h2>
          <p className="text-sm text-graphite-400">
            Secure messaging with your care team
            {unread > 0 && <Badge variant="default" className="ml-2">{unread} unread</Badge>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-teal-50/50 px-4 py-3">
        <Shield className="h-4 w-4 text-teal" />
        <p className="text-xs text-teal-700">Messages are encrypted and HIPAA-compliant. Only your care team can see them.</p>
      </div>

      {/* Compose */}
      <Card>
        <CardHeader><CardTitle className="text-base">New Message</CardTitle></CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex items-center gap-2 py-2">
              <Check className="h-5 w-5 text-teal" />
              <span className="text-sm font-medium text-navy">Message sent! Your care team will respond within 24 hours.</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to your care team..."
                className="calculator-input min-h-[80px] resize-y flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim() || sending} className="self-end gap-2">
                <Send className="h-4 w-4" /> Send
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thread */}
      <Card>
        <CardHeader><CardTitle className="text-base">Conversation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.direction === "OUTBOUND" && "flex-row-reverse")}>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                msg.direction === "INBOUND" ? "bg-teal-50" : "bg-navy-100"
              )}>
                {msg.direction === "INBOUND" ? <Stethoscope className="h-4 w-4 text-teal" /> : <User className="h-4 w-4 text-navy" />}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3",
                msg.direction === "INBOUND"
                  ? "bg-white border border-navy-100/60 shadow-premium"
                  : "bg-teal-50 border border-teal/20"
              )}>
                {msg.subject && <p className="text-xs font-bold text-navy mb-1">{msg.subject}</p>}
                <p className="text-sm leading-relaxed text-graphite-600">{msg.body}</p>
                <p className="mt-2 text-[10px] text-graphite-300">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  {msg.direction === "INBOUND" && " · Care Team"}
                  {!msg.isRead && msg.direction === "INBOUND" && <Badge variant="default" className="ml-2 text-[8px]">New</Badge>}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
