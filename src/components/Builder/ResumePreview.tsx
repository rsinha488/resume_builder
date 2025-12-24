'use client';
import { useAppSelector } from '@/lib/hooks';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import PrimoTemplate from './PrimoTemplate';
import MinimalTemplate from './MinimalTemplate';
import CascadeTemplate from './CascadeTemplate';

export default function ResumePreview() {
    const resume = useAppSelector((state) => state.resume);
    const { templateId } = resume;

    switch (templateId) {
        case 'classic':
            return <ClassicTemplate data={resume} />;
        case 'primo':
            return <PrimoTemplate data={resume} />;
        case 'minimal':
            return <MinimalTemplate data={resume} />;
        case 'cascade':
            return <CascadeTemplate data={resume} />;
        case 'modern':
        default:
            return <ModernTemplate data={resume} />;
    }
}
