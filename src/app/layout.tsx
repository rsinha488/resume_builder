import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ResumeBuilder — Professional Resume & Cover Letter Builder",
    template: "%s | ResumeBuilder",
  },
  description: "Create professional, ATS-optimized resumes and cover letters in minutes. Choose from 10+ templates, customize colors and fonts, and download as PDF.",
  keywords: ["resume builder", "CV builder", "cover letter", "ATS resume", "free resume maker"],
  openGraph: {
    title: "ResumeBuilder — Professional Resume & Cover Letter Builder",
    description: "Create professional, ATS-optimized resumes and cover letters in minutes.",
    type: "website",
  },
};

import ToasterProvider from "@/components/ToasterProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <ToasterProvider />
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
