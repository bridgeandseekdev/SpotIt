import { produce } from 'immer';
// import { findMatchingSymbol } from "../../utils/gameUtils";
// import { DIFFICULTY_CONFIGS } from "../../constants/gameConstants";

const onlineMode = {
  config: {
    needsOpponent: true,
    needsTimer: false,
  },
  init: handleInitialization,
};

function handleInitialization({ state, serverPayload }) {
  const { gameId, pileCard, players, gameStatus } = serverPayload;
  const selfId = state.socketConnection.id;
  const opponentId = Object.keys(players).find((id) => id !== selfId);
  return produce(state, (draft) => {
    draft.socketConnection.gameId = gameId;
    draft.gameStatus = gameStatus;
    draft.pileCard = pileCard;

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

export default onlineMode;
