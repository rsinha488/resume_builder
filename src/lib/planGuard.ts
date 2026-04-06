import { prisma } from '@/lib/prisma';

/**
 * Checks if a user has an active PRO plan (not expired).
 * Returns { isPro: true } if active, or { isPro: false, reason } if not.
 */
export async function checkProAccess(userId: string): Promise<{ isPro: boolean; reason?: string; aiUsageCount: number }> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, planExpiry: true, subscriptionType: true, aiUsageCount: true },
    });

    if (!user) return { isPro: false, reason: 'User not found', aiUsageCount: 0 };
    if (user.plan !== 'PRO') return { isPro: false, reason: 'Free plan', aiUsageCount: user.aiUsageCount || 0 };

    // Annual subscriptions managed by Stripe — no client-side expiry check needed
    if (user.subscriptionType === 'ANNUAL') return { isPro: true, aiUsageCount: user.aiUsageCount || 0 };

    // Trial: check expiry
    if (user.planExpiry && new Date() > user.planExpiry) {
        // Auto-downgrade expired trial
        await prisma.user.update({
            where: { id: userId },
            data: { plan: 'FREE', subscriptionType: 'NONE', planExpiry: null },
        });
        return { isPro: false, reason: 'Trial expired', aiUsageCount: user.aiUsageCount || 0 };
    }

    return { isPro: true, aiUsageCount: user.aiUsageCount || 0 };
}
