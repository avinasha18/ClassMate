// middleware.js

import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};