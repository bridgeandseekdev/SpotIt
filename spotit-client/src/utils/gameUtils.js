import { SCALE_VARIANTS } from '../constants/scaleVariants';

export const getRandomRotation = (isInteractive) => {
  const maxRotation = isInteractive ? -45 : 45;
  return Math.floor(Math.random() * maxRotation);
};

export const getRandomScale = () => {
  if (Math.random() < 0.5) return 'UP';
  if (Math.random() < 0.5) return 'DOWN';
  return 'DEFAULT';
};

export const getSymbolStyles = (scale) => {
  const variant = SCALE_VARIANTS[scale];
  return {
    mobile: `${variant.mobile.w} ${variant.mobile.h}`,
    desktop: `md:${variant.desktop.w} md:${variant.desktop.h}`,
  };
};

export const getDeckBySettings = async (theme, symbolsPerCard) => {
  try {
    // Dynamic import based on theme and symbol count
    const deckModule = await import(
      `/src/assets/decks/${theme}_deck_${Number(symbolsPerCard) - 1}.json`
    );
    return deckModule.default;
  } catch (error) {
    console.error('Failed to load deck', error);
  }
};
