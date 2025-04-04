import shuffle from 'lodash.shuffle';
import { DIFFICULTY_CONFIGS } from '../constants/gameConstants';
import { getBaseLayout } from './layoutEngine';
import { getSymbolRotation, getSymbolScale } from './visualEngine';

const deckModules = {
  classic: {
    3: () => import('/src/assets/decks/classic_deck_2.json'),
    5: () => import('/src/assets/decks/classic_deck_4.json'),
    8: () => import('/src/assets/decks/classic_deck_7.json'),
  },
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

//src/utils/gameUtils.js
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
