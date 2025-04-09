import { produce } from 'immer';
import { findMatchingSymbol } from '../../utils/gameUtils';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

const timedMode = {
  config: {
    needsOpponent: false,
    needsTimer: true,
  },
  init: handleInitialization,
  handleTimerExpiry,
  handleMatch,
};

export default timedMode;

function stopTimer(draft) {
  draft.timer.enabled = false;
  draft.timer.remaining = 0;
  draft.timer.duration = 0;
}

function handleInitialization({ state, deck }) {
  return produce(state, (draft) => {
    draft.pileCard = deck.pop();
    draft.gameStatus = 'playing';
    draft.players.self.deck = deck;
    draft.players.self.currentCard = deck[0];
    draft.players.self.score = 0;
    draft.timer.enabled = true;
    draft.timer.duration = DIFFICULTY_CONFIGS[draft.difficulty].timerSeconds;
    draft.timer.remaining = DIFFICULTY_CONFIGS[draft.difficulty].timerSeconds;
  });
}

function handleMatch({ state, symbol }) {
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
        draft.players.self.deck.length > 0 ? draft.players.self.deck[0] : null;
      draft.timer.remaining = draft.timer.duration; // Reset timer
      if (draft.players.self.deck.length === 0) {
        draft.gameStatus = 'game_over';
        stopTimer(draft);
      }
    });
  } else {
    return state;
  }
}

function handleTimerExpiry({ state }) {
  return produce(state, (draft) => {
    draft.pileCard = draft.players.self.currentCard;
    draft.players.self.deck.shift();
    draft.players.self.currentCard =
      draft.players.self.deck.length > 0 ? draft.players.self.deck[0] : null;
    draft.timer.remaining = draft.timer.duration; // Reset timer
    if (draft.players.self.deck.length === 0) {
      stopTimer(draft);
    }
  });
}
