import type { Metadata, Viewport } from 'next';
import LayoutWrapper from '@/components/UI/Layout/LayoutWrapper';
import PWARegistration from '@/components/PWA/PWARegistration';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flexi | Wrist Rehab Companion',
  description: 'Track wrist mobility, pain index, grip strength and recovery progress daily for distal radius or other hand fractures.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Outfit Google font for high fidelity typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <PWARegistration />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
