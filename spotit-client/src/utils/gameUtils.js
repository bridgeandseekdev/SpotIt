import { SCALE_VARIANTS, SCALE_PATTERNS } from '../constants/gameConstants';

export const getRandomRotation = (isInteractive) => {
  const maxRotation = isInteractive ? -45 : 45;
  return Math.floor(Math.random() * maxRotation);
};

export const getScale = (difficulty, symbolIndex, symbolCount) => {
  switch (difficulty) {
    case 'medium':
      // Use predefined scale pattern based on symbol position
      return SCALE_PATTERNS[symbolCount][symbolIndex] || 'DEFAULT';

    case 'hard':
      // Only use random scaling for hard mode
      if (Math.random() < 0.33) return 'UP';
      if (Math.random() < 0.63) return 'DOWN';
      return 'DEFAULT';

    default:
      return 'DEFAULT';
  }
};

export const getRotation = (difficulty, isInteractive) => {
  switch (difficulty) {
    case 'medium':
      // No rotation for medium difficulty
      return 0;

    case 'hard':
      return Math.floor(
        Math.random() *
          (isInteractive
            ? Math.random() < 0.33
              ? -45
              : 45
            : Math.random() > 0.66
            ? -60
            : 60),
      );

    default:
      return 0;
  }
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

const deckModules = {
  classic: {
    3: () => import('/src/assets/decks/classic_deck_2.json'),
    5: () => import('/src/assets/decks/classic_deck_4.json'),
    8: () => import('/src/assets/decks/classic_deck_7.json'),
  },
};

export const getDeckBySettings = async (theme, symbolsPerCard) => {
  try {
    // Dynamic import based on theme and symbol count
    const deckModule = await deckModules[theme][symbolsPerCard]();
    return deckModule.default;
  } catch (error) {
    console.error('Failed to load deck', error);
    return null;
  }
};
