import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import prisma from '@/prisma/db/prisma';
// const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const currentUserId = parseInt(searchParams.get('id'));

  if (!currentUserId) {
    return NextResponse.json({ message: 'Current user ID is required' }, { status: 400 });
  }

  try {
    const following = await prisma.userFollow.findMany({
      where: { followerId: currentUserId },
      select: {
        followingId: true, // Assuming the `userFollow` model has a field `followingId`
      },
    });
    
    // Extracting the IDs from the `following` array
    const followingIds = following.map(f => f.followingId);
    
    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [currentUserId, ...followingIds], // Exclude the current user and those already being followed
        },
      },
      take: 10, // Limit to top 10 users
      orderBy: {
        registrationNumber: 'desc', // Adjust this as needed, e.g., by popularity, recent activity, etc.
      },
      select: {
        id: true,
        fullName: true,
        registrationNumber: true,
        tag: true,
        profilePictureUrl: true,
      },
    });
    
    console.log(users);
    
    // console.log(users)
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
