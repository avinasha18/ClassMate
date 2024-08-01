import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function POST(req) {
  try {
    const { requestId, senderId, userId } = await req.json();

    // Find the follow request
    const followRequest = await prisma.followRequest.findUnique({
      where: { id: requestId },
    });

    if (!followRequest) {
      return NextResponse.json({ error: 'Follow request not found' }, { status: 404 });
    }

    // Check if a follow relationship already exists
    const existingFollow = await prisma.userFollow.findFirst({
      where: {
        followerId: senderId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      return NextResponse.json({ message: 'Follow relationship already exists' }, { status: 400 });
    }

    // Create follow relationship
    await prisma.userFollow.create({
      data: {
        followerId: senderId,
        followingId: userId,
      },
    });

    // Delete the follow request
    await prisma.followRequest.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ message: 'Follow request accepted' }, { status: 200 });
  } catch (error) {
    console.error('Error accepting follow request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
