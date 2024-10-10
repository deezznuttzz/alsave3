import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 400 });
  }

  await prisma.user.updateMany({
    where: { refreshToken },
    data: { refreshToken: null },
  });

  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('refreshToken', '', { httpOnly: true, expires: new Date(0) });

  return response;
}
