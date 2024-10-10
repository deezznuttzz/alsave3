// app/api/auth/login/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Generate tokens
  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email });

  // Store refresh token in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const response = NextResponse.json({ accessToken, userId: user.id }); // Include userId in the response

  // Set refresh token as an HttpOnly cookie
  response.cookies.set('refreshToken', refreshToken, { httpOnly: true, path: '/' });

  return response;
}
