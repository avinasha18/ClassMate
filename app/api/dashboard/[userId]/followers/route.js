import prisma from "@/prisma/db/prisma";
import { NextResponse } from "next/server";
export async function GET(request, { params }) {
  const currentUserId = params.userId;

  if (!currentUserId || isNaN(parseInt(currentUserId))) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const followers = await prisma.userFollow.findMany({
      where: { followerId: parseInt(currentUserId) },
      select: {
        following: {
          select: {
            id: true,
            fullName: true,
            tag: true,
            profilePictureUrl: true,
            email: true,
            bio: true,
          },
        },
      },
    });

    const totalFollowers = followers.length;

    return NextResponse.json({
      followers: followers.map(f => f.following),
      totalFollowers,
      currentPage: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}