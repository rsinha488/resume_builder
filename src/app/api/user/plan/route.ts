import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan, subscriptionType } = await request.json();

        if (!['FREE', 'PRO'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        let planExpiry = null;
        if (subscriptionType === 'TRIAL') {
            planExpiry = new Date();
            planExpiry.setDate(planExpiry.getDate() + 14); // 14 days trial
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.userId },
            data: {
                plan,
                subscriptionType: subscriptionType || 'NONE',
                planExpiry
            },
        });

        return NextResponse.json({
            message: `Plan updated to ${plan} (${subscriptionType})`,
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                plan: updatedUser.plan,
                subscriptionType: updatedUser.subscriptionType,
                planExpiry: updatedUser.planExpiry
            }
        });
    } catch (error) {
        console.error('Plan update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const user = await getUserFromRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { plan: true }
        });

        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
