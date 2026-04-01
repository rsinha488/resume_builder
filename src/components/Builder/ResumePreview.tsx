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

import { SAMPLE_DATA } from '@/lib/sampleData';

import { ResumeState } from '@/lib/features/resume/resumeSlice';

interface ResumePreviewProps {
    readonly data?: ResumeState;
    readonly templateId?: string;
    readonly onSectionClick?: (sectionId: string) => void;
}

export default function ResumePreview({ data, templateId, onSectionClick }: ResumePreviewProps) {
    const stateResume = useAppSelector((state) => state.resume);
    const resume = data || stateResume;

    // Helper to check if personal info is empty
    // Merge logic: Use user data if present, otherwise fallback to sample data
    const displayData: ResumeState = {
        ...resume,
        personalInfo: resume.personalInfo?.fullName ? resume.personalInfo : (SAMPLE_DATA.personalInfo as any),
        experiences: resume.experiences?.length > 0 ? resume.experiences : (SAMPLE_DATA.experiences as any),
        education: resume.education?.length > 0 ? resume.education : (SAMPLE_DATA.education as any),
        skills: resume.skills?.length > 0 ? resume.skills : (SAMPLE_DATA.skills as any),
        languages: resume.languages?.length > 0 ? resume.languages : (SAMPLE_DATA.languages as any),
        certifications: resume.certifications?.length > 0 ? resume.certifications : (SAMPLE_DATA.certifications as any),
        hobbies: resume.hobbies?.length > 0 ? resume.hobbies : (SAMPLE_DATA.hobbies as any),
        // Design fallbacks
        templateId: templateId || resume.templateId || (SAMPLE_DATA.templateId as string),
        themeColor: resume.themeColor || (SAMPLE_DATA.themeColor as string),
        fontFamily: resume.fontFamily || (SAMPLE_DATA.fontFamily as string),
        fontSize: resume.fontSize || (SAMPLE_DATA.fontSize as any),
        lineSpacing: resume.lineSpacing || (SAMPLE_DATA.lineSpacing as number),
        sectionSpacing: resume.sectionSpacing || (SAMPLE_DATA.sectionSpacing as number),
        margins: resume.margins || (SAMPLE_DATA.margins as number),
    };

    const finalTemplateId = templateId || resume.templateId;

    switch (finalTemplateId) {
        case 'classic':
            return <ClassicTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'primo':
            return <PrimoTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'minimal':
            return <MinimalTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'cascade':
            return <CascadeTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'concept':
            return <ConceptTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'diamond':
            return <DiamondTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'influx':
            return <InfluxTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'vibes':
            return <VibesTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'muse':
            return <MuseTemplate data={displayData as any} onSectionClick={onSectionClick} />;
        case 'modern':
        default:
            return <ModernTemplate data={displayData as any} onSectionClick={onSectionClick} />;
    }
}
