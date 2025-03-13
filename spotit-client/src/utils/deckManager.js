const deckModules = {
  classic: {
    3: () => import('/src/assets/decks/classic_deck_2.json'),
    5: () => import('/src/assets/decks/classic_deck_4.json'),
    8: () => import('/src/assets/decks/classic_deck_7.json'),
  },
};

export const getDeckBySettings = async (theme, symbolsPerCard) => {
  try {
    const deckModule = await deckModules[theme][symbolsPerCard]();
    return deckModule.default;
  } catch (error) {
    console.error('Failed to load deck', error);
    return null;
  }
};
