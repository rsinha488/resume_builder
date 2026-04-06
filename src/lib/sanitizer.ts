import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

/**
 * Sanitizes a string to remove any HTML tags or script patterns.
 * This is the primary defense against XSS in resume text.
 */
export const sanitizeString = (str: string): string => {
    if (!str) return '';
    // Strip all HTML tags entirely for resume text
    return purify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

/**
 * Recursively sanitizes a JSON object.
 * Useful for cleaning resume data before saving to the database.
 */
export const sanitizeObject = <T>(obj: T): T => {
    if (typeof obj === 'string') {
        return sanitizeString(obj) as unknown as T;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item)) as unknown as T;
    }
    
    if (obj !== null && typeof obj === 'object') {
        const sanitizedObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitizedObj[key] = sanitizeObject(value);
        }
        return sanitizedObj as T;
    }
    
    return obj;
};

/**
 * Validates if the text contains suspicious patterns like script tags or eval().
 * Returns true if the text is considered suspicious.
 */
export const isSuspicious = (text: string): boolean => {
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /onload=/i,
        /onerror=/i,
        /eval\(/i,
        /setTimeout\(/i,
        /setInterval\(/i,
        /Function\(/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
};
