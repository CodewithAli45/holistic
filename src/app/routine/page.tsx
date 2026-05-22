'use client';

import RoutineChecklist from '@/components/Routine/RoutineChecklist';
import { CalendarRange, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RoutinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-md"></div>
        <div className="h-64 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Introduction text */}
      <div className="bg-white/50 border border-border-card rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <CalendarRange className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black text-text-main tracking-tight leading-none">Daily Rehabilitation Routines</h2>
        </div>
        <p className="text-xs text-text-muted leading-normal font-semibold">
          Fracture recoveries thrive on routine. Tick off exercises as you finish them in the morning or evening.
        </p>
      </div>

      {/* Routine Checklists Component */}
      <RoutineChecklist />

      {/* Quick Clinical Info Panel */}
      <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-6 shadow-inner flex flex-col sm:flex-row gap-5 items-start">
        <div className="bg-primary text-white p-3 rounded-2xl">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            Understanding Your Wrist Joint Range of Motion (ROM) Goal
          </h4>
          <p className="text-xs text-text-muted font-medium leading-relaxed">
            In standard distal radius fracture rehabilitation, the target active range is roughly **80-90° flexion** (bending forward), **70° extension** (bending backward), and **80-90° pronation/supination** (forearm rotation). Focus on reaching comfortable thresholds and never push into acute sharp pain.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-black uppercase tracking-wider pt-1.5">
            <ShieldCheck className="w-4 h-4 text-secondary-hover" /> Verified by FlexiRecover Clinical Engine
          </div>
        </div>
      </div>
    </div>
  );
}
