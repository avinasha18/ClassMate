// app/api/add-story/route.js
import { NextResponse } from "next/server";
import prisma from "@/prisma/db/prisma";

export async function POST(request) {
  try {
    const { imageUrl, userId } = await request.json();
    
    const story = await prisma.story.create({
      data: {
        userId: parseInt(userId),
        content: imageUrl,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        cloudinaryPublicId: imageUrl.split('/').pop().split('.')[0], // Extract public_id from URL
      },
      include: {
        user: true,
      },
    });
    
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error adding story:", error);
    return NextResponse.error();
  }
}
