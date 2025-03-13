import { SCALE_VARIANTS, DIFFICULTY_CONFIGS } from '../constants/gameConstants';

export const getSymbolScale = (difficulty, symbolIndex) => {
  const config = DIFFICULTY_CONFIGS[difficulty];

  if (config.randomScale) {
    const scales = ['SMALL', 'MEDIUM', 'LARGE'];
    return scales[Math.floor(Math.random() * 3)];
  }

  if (config.scalePattern) {
    return config.scalePattern[symbolIndex];
  }

  return config.scale;
};

export const getSymbolRotation = (difficulty) => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  if (!config.rotation) return 0;
  return Math.floor(
    Math.random() * config.maxRotation * (Math.random() > 0.5 ? 1 : -1),
  );
};

export const getSymbolStyles = (scale) => {
  const variant = SCALE_VARIANTS[scale];
  return {
    mobile: `${variant.mobile.w} ${variant.mobile.h}`,
    desktop: `md:${variant.desktop.w} md:${variant.desktop.h}`,
  };
};
