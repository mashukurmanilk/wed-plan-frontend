import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { WedPlanProvider } from './context/WedPlanContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

export const metadata: Metadata = {
  title: 'WedPlan — The Modern Luxury Wedding Planning Platform | Inspired by Loverly',
  description:
    'Discover premier wedding venues, photographers, florists, and stylists. Plan your dream wedding with WedPlan curated directory and suite of digital tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#24292F] selection:bg-[#EBDCD4] selection:text-[#5B2D21]">
        <WedPlanProvider>
          <Suspense fallback={<div className="h-20 bg-[#FAF7F2]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <Suspense fallback={null}>
            <ToastContainer />
          </Suspense>
        </WedPlanProvider>
      </body>
    </html>
  );
}
