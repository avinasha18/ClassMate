import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/prisma/db/prisma';
// const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json(
        { message: 'currentUserId is required' },
        { status: 400 }
      );
    }

    const parsedCurrentUserId = parseInt(currentUserId);

    if (isNaN(parsedCurrentUserId)) {
      return NextResponse.json(
        { message: 'currentUserId must be a valid number' },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        NOT: { id: parsedCurrentUserId },
      },
      select: {
        id: true,
        fullName: true,
        registrationNumber: true,
        tag: true,
        profilePictureUrl: true,
        followers: {
          where: { followerId: parsedCurrentUserId },
        },
      },
      take: 5, // Limit to 5 suggestions
    });

    const formattedUsers = users
      .filter(user => user.followers.length === 0)
      .map(user => ({
        id: user.id,
        fullName: user.fullName,
        registrationNumber: user.registrationNumber,
        tag: user.tag,
        profilePictureUrl: user.profilePictureUrl,
      }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching follow suggestions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}