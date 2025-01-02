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

export const getSymbolPositions = (symbolCount) => {
  // Return different position arrays based on symbol count
  switch (symbolCount) {
    case '3':
      return [
        { top: '25%', left: '25%' },
        { bottom: '45%', right: '20%' },
        { bottom: '20%', left: '35%' },
      ];

    case '5':
      return [
        { top: '18%', right: '18%' },
        { bottom: '18%', right: '18%' },
        { bottom: '18%', left: '18%' },
        { top: '18%', left: '18%' },
        {
          top: '45%',
          left: '45%',
        },
      ];

    default:
      return [
        { top: '10%', left: '45%' },
        { top: '25%', right: '15%' },
        { bottom: '20%', right: '15%' },
        { bottom: '10%', left: '45%' },
        { bottom: '20%', left: '15%' },
        { top: '20%', left: '15%' },
        { top: '45%', left: '30%' },
        { top: '45%', right: '30%' },
      ];
  }
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
