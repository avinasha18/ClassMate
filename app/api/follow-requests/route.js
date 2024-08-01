// /pages/api/follow-requests.js

import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const followRequests = await prisma.FollowRequest.findMany({
      where: { receiverId: parseInt(userId) },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            profilePictureUrl: true,
            registrationNumber: true,
          },
        },
      },
    });

    return NextResponse.json(followRequests, { status: 200 });
  } catch (error) {
    console.error('Error fetching follow requests:', error);
    return NextResponse.json({ error: 'Failed to fetch follow requests' }, { status: 500 });
  }
}