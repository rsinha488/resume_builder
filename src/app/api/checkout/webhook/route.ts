import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const subscriptionType = session.metadata?.subscriptionType as 'TRIAL' | 'ANNUAL';

                if (!userId || !subscriptionType) break;

                let planExpiry: Date | null = null;
                if (subscriptionType === 'TRIAL') {
                    planExpiry = new Date();
                    planExpiry.setDate(planExpiry.getDate() + 14);
                }

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan: 'PRO',
                        subscriptionType,
                        planExpiry,
                        stripeCustomerId: session.customer as string | null,
                        stripeSubscriptionId: session.subscription as string | null,
                    },
                });
                break;
            }

            case 'customer.subscription.deleted': {
                // Subscription cancelled — downgrade to FREE
                const subscription = event.data.object as Stripe.Subscription;
                await prisma.user.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        plan: 'FREE',
                        subscriptionType: 'NONE',
                        planExpiry: null,
                        stripeSubscriptionId: null,
                    },
                });
                break;
            }

            case 'invoice.payment_failed': {
                // Renewal failed — downgrade to FREE
                const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } | null };
                const rawSub = invoice.subscription;
                const subId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
                if (subId) {
                    await prisma.user.updateMany({
                        where: { stripeSubscriptionId: subId },
                        data: { plan: 'FREE', subscriptionType: 'NONE', planExpiry: null },
                    });
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const status = subscription.status;
                if (status === 'active') {
                    await prisma.user.updateMany({
                        where: { stripeSubscriptionId: subscription.id },
                        data: { plan: 'PRO' },
                    });
                } else if (status === 'past_due' || status === 'unpaid') {
                    await prisma.user.updateMany({
                        where: { stripeSubscriptionId: subscription.id },
                        data: { plan: 'FREE', subscriptionType: 'NONE', planExpiry: null },
                    });
                }
                break;
            }

            case 'invoice.payment_action_required': {
                // 3D Secure / SCA required — downgrade until resolved
                const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } | null };
                const rawSub = invoice.subscription;
                const subId = typeof rawSub === 'string' ? rawSub : rawSub?.id;
                if (subId) {
                    await prisma.user.updateMany({
                        where: { stripeSubscriptionId: subId },
                        data: { plan: 'FREE', subscriptionType: 'NONE', planExpiry: null },
                    });
                }
                break;
            }
        }
    } catch (err) {
        console.error('Webhook handler error:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
