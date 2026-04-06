let sharedPurify: any = null;

/**
 * Lazily initializes and returns the DOMPurify instance.
 * This prevents build-time errors related to JSDOM's ESM/CJS dependencies.
 */
const getPurify = async () => {
    if (sharedPurify) return sharedPurify;
    
    // Defer loading to runtime
    const { JSDOM } = await import('jsdom');
    const createDOMPurify = (await import('dompurify')).default;
    
    const window = new JSDOM('').window;
    sharedPurify = createDOMPurify(window as any);
    return sharedPurify;
};

/**
 * Sanitizes a string to remove any HTML tags or script patterns.
 * This is the primary defense against XSS in resume text.
 */
export const sanitizeString = async (str: string): Promise<string> => {
    if (!str) return '';
    const purify = await getPurify();
    // Strip all HTML tags entirely for resume text
    return purify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
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
