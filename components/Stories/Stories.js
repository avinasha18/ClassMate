// components/Stories/Stories.js
import prisma from "@/prisma/db/prisma";
import StoryList from "./StoryList";

const Stories = async ({ id, userData }) => {
  const currentUserId = parseInt(id);

  // Fetch all stories from users that the current user is following
  const followingUserIds = await prisma.userFollow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = followingUserIds.map(follow => follow.followingId);

  // Fetch stories for followed users and the current user
  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          userId: { in: followingIds },
        },
        {
          userId: currentUserId,
        },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = { user: story.user, stories: [] };
    }
    acc[story.userId].stories.push(story);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg overflow-hidden text-xs custom-scrollbar">
      <div className="flex gap-6 w-max overflow-x-auto custom-scrollbar">
        <StoryList stories={Object.values(groupedStories)} userId={currentUserId} userData={userData} />
      </div>
    </div>
  );
};

export default Stories;
