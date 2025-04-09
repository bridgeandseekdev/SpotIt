const practiceMode = {
  config: {
    needsOpponent: false,
    needsTimer: false,
  },
  init: handleInitialization,
};

export default practiceMode;

function handleInitialization(state, deck) {
  // Initialize the game state for practice mode
  const deckCopy = [...deck];
  const pileCard = deckCopy.pop();
  const newState = {
    ...state,
    pileCard,
    players: {
      self: {
        ...state.players.self, // id and name will be null for practice modes
        deck: deckCopy,
        currentCard: deckCopy[0],
        score: 0,
      },
    },
  };
  return newState;
}
