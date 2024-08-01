import { NextResponse } from "next/server";
import prisma from "@/prisma/db/prisma";

export async function POST(request) {
  try {
    const { postId, content, userId } = await request.json();
    if (!postId || !content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newComment = await prisma.comment.create({
      data: {
        postId,
        content,
        userId
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
