import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push (set VAPID keys in environment variables)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@edunexus.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, notification } = body;

    // Validate input
    if (!subscription || !notification) {
      return NextResponse.json(
        { error: 'Missing subscription or notification data' },
        { status: 400 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title: notification.title || 'EduNexus',
      body: notification.body || '',
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/icon-96x96.png',
      tag: notification.tag || 'default',
      data: notification.data || {},
      actions: notification.actions || [],
      requireInteraction: notification.requireInteraction || false,
    });

    // Send push notification
    await webpush.sendNotification(subscription, payload);

    console.log('Push notification sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
    });
  } catch (error) {
    console.error('Send notification error:', error);

    // Handle specific errors
    if ((error as any).statusCode === 410) {
      // Subscription expired, should be removed
      return NextResponse.json(
        { error: 'Subscription expired', expired: true },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Batch send notifications
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptions, notification } = body;

    if (!Array.isArray(subscriptions) || !notification) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const payload = JSON.stringify({
      title: notification.title || 'EduNexus',
      body: notification.body || '',
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/icon-96x96.png',
      tag: notification.tag || 'default',
      data: notification.data || {},
      actions: notification.actions || [],
      requireInteraction: notification.requireInteraction || false,
    });

    // Send to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub, payload))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Batch notification sent: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Batch notification sent',
      stats: { successful, failed, total: subscriptions.length },
    });
  } catch (error) {
    console.error('Batch send error:', error);
    return NextResponse.json(
      { error: 'Failed to send batch notifications' },
      { status: 500 }
    );
  }
}
