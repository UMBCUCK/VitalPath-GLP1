import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getPosts,
  createPost,
  createComment,
  likePost,
  flagPost,
  flagComment,
  joinChallenge,
  updateChallengeProgress,
} from "@/lib/community";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const data = await getPosts(category, page, Math.min(limit, 50));
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Community GET error:", error);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "create_post": {
        const { category, title, body: postBody, isAnonymous } = body;
        if (!category || !title || !postBody) {
          return NextResponse.json({ error: "Missing required fields: category, title, body" }, { status: 400 });
        }
        const post = await createPost(session.userId, { category, title, body: postBody, isAnonymous });
        return NextResponse.json({ ok: true, post });
      }

      case "create_comment": {
        const { postId, body: commentBody, isAnonymous } = body;
        if (!postId || !commentBody) {
          return NextResponse.json({ error: "Missing required fields: postId, body" }, { status: 400 });
        }
        const comment = await createComment(postId, session.userId, commentBody, isAnonymous);
        return NextResponse.json({ ok: true, comment });
      }

      case "like_post": {
        const { postId } = body;
        if (!postId) {
          return NextResponse.json({ error: "Missing postId" }, { status: 400 });
        }
        await likePost(postId);
        return NextResponse.json({ ok: true });
      }

      case "flag_post": {
        const { postId } = body;
        if (!postId) {
          return NextResponse.json({ error: "Missing postId" }, { status: 400 });
        }
        await flagPost(postId);
        return NextResponse.json({ ok: true });
      }

      case "flag_comment": {
        const { commentId } = body;
        if (!commentId) {
          return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
        }
        await flagComment(commentId);
        return NextResponse.json({ ok: true });
      }

      case "join_challenge": {
        const { challengeId } = body;
        if (!challengeId) {
          return NextResponse.json({ error: "Missing challengeId" }, { status: 400 });
        }
        const result = await joinChallenge(challengeId, session.userId);
        if ("error" in result) {
          return NextResponse.json({ error: result.error }, { status: 409 });
        }
        return NextResponse.json({ ok: true, participation: result.participation });
      }

      case "update_progress": {
        const { challengeId, progress } = body;
        if (!challengeId || progress === undefined) {
          return NextResponse.json({ error: "Missing challengeId or progress" }, { status: 400 });
        }
        const result = await updateChallengeProgress(challengeId, session.userId, progress);
        if (result && "error" in result) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        return NextResponse.json({ ok: true, participation: result });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Community POST error:", error);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
