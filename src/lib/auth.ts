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
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;
    return verifyToken(token);
};
