export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
    thumbnail?: string;
}

export const TEMPLATES: TemplateMetadata[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'A clean and professional look with a sidebar.',
        isPremium: false,
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
    },
];
