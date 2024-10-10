// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { subscription, userId } = await req.json(); // Extract userId and subscription from the request body

  if (!userId) {
    return NextResponse.json({ error: 'User ID is missing' }, { status: 400 });
  }

  // Update the user to store the subscription
  try {
    await prisma.user.update({
      where: { id: Number(userId) }, // Use the passed userId to update the user
      data: { subscription: JSON.stringify(subscription) },
    });

    return NextResponse.json({ message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Error saving subscription' }, { status: 500 });
  }
}
