'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { usePhysioStore } from '@/store/usePhysioStore';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const dailyBgEnabled = usePhysioStore((state) => state.dailyBgEnabled);
  const previewBgDay = usePhysioStore((state) => state.previewBgDay);
  const setPreviewBgDay = usePhysioStore((state) => state.setPreviewBgDay);

  useEffect(() => {
    setMounted(true);
    setPreviewBgDay(null); // Reset preview on load
  }, [setPreviewBgDay]);

  useEffect(() => {
    if (!mounted) return;

    if (dailyBgEnabled) {
      // Complete theme palettes corresponding to Sunday (0) through Saturday (6)
      const themePalettes = [
        {
          bg: '#FAF6EE', // Sunday - Soft Beige
          primary: '#8B5A2B',
          primaryHover: '#704820',
          primaryLight: '#F5ECE0',
          textMain: '#2C1E11',
          borderCard: '#EADCC9',
        },
        {
          bg: '#E6FCFF', // Monday - Light Cyan
          primary: '#0891B2',
          primaryHover: '#0E7490',
          primaryLight: '#CFFAFE',
          textMain: '#083344',
          borderCard: '#BFEFF2',
        },
        {
          bg: '#FDF2F8', // Tuesday - Light Pink / Magenta
          primary: '#DB2777',
          primaryHover: '#BE185D',
          primaryLight: '#FCE7F3',
          textMain: '#500724',
          borderCard: '#FBCFE8',
        },
        {
          bg: '#FFFDEB', // Wednesday - Warm Gold
          primary: '#D97706',
          primaryHover: '#B45309',
          primaryLight: '#FEF3C7',
          textMain: '#451A03',
          borderCard: '#FDE68A',
        },
        {
          bg: '#FAF5FF', // Thursday - Lilac Mist / Lavender
          primary: '#7C3AED',
          primaryHover: '#6D28D9',
          primaryLight: '#F3E8FF',
          textMain: '#2E1065',
          borderCard: '#E9D5FF',
        },
        {
          bg: '#F0FDF4', // Friday - Fresh Mint
          primary: '#059669',
          primaryHover: '#047857',
          primaryLight: '#D1FAE5',
          textMain: '#064E3B',
          borderCard: '#A7F3D0',
        },
        {
          bg: '#FFF7ED', // Saturday - Peach Cream
          primary: '#EA580C',
          primaryHover: '#C2410C',
          primaryLight: '#FFEDD5',
          textMain: '#431407',
          borderCard: '#FED7AA',
        },
      ];

      // Determine which day's palette to show
      const activeDay = previewBgDay !== null ? previewBgDay : new Date().getDay();
      const palette = themePalettes[activeDay] || themePalettes[0];
      
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--color-bg-base', palette.bg);
      rootStyle.setProperty('--color-primary', palette.primary);
      rootStyle.setProperty('--color-primary-hover', palette.primaryHover);
      rootStyle.setProperty('--color-primary-light', palette.primaryLight);
      rootStyle.setProperty('--color-text-main', palette.textMain);
      rootStyle.setProperty('--color-border-card', palette.borderCard);
    } else {
      // Revert to original CSS theme variables
      const rootStyle = document.documentElement.style;
      rootStyle.removeProperty('--color-bg-base');
      rootStyle.removeProperty('--color-primary');
      rootStyle.removeProperty('--color-primary-hover');
      rootStyle.removeProperty('--color-primary-light');
      rootStyle.removeProperty('--color-text-main');
      rootStyle.removeProperty('--color-border-card');
    }
  }, [mounted, dailyBgEnabled, previewBgDay]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <HeartPulse className="w-12 h-12 text-primary animate-pulse" />
          <p className="text-sm font-semibold text-text-muted">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col md:flex-row">
      {/* Desktop Sidebar (visible on medium & up) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Top Navigation & Menu Toggle */}
      <div className="md:hidden glass-panel border-b border-border-card px-6 py-4 flex items-center justify-between sticky top-0 z-50 w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-light text-primary p-2 rounded-lg">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-bold text-base text-text-main">Flexi</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-text-main rounded-xl cursor-pointer smooth-transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay/Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-bg-base flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header />

        {/* Viewport page container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
