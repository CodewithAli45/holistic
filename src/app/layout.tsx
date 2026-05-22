import type { Metadata } from 'next';
import LayoutWrapper from '@/components/UI/Layout/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlexiRecover | Physiotherapy Fracture Recovery Companion',
  description: 'Track wrist mobility, pain index, grip strength and recovery progress daily for distal radius or other hand fractures.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
