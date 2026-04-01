import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { id: true, email: true, name: true, avatarUrl: true, plan: true, subscriptionType: true, planExpiry: true, createdAt: true },
    });

    if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(data);
}

export async function PATCH(request: Request) {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { name, avatarUrl, currentPassword, newPassword } = body;

    const updateData: { name?: string; avatarUrl?: string; password?: string } = {};

    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
        }
        updateData.name = name.trim();
    }

    if (avatarUrl !== undefined) {
        if (typeof avatarUrl !== 'string') {
            return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
        }
        updateData.avatarUrl = avatarUrl;
    }

    if (newPassword !== undefined) {
        if (!currentPassword) {
            return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
        }
        const valid = await bcrypt.compare(currentPassword, existing.password);
        if (!valid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }
        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: user.userId },
        data: updateData,
        select: { id: true, email: true, name: true, avatarUrl: true, plan: true, subscriptionType: true, planExpiry: true },
    });

    return NextResponse.json(updated);
}
