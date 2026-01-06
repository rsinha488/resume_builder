import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
}

export interface RecipientInfo {
    companyName: string;
    hiringManagerName: string;
    address: string;
    email?: string;
}

export interface CoverLetterState {
    id?: string | null;
    title: string;
    templateId: string;
    personalInfo: PersonalInfo;
    recipientInfo: RecipientInfo;
    content: string;
    themeColor: string;
    fontFamily: string;
    date: string;
}

const initialState: CoverLetterState = {
    id: null,
    title: 'Untitled Cover Letter',
    templateId: 'modern',
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        address: '',
    },
    recipientInfo: {
        companyName: '',
        hiringManagerName: '',
        address: '',
    },
    content: '',
    themeColor: '#2563eb',
    fontFamily: 'Inter',
    date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }),
};

export const coverLetterSlice = createSlice({
    name: 'coverLetter',
    initialState,
    reducers: {
        setCoverLetter: (state, action: PayloadAction<CoverLetterState>) => {
            return { ...action.payload, templateId: action.payload.templateId || 'modern' };
        },
        updateTemplate: (state, action: PayloadAction<string>) => {
            state.templateId = action.payload;
        },
        updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
            state.personalInfo = { ...state.personalInfo, ...action.payload };
        },
        updateRecipientInfo: (state, action: PayloadAction<Partial<RecipientInfo>>) => {
            state.recipientInfo = { ...state.recipientInfo, ...action.payload };
        },
        updateContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        updateThemeColor: (state, action: PayloadAction<string>) => {
            state.themeColor = action.payload;
        },
        updateFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload;
        },
        updateDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload;
        },
        resetCoverLetter: () => initialState,
    },
});

export const {
    setCoverLetter,
    updateTemplate,
    updatePersonalInfo,
    updateRecipientInfo,
    updateContent,
    updateThemeColor,
    updateFontFamily,
    updateDate,
    resetCoverLetter
} = coverLetterSlice.actions;

export default coverLetterSlice.reducer;
