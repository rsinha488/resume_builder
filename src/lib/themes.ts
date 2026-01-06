export interface ColorPalette {
    id: string;
    name: string;
    primary: string;
    secondary: string;
    premium: boolean;
}

export interface FontPairing {
    id: string;
    name: string;
    heading: string;
    body: string;
    premium: boolean;
}

export const COLOR_PALETTES: ColorPalette[] = [
    { id: 'zety-blue', name: 'Zety Blue', primary: '#2563eb', secondary: '#1e40af', premium: false },
    { id: 'emerald', name: 'Emerald City', primary: '#059669', secondary: '#064e3b', premium: false },
    { id: 'slate', name: 'Professional Slate', primary: '#475569', secondary: '#1e293b', premium: false },
    { id: 'navy', name: 'Navy Corporate', primary: '#1e3a8a', secondary: '#172554', premium: false },
    { id: 'royal', name: 'Royal Purple', primary: '#7c3aed', secondary: '#4c1d95', premium: true },
    { id: 'crimson', name: 'Executive Crimson', primary: '#dc2626', secondary: '#7f1d1d', premium: true },
    { id: 'midnight', name: 'Midnight Gold', primary: '#111827', secondary: '#92400e', premium: true },
    { id: 'ocean', name: 'Deep Ocean', primary: '#0891b2', secondary: '#164e63', premium: true },
    { id: 'forest', name: 'Forest Growth', primary: '#166534', secondary: '#052e16', premium: true },
    { id: 'terracotta', name: 'Modern Terracotta', primary: '#9a3412', secondary: '#431407', premium: true },
    { id: 'gold', name: 'Luxury Gold', primary: '#a16207', secondary: '#422006', premium: true },
    { id: 'teal', name: 'Modern Teal', primary: '#0d9488', secondary: '#0f172a', premium: true },
];

export const FONT_PAIRINGS: FontPairing[] = [
    { id: 'modern-sans', name: 'Modern Sans', heading: 'Inter, sans-serif', body: 'Inter, sans-serif', premium: false },
    { id: 'classic-serif', name: 'Classic Serif', heading: 'Georgia, serif', body: 'Georgia, serif', premium: false },
    { id: 'elegant-mix', name: 'Elegant Mix', heading: 'Playfair Display, serif', body: 'Lato, sans-serif', premium: true },
    { id: 'tech-clean', name: 'Tech Clean', heading: 'Roboto Mono, monospace', body: 'Roboto, sans-serif', premium: true },
    { id: 'corporate', name: 'Corporate', heading: 'Montserrat, sans-serif', body: 'Open Sans, sans-serif', premium: true },
];
