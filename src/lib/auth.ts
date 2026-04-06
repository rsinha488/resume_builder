import jwt from 'jsonwebtoken';

const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET environment variable is not set.');
    return secret;
};

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, getSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, getSecret()) as { userId: string };
    } catch (error) {
        return null;
    }
};

export const getUserFromRequest = (request: Request) => {
    // 1. Try to get from Authorization header (Legacy support)
    let token = request.headers.get('authorization')?.split(' ')[1];
    
    // 2. Try to get from Next.js NextRequest.cookies (if available)
    if (!token && 'cookies' in request && typeof (request as any).cookies.get === 'function') {
        token = (request as any).cookies.get('token')?.value;
    }

    // 3. Fallback: Parse 'cookie' header manually for standard Request objects
    if (!token) {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
            // Robust regex to find the 'token' cookie value
            const match = cookieHeader.match(/(^|;\s*)token\s*=\s*([^;]+)/);
            if (match) {
                token = match[2];
            }
        }
    }

    if (!token) return null;
    return verifyToken(token);
};
