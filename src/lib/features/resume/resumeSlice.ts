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

export interface ResumeState {
    id?: string | null;
    title: string;
    templateId: string;
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: string[];
    themeColor: string;
    fontFamily: string;
}

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
    skills: [],
    themeColor: '#2563eb',
    fontFamily: 'Inter',
};

export const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setResume: (state, action: PayloadAction<ResumeState>) => {
            return { ...action.payload, templateId: action.payload.templateId || 'modern' };
        },
        updateTemplate: (state, action: PayloadAction<string>) => {
            state.templateId = action.payload;
        },
        updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
        },
        addExperience: (state, action: PayloadAction<Experience>) => {
            state.experiences.push(action.payload);
        },
        updateExperience: (state, action: PayloadAction<Experience>) => {
            const index = state.experiences.findIndex(exp => exp.id === action.payload.id);
            if (index !== -1) state.experiences[index] = action.payload;
        },
        removeExperience: (state, action: PayloadAction<string>) => {
            state.experiences = state.experiences.filter(exp => exp.id !== action.payload);
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
        updateSkills: (state, action: PayloadAction<string[]>) => {
            state.skills = action.payload;
        },
        updateThemeColor: (state, action: PayloadAction<string>) => {
            state.themeColor = action.payload;
        },
        updateFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload;
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
    updateSkills,
    updateThemeColor,
    updateFontFamily,
    resetResume
} = resumeSlice.actions;

export default resumeSlice.reducer;
