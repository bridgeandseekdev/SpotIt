import { produce } from 'immer';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';
import { getRandomBotTime, findMatchingSymbol } from '../../utils/gameUtils';

const botMode = {
  config: {
    needsOpponent: true,
    needsTimer: true,
  },
  init: handleInitialization,
  handleMatch,
  handleTimerExpiry,
};

export default botMode;

function stopTimer(draft) {
  draft.timer.enabled = false;
  draft.timer.remaining = 0;
  draft.timer.duration = 0;
}

function handleInitialization({ state, deck }) {
  const pileCard = deck.pop();
  const midpoint = Math.floor(deck.length / 2);
  const playerDeck = deck.slice(0, midpoint);
  const opponentDeck = deck.slice(midpoint);
  return produce(state, (draft) => {
    draft.pileCard = pileCard;
    draft.gameStatus = 'playing';
    draft.players.self.deck = playerDeck;
    draft.players.self.currentCard = playerDeck[0];
    draft.players.self.score = 0;
    draft.players.opponent.deck = opponentDeck;
    draft.players.opponent.currentCard = opponentDeck[0];
    draft.players.opponent.score = 0;
    draft.timer.enabled = true;
    draft.timer.duration = DIFFICULTY_CONFIGS[draft.difficulty].timerSeconds;
    draft.timer.remaining = DIFFICULTY_CONFIGS[draft.difficulty].timerSeconds;
  });
}

function handleMatch({ state, symbol }) {
  // Check if the game is over
  if (state.gameStatus !== 'playing') {
    return state;
  }

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
      draft.timer.remaining = getRandomBotTime(draft.difficulty);
      if (
        draft.players.self.deck.length === 0 ||
        draft.players.opponent.deck.length === 0
      ) {
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
    draft.pileCard = draft.players.opponent.currentCard;
    draft.players.opponent.deck.shift();
    draft.players.opponent.currentCard =
      draft.players.opponent.deck.length > 0
        ? draft.players.opponent.deck[0]
        : null;
    draft.players.opponent.score += 1;
    draft.timer.remaining = getRandomBotTime(draft.difficulty);
    if (
      draft.players.self.deck.length === 0 ||
      draft.players.opponent.deck.length === 0
    ) {
      draft.gameStatus = 'game_over';
      stopTimer(draft);
    }
  });
}
