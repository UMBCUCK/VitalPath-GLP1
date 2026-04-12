"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Shield, User, Stethoscope, Check, MessageCircle, Clock, AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return d.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export function MessagesClient({ messages: initialMessages }: { messages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform));
  }, []);

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setSending(true);

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      direction: "OUTBOUND",
      subject: null,
      body: newMessage,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [optimisticMsg, ...prev]);
    const body = newMessage;
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id
              ? { ...optimisticMsg, id: data.message?.id || optimisticMsg.id }
              : m
          )
        );
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } else {
        setFailedIds((prev) => new Set(prev).add(optimisticMsg.id));
      }
    } catch {
      setFailedIds((prev) => new Set(prev).add(optimisticMsg.id));
    } finally {
      setSending(false);
    }
  }

  async function retrySend(msgId: string, body: string) {
    setFailedIds((prev) => { const s = new Set(prev); s.delete(msgId); return s; });
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, id: data.message?.id || msgId } : m
          )
        );
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } else {
        setFailedIds((prev) => new Set(prev).add(msgId));
      }
    } catch {
      setFailedIds((prev) => new Set(prev).add(msgId));
    } finally {
      setSending(false);
    }
  }

  function dismissFailed(msgId: string) {
    setFailedIds((prev) => { const s = new Set(prev); s.delete(msgId); return s; });
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Messages</h2>
          <p className="text-sm text-graphite-400">Secure messaging with your care team</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 rounded-xl bg-teal-50/50 px-4 py-3">
        <Shield className="h-4 w-4 text-teal shrink-0" />
        <p className="text-xs text-teal-700">
          Messages are end-to-end encrypted and HIPAA-compliant. Only your care team can see them.
        </p>
      </div>

      {/* Compose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message Your Care Team</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex items-center gap-3 rounded-xl bg-teal-50 border border-teal/20 px-4 py-3">
              <Check className="h-5 w-5 text-teal shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy">Message sent!</p>
                <p className="text-xs text-graphite-400">Your care team typically responds within 24 hours.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendMessage();
                }}
                placeholder="Type your message to your care team…"
                className="calculator-input min-h-[88px] resize-y w-full"
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-graphite-300">
                  <kbd className="rounded border border-graphite-200 bg-graphite-50 px-1 py-0.5 text-[10px]">{isMac ? "⌘+Return" : "Ctrl+Enter"}</kbd> to send
                </p>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="gap-2"
                  size="sm"
                >
                  {sending ? (
                    <>Sending…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thread */}
      {hasMessages ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Conversation</span>
              <span className="text-xs font-normal text-graphite-400">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((msg) => {
              const isFailed = failedIds.has(msg.id);
              return (
                <div key={msg.id} className={cn("flex gap-3", msg.direction === "OUTBOUND" && "flex-row-reverse")}>
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isFailed ? "bg-red-50" : msg.direction === "INBOUND" ? "bg-teal-50" : "bg-navy-100"
                  )}>
                    {msg.direction === "INBOUND"
                      ? <Stethoscope className="h-4 w-4 text-teal" />
                      : isFailed
                        ? <AlertCircle className="h-4 w-4 text-red-500" />
                        : <User className="h-4 w-4 text-navy" />
                    }
                  </div>
                  <div className={cn(
                    "max-w-[78%] space-y-1",
                    msg.direction === "OUTBOUND" && "items-end"
                  )}>
                    {msg.subject && (
                      <p className={cn(
                        "text-xs font-bold text-navy",
                        msg.direction === "OUTBOUND" && "text-right"
                      )}>
                        {msg.subject}
                      </p>
                    )}
                    <div className={cn(
                      "rounded-2xl px-4 py-3",
                      isFailed
                        ? "bg-red-50 border border-red-200"
                        : msg.direction === "INBOUND"
                          ? "bg-white border border-navy-100/60 shadow-sm"
                          : "bg-teal-50 border border-teal/20"
                    )}>
                      <p className={cn("text-sm leading-relaxed", isFailed ? "text-red-700" : "text-graphite-600")}>{msg.body}</p>
                    </div>
                    {isFailed ? (
                      <div className="flex items-center gap-2 px-1">
                        <p className="text-[10px] text-red-500">Failed to send</p>
                        <button
                          onClick={() => retrySend(msg.id, msg.body)}
                          disabled={sending}
                          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium text-teal hover:underline disabled:opacity-50"
                        >
                          <RotateCcw className="h-2.5 w-2.5" /> Retry
                        </button>
                        <button
                          onClick={() => dismissFailed(msg.id)}
                          className="text-[10px] text-graphite-400 hover:text-red-500"
                        >
                          Discard
                        </button>
                      </div>
                    ) : (
                      <div className={cn(
                        "flex items-center gap-1.5 px-1",
                        msg.direction === "OUTBOUND" && "flex-row-reverse"
                      )}>
                        <Clock className="h-3 w-3 text-graphite-300" />
                        <p className="text-[10px] text-graphite-300">
                          {formatTime(msg.createdAt)}
                          {msg.direction === "INBOUND" && " · Care Team"}
                        </p>
                        {!msg.isRead && msg.direction === "INBOUND" && (
                          <Badge variant="default" className="text-[8px] py-0 h-4">New</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        /* Empty state */
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
              <MessageCircle className="h-7 w-7 text-teal" />
            </div>
            <h3 className="mt-4 text-base font-bold text-navy">No messages yet</h3>
            <p className="mt-2 text-sm text-graphite-400 max-w-sm mx-auto">
              Send your first message above and your care team will respond within 24 hours.
              You can ask about your treatment, medication, nutrition, or anything else.
            </p>
            <div className="mt-6 grid gap-2 max-w-xs mx-auto">
              {[
                "How should I take my medication?",
                "I'm experiencing some nausea",
                "Can I adjust my dose?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setNewMessage(prompt)}
                  className="rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-left text-sm text-graphite-600 hover:border-teal/30 hover:bg-teal-50/30 transition-colors"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
