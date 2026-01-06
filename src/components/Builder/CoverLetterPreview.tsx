'use client';
import { useAppSelector } from '@/lib/hooks';
import ModernCoverLetter from './ModernCoverLetter';
import ClassicCoverLetter from './ClassicCoverLetter';
import CascadeCoverLetter from './CascadeCoverLetter';
import ConceptCoverLetter from './ConceptCoverLetter';
import DiamondCoverLetter from './DiamondCoverLetter';
import InfluxCoverLetter from './InfluxCoverLetter';
import VibesCoverLetter from './VibesCoverLetter';
import MuseCoverLetter from './MuseCoverLetter';
import MinimalCoverLetter from './MinimalCoverLetter';
import PrimoCoverLetter from './PrimoCoverLetter';

export default function CoverLetterPreview() {
    const coverLetter = useAppSelector((state) => state.coverLetter);
    const { templateId } = coverLetter;

    const renderTemplate = () => {
        switch (templateId) {
            case 'classic':
                return <ClassicCoverLetter data={coverLetter} />;
            case 'cascade':
                return <CascadeCoverLetter data={coverLetter} />;
            case 'concept':
                return <ConceptCoverLetter data={coverLetter} />;
            case 'diamond':
                return <DiamondCoverLetter data={coverLetter} />;
            case 'influx':
                return <InfluxCoverLetter data={coverLetter} />;
            case 'vibes':
                return <VibesCoverLetter data={coverLetter} />;
            case 'muse':
                return <MuseCoverLetter data={coverLetter} />;
            case 'minimal':
                return <MinimalCoverLetter data={coverLetter} />;
            case 'primo':
                return <PrimoCoverLetter data={coverLetter} />;
            case 'modern':
            default:
                return <ModernCoverLetter data={coverLetter} />;
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-start p-4 lg:p-8 bg-gray-100 overflow-y-auto">
            <div className="w-full max-w-[210mm] origin-top transform scale-[0.6] sm:scale-[0.8] lg:scale-100 transition-transform duration-300">
                {renderTemplate()}
            </div>
        </div>
    );
}
