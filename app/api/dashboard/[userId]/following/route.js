import prisma from "@/prisma/db/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const currentUserId = params.userId;

  if (!currentUserId || isNaN(parseInt(currentUserId))) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const following = await prisma.userFollow.findMany({
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

    const totalFollowing = following.length;

    return NextResponse.json({
      following: following.map(f => f.following),
      totalFollowing,
      currentPage: 1,
      totalPages: 1,
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}