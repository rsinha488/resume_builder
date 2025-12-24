import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
        return null;
    }
};

export const getUserFromRequest = async () => {
    const headersList = await headers();
    const token = headersList.get('authorization')?.split(' ')[1];
    if (!token) return null;
    return verifyToken(token);
};
