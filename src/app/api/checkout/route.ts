import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    try {
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subscriptionType } = await req.json();

        if (!['TRIAL', 'ANNUAL'].includes(subscriptionType)) {
            return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
        }

        const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const priceId = subscriptionType === 'TRIAL'
            ? process.env.STRIPE_TRIAL_PRICE_ID!
            : process.env.STRIPE_ANNUAL_PRICE_ID!;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: dbUser.email,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${appUrl}/dashboard?upgrade=success`,
            cancel_url: `${appUrl}/dashboard?upgrade=cancelled`,
            metadata: {
                userId: user.userId,
                subscriptionType,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
