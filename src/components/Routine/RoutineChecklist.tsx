'use client';

import { useState, useEffect } from 'react';
import { usePhysioStore } from '@/store/usePhysioStore';
import { exercisesData } from '@/data/exercisesData';
import { Check, Sun, Moon, Sparkles, Award } from 'lucide-react';

export default function RoutineChecklist() {
  const { logs, toggleExerciseCompletion } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('');
  
  useEffect(() => {
    setMounted(true);
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  if (!mounted || !todayDateStr) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 h-64 animate-pulse"></div>
    );
  }

  const completedList = logs[todayDateStr]?.exercisesCompleted || [];
  
  // Calculate completion percentages
  const totalCount = exercisesData.length;
  const completedCount = completedList.length;
  const totalPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Let's create mock divisions for Morning and Evening for custom aesthetic checkboxes!
  // To keep it highly usable, we can show:
  // - Morning Routine: 2 exercises (Finger Open & Close, Wrist Rotation)
  // - Evening Routine: 2 exercises (Wrist Flexion & Extension, Soft Ball Squeezing)
  const morningExercises = exercisesData.filter(ex => ex.id === 'finger-open-close' || ex.id === 'wrist-rotation');
  const eveningExercises = exercisesData.filter(ex => ex.id === 'wrist-flexion-extension' || ex.id === 'soft-ball-squeezing');

  const morningCompletedCount = morningExercises.filter(ex => completedList.includes(ex.id)).length;
  const morningPercentage = morningExercises.length > 0 ? Math.round((morningCompletedCount / morningExercises.length) * 100) : 0;

  const eveningCompletedCount = eveningExercises.filter(ex => completedList.includes(ex.id)).length;
  const eveningPercentage = eveningExercises.length > 0 ? Math.round((eveningCompletedCount / eveningExercises.length) * 100) : 0;

  const handleToggle = (id: string) => {
    toggleExerciseCompletion(todayDateStr, id);
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-tr from-primary to-accent text-white rounded-3xl p-6 shadow-lg shadow-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] bg-white/20 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Routine Checklist
          </span>
          <h3 className="font-extrabold text-xl mt-3 tracking-tight">Today's Rehabilitation Targets</h3>
          <p className="text-xs text-white/80 font-medium mt-1 leading-normal max-w-md">
            Complete the assigned routines twice daily (morning & evening) to maintain tendon glide and joint range of motion.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/15">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-white/20 fill-none"
                strokeWidth="4.5"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-white fill-none transition-all duration-500 ease-out"
                strokeWidth="4.5"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - totalPercentage / 100)}`}
              />
            </svg>
            <span className="absolute text-xs font-black">{totalPercentage}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">Completed</span>
            <span className="text-lg font-black tracking-tight">{completedCount} / {totalCount}</span>
            <span className="text-[10px] font-medium text-white/70 block">Target Exercises</span>
          </div>
        </div>
      </div>

      {/* Routine checklists layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Morning Routine Checklist */}
        <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-50 border border-amber-100 text-amber-500 p-2.5 rounded-xl">
                  <Sun className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-extrabold text-text-main text-base tracking-tight">Morning Routine</h4>
                  <p className="text-[10px] text-text-muted font-bold mt-0.5">Activate joints, stretch stiffness</p>
                </div>
              </div>
              <span className="text-xs bg-amber-50 text-amber-700 font-extrabold px-2.5 py-1 rounded-lg border border-amber-100">
                {morningPercentage}% Completed
              </span>
            </div>

            <div className="space-y-3">
              {morningExercises.map((ex) => {
                const checked = completedList.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => handleToggle(ex.id)}
                    className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                      checked 
                        ? 'bg-secondary-light/20 border-secondary-light' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center smooth-transition ${
                        checked 
                          ? 'bg-secondary border-secondary text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <div>
                        <h5 className={`text-xs font-black leading-snug ${checked ? 'text-text-main line-through opacity-70' : 'text-text-main'}`}>
                          {ex.title}
                        </h5>
                        <p className="text-[10px] text-text-light font-bold mt-0.5 uppercase tracking-wider">
                          {ex.setsCount} sets x {ex.repsCount} reps
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] text-text-light font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Suggested: Perform after waking up
          </div>
        </div>

        {/* Evening Routine Checklist */}
        <div className="bg-bg-card rounded-3xl border border-border-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-500 p-2.5 rounded-xl">
                  <Moon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-extrabold text-text-main text-base tracking-tight">Evening Routine</h4>
                  <p className="text-[10px] text-text-muted font-bold mt-0.5">Strengthen, soothe sore tissue</p>
                </div>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-lg border border-indigo-100">
                {eveningPercentage}% Completed
              </span>
            </div>

            <div className="space-y-3">
              {eveningExercises.map((ex) => {
                const checked = completedList.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => handleToggle(ex.id)}
                    className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                      checked 
                        ? 'bg-secondary-light/20 border-secondary-light' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center smooth-transition ${
                        checked 
                          ? 'bg-secondary border-secondary text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {checked && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                      </div>
                      <div>
                        <h5 className={`text-xs font-black leading-snug ${checked ? 'text-text-main line-through opacity-70' : 'text-text-main'}`}>
                          {ex.title}
                        </h5>
                        <p className="text-[10px] text-text-light font-bold mt-0.5 uppercase tracking-wider">
                          {ex.setsCount} sets x {ex.repsCount} reps
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 text-[10px] text-text-light font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-500" /> Suggested: Perform 1hr before sleeping
          </div>
        </div>

      </div>
    </div>
  );
}
