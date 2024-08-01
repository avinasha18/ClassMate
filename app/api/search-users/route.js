import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const currentUserId = searchParams.get('currentUserId'); // Get the current user ID from the query params

  if (!query) {
    return NextResponse.json({ message: 'Query is required' }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { registrationNumber: { contains: query, mode: 'insensitive' } },
          { tag: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        registrationNumber: true,
        tag: true,
        profilePictureUrl: true,
      },
    });

    const userFollowStatus = await Promise.all(users.map(async (user) => {
      const isFollowing = await prisma.userFollow.findUnique({
        where: {
          followerId_followingId: {
            followerId: parseInt(currentUserId),
            followingId: user.id,
          },
        },
      });

      const isRequested = await prisma.followRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: parseInt(currentUserId),
            receiverId: user.id,
          },
        },
      });

      return {
        ...user,
        followStatus: isFollowing ? 'following' : isRequested ? 'requested' : 'follow',
      };
    }));

    return NextResponse.json(userFollowStatus);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
