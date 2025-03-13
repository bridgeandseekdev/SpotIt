import {
  SCALE_VARIANTS,
  SCALE_PATTERNS,
  DIFFICULTY_CONFIGS,
} from '../constants/gameConstants';

export const getSymbolScale = (difficulty, symbolIndex, symbolCount) => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (config.useRandomScaling) {
    if (Math.random() < 0.33) return 'UP';
    if (Math.random() < 0.63) return 'DOWN';
    return 'DEFAULT';
  }

  if (config.useScalePatterns) {
    return SCALE_PATTERNS[symbolCount]?.[symbolIndex] || 'DEFAULT';
  }

  return config.defaultScale || 'DEFAULT';
};

export const getSymbolRotation = (difficulty, isInteractive) => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (!config.allowRotation) return 0;

  const baseRotation = isInteractive ? 45 : 60;
  return Math.floor(
    Math.random() * baseRotation * (Math.random() > 0.5 ? 1 : -1),
  );
};

export const getSymbolStyles = (scale) => {
  const variant = SCALE_VARIANTS[scale];
  return {
    mobile: `${variant.mobile.w} ${variant.mobile.h}`,
    desktop: `md:${variant.desktop.w} md:${variant.desktop.h}`,
  };
};
