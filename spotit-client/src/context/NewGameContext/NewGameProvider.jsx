import { useReducer } from 'react';
import { loadDeck } from '../../utils/gameUtils';
import gameModes from '../gameModes';
import { preloadIcons } from '../../utils/iconUtils';
import NewGameContext from './NewGameContext';

const initialState = {
  mode: null, //'practice' | 'timed' | 'bot' | 'online'
  status: 'idle', // 'idle' | 'playing' | 'stand_by' | 'game_over' | 'error'
  pileCard: null,
  difficulty: null, // 'easy' | 'medium' | 'hard'
  timer: {
    enabled: false,
    duration: null,
    remaining: null,
  },
  players: {
    self: {
      id: null, // socket connection id
      name: null,
      deck: null,
      currentCard: null,
      score: 0,
    },
    opponent: {
      id: null, // socket connection id
      name: null,
      deck: null,
      currentCard: null,
      score: 0,
    },
  },
  socketConnection: {
    socket: null,
    id: null, // Player id aka socket connection id
    status: 'disconnected', // 'connected' | 'disconnected',
    roomId: null,
    hostId: null,
    gameId: null,
    players: [],
  },
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      };
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export const NewGameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const initializeGame = async () => {
    const currentMode = gameState.mode;
    const currentDifficulty = gameState.difficulty;
    try {
      const deck = await loadDeck(currentDifficulty);
      const uniqueSymbols = [...new Set(deck.flat().map((obj) => obj.symbol))];
      await preloadIcons(uniqueSymbols);
      const result = gameModes[currentMode].init(gameState, deck);
      dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
    } catch (error) {
      console.error('Error initializing game:', error);
      dispatch({ type: 'INITIALIZATION_ERROR', payload: error.message });
    }
  };

  const handleMatch = (symbol) => {
    const currentMode = gameState.mode;
    const result = gameModes[currentMode].handleMatch(gameState, symbol);
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const value = {
    gameState,
    setGameModeAction: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setDifficultyAction: (difficulty) =>
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    handleMatchAction: handleMatch,
    initializeGameAction: initializeGame,
  };

  return (
    <NewGameContext.Provider value={value}>{children}</NewGameContext.Provider>
  );
};
