import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LogEntry {
  date: string; // YYYY-MM-DD
  painLevel: number; // 0 - 10
  gripStrength: number; // kg
  mobility: {
    flexion: number; // degrees (e.g. 0-90)
    extension: number; // degrees (e.g. 0-70)
    rotation: number; // degrees (e.g. 0-90)
  };
  exercisesCompleted: string[]; // List of exercise IDs
  notes: string;
}

export type RecoveryStage = 'Early' | 'Mid' | 'Advanced';

interface PhysioState {
  logs: Record<string, LogEntry>; // Keyed by YYYY-MM-DD
  streak: number;
  recoveryStage: RecoveryStage;
  remindersEnabled: boolean;
  remindersTime: string; // e.g. "09:00"
  
  // Actions
  addLogEntry: (date: string, data: Partial<LogEntry>) => void;
  toggleExerciseCompletion: (date: string, exerciseId: string) => void;
  updateRecoveryStage: (stage: RecoveryStage) => void;
  toggleReminders: () => void;
  updateReminderTime: (time: string) => void;
  setStreak: (streak: number) => void;
  resetAllData: () => void;
}

// Helper to generate dynamic dates relative to today
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const getPastDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
};

const getSeedLogs = (): Record<string, LogEntry> => {
  const seed: Record<string, LogEntry> = {};
  
  // Dynamic seed logs for 7 consecutive days up to yesterday
  const notes = [
    "First day after cast removal. Wrist is incredibly stiff, and minor swelling around distal radius.",
    "Fingers are moving slightly better. Still substantial tightness when trying to rotate.",
    "Wrist flexion/extension is stiff. Keeping movements small to avoid sharp pain.",
    "Grip strength shows progress! Did first squeeze with soft rubber ball.",
    "Excellent rotation progress. Forearm feels much more relaxed.",
    "Significant milestone today: Able to open a lightweight jar lid with minimal support!",
    "Steady progress. Wrist flexion reached 50 degrees today. Recovery is on track."
  ];

  for (let i = 6; i >= 0; i--) {
    const dateStr = getPastDateStr(i);
    // Linearly improving metrics for beautiful charts
    const progressFactor = 6 - i; // 0 to 6
    seed[dateStr] = {
      date: dateStr,
      painLevel: Math.max(8 - Math.round(progressFactor * 0.8), 2),
      gripStrength: parseFloat((4.0 + progressFactor * 0.75).toFixed(1)),
      mobility: {
        flexion: 20 + progressFactor * 5,
        extension: 15 + progressFactor * 4,
        rotation: 30 + progressFactor * 7,
      },
      exercisesCompleted: i % 2 === 0 
        ? ['finger-open-close', 'wrist-rotation']
        : ['finger-open-close', 'wrist-flexion-extension', 'wrist-rotation', 'soft-ball-squeezing'],
      notes: notes[progressFactor] || "Continuing physical therapy daily."
    };
  }
  
  return seed;
};

export const usePhysioStore = create<PhysioState>()(
  persist(
    (set, get) => ({
      logs: getSeedLogs(),
      streak: 7, // starting with a 7-day streak from seed data
      recoveryStage: 'Mid',
      remindersEnabled: true,
      remindersTime: '08:30',
      
      addLogEntry: (date, data) => set((state) => {
        const existing = state.logs[date] || {
          date,
          painLevel: 5,
          gripStrength: 5,
          mobility: { flexion: 30, extension: 25, rotation: 40 },
          exercisesCompleted: [],
          notes: '',
        };
        
        const updatedEntry: LogEntry = {
          ...existing,
          ...data,
          mobility: {
            ...existing.mobility,
            ...(data.mobility || {}),
          },
          // Keep array of completed exercises intact unless explicit
          exercisesCompleted: data.exercisesCompleted !== undefined 
            ? data.exercisesCompleted 
            : existing.exercisesCompleted,
        };

        const newLogs = {
          ...state.logs,
          [date]: updatedEntry,
        };

        // Recalculate streak
        let currentStreak = 0;
        const sortedDates = Object.keys(newLogs).sort();
        let lastDate: Date | null = null;

        for (const dStr of sortedDates) {
          const entry = newLogs[dStr];
          if (entry.exercisesCompleted.length > 0) {
            const currentDate = new Date(dStr);
            if (lastDate === null) {
              currentStreak = 1;
            } else {
              const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1; // broken streak
              }
            }
            lastDate = currentDate;
          }
        }

        return {
          logs: newLogs,
          streak: currentStreak > 0 ? currentStreak : state.streak,
        };
      }),

      toggleExerciseCompletion: (date, exerciseId) => set((state) => {
        const existing = state.logs[date] || {
          date,
          painLevel: 5,
          gripStrength: 5,
          mobility: { flexion: 30, extension: 25, rotation: 40 },
          exercisesCompleted: [],
          notes: '',
        };

        const index = existing.exercisesCompleted.indexOf(exerciseId);
        const nextCompleted = [...existing.exercisesCompleted];
        if (index > -1) {
          nextCompleted.splice(index, 1);
        } else {
          nextCompleted.push(exerciseId);
        }

        return {
          logs: {
            ...state.logs,
            [date]: {
              ...existing,
              exercisesCompleted: nextCompleted,
            },
          },
        };
      }),

      updateRecoveryStage: (recoveryStage) => set({ recoveryStage }),
      toggleReminders: () => set((state) => ({ remindersEnabled: !state.remindersEnabled })),
      updateReminderTime: (remindersTime) => set({ remindersTime }),
      setStreak: (streak) => set({ streak }),
      
      resetAllData: () => set({
        logs: getSeedLogs(),
        streak: 7,
        recoveryStage: 'Mid',
        remindersEnabled: true,
        remindersTime: '08:30',
      }),
    }),
    {
      name: 'flexirecover-storage', // key in local storage
    }
  )
);
