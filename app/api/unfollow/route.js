import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { currentUserId, userIdToUnfollow } = body;

  if (!currentUserId || !userIdToUnfollow) {
    return NextResponse.json({ message: 'Both currentUserId and userIdToUnfollow are required' }, { status: 400 });
  }

  try {
    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId: parseInt(currentUserId),
          followingId: parseInt(userIdToUnfollow),
        },
      },
    });

    return NextResponse.json({ message: 'Unfollowed successfully', status: 'unfollowed' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}