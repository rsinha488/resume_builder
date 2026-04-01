import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', {
        httpOnly: false,
        path: '/',
        maxAge: 0,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    return response;
}
