import shuffle from 'lodash.shuffle';
import {
  DIFFICULTY_CONFIGS,
  SYMBOL_POSITIONS,
  SCALE_VARIANTS,
} from '../constants/gameConstants';

const deckModules = {
  classic: {
    3: () => import('/src/assets/decks/classic_deck_2.json'),
    5: () => import('/src/assets/decks/classic_deck_4.json'),
    8: () => import('/src/assets/decks/classic_deck_7.json'),
  },
};

const getBaseLayout = (symbolCount) => {
  return {
    positions: SYMBOL_POSITIONS[symbolCount] || [],
    containerClass: 'relative h-[80%] sm:h-[90%] aspect-square',
  };
};

const getSymbolScale = (difficulty, symbolIndex) => {
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

const getSymbolRotation = (difficulty) => {
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

const getDeckBySettings = async (theme, symbolsPerCard) => {
  try {
    const deckModule = await deckModules[theme][symbolsPerCard]();
    return deckModule.default;
  } catch (error) {
    console.error('Failed to load deck', error);
    return null;
  }
};

export async function loadDeck(difficulty) {
  const { symbolsPerCard } = DIFFICULTY_CONFIGS[difficulty];
  const positions = getBaseLayout(symbolsPerCard).positions;

  const rawDeck = await (async () => {
    switch (difficulty) {
      case 'easy':
        return await getDeckBySettings('classic', symbolsPerCard);
      case 'medium':
        return await getDeckBySettings('classic', symbolsPerCard);
      case 'hard':
        return await getDeckBySettings('classic', symbolsPerCard);
      default:
        return null;
    }
  })();

  // Transform each card to include pre-calculated layout values
  return shuffle(
    rawDeck.map((card) => {
      const shuffledSymbols = shuffle([...card]);
      return shuffledSymbols.map((symbol, index) => ({
        symbol,
        position: positions[index],
        rotation: getSymbolRotation(difficulty),
        scale: getSymbolScale(difficulty, index),
      }));
    }),
  );
}

export function getRandomBotTime(difficulty) {
  const ranges = {
    easy: { min: 3, max: 5 },
    medium: { min: 3, max: 8 },
    hard: { min: 3, max: 12 },
  };

  const { min, max } = ranges[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function findMatchingSymbol(card1, card2) {
  const card1Symbols = card1.map((item) => item.symbol);
  const card2Symbols = card2.map((item) => item.symbol);

  for (const symbol of card1Symbols) {
    if (card2Symbols.includes(symbol)) {
      return symbol;
    }
  }

  return null;
}
