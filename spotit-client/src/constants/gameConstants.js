export const SCALE_VARIANTS = {
  SMALL: { mobile: { h: 'h-8', w: 'w-8' }, desktop: { h: 'h-12', w: 'w-12' } },
  MEDIUM: {
    mobile: { h: 'h-10', w: 'w-10' },
    desktop: { h: 'h-14', w: 'w-14' },
  },
  LARGE: {
    mobile: { h: 'h-14', w: 'w-14' },
    desktop: { h: 'h-20', w: 'w-20' },
  },
};

export const SYMBOL_POSITIONS = {
  3: [
    { top: '25%', left: '50%', transform: 'translate(-50%, 0)' },
    { bottom: '25%', right: '25%' },
    { bottom: '25%', left: '25%' },
  ],
  5: [
    { top: '15%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '40%', right: '20%' },
    { bottom: '25%', right: '20%' },
    { bottom: '25%', left: '20%' },
    { top: '40%', left: '20%' },
  ],
  8: [
    { top: '12%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '25%', right: '15%' },
    { bottom: '25%', right: '15%' },
    { bottom: '12%', left: '50%', transform: 'translate(-50%, 0)' },
    { bottom: '25%', left: '15%' },
    { top: '25%', left: '15%' },
    { top: '55%', left: '40%', transform: 'translate(-50%, -50%)' },
    { top: '50%', left: '65%', transform: 'translate(-50%, -50%)' },
  ],
};

export const DIFFICULTY_CONFIGS = {
  easy: {
    symbolsPerCard: '3',
    scale: 'MEDIUM',
    rotation: false,
    timerSeconds: 10,
  },
  medium: {
    symbolsPerCard: '5',
    scalePattern: ['LARGE', 'MEDIUM', 'LARGE', 'SMALL', 'MEDIUM'],
    rotation: false,
    timerSeconds: 6,
  },
  hard: {
    symbolsPerCard: '8',
    randomScale: true,
    rotation: true,
    maxRotation: 45,
    timerSeconds: 4,
  },
};
