"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MessageCircle, Heart, Flag, Users, Trophy, Target,
  Plus, Send, ChevronRight, Clock, Flame,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  category: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  isPinned: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: string | Date;
}

interface ChallengeItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  target: number;
  unit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  participantCount: number;
  joined: boolean;
  userProgress: number;
  userCompleted: boolean;
}

interface GroupItem {
  id: string;
  name: string;
  description: string | null;
  goalType: string;
  memberCount: number;
  maxMembers: number;
  role: string;
}

interface CommunityClientProps {
  initialPosts: Post[];
  totalPosts: number;
  challenges: ChallengeItem[];
  groups: GroupItem[];
}

// ─── Helpers ───────────────────────────────────────────────

const CATEGORIES = ["ALL", "JOURNEY", "NUTRITION", "EXERCISE", "WINS", "QUESTIONS", "TIPS"] as const;

const categoryColors: Record<string, "default" | "secondary" | "gold" | "success" | "warning"> = {
  JOURNEY: "default",
  NUTRITION: "success",
  EXERCISE: "warning",
  WINS: "gold",
  QUESTIONS: "secondary",
  TIPS: "default",
};

function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// ─── Component ─────────────────────────────────────────────

export function CommunityClient({ initialPosts, totalPosts, challenges, groups }: CommunityClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"feed" | "challenges" | "groups">("feed");
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState<string>("ALL");
  const [showNewPost, setShowNewPost] = useState(false);
  const [loading, setLoading] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("JOURNEY");
  const [newAnonymous, setNewAnonymous] = useState(false);

  // ─── Actions ──────────────────────────────────────────

  const fetchPosts = useCallback(async (cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== "ALL") params.set("category", cat);
      const res = await fetch(`/api/community?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    setCategory(cat);
    fetchPosts(cat);
  }, [fetchPosts]);

  const handleCreatePost = useCallback(async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_post",
          category: newCategory,
          title: newTitle,
          body: newBody,
          isAnonymous: newAnonymous,
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewBody("");
        setNewAnonymous(false);
        setShowNewPost(false);
        fetchPosts(category);
      }
    } finally {
      setLoading(false);
    }
  }, [newTitle, newBody, newCategory, newAnonymous, category, fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like_post", postId }),
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p))
    );
  }, []);

  const handleJoinChallenge = useCallback(async (challengeId: string) => {
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join_challenge", challengeId }),
    });
    if (res.ok) {
      router.refresh();
    }
  }, [router]);

  // ─── Tabs ─────────────────────────────────────────────

  const tabs = [
    { key: "feed" as const, label: "Feed", icon: MessageCircle },
    { key: "challenges" as const, label: "Challenges", icon: Trophy },
    { key: "groups" as const, label: "My Groups", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Community</h1>
          <p className="text-sm text-graphite-500">Connect, share, and stay motivated together</p>
        </div>
        {activeTab === "feed" && (
          <Button onClick={() => setShowNewPost(!showNewPost)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-navy-50/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-navy shadow-sm"
                : "text-graphite-500 hover:text-navy"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          {/* New Post Form */}
          {showNewPost && (
            <Card className="border-teal-200 bg-teal-50/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy"
                  >
                    {CATEGORIES.filter((c) => c !== "ALL").map((c) => (
                      <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-graphite-500">
                    <input
                      type="checkbox"
                      checked={newAnonymous}
                      onChange={(e) => setNewAnonymous(e.target.checked)}
                      className="rounded border-navy-200"
                    />
                    Post anonymously
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
                <textarea
                  placeholder="Share your thoughts, wins, or questions..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-400 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCreatePost}
                    disabled={!newTitle.trim() || !newBody.trim() || loading}
                    className="gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-teal text-white"
                    : "bg-navy-50 text-graphite-500 hover:bg-navy-100"
                }`}
              >
                {cat === "ALL" ? "All Posts" : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="mx-auto h-10 w-10 text-graphite-300" />
                <p className="mt-3 text-sm text-graphite-500">
                  No posts yet. Be the first to share!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={categoryColors[post.category] || "secondary"} className="text-[10px]">
                            {post.category}
                          </Badge>
                          {post.isPinned && (
                            <Badge variant="gold" className="text-[10px]">Pinned</Badge>
                          )}
                          <span className="text-xs text-graphite-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(post.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-navy text-sm">{post.title}</h3>
                        <p className="mt-1 text-xs text-graphite-500 line-clamp-2">{post.body}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-xs text-graphite-400">
                            by {post.authorName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 border-t border-navy-100/40 pt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-graphite-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        {post.likeCount}
                      </button>
                      <span className="flex items-center gap-1.5 text-xs text-graphite-500">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.commentCount}
                      </span>
                      <button className="ml-auto flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors">
                        <Flag className="h-3 w-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          {challenges.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="mx-auto h-10 w-10 text-graphite-300" />
                <p className="mt-3 text-sm text-graphite-500">
                  No active challenges right now. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {challenges.map((challenge) => {
                const progressPct = challenge.target > 0
                  ? Math.min((challenge.userProgress / challenge.target) * 100, 100)
                  : 0;
                const daysLeft = Math.max(
                  0,
                  Math.ceil((new Date(challenge.endsAt).getTime() - Date.now()) / 86400000)
                );

                return (
                  <Card key={challenge.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{challenge.title}</CardTitle>
                          {challenge.description && (
                            <p className="mt-1 text-xs text-graphite-500">{challenge.description}</p>
                          )}
                        </div>
                        <Badge variant={challenge.userCompleted ? "success" : "default"} className="text-[10px] shrink-0">
                          {challenge.userCompleted ? "Completed" : `${daysLeft}d left`}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-graphite-500">
                        <span className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          {challenge.target} {challenge.unit}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {challenge.participantCount} joined
                        </span>
                      </div>

                      {challenge.joined ? (
                        <div className="space-y-1.5">
                          <Progress value={progressPct} className="h-2" />
                          <p className="text-[11px] text-graphite-400 text-right">
                            {challenge.userProgress} / {challenge.target} {challenge.unit}
                          </p>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleJoinChallenge(challenge.id)}
                          size="sm"
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Flame className="h-4 w-4" />
                          Join Challenge
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Groups Tab */}
      {activeTab === "groups" && (
        <div className="space-y-4">
          {groups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-graphite-300" />
                <p className="mt-3 text-sm font-medium text-navy">No groups yet</p>
                <p className="mt-1 text-xs text-graphite-500">
                  Accountability groups help you stay on track. Groups will be available soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy text-sm">{group.name}</h3>
                        {group.description && (
                          <p className="mt-1 text-xs text-graphite-500 line-clamp-2">{group.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {group.role === "LEADER" ? "Leader" : "Member"}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-graphite-400">
                        <Users className="h-3.5 w-3.5" />
                        {group.memberCount} / {group.maxMembers} members
                      </span>
                      <Badge variant={categoryColors[group.goalType] || "secondary"} className="text-[10px]">
                        {group.goalType.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
