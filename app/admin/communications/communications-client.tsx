"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import {
  MessageSquare, Clock, AlertCircle, Mail, Plus, X,
  Send, Search, ArrowLeft, User, Smartphone, Monitor,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

interface Thread {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientAvatar: string | null;
  subject: string | null;
  status: string;
  assignedTo: string | null;
  assignedName: string;
  priority: string;
  lastMessageAt: string | null;
  lastMessagePreview: string;
  lastMessageDirection: string | null;
  lastMessageChannel: string | null;
  messageCount: number;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  userId: string;
  threadId: string;
  direction: string;
  channel: string;
  subject: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface ThreadDetail {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientAvatar: string | null;
  subject: string | null;
  status: string;
  assignedTo: string | null;
  assignedName: string;
  priority: string;
  messages: Message[];
}

interface Admin {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface Template {
  id: string;
  name: string;
  body: string;
}

interface Metrics {
  totalThreads: number;
  openThreads: number;
  waitingThreads: number;
  unreadCount: number;
  avgResponseMinutes: number;
}

interface Props {
  initialThreads: Thread[];
  initialTotal: number;
  initialMetrics: Metrics;
  admins: Admin[];
  templates: Template[];
}

// ─── Helpers ────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; variant: "default" | "warning" | "success" | "secondary" }> = {
  OPEN: { label: "Open", variant: "default" },
  WAITING: { label: "Waiting", variant: "warning" },
  RESOLVED: { label: "Resolved", variant: "success" },
  CLOSED: { label: "Closed", variant: "secondary" },
};

const priorityDot: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-amber-500",
  NORMAL: "bg-blue-500",
  LOW: "bg-gray-400",
};

const channelIcon = (ch: string) => {
  switch (ch) {
    case "EMAIL": return <Mail className="h-3.5 w-3.5" />;
    case "SMS": return <Smartphone className="h-3.5 w-3.5" />;
    default: return <Monitor className="h-3.5 w-3.5" />;
  }
};

