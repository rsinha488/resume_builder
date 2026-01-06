export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
    thumbnail?: string;
    isRecommended?: boolean;
}

export const TEMPLATES: TemplateMetadata[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'A clean and professional look with a sidebar.',
        isPremium: false,
        isRecommended: true,
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'A traditional single-column layout for conservative industries.',
        isPremium: false,
    },
    {
        id: 'primo',
        name: 'Primo',
        description: 'A bold and creative design with high-impact visuals.',
        isPremium: true,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant, focusing purely on content.',
        isPremium: true,
    },
    {
        id: 'cascade',
        name: 'Cascade',
        description: 'A modern two-column design with a colored sidebar.',
        isPremium: true,
        isRecommended: true,
    },
    {
        id: 'concept',
        name: 'Concept',
        description: 'Modern and clean with subtle icons and a professional top bar.',
        isPremium: true,
        isRecommended: true,
    },
    {
        id: 'diamond',
        name: 'Diamond',
        description: 'Bold geometric headers for high impact and modern feel.',
        isPremium: true,
    },
    {
        id: 'influx',
        name: 'Influx',
        description: 'A professional top-bar layout with a focus on hierarchy.',
        isPremium: true,
    },
    {
        id: 'vibes',
        name: 'Vibes',
        description: 'Creative design with a right-hand sidebar for a unique look.',
        isPremium: true,
    },
    {
        id: 'muse',
        name: 'Muse',
        description: 'Elegant and sophisticated with serif typography and classic spacing.',
        isPremium: true,
    },
];
