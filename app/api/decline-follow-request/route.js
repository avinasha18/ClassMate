// app/api/decline-follow-request/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function POST(request) {
  const { requestId } = await request.json();

  if (!requestId) {
    return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
  }

  try {
    await prisma.followRequest.delete({
      where: { id: parseInt(requestId) },
    });

    return NextResponse.json({ message: 'Follow request declined' }, { status: 200 });
  } catch (error) {
    console.error('Error declining follow request:', error);
    return NextResponse.json({ error: 'Failed to decline follow request' }, { status: 500 });
  }
}