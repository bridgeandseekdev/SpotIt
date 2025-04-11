import { produce } from 'immer';

const onlineMode = {
  config: {
    needsOpponent: true,
    needsTimer: false,
  },
  init: handleInitialization,
  handleMatch,
  handleGameOver,
};

export default onlineMode;

function handleInitialization({ state, serverPayload }) {
  const { gameId, pileCard, players, gameStatus, difficulty } = serverPayload;
  const selfId = state.socketConnection.id;
  const opponentId = Object.keys(players).find((id) => id !== selfId);
  return produce(state, (draft) => {
    draft.socketConnection.gameId = gameId;
    draft.gameStatus = gameStatus;
    draft.pileCard = pileCard;
    draft.difficulty = difficulty;

    draft.players.self.deck = players[selfId].deck;
    draft.players.self.currentCard = players[selfId].currentCard;
    draft.players.self.score = players[selfId].score;
    draft.players.self.id = players[selfId].id;
    draft.players.self.username = players[selfId].username;

    draft.players.opponent.deck = players[opponentId].deck;
    draft.players.opponent.currentCard = players[opponentId].currentCard;
    draft.players.opponent.score = players[opponentId].score;
    draft.players.opponent.id = players[opponentId].id;
    draft.players.opponent.username = players[opponentId].username;
  });
}

function handleMatch({ state, serverPayload }) {
  const { playerId, newPileCard, playerScore, nextPlayerCard, updatedDeck } =
    serverPayload;

  const whoseToUpdate =
    state.socketConnection.id === playerId ? 'self' : 'opponent';
  return produce(state, (draft) => {
    draft.pileCard = newPileCard;
    draft.players[whoseToUpdate].score = playerScore;
    draft.players[whoseToUpdate].deck = updatedDeck;
    draft.players[whoseToUpdate].currentCard = nextPlayerCard;
  });
}

function handleGameOver({ state, serverPayload }) {
  const { finalScores } = serverPayload;
  const selfId = state.socketConnection.id;
  const opponentId = Object.keys(finalScores).find((id) => id !== selfId);
  return produce(state, (draft) => {
    draft.gameStatus = 'game_over';
    draft.players.self.score = finalScores[selfId];
    draft.players.opponent.score = finalScores[opponentId];
  });
}
