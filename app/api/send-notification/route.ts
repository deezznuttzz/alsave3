import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:danieldavel22@gmail.com', // Replace with your email
  'BBndgWKwLs0XPuy9DIH-Og5YpGrEdHjAIu4eW561L-gmXbqpqLm_gEHoE_pZwWtD0pQFf01CPWBpB0oprDXr7ZM' as string,  // VAPID public key
  'c87V5ZrVXsvWmXrwftDay1nhjQsrZUaHJsjO4QPJWgE' as string  // VAPID private key
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, message } = body;

    if (!userId) {
      console.log("Invalid user ID:", userId);
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch the user by ID and include the subscription
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        subscription: true,
      },
    });

    if (!user) {
      console.log("User not found:", userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.subscription) {
      console.log("No subscription found for this user:", userId);
      return NextResponse.json({ error: 'No subscription found for this user' }, { status: 400 });
    }

    // Parse the stored JSON subscription into a PushSubscription object
    let subscription;
    try {
      subscription = JSON.parse(user.subscription as unknown as string);
    } catch (parseError) {
      console.error("Failed to parse subscription:", user.subscription);
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    // Validate the subscription object
    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      console.log("Invalid subscription format:", subscription);
      return NextResponse.json({ error: 'Invalid subscription format' }, { status: 400 });
    }

    console.log("Sending notification to subscription:", subscription);

    // Prepare payload for the push notification with the combined message
    const payload = JSON.stringify({
      title: 'Special Offers!',
      message: message,  // Use the combined message for this user
    });

    // Send the push notification using the stored subscription
    await webpush.sendNotification(subscription, payload);

    console.log("Notification sent successfully.");
    return NextResponse.json({ message: 'Notification sent successfully' });
  } catch (error: any) {
    console.error('Error while sending notification:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