function timeAgo(iso: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMinutes(mins: number) {
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainder = mins % 60;
  return remainder ? `${hrs}h ${remainder}m` : `${hrs}h`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Component ──────────────────────────────────────────────

export function CommunicationsClient({
  initialThreads,
  initialTotal,
  initialMetrics,
  admins,
  templates,
}: Props) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadDetail, setThreadDetail] = useState<ThreadDetail | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Reply
  const [replyText, setReplyText] = useState("");
  const [replyChannel, setReplyChannel] = useState("APP");
  const [sending, setSending] = useState(false);

  // New thread
  const [showNewThread, setShowNewThread] = useState(false);
  const [newPatientSearch, setNewPatientSearch] = useState("");
  const [patientResults, setPatientResults] = useState<{ id: string; firstName: string | null; lastName: string | null; email: string }[]>([]);
  const [newPatientId, setNewPatientId] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newChannel, setNewChannel] = useState("APP");
  const [creatingThread, setCreatingThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadDetail?.messages]);

  // ── Fetch threads ────────────────────────────────────────

  const fetchThreads = useCallback(async () => {
    setLoadingThreads(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);
      if (assignedFilter !== "all") params.set("assignedTo", assignedFilter);

      const res = await fetch(`/api/admin/communications?${params}`);
      const data = await res.json();
      setThreads(data.threads || []);
    } catch {
      // keep existing
    } finally {
      setLoadingThreads(false);
    }
  }, [searchQuery, statusFilter, priorityFilter, assignedFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchThreads(), 300);
    return () => clearTimeout(timer);
  }, [fetchThreads]);

  const refreshMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/communications?action=metrics");
      const data = await res.json();
      setMetrics(data);
    } catch {
      // keep existing
    }
  }, []);

  // ── Select thread ────────────────────────────────────────

  const selectThread = useCallback(async (threadId: string) => {
    setSelectedThreadId(threadId);
    setLoadingThread(true);
    setReplyText("");
    try {
      const res = await fetch(`/api/admin/communications/${threadId}`);
      const data = await res.json();
      setThreadDetail(data);
      // Refresh threads to update unread counts
      await fetchThreads();
    } catch {
      // silent
    } finally {
      setLoadingThread(false);
    }
  }, [fetchThreads]);

  // ── Reply ────────────────────────────────────────────────

  const handleReply = async () => {
    if (!selectedThreadId || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/communications/${selectedThreadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText, channel: replyChannel }),
      });
      if (res.ok) {
        setReplyText("");
        await selectThread(selectedThreadId);
        await refreshMetrics();
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  // ── Update thread status/priority/assignment ─────────────

  const handleUpdateThread = async (field: string, value: string) => {
    if (!selectedThreadId) return;
    try {
      await fetch(`/api/admin/communications/${selectedThreadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      await selectThread(selectedThreadId);
      await fetchThreads();
      await refreshMetrics();
    } catch {
      // silent
    }
  };

  // ── New thread ───────────────────────────────────────────

  const searchPatients = useCallback(async (q: string) => {
    if (q.length < 2) { setPatientResults([]); return; }
    try {
      const res = await fetch(`/api/admin/communications?action=patients&search=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPatientResults(data.patients || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchPatients(newPatientSearch), 300);
    return () => clearTimeout(timer);
  }, [newPatientSearch, searchPatients]);

  const handleCreateThread = async () => {
    if (!newPatientId || !newSubject || !newMessage) return;
    setCreatingThread(true);
    try {
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: newPatientId,
          subject: newSubject,
          message: newMessage,
          channel: newChannel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowNewThread(false);
        setNewPatientId("");
        setNewPatientSearch("");
        setNewSubject("");
        setNewMessage("");
        await fetchThreads();
        await refreshMetrics();
        await selectThread(data.thread.id);
      }
    } catch {
      // silent
    } finally {
      setCreatingThread(false);
    }
  };

  // ── Load template ────────────────────────────────────────

  const loadTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (tpl) setReplyText(tpl.body);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Communication Hub</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Manage patient messages, threads, and support communications
          </p>
        </div>
        <Button onClick={() => setShowNewThread(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Message
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Open Threads"
          value={String(metrics.openThreads)}
          icon={MessageSquare}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Waiting"
          value={String(metrics.waitingThreads)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Avg Response Time"
          value={formatMinutes(metrics.avgResponseMinutes)}
          icon={Send}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Unread"
          value={String(metrics.unreadCount)}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
      </div>

      {/* New Thread Modal */}
      {showNewThread && (
        <Card className="border-teal/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">New Message Thread</CardTitle>
              <button
                onClick={() => setShowNewThread(false)}
                className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient search */}
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Patient</label>
              <div className="relative">
                <Input
                  placeholder="Search patients by name or email..."
                  value={newPatientSearch}
                  onChange={(e) => { setNewPatientSearch(e.target.value); setNewPatientId(""); }}
                />
                {patientResults.length > 0 && !newPatientId && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-xl border border-navy-200 bg-white shadow-lg">
                    {patientResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setNewPatientId(p.id);
                          setNewPatientSearch(
                            `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.email
                          );
                          setPatientResults([]);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-linen/40 first:rounded-t-xl last:rounded-b-xl"
                      >
                        <User className="h-4 w-4 text-graphite-400" />
                        <span className="font-medium text-navy">
                          {p.firstName} {p.lastName}
                        </span>
                        <span className="text-graphite-400">{p.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {newPatientId && (
                <p className="mt-1 text-xs text-emerald-600">Patient selected</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Subject</label>
                <Input
                  placeholder="Message subject..."
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-navy-200 bg-white px-4 py-2 text-sm text-navy-800 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                >
                  <option value="APP">App</option>
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-500">Message</label>
              <textarea
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-800 placeholder:text-navy-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleCreateThread} disabled={creatingThread || !newPatientId || !newSubject || !newMessage}>
                {creatingThread ? "Creating..." : "Send Message"}
              </Button>
              <Button variant="outline" onClick={() => setShowNewThread(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Split Layout */}
      <div className="flex gap-0 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium" style={{ height: "calc(100vh - 380px)", minHeight: "500px" }}>
        {/* Left Panel: Thread List */}
        <div className={cn(
          "flex flex-col border-r border-navy-100/40",
          selectedThreadId ? "hidden lg:flex lg:w-1/3" : "w-full lg:w-1/3"
        )}>
          {/* Filters */}
          <div className="space-y-2 border-b border-navy-100/40 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-300" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-navy-200 bg-white px-2 text-xs text-graphite-600 focus:border-teal focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="WAITING">Waiting</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-navy-200 bg-white px-2 text-xs text-graphite-600 focus:border-teal focus:outline-none"
              >
                <option value="all">All Priority</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="h-8 flex-1 rounded-lg border border-navy-200 bg-white px-2 text-xs text-graphite-600 focus:border-teal focus:outline-none"
              >
                <option value="all">All Agents</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal border-t-transparent" />
              </div>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-graphite-300">
                <MessageSquare className="mb-2 h-8 w-8" />
                <p className="text-sm">No threads found</p>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => selectThread(thread.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-navy-100/20 px-4 py-3 text-left transition-colors",
                    selectedThreadId === thread.id
                      ? "bg-teal-50/40"
                      : "hover:bg-linen/30",
                    thread.unreadCount > 0 && "bg-blue-50/20"
                  )}
                >
                  {/* Priority dot */}
                  <div className="mt-1.5 flex flex-col items-center gap-1">
                    <span className={cn("h-2.5 w-2.5 rounded-full", priorityDot[thread.priority] || priorityDot.NORMAL)} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "truncate text-sm",
                        thread.unreadCount > 0 ? "font-bold text-navy" : "font-medium text-graphite-600"
                      )}>
                        {thread.patientName}
                      </span>
                      <span className="shrink-0 text-xs text-graphite-300">
                        {timeAgo(thread.lastMessageAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-navy-600">
                      {thread.subject || "No subject"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-graphite-400">
                      {thread.lastMessagePreview || "No messages yet"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={statusConfig[thread.status]?.variant || "secondary"}
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {statusConfig[thread.status]?.label || thread.status}
                      </Badge>
                      {thread.unreadCount > 0 && (
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal px-1 text-[10px] font-bold text-white">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Thread Detail */}
        <div className={cn(
          "flex flex-1 flex-col",
          selectedThreadId ? "flex" : "hidden lg:flex"
        )}>
          {!selectedThreadId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-graphite-300">
              <MessageSquare className="mb-3 h-12 w-12" />
              <p className="text-sm font-medium">Select a thread to view messages</p>
              <p className="mt-1 text-xs">Or create a new message thread</p>
            </div>
          ) : loadingThread ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
            </div>
          ) : threadDetail ? (
            <>
              {/* Thread header */}
              <div className="flex items-center gap-3 border-b border-navy-100/40 px-4 py-3">
                {/* Back button (mobile) */}
                <button
                  onClick={() => { setSelectedThreadId(null); setThreadDetail(null); }}
                  className="rounded-lg p-1 text-graphite-400 hover:bg-navy-50 lg:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal">
                  {getInitials(threadDetail.patientName || "?")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy">
                    {threadDetail.patientName}
                  </p>
                  <p className="truncate text-xs text-graphite-400">
                    {threadDetail.subject || "No subject"} &middot; {threadDetail.patientEmail}
                  </p>
                </div>

                {/* Thread controls */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={threadDetail.status}
                      onChange={(e) => handleUpdateThread("status", e.target.value)}
                      className="h-8 appearance-none rounded-lg border border-navy-200 bg-white pl-3 pr-7 text-xs font-medium text-graphite-600 focus:border-teal focus:outline-none"
                    >
                      <option value="OPEN">Open</option>
                      <option value="WAITING">Waiting</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-graphite-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={threadDetail.priority}
                      onChange={(e) => handleUpdateThread("priority", e.target.value)}
                      className="h-8 appearance-none rounded-lg border border-navy-200 bg-white pl-3 pr-7 text-xs font-medium text-graphite-600 focus:border-teal focus:outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-graphite-400" />
                  </div>
                  <div className="relative">
                    <select
                      value={threadDetail.assignedTo || ""}
                      onChange={(e) => handleUpdateThread("assignedTo", e.target.value)}
                      className="h-8 appearance-none rounded-lg border border-navy-200 bg-white pl-3 pr-7 text-xs font-medium text-graphite-600 focus:border-teal focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {admins.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.firstName} {a.lastName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-graphite-400" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {threadDetail.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.direction === "OUTBOUND" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5",
                        msg.direction === "OUTBOUND"
                          ? "rounded-br-md bg-teal text-white"
                          : "rounded-bl-md bg-navy-50 text-navy-800"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                      <div className={cn(
                        "mt-1 flex items-center gap-1.5 text-[10px]",
                        msg.direction === "OUTBOUND" ? "text-teal-100" : "text-graphite-400"
                      )}>
                        {channelIcon(msg.channel)}
                        <span>{msg.channel}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(msg.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply composer */}
              <div className="border-t border-navy-100/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={replyChannel}
                    onChange={(e) => setReplyChannel(e.target.value)}
                    className="h-8 rounded-lg border border-navy-200 bg-white px-2 text-xs text-graphite-600 focus:border-teal focus:outline-none"
                  >
                    <option value="APP">App</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                  <select
                    onChange={(e) => { if (e.target.value) loadTemplate(e.target.value); e.target.value = ""; }}
                    className="h-8 rounded-lg border border-navy-200 bg-white px-2 text-xs text-graphite-600 focus:border-teal focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Load template...</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply();
                    }}
                    placeholder="Type a reply... (Ctrl+Enter to send)"
                    className="flex-1 resize-none rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm text-navy-800 placeholder:text-navy-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                  <Button
                    size="icon"
                    onClick={handleReply}
                    disabled={sending || !replyText.trim()}
                    className="h-auto self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
