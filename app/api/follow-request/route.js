import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import prisma from '@/prisma/db/prisma';
// const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { currentUserId, userIdToFollow } = body;

  if (!currentUserId || !userIdToFollow) {
    return NextResponse.json({ message: 'Both currentUserId and userIdToFollow are required' }, { status: 400 });
  }

  try {
    const existingRequest = await prisma.followRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: parseInt(currentUserId),
          receiverId: parseInt(userIdToFollow),
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: 'Follow request already sent', status: 'requested' });
    }

    const followRequest = await prisma.followRequest.create({
      data: {
        senderId: parseInt(currentUserId),
        receiverId: parseInt(userIdToFollow),
      },
    });

    return NextResponse.json({ message: 'Follow request sent', status: 'requested', followRequest });
  } catch (error) {
    console.error('Error creating follow request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}