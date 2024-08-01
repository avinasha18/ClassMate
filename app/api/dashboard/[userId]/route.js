import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function POST(request, { params }) {
  const { userId } = params;
  const { desc, media } = await request.json();

  if (!desc && !media) {
    return NextResponse.json({ error: 'Post content or media is required' }, { status: 400 });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        userId: parseInt(userId),
        content: desc,
        imageUrl: media,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}