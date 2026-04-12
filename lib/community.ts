import { db } from "@/lib/db";

// ─── Posts ─────────────────────────────────────────────────

export async function getPosts(
  category?: string,
  page = 1,
  limit = 20
) {
  const where = {
    ...(category && category !== "ALL" ? { category } : {}),
    isFlagged: false,
  };

  const [posts, total] = await Promise.all([
    db.communityPost.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.communityPost.count({ where }),
  ]);

  // Fetch author names separately (no relation on model)
  const authorIds = [...new Set(posts.map((p) => p.authorId))];
  const authors = authorIds.length
    ? await db.user.findMany({
        where: { id: { in: authorIds } },
        select: { id: true, firstName: true, lastName: true },
      })
    : [];

  const authorMap = new Map(authors.map((a) => [a.id, a]));

  const enriched = posts.map((post) => {
    const author = authorMap.get(post.authorId);
    return {
      ...post,
      authorName: post.isAnonymous
        ? "Anonymous"
        : author
          ? `${author.firstName || ""} ${author.lastName || ""}`.trim() || "Member"
          : "Member",
    };
  });

  return { posts: enriched, total, page, limit };
}

export async function createPost(
  authorId: string,
  data: { category: string; title: string; body: string; isAnonymous?: boolean }
) {
  return db.communityPost.create({
    data: {
      authorId,
      category: data.category,
      title: data.title,
      body: data.body,
      isAnonymous: data.isAnonymous ?? false,
    },
  });
}

export async function getPost(postId: string) {
  const post = await db.communityPost.findUnique({
    where: { id: postId },
    include: {
      comments: {
        where: { isFlagged: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) return null;

  // Enrich author names
  const allAuthorIds = [
    post.authorId,
    ...post.comments.map((c) => c.authorId),
  ];
  const uniqueIds = [...new Set(allAuthorIds)];
  const authors = await db.user.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, firstName: true, lastName: true },
  });
  const authorMap = new Map(authors.map((a) => [a.id, a]));

  const getName = (id: string, isAnon: boolean) => {
    if (isAnon) return "Anonymous";
    const a = authorMap.get(id);
    return a ? `${a.firstName || ""} ${a.lastName || ""}`.trim() || "Member" : "Member";
  };

  return {
    ...post,
    authorName: getName(post.authorId, post.isAnonymous),
    comments: post.comments.map((c) => ({
      ...c,
      authorName: getName(c.authorId, c.isAnonymous),
    })),
  };
}

// ─── Comments ──────────────────────────────────────────────

export async function createComment(
  postId: string,
  authorId: string,
  body: string,
  isAnonymous = false
) {
  const [comment] = await Promise.all([
    db.communityComment.create({
      data: { postId, authorId, body, isAnonymous },
    }),
    db.communityPost.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);
  return comment;
}

// ─── Likes ─────────────────────────────────────────────────

export async function likePost(postId: string) {
  return db.communityPost.update({
    where: { id: postId },
    data: { likeCount: { increment: 1 } },
  });
}

// ─── Flagging ──────────────────────────────────────────────

export async function flagPost(postId: string) {
  return db.communityPost.update({
    where: { id: postId },
    data: { isFlagged: true },
  });
}

export async function flagComment(commentId: string) {
  return db.communityComment.update({
    where: { id: commentId },
    data: { isFlagged: true },
  });
}

// ─── Challenges ────────────────────────────────────────────

export async function getChallenges(active?: boolean) {
  const where = active !== undefined ? { isActive: active } : {};
  return db.challenge.findMany({
    where,
    orderBy: { startsAt: "desc" },
    include: {
      _count: { select: { participants: true } },
    },
  });
}

export async function joinChallenge(challengeId: string, userId: string) {
  const existing = await db.challengeParticipation.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });

  if (existing) {
    return { error: "Already joined this challenge" };
  }

  const [participation] = await Promise.all([
    db.challengeParticipation.create({
      data: { challengeId, userId },
    }),
    db.challenge.update({
      where: { id: challengeId },
      data: { participantCount: { increment: 1 } },
    }),
  ]);

  return { participation };
}

export async function updateChallengeProgress(
  challengeId: string,
  userId: string,
  progress: number
) {
  const participation = await db.challengeParticipation.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
    include: { challenge: true },
  });

  if (!participation) {
    return { error: "Not participating in this challenge" };
  }

  const isCompleted = progress >= participation.challenge.target;

  return db.challengeParticipation.update({
    where: { id: participation.id },
    data: {
      progress,
      isCompleted,
      completedAt: isCompleted && !participation.isCompleted ? new Date() : participation.completedAt,
    },
  });
}

// ─── Groups ────────────────────────────────────────────────

export async function getGroups(userId: string) {
  return db.groupMembership.findMany({
    where: { userId },
    include: {
      group: {
        include: {
          _count: { select: { members: true } },
        },
      },
    },
  });
}

// ─── User challenge participation lookup ───────────────────

export async function getUserChallengeIds(userId: string) {
  const participations = await db.challengeParticipation.findMany({
    where: { userId },
    select: { challengeId: true, progress: true, isCompleted: true },
  });
  return participations;
}
