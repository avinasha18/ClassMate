import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';

export async function GET(request, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const id = parseInt(userId);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}