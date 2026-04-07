/**
 * Sanitizes a string by stripping all HTML tags.
 * This is safe for resume text which should only contain plain text.
 * This avoids problematic server-side dependencies like JSDOM.
 */
export const sanitizeString = async (str: string): Promise<string> => {
    if (!str) return '';
    // Strip all HTML tags
    const clean = str.replace(/<[^>]*>?/gm, '');
    // Decode common HTML entities that might be in the source
    return clean
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
};

/**
 * Recursively sanitizes a JSON object.
 * Useful for cleaning resume data before saving to the database.
 */
export const sanitizeObject = async <T>(obj: T): Promise<T> => {
    if (typeof obj === 'string') {
        return (await sanitizeString(obj)) as unknown as T;
    }
    
    if (Array.isArray(obj)) {
        const sanitizedArray = await Promise.all(obj.map(item => sanitizeObject(item)));
        return sanitizedArray as unknown as T;
    }
    
    if (obj !== null && typeof obj === 'object') {
        const sanitizedObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitizedObj[key] = await sanitizeObject(value);
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
