import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const currentUserId = parseInt(searchParams.get('id'));

  if (!currentUserId) {
    return NextResponse.json({ message: 'Current user ID is required' }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId } // Exclude the current user
      },
      take: 10, // Limit to top 10 users
      orderBy: {
        // Adjust this as needed, e.g., by popularity, recent activity, etc.
        registrationNumber: 'desc'
      },
      select: {
        id: true,
        fullName: true,
        registrationNumber: true,
        tag: true,
        profilePictureUrl: true,
      },
    });
    // console.log(users)
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
