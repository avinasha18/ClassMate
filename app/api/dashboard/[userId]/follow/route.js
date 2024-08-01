// app/api/users/[userId]/follow/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function POST(request, { params }) {
  const { userId } = params;
  const body = await request.json();
  const { followerId } = body;

  try {
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(followerId),
          followingId: parseInt(userId),
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.userFollow.delete({
        where: {
          followerId_followingId: {
            followerId: parseInt(followerId),
            followingId: parseInt(userId),
          },
        },
      });
      return NextResponse.json({ message: 'Unfollowed successfully' });
    } else {
      // Follow
      await prisma.userFollow.create({
        data: {
          followerId: parseInt(followerId),
          followingId: parseInt(userId),
        },
      });
      return NextResponse.json({ message: 'Followed successfully' });
    }
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}