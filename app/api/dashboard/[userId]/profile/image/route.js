// app/api/profile/[userId]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/prisma/db/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

//app/api/profile/[userId]/image/route.js
export async function PUT(request, { params }) {
    const { id } = params;
  
    try {
      const formData = await request.formData();
      const file = formData.get('profilePicture');
  
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }
  
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + path.extname(file.name);
      const filepath = path.join(process.cwd(), 'public/assets/profiles', filename);
      
      await writeFile(filepath, buffer);
  
      const profilePictureUrl = `/assets/profiles/${filename}`;
  
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { profilePictureUrl },
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
      console.error('Error updating profile picture:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }