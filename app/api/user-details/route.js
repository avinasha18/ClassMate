// app/api/user-details/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        profilePictureUrl: true,
        registrationNumber: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}