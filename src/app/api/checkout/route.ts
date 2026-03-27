import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { plan, subscriptionType } = await req.json();

        // Simulate Stripe Checkout Session creation
        // In a real app, you would use stripe.checkout.sessions.create()

        const mockSessionId = `cs_test_${Math.random().toString(36).substring(7)}`;
        const mockUrl = `/api/checkout/mock-success?session_id=${mockSessionId}&plan=${plan}&type=${subscriptionType}`;

        return NextResponse.json({ url: mockUrl });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
