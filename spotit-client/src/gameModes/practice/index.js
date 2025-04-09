import { produce } from 'immer';
import { findMatchingSymbol } from '../../utils/gameUtils';

const practiceMode = {
  config: {
    needsOpponent: false,
    needsTimer: false,
  },
  init: handleInitialization,
  handleMatch,
};

export default practiceMode;

function handleInitialization(state, deck) {
  // Initialize the game state for practice mode
  return produce(state, (draft) => {
    draft.pileCard = deck.pop();
    draft.status = 'playing';
    draft.players.self.deck = deck;
    draft.players.self.currentCard = deck[0];
    draft.players.self.score = 0;
  });
}

function handleMatch(state, symbol) {
  // Handle the match logic for practice mode
  if (state.pileCard && state.players.self.currentCard) {
    const matchingSymbol = findMatchingSymbol(
      state.pileCard,
      state.players.self.currentCard,
    );

    if (matchingSymbol === symbol) {
      return produce(state, (draft) => {
        draft.players.self.score += 1;
        draft.pileCard = draft.players.self.currentCard;
        draft.players.self.deck.shift();
        draft.players.self.currentCard =
          draft.players.self.deck.length > 0
            ? draft.players.self.deck[0]
            : null;
        if (draft.players.self.deck.length === 0) {
          draft.status = 'game_over';
        }
      });
    } else {
      return state;
    }
  } else {
    return state;
  }
}
