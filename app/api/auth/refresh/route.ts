import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
  }

  try {
    // Decode the refresh token
    const decoded = verifyRefreshToken(refreshToken) as { id: string; email: string };
    
    // Convert the decoded.id from string to number (since Prisma expects an Int)
    const userId = parseInt(decoded.id, 10);  // Convert string to number

    // Find the user using the numeric ID
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
    }

    // Generate a new access token
    const accessToken = signAccessToken({ id: user.id, email: user.email });

    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
  }
}
