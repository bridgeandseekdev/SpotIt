import { produce } from 'immer';

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
  const newState = produce(state, (draft) => {
    draft.pileCard = pileCard;
    draft.players.self.deck = deckCopy;
    draft.players.self.currentCard = deckCopy[0];
    draft.players.self.score = 0;
  });
  return newState;
}
