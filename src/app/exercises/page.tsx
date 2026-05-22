'use client';

import { useState, useEffect } from 'react';
import { exercisesData } from '@/data/exercisesData';
import ExerciseCard from '@/components/Exercises/ExerciseCard';
import { Dumbbell, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { usePhysioStore } from '@/store/usePhysioStore';

export default function ExercisesPage() {
  const { logs } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Morning' | 'Evening'>('All');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const dateStr = new Date().toISOString().split('T')[0];
    const todayLog = logs[dateStr];
    if (todayLog) {
      setCompletedCount(todayLog.exercisesCompleted.length);
    }
  }, [logs]);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded-md"></div>
        <div className="h-48 bg-slate-100 rounded-3xl"></div>
      </div>
    );
  }

  // Filter exercises
  const filteredExercises = exercisesData.filter((ex) => {
    if (activeFilter === 'All') return true;
    return ex.category === activeFilter || ex.category === 'Both';
  });

  const totalExercises = exercisesData.length;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-tr from-primary to-primary-hover text-white rounded-3xl p-6 shadow-md shadow-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] bg-white/20 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Exercise Library
          </span>
          <h3 className="font-extrabold text-xl mt-3 tracking-tight">Active Wrist Rehabilitation</h3>
          <p className="text-xs text-white/80 font-medium mt-1 leading-normal max-w-md">
            Click 'Instructions' to learn proper form. Use the interactive timers to complete the clinical recovery sessions.
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 px-4.5 py-3.5 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-white animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Completed Today</span>
            <span className="text-base font-black leading-tight">{completedCount} / {totalExercises} Done</span>
          </div>
        </div>
      </div>

      {/* Filter and Library Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/50 border border-border-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-text-muted">Session Filters:</span>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'All' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            All Exercises
          </button>
          <button
            onClick={() => setActiveFilter('Morning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'Morning' 
                ? 'bg-white text-amber-600 shadow-sm' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Morning Routines
          </button>
          <button
            onClick={() => setActiveFilter('Evening')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'Evening' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Evening Routines
          </button>
        </div>
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
