// app/api/profile/[userId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { id } = params;
    console.log(id)
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        registrationNumber: true,
        fullName: true,
        email: true,
        tag: true,
        college: true,
        gender: true,
        bio: true,
        profilePictureUrl: true,
        _count: {
          select: { followers: true, following: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      followersCount: user._count.followers,
      followingCount: user._count.following
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        fullName: data.fullName,
        bio: data.bio,
      },
      select: {
        id: true,
        registrationNumber: true,
        fullName: true,
        email: true,
        tag: true,
        college: true,
        gender: true,
        bio: true,
        profilePictureUrl: true,
        _count: {
          select: { followers: true, following: true }
        }
      }
    });

    return NextResponse.json({
      ...updatedUser,
      followersCount: updatedUser._count.followers,
      followingCount: updatedUser._count.following
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
