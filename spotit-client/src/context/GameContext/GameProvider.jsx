import { useReducer } from 'react';
import GameContext from './GameContext';
import { loadDeck, getRandomBotTime } from '../../utils/gameUtils';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';
import { preloadIcons } from '../../assets/icons';

const initialState = {
  gameMode: null,
  difficulty: null,
  offline: {
    gameStatus: 'idle',
    pileCard: null,
    player: {
      deck: [],
      score: 0,
      currentCard: null,
      cardsRemaining: 0,
    },
    opponent: null,
    timer: {
      enabled: false,
      duration: 0,
      remaining: 0,
    },
  },
  online: {},
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'INITIALIZE_GAME_START':
      return {
        ...state,
        offline: { ...state.offline, gameStatus: 'initializing' },
      };
    case 'INITIALIZE_GAME_SUCCESS':
      return { ...state, ...action.payload };
    case 'INITIALIZE_GAME_ERROR':
      return {
        ...state,
        offline: {
          ...state.offline,
          gameStatus: 'error',
          error: action.payload,
        },
      };
    case 'MATCH_FOUND':
      return handleMatchFound(state, action.payload);
    case 'UPDATE_TIMER':
      return {
        ...state,
        offline: {
          ...state.offline,
          timer: {
            ...state.offline.timer,
            remaining: action.payload,
          },
        },
      };
    case 'TIMER_EXPIRED':
      return handleTimerExpired(state);

    case 'ONLINE_GAME_INITIALIZED':
      return handleOnlineGameInitialized(state, action.payload);

    case 'ONLINE_GAME_STARTED':
      return {
        ...state,
        online: {
          ...state.online,
          gameStatus: 'playing',
        },
      };

    case 'ONLINE_MATCH_FOUND':
      return handleOnlineMatchFound(state, action.payload);

    case 'ONLINE_MATCH_OVER':
      return {
        ...state,
        online: {
          ...state.online,
          gameStatus: 'game_over',
        },
      };

    case 'RESET_GAME':
      return initialState;

    case 'RESET_ONLINE_GAME':
      return {
        ...state,
        online: {},
      };

    default:
      return state;
  }
}

function handleOnlineGameInitialized(state, { payload, myPlayerId }) {
  const { gameId, pileCard, players, gameStatus } = payload;
  const player = players[myPlayerId];
  const opponentId = Object.keys(players).find((id) => id !== myPlayerId);
  const opponent = players[opponentId];

  return {
    ...state,
    online: {
      ...state.online,
      gameId,
      gameStatus,
      pileCard,
      player,
      opponent,
    },
  };
}

function handleOnlineMatchFound(state, { payload, myPlayerId }) {
  const {
    newPileCard,
    nextPlayerCard,
    playerCardsRemaining,
    playerId,
    playerScore,
    updatedDeck,
  } = payload;
  const whoseToUpdate = playerId === myPlayerId ? 'player' : 'opponent';

  return {
    ...state,
    online: {
      ...state.online,
      pileCard: newPileCard,
      [whoseToUpdate]: {
        ...state.online[whoseToUpdate],
        currentCard: nextPlayerCard,
        score: playerScore,
        cardsRemaining: playerCardsRemaining,
        deck: updatedDeck,
      },
    },
  };
}

async function initializeGame(mode, difficulty) {
  const fullDeck = await loadDeck(difficulty);
  const uniqueSymbols = [...new Set(fullDeck.flat().map((obj) => obj.symbol))];
  await preloadIcons(uniqueSymbols);
  const pileCard = fullDeck.pop();

  const commonState = {
    gameMode: mode,
    difficulty,
    offline: {
      gameStatus: 'playing',
      pileCard,
    },
  };

  if (mode === 'practice' || mode === 'timed') {
    return {
      ...commonState,
      offline: {
        ...commonState.offline,
        player: {
          deck: fullDeck,
          score: 0,
          currentCard: fullDeck[0],
          cardsRemaining: fullDeck.length,
        },
        opponent: null,
        timer:
          mode === 'timed'
            ? {
                enabled: true,
                duration: DIFFICULTY_CONFIGS[difficulty].timerSeconds,
                remaining: DIFFICULTY_CONFIGS[difficulty].timerSeconds,
              }
            : { enabled: false },
      },
    };
  }

  if (mode === 'bot') {
    const midpoint = Math.floor(fullDeck.length / 2);
    const playerDeck = fullDeck.slice(0, midpoint);
    const opponentDeck = fullDeck.slice(midpoint);

    return {
      ...commonState,
      offline: {
        ...commonState.offline,
        player: {
          deck: playerDeck,
          score: 0,
          currentCard: playerDeck[0],
          cardsRemaining: playerDeck.length,
        },
        opponent: {
          deck: opponentDeck,
          score: 0,
          currentCard: opponentDeck[0],
          cardsRemaining: opponentDeck.length,
        },
        timer:
          mode === 'bot'
            ? {
                enabled: true,
                duration: getRandomBotTime(difficulty),
                remaining: getRandomBotTime(difficulty),
              }
            : { enabled: false },
      },
    };
  }
  return commonState;
}

