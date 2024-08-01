import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function GET(request, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const id = parseInt(userId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        tag: true,
        bio: true,
        profilePictureUrl: true,
        _count: {
          select: {
            followers: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const followingCount = await prisma.userFollow.count({
      where: { followerId: id },
    });

    return NextResponse.json({
      ...user,
      followersCount: user._count.followers,
      followingCount,
      postsCount: user._count.posts,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}