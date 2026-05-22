'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X, HeartPulse } from 'lucide-react';
import Link from 'next/link';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <span className="font-bold text-base text-text-main">FlexiRecover</span>
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
          <div className="relative w-64 bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
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
