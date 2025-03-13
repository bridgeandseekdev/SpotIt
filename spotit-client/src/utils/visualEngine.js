import { SCALE_VARIANTS, DIFFICULTY_CONFIGS } from '../constants/gameConstants';

export const getSymbolScale = (difficulty, symbolIndex) => {
  const config = DIFFICULTY_CONFIGS[difficulty].visualConfig;

  if (config.randomScale) {
    const scales = ['UP', 'DEFAULT', 'DOWN'];
    return scales[Math.floor(Math.random() * scales.length)];
  }

  if (config.scales) {
    return config.scales[symbolIndex];
  }

  return config.scale;
};

export const getSymbolRotation = (difficulty) => {
  const config = DIFFICULTY_CONFIGS[difficulty].visualConfig;
  if (!config.rotation) return 0;
  return Math.floor(Math.random() * 45 * (Math.random() > 0.5 ? 1 : -1));
};

export const getSymbolStyles = (scale) => {
  const variant = SCALE_VARIANTS[scale];
  return {
    mobile: `${variant.mobile.w} ${variant.mobile.h}`,
    desktop: `md:${variant.desktop.w} md:${variant.desktop.h}`,
  };
};
