import prisma from "@/prisma/db/prisma";

// User related functions
export async function getUserData(id) {
  id = parseInt(id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePictureUrl: true,
        registrationNumber: true,
        tag: true,
        college: true,
        gender: true,
        bio: true
      }
    });
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Post related functions
export const getPosts = async (id) => {
  id = parseInt(id);
  const posts = await prisma.post.findMany({
    where: { userId: id },
    include: {
      user: true,
      likes: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
      reactions: true
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log(posts,"posts data")
  return posts;
};

export const createPost = async (formData) => {
  const content = formData.get('desc');
  const imageUrl = formData.get('img');
  const userId = parseInt(formData.get('userId'));
  return await prisma.post.create({
    data: {
      userId: userId,
      imageUrl: imageUrl,
      content: content
    },
    include: {
      user: true,
      likes: true,
      comments: true,
      reactions: true
    }
  });
};

export const deletePost = async (postId) => {
  await prisma.post.delete({
    where: { id: parseInt(postId) }
  });
};

// Like related functions
export const switchLike = async (postId, userId) => {
  postId = parseInt(postId);
  userId = parseInt(userId);
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: { postId, userId }
    }
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id }
    });
    return false; // Unliked
  } else {
    await prisma.like.create({
      data: { postId, userId }
    });
    return true; // Liked
  }
};

// Comment related functions
// export const addComment = async (postId, content, userId) => {
//   return await prisma.comment.create({
//     data: {
//       postId: parseInt(postId),
//       userId: parseInt(userId),
//       content: content
//     },
//     include: { user: true }
//   });
// };

// // User mention suggestions
// export const getMentionSuggestions = async (query) => {
//   return await prisma.user.findMany({
//     where: {
//       OR: [
//         { fullName: { contains: query, mode: 'insensitive' } },
//         { email: { contains: query, mode: 'insensitive' } },
//         { tag: { contains: query, mode: 'insensitive' } }
//       ]
//     },
//     take: 5,
//     select: { id: true, fullName: true, email: true, tag: true }
//   });
// };

// New functions based on the schema

// Follow/Unfollow function
export const toggleFollow = async (followerId, followingId) => {
  followerId = parseInt(followerId);
  followingId = parseInt(followingId);
  const existingFollow = await prisma.userFollow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId }
    }
  });

  if (existingFollow) {
    await prisma.userFollow.delete({
      where: { id: existingFollow.id }
    });
    return false; // Unfollowed
  } else {
    await prisma.userFollow.create({
      data: { followerId, followingId }
    });
    return true; // Followed
  }
};

// Block/Unblock function
export const toggleBlock = async (blockerId, blockedId) => {
  blockerId = parseInt(blockerId);
  blockedId = parseInt(blockedId);
  const existingBlock = await prisma.blockedAccount.findUnique({
    where: {
      blockerId_blockedId: { blockerId, blockedId }
    }
  });

  if (existingBlock) {
    await prisma.blockedAccount.delete({
      where: { id: existingBlock.id }
    });
    return false; // Unblocked
  } else {
    await prisma.blockedAccount.create({
      data: { blockerId, blockedId }
    });
    return true; // Blocked
  }
};

// Add reaction to a post
export const addReaction = async (postId, userId, type) => {
  return await prisma.reaction.upsert({
    where: {
      postId_userId: { postId: parseInt(postId), userId: parseInt(userId) }
    },
    update: { type },
    create: {
      postId: parseInt(postId),
      userId: parseInt(userId),
      type
    }
  });
};

// Create a story
export const createStory = async (userId, content) => {
  return await prisma.story.create({
    data: {
      userId: parseInt(userId),
      content
    }
  });
};

// Get stories for a user's feed
// export const getStories = async (userId) => {
//   const followingUsers = await prisma.userFollow.findMany({
//     where: { followerId: parseInt(userId) },
//     select: { followingId: true }
//   });

//   const followingIds = followingUsers.map(follow => follow.followingId);

//   return await prisma.story.findMany({
//     where: {
//       userId: { in: [...followingIds, parseInt(userId)] },
//       expiresAt: { gt: new Date() }
//     },
//     include: { user: true },
//     orderBy: { createdAt: 'desc' }
//   });
// };

export const addComment = async (postId, content, userId) => {
  userId = parseInt(userId)
  const response = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      content,
      userId
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to add comment");
  }
  const data = await response.json();
  return data;
};


export const getMentionSuggestions = async (query) => {
  console.log(query);

  const users = await prisma.user.findMany({
    where: {
        OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { tag: { contains: query, mode: 'insensitive' } }
        ]
    },
    take: 5,
    select: { id: true, fullName: true, email: true, tag: true }
  });
  console.log(users,"user data")  
  
  return users;
};


export const addStory = async (imageUrl, userId) => {
  try {
    console.log("in add story")
    const story = await prisma.story.create({
      data: {
        userId: parseInt(userId),
        content: imageUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        cloudinaryPublicId: imageUrl.split('/').pop().split('.')[0] // Extract public_id from URL
      },
      include: {
        user: true,
      },
    });
    return story;
  } catch (error) {
    console.error("Error adding story:", error);
    throw error;
  }
};




export const getStories = async (userId) => {
  try {
    const userStories = await prisma.story.findMany({
      where: {
        userId: userId,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const followingStories = await prisma.story.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group stories by user
    const groupedStories = [...userStories, ...followingStories].reduce((acc, story) => {
      if (!acc[story.userId]) {
        acc[story.userId] = { user: story.user, stories: [] };
      }
      acc[story.userId].stories.push(story);
      return acc;
    }, {});

    return Object.values(groupedStories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};