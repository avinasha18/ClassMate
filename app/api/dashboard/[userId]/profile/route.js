// app/api/profile/[userId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
  const { userId } = params;
  const formData = await request.formData();

  try {
    const updateData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      tag: formData.get('tag'),
      college: formData.get('college'),
      gender: formData.get('gender'),
      bio: formData.get('bio'),
    };

    const profilePicture = formData.get('profilePicture');
    if (profilePicture) {
      const buffer = await profilePicture.arrayBuffer();
      const filename = `${Date.now()}-${profilePicture.name}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(filepath, Buffer.from(buffer));
      updateData.profilePictureUrl = `/uploads/${filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
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