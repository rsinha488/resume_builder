import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/builder', '/cover-letter', '/templates'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    const response = isProtected && !token 
        ? NextResponse.redirect(new URL('/login', request.url))
        : isAuthRoute && token
        ? NextResponse.redirect(new URL('/dashboard', request.url))
        : NextResponse.next();

    // --- SECURITY HEADERS ---
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' blob: data: https://res.cloudinary.com;
        connect-src 'self' https://api.cloudinary.com;
        frame-ancestors 'none';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    
    // Add HSTS in production
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/builder/:path*', '/cover-letter/:path*', '/templates/:path*', '/login', '/register'],
};
