import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    summary: string;
    avatarUrl?: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

export interface CustomSection {
    id: string;
    title: string;
    content: string; // HTML/Markdown
}

export interface SectionConfig {
    id: string;
    name: string;
    isVisible: boolean;
    type: 'default' | 'custom';
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link?: string;
    technologies?: string;
}

export interface ResumeState {
    id?: string | null;
    title: string;
    templateId: string;
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    projects: Project[];
    skills: string[];
    languages: string[];
    certifications: string[];
    hobbies: string[];
    sections: SectionConfig[];
    customSections: CustomSection[];
    themeColor: string;
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    lineSpacing: number;
    sectionSpacing: number;
    margins: number;
    isMultiPage: boolean;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
    { id: 'personal', name: 'Personal info', isVisible: true, type: 'default' },
    { id: 'summary', name: 'Professional Summary', isVisible: true, type: 'default' },
    { id: 'experience', name: 'Work Experience', isVisible: true, type: 'default' },
    { id: 'education', name: 'Education', isVisible: true, type: 'default' },
    { id: 'projects', name: 'Projects', isVisible: true, type: 'default' },
    { id: 'skills', name: 'Skills', isVisible: true, type: 'default' },
    { id: 'languages', name: 'Languages', isVisible: true, type: 'default' },
    { id: 'certifications', name: 'Certifications', isVisible: true, type: 'default' },
    { id: 'hobbies', name: 'Interests', isVisible: true, type: 'default' },
];

const initialState: ResumeState = {
    id: null,
    title: 'Untitled Resume',
    templateId: 'modern',
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
    },
    experiences: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
    hobbies: [],
    sections: DEFAULT_SECTIONS,
    customSections: [],
    themeColor: '#2563eb',
    fontFamily: 'Inter',
    fontSize: 'medium',
    lineSpacing: 1.15,
    sectionSpacing: 24,
    margins: 16,
    isMultiPage: false,
};

export const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setResume: (state, action: PayloadAction<ResumeState>) => {
            return {
                ...action.payload,
                templateId: action.payload.templateId || 'modern',
                lineSpacing: action.payload.lineSpacing ?? initialState.lineSpacing,
                sectionSpacing: action.payload.sectionSpacing ?? initialState.sectionSpacing,
                margins: action.payload.margins ?? initialState.margins,
                fontSize: action.payload.fontSize ?? initialState.fontSize,
                fontFamily: action.payload.fontFamily ?? initialState.fontFamily,
                themeColor: action.payload.themeColor ?? initialState.themeColor,
                isMultiPage: action.payload.isMultiPage ?? initialState.isMultiPage,
                sections: action.payload.sections || DEFAULT_SECTIONS,
                customSections: action.payload.customSections || [],
                projects: action.payload.projects || [],
            };
        },
        updateTemplate: (state, action: PayloadAction<string>) => {
            state.templateId = action.payload;
        },
        updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
        },
        addExperience: (state, action: PayloadAction<Experience>) => {
            state.experiences?.push(action.payload);
        },
        updateExperience: (state, action: PayloadAction<Experience>) => {
            const index = state.experiences?.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) state.experiences[index] = action.payload;
        },
        removeExperience: (state, action: PayloadAction<string>) => {
            state.experiences = state.experiences?.filter(exp => exp.id !== action.payload);
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            state.education.push(action.payload);
        },
        updateEducation: (state, action: PayloadAction<Education>) => {
            const index = state.education.findIndex(edu => edu.id === action.payload.id);
            if (index !== -1) state.education[index] = action.payload;
        },
        removeEducation: (state, action: PayloadAction<string>) => {
            state.education = state.education.filter(edu => edu.id !== action.payload);
        },
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload);
        },
        updateProject: (state, action: PayloadAction<Project>) => {
            const index = state.projects.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.projects[index] = action.payload;
        },
        removeProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter(p => p.id !== action.payload);
        },
        updateSkills: (state, action: PayloadAction<string[]>) => {
            state.skills = action.payload;
        },
        updateLanguages: (state, action: PayloadAction<string[]>) => {
            state.languages = action.payload;
        },
        updateCertifications: (state, action: PayloadAction<string[]>) => {
            state.certifications = action.payload;
        },
        updateHobbies: (state, action: PayloadAction<string[]>) => {
            state.hobbies = action.payload;
        },
        updateSections: (state, action: PayloadAction<SectionConfig[]>) => {
            state.sections = action.payload;
        },
        toggleSectionVisibility: (state, action: PayloadAction<string>) => {
            const section = state.sections.find(s => s.id === action.payload);
            if (section) section.isVisible = !section.isVisible;
        },
        addCustomSection: (state, action: PayloadAction<CustomSection>) => {
            state.customSections.push(action.payload);
            state.sections.push({
                id: action.payload.id,
                name: action.payload.title,
                isVisible: true,
                type: 'custom'
            });
        },
        updateCustomSection: (state, action: PayloadAction<CustomSection>) => {
            const index = state.customSections.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.customSections[index] = action.payload;
                const sectionConfig = state.sections.find(s => s.id === action.payload.id);
                if (sectionConfig) sectionConfig.name = action.payload.title;
            }
        },
        removeCustomSection: (state, action: PayloadAction<string>) => {
            state.customSections = state.customSections.filter(s => s.id !== action.payload);
            state.sections = state.sections.filter(s => s.id !== action.payload);
        },
        updateThemeColor: (state, action: PayloadAction<string>) => {
            state.themeColor = action.payload;
        },
        updateFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload;
        },
        updateFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
            state.fontSize = action.payload;
        },
        updateLineSpacing: (state, action: PayloadAction<number>) => {
            state.lineSpacing = action.payload;
        },
        updateSectionSpacing: (state, action: PayloadAction<number>) => {
            state.sectionSpacing = action.payload;
        },
        updateMargins: (state, action: PayloadAction<number>) => {
            state.margins = action.payload;
        },
        updateIsMultiPage: (state, action: PayloadAction<boolean>) => {
            state.isMultiPage = action.payload;
        },
        resetResume: () => initialState,
    },
});

export const {
    setResume,
    updateTemplate,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    updateSkills,
    updateLanguages,
    updateCertifications,
    updateHobbies,
    updateSections,
    toggleSectionVisibility,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    updateThemeColor,
    updateFontFamily,
    updateFontSize,
    updateLineSpacing,
    updateSectionSpacing,
    updateMargins,
    updateIsMultiPage,
    resetResume
} = resumeSlice.actions;

export default resumeSlice.reducer;
