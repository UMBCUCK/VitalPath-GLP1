export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPosts, getChallenges, getGroups, getUserChallengeIds } from "@/lib/community";
import { CommunityClient } from "./community-client";

export default async function CommunityPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [postsData, challenges, memberships, userChallenges] = await Promise.all([
    getPosts(undefined, 1, 20),
    getChallenges(true),
    getGroups(session.userId),
    getUserChallengeIds(session.userId),
  ]);

  const joinedChallengeIds = new Set(userChallenges.map((c) => c.challengeId));

  return (
    <CommunityClient
      initialPosts={postsData.posts}
      totalPosts={postsData.total}
      challenges={challenges.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        type: c.type,
        target: c.target,
        unit: c.unit,
        startsAt: c.startsAt.toISOString(),
        endsAt: c.endsAt.toISOString(),
        isActive: c.isActive,
        participantCount: c.participantCount,
        joined: joinedChallengeIds.has(c.id),
        userProgress: userChallenges.find((uc) => uc.challengeId === c.id)?.progress ?? 0,
        userCompleted: userChallenges.find((uc) => uc.challengeId === c.id)?.isCompleted ?? false,
      }))}
      groups={memberships.map((m) => ({
        id: m.group.id,
        name: m.group.name,
        description: m.group.description,
        goalType: m.group.goalType,
        memberCount: m.group._count.members,
        maxMembers: m.group.maxMembers,
        role: m.role,
      }))}
    />
  );
}
