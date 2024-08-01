import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = parseInt(url.searchParams.get('id'));
        const type = url.searchParams.get('type');
        
        if (!id) {
            return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                id: true,
                fullName: true,
                email: true,
                profilePictureUrl: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (type === "POSTS") {
            const { posts, postUserData } = await getPosts(id);
            return NextResponse.json({ user, posts, postUserData }, { status: 200 });
        }

        if (type === "switchLike") {
            const postId = parseInt(url.searchParams.get('postId'));
            const switchLikeData = await switchLike(postId, id);
            return NextResponse.json({ switchLikeData }, { status: 200 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function POST(request){
    try {
        const body = await request.json();
        const {id, type} = body;
    }
    catch(e){
        console.log(e)
        return new Error("Post error at user route")
    }
}

// Helper function to get posts by user ID
const getPosts = async (userId) => {
    // console.log("in get posts");

    // Get the IDs of users that the current user is following
    const userFollowing = await prisma.userFollow.findMany({
        where: {
            followerId: userId
        },
        select: {
            followingId: true
        }
    });
    const postUserData = await prisma.user.findMany({
        where: {
            id: {
                in : userFollowing.map((user) => user.followingId)
            }
        },
        select : {
            id : true,
            profilePictureUrl: true,
            fullName: true,
            tag : true,
            registrationNumber : true
        }
    })
    // console.log(postUserData,"Post user data")
    // Extract the following IDs into an array
    const followingIds = userFollowing.map(follow => follow.followingId);
    // console.log('Following IDs:', followingIds);

    // Fetch posts from the users that the current user is following
    const posts = await prisma.post.findMany({
        where: {
            userId: {
                in: followingIds
            }
        },
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

    // console.log('Posts data:', posts);
    return {posts,postUserData};
};

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
export const commentCountFun =  async (postId)=> {
    const commentCount = await prisma.comment.count({
        where: {
            postId : postId
        }
    });
    return commentCount
}

// Post related functions

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
export const addComment = async (postId, content, userId) => {
  return await prisma.comment.create({
    data: {
      postId: parseInt(postId),
      userId: parseInt(userId),
      content: content
    },
    include: { user: true }
  });
};

// User mention suggestions
export const getMentionSuggestions = async (query) => {
  return await prisma.user.findMany({
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
};

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
export const getStories = async (userId) => {
  const followingUsers = await prisma.userFollow.findMany({
    where: { followerId: parseInt(userId) },
    select: { followingId: true }
  });

  const followingIds = followingUsers.map(follow => follow.followingId);

  return await prisma.story.findMany({
    where: {
      userId: { in: [...followingIds, parseInt(userId)] },
      expiresAt: { gt: new Date() }
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
};

