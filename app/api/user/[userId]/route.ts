import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';  // Adjust the path to your Prisma client setup

// Handle GET requests
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
