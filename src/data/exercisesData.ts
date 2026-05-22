export interface Exercise {
  id: string;
  title: string;
  category: 'Morning' | 'Evening' | 'Both';
  instructions: string[];
  repsCount: number;
  setsCount: number;
  durationSeconds: number; // default duration in seconds for timer
  iconName: 'Activity' | 'ArrowUpDown' | 'RefreshCw' | 'CircleDot';
  tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const exercisesData: Exercise[] = [
  {
    id: 'finger-open-close',
    title: 'Finger Open & Close',
    category: 'Both',
    instructions: [
      'Place your forearm on a table with your hand hanging off the edge or resting flat.',
      'Make a tight fist slowly, wrapping your thumb over your fingers.',
      'Hold the fist position for 3 seconds.',
      'Open your hand wide, spreading your fingers as far apart as possible.',
      'Hold the open position for 3 seconds, then repeat.'
    ],
    repsCount: 12,
    setsCount: 3,
    durationSeconds: 60,
    iconName: 'Activity',
    tips: [
      'Do not rush; focus on reaching full extension of each finger.',
      'If you feel sharp pain, reduce the intensity of the open or squeeze.'
    ],
    difficulty: 'Easy'
  },
  {
    id: 'wrist-flexion-extension',
    title: 'Wrist Flexion & Extension',
    category: 'Both',
    instructions: [
      'Rest your forearm on a table, palm facing down, with your wrist hanging over the edge.',
      'Slowly bend your wrist upward as far as comfortable (Extension).',
      'Hold for 3 seconds, then slowly lower it back to the start.',
      'Flip your hand so your palm faces up, and slowly bend your wrist upward (Flexion).',
      'Hold for 3 seconds, then slowly lower it.'
    ],
    repsCount: 15,
    setsCount: 2,
    durationSeconds: 90,
    iconName: 'ArrowUpDown',
    tips: [
      'Keep your forearm flat on the table; let only the wrist do the moving.',
      'Support your elbow with a small rolled towel if needed for stability.'
    ],
    difficulty: 'Medium'
  },
  {
    id: 'wrist-rotation',
    title: 'Wrist Rotation (Pronation & Supination)',
    category: 'Both',
    instructions: [
      'Sit comfortably and bend your elbow to 90 degrees, keeping it tucked close to your side.',
      'Turn your palm up so it faces the ceiling (Supination) and hold for 3 seconds.',
      'Slowly turn your palm down so it faces the floor (Pronation) and hold for 3 seconds.',
      'Ensure the motion comes solely from your forearm and wrist, not your shoulder.'
    ],
    repsCount: 10,
    setsCount: 3,
    durationSeconds: 60,
    iconName: 'RefreshCw',
    tips: [
      'Keep your shoulder relaxed and elbow locked against your rib cage.',
      'Try holding a light object (like a ruler or pen) to visualize and track the rotating angle.'
    ],
    difficulty: 'Easy'
  },
  {
    id: 'soft-ball-squeezing',
    title: 'Soft Ball Squeezing',
    category: 'Both',
    instructions: [
      'Hold a soft therapy ball or a soft sponge in the palm of your hand.',
      'Slowly squeeze the ball with your fingers and thumb as tightly as you can tolerate without sharp pain.',
      'Hold the squeeze firmly for 5 seconds.',
      'Slowly release your grip, allowing your hand to open completely.',
      'Relax for 2 seconds before the next repetition.'
    ],
    repsCount: 15,
    setsCount: 3,
    durationSeconds: 120,
    iconName: 'CircleDot',
    tips: [
      'Focus on an even squeeze using all fingers and the thumb equally.',
      'Use a softer ball in the early stages and transition to a firmer ball as your strength increases.'
    ],
    difficulty: 'Hard'
  }
];
