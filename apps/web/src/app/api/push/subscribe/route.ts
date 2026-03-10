import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for subscriptions (use database in production)
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    // Validate subscription
    if (!subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Store subscription (use database in production)
    const key = subscription.endpoint;
    subscriptions.set(key, {
      ...subscription,
      createdAt: new Date().toISOString(),
    });

    console.log('Push subscription saved:', key);

    return NextResponse.json({
      success: true,
      message: 'Subscription saved',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const subscription = await request.json();

    if (!subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Remove subscription
    const key = subscription.endpoint;
    const deleted = subscriptions.delete(key);

    if (deleted) {
      console.log('Push subscription removed:', key);
      return NextResponse.json({
        success: true,
        message: 'Subscription removed',
      });
    } else {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all subscriptions (for admin use)
  return NextResponse.json({
    count: subscriptions.size,
    subscriptions: Array.from(subscriptions.values()),
  });
}
