import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma/db/prisma';

export async function POST(request) {
  let data;
  
  try {
    data = await request.json();
  } catch (error) {
    // If parsing JSON fails, it might be form data
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      return handleRegister(Object.fromEntries(formData));
    }
    return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
  }

  const { action, ...userData } = data;

  if (action === 'login') {
    return handleLogin(userData);
  } else if (action === 'register') {
    return handleRegister(userData);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

async function handleLogin({ registrationNumber, password, college }) {
  registrationNumber = registrationNumber.toUpperCase();
  const user = await prisma.user.findFirst({
    where: { 
      registrationNumber,
      college
    }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return NextResponse.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, profilePictureUrl: user.profilePictureUrl } });
}

async function handleRegister(data) {
  const { fullName, email, password, college, registrationNumber, gender, profilePictureUrl, tag } = data;
  
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { registrationNumber: registrationNumber.toUpperCase() },
        { email },
      ],
    },
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      fullName,
      registrationNumber: registrationNumber.toUpperCase(),
      email,
      password: hashedPassword,
      tag,
      college,
      gender,
      profilePictureUrl,
    },
  });

  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return NextResponse.json({
    token,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePictureUrl: newUser.profilePictureUrl
    }
  });
}