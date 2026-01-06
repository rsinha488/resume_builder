'use client';
import { useAppSelector } from '@/lib/hooks';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import PrimoTemplate from './PrimoTemplate';
import MinimalTemplate from './MinimalTemplate';
import CascadeTemplate from './CascadeTemplate';
import ConceptTemplate from './ConceptTemplate';
import DiamondTemplate from './DiamondTemplate';
import InfluxTemplate from './InfluxTemplate';
import VibesTemplate from './VibesTemplate';
import MuseTemplate from './MuseTemplate';

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
        case 'concept':
            return <ConceptTemplate data={resume} />;
        case 'diamond':
            return <DiamondTemplate data={resume} />;
        case 'influx':
            return <InfluxTemplate data={resume} />;
        case 'vibes':
            return <VibesTemplate data={resume} />;
        case 'muse':
            return <MuseTemplate data={resume} />;
        case 'modern':
        default:
            return <ModernTemplate data={resume} />;
    }
}
