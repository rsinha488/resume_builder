import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './features/resume/resumeSlice';
import coverLetterReducer from './features/coverLetter/coverLetterSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            resume: resumeReducer,
            coverLetter: coverLetterReducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
