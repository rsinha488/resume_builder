import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <StoreProvider>
          <ToasterProvider />
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
