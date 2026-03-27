'use client';
import { Toaster } from 'sonner';

export default function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                style: {
                    borderRadius: '12px',
                },
            }}
        />
    );
}
