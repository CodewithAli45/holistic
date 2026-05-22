'use client';

import { useState, useEffect, useRef } from 'react';
import { Exercise } from '@/data/exercisesData';
import { usePhysioStore } from '@/store/usePhysioStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Timer as TimerIcon,
  Sparkles,
  FlameKindling
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { logs, toggleExerciseCompletion } = usePhysioStore();
  const [mounted, setMounted] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState('');
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout expansion states
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Timer Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            setTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const handleStartPause = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(exercise.durationSeconds);
    setTimerFinished(false);
  };

  const isCompleted = todayDateStr && logs[todayDateStr]?.exercisesCompleted?.includes(exercise.id);

  const handleToggleComplete = () => {
    if (!todayDateStr) return;
    toggleExerciseCompletion(todayDateStr, exercise.id);
  };

  // Helper to format remaining time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 h-48 animate-pulse"></div>
    );
  }

  return (
    <div className={`bg-bg-card rounded-3xl border shadow-sm smooth-transition relative overflow-hidden group ${
      isCompleted 
        ? 'border-secondary-light bg-emerald-50/10' 
        : 'border-border-card hover:border-primary/30 hover:shadow-md'
    }`}>
      {/* Top accent badge */}
      {isCompleted && (
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Left Title details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                exercise.difficulty === 'Easy' ? 'bg-emerald-50 text-secondary-hover border border-emerald-100' :
                exercise.difficulty === 'Medium' ? 'bg-sky-50 text-primary border border-sky-100' :
                'bg-rose-50 text-danger border border-rose-100'
              }`}>
                {exercise.difficulty}
              </span>
              <span className="text-[10px] bg-slate-100 text-text-muted font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-slate-200">
                {exercise.setsCount} Sets x {exercise.repsCount} Reps
              </span>
            </div>
            <h3 className="font-extrabold text-text-main text-lg leading-snug tracking-tight">
              {exercise.title}
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-normal font-semibold">
              Primary Focus: Wrist fracture recovery active mobility.
            </p>
          </div>

          {/* Right Timer Interactive Block */}
          <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center gap-4 min-w-[210px] justify-between self-start shadow-inner">
            <div className="flex items-center gap-2">
              <TimerIcon className={`w-4 h-4 ${isTimerRunning ? 'text-primary animate-spin' : 'text-text-light'}`} />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-text-light uppercase tracking-wider">Timer</span>
                <span className={`text-base font-black tabular-nums tracking-tight leading-none ${
                  timerFinished ? 'text-secondary-hover' : 'text-text-main'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleStartPause}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isTimerRunning 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                    : 'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10'
                }`}
                title={isTimerRunning ? 'Pause' : 'Start'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleResetTimer}
                className="p-2 bg-slate-200 hover:bg-slate-300 text-text-muted rounded-xl transition-all cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Completion Toast inside card on timer finish */}
        {timerFinished && !isCompleted && (
          <div className="mt-4 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-2xl flex items-center justify-between text-xs text-secondary-hover font-bold animate-pulse">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Recommended duration complete!
            </span>
            <button
              onClick={() => {
                handleToggleComplete();
                setTimerFinished(false);
              }}
              className="bg-secondary text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              Check Off Exercise
            </button>
          </div>
        )}

        {/* Action Toggle buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          {/* Instruction Expand Toggle */}
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs font-bold text-text-muted hover:text-text-main flex items-center gap-1 cursor-pointer transition-all bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-2 rounded-xl"
          >
            <HelpCircle className="w-4 h-4 text-primary" />
            <span>Instructions</span>
            {showInstructions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Mark Complete Action Button */}
          <button
            onClick={handleToggleComplete}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 ${
              isCompleted 
                ? 'bg-secondary text-white shadow-lg shadow-secondary/15 hover:bg-secondary-hover' 
                : 'bg-slate-100 text-text-main hover:bg-primary-light hover:text-primary hover:scale-[1.01]'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-current text-white' : ''}`} />
            <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
          </button>
        </div>

        {/* Instructions Drawer Panel */}
        {showInstructions && (
          <div className="mt-4 p-4.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3.5 animate-in slide-in-from-top duration-300">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <FlameKindling className="w-3.5 h-3.5 text-orange-500" /> Follow Step-by-Step
            </h4>
            <ol className="space-y-2 text-xs text-text-main font-semibold">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <span className="bg-white border border-slate-200 text-primary w-5 h-5 rounded-full flex items-center justify-center font-black flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="mt-3.5 pt-3.5 border-t border-slate-200/50">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1">Clinical Tips:</span>
                <ul className="space-y-1 text-[11px] text-text-muted list-disc list-inside font-semibold leading-relaxed">
                  {exercise.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