function handleMatchFound(state) {
  if (state.gameMode === 'practice' || state.gameMode === 'timed') {
    const newDeck = [...state.offline.player.deck];
    newDeck.shift(); //Remove the matched card

    return {
      ...state,
      offline: {
        ...state.offline,
        pileCard: state.offline.player.currentCard,
        player: {
          ...state.offline.player,
          deck: newDeck,
          currentCard: newDeck.length > 0 ? newDeck[0] : null,
          cardsRemaining: newDeck.length,
          score: state.offline.player.score + 1,
        },
        timer: state.offline.timer.enabled
          ? {
              ...state.offline.timer,
              remaining: state.offline.timer.duration, // Reset timer
            }
          : state.offline.timer,
        gameStatus: newDeck.length === 0 ? 'game_over' : 'playing',
      },
    };
  } else if (state.gameMode === 'bot') {
    const newPlayerDeck = [...state.offline.player.deck];
    newPlayerDeck.shift();

    return {
      ...state,
      offline: {
        ...state.offline,
        pileCard: state.offline.player.currentCard,
        player: {
          ...state.offline.player,
          deck: newPlayerDeck,
          currentCard: newPlayerDeck.length > 0 ? newPlayerDeck[0] : null,
          cardsRemaining: newPlayerDeck.length,
          score: state.offline.player.score + 1,
        },
        timer: {
          ...state.offline.timer,
          remaining: getRandomBotTime(state.difficulty), // New random time
        },
        gameStatus:
          newPlayerDeck.length === 0 ||
          (state.offline.opponent && state.offline.opponent.deck.length === 0)
            ? 'game_over'
            : 'playing',
      },
    };
  }
  return state;
}

function handleTimerExpired(state) {
  if (state.gameMode === 'timed') {
    const newDeck = [...state.offline.player.deck];
    newDeck.shift(); //Remove the next card without scoring

    return {
      ...state,
      offline: {
        ...state.offline,
        pileCard: state.offline.player.currentCard,
        player: {
          ...state.offline.player,
          deck: newDeck,
          currentCard: newDeck.length > 0 ? newDeck[0] : null,
          cardsRemaining: newDeck.length,
        },
        timer: {
          ...state.offline.timer,
          remaining: state.offline.timer.duration, //reset timer
        },
        gameStatus: newDeck.length === 0 ? 'game_over' : 'playing',
      },
    };
  } else if (state.gameMode === 'bot') {
    //Bot wins this round
    const newOpponentDeck = [...state.offline.opponent.deck];
    newOpponentDeck.shift();

    return {
      ...state,
      offline: {
        ...state.offline,
        pileCard: state.offline.opponent.currentCard,
        opponent: {
          ...state.offline.opponent,
          deck: newOpponentDeck,
          currentCard: newOpponentDeck.length > 0 ? newOpponentDeck[0] : null,
          cardsRemaining: newOpponentDeck.length,
          score: state.offline.opponent.score + 1,
        },
        timer: {
          ...state.offline.timer,
          remaining: getRandomBotTime(state.difficulty), // New random time
        },
        gameStatus:
          newOpponentDeck.length === 0 || state.offline.player.deck.length === 0
            ? 'game_over'
            : 'playing',
      },
    };
  }
  return state;
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = async () => {
    dispatch({ type: 'INITIALIZE_GAME_START' });
    try {
      const gameState = await initializeGame(state.gameMode, state.difficulty);
      dispatch({ type: 'INITIALIZE_GAME_SUCCESS', payload: gameState });
    } catch (error) {
      dispatch({ type: 'INITIALIZE_GAME_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    setGameMode: (mode) => dispatch({ type: 'SET_GAME_MODE', payload: mode }),
    setDifficulty: (difficulty) =>
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    initializeGame: startGame,
    handleMatchFound: (symbol) =>
      dispatch({ type: 'MATCH_FOUND', payload: symbol }),
    updateTimer: (newTime) =>
      dispatch({ type: 'UPDATE_TIMER', payload: newTime }),
    timerExpired: () => dispatch({ type: 'TIMER_EXPIRED' }),
    handleOnlineGameInitialized: (payload, myPlayerId) =>
      dispatch({
        type: 'ONLINE_GAME_INITIALIZED',
        payload: { payload, myPlayerId },
      }),
    handleOnlineGameStarted: () => dispatch({ type: 'ONLINE_GAME_STARTED' }),
    handleOnlineMatchFound: (payload, myPlayerId) =>
      dispatch({
        type: 'ONLINE_MATCH_FOUND',
        payload: { payload, myPlayerId },
      }),
    handleOnlineMatchFailed: () => dispatch({ type: 'ONLINE_MATCH_FAILED' }),
    handleOnlineGameover: () => dispatch({ type: 'ONLINE_MATCH_OVER' }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
    resetOnlineGame: () => dispatch({ type: 'RESET_ONLINE_GAME' }),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
