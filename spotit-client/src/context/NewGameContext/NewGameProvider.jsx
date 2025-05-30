import { useEffect, useReducer, useRef } from 'react';
import { loadDeck } from '../../utils/gameUtils';
import gameModes from '../../gameModes';
import { preloadIcons } from '../../assets/icons';
import NewGameContext from './NewGameContext';
import { produce } from 'immer';

const initialState = {
  mode: null, //'practice' | 'timed' | 'bot' | 'online'
  gameStatus: 'idle', // 'idle' | 'playing' | 'stand_by' | 'game_over' | 'error'
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
    id: null, // Player id aka socket connection id
    socketStatus: 'disconnected', // 'connected' | 'disconnected',
    roomId: null,
    hostId: null,
    gameId: null,
    players: [],
  },
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return produce(state, (draft) => {
        draft.mode = action.payload;
      });
    case 'SET_DIFFICULTY':
      return produce(state, (draft) => {
        draft.difficulty = action.payload;
      });
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        ...action.payload, //produce/immer is used in the game mode plugins
      };
    case 'UPDATE_TIMER':
      return produce(state, (draft) => {
        draft.timer.remaining = action.payload;
      });
    case 'NEW_SOCKET_CONNECTION':
      return produce(state, (draft) => {
        draft.socketConnection.socketStatus = 'connected';
        draft.socketConnection.id = action.payload.id;
      });
    case 'ROOM_CREATED':
      return produce(state, (draft) => {
        draft.socketConnection.roomId = action.payload.roomId;
        draft.socketConnection.hostId = action.payload.hostId;
        draft.socketConnection.players = action.payload.players;
      });
    case 'ROOM_JOINED':
      return produce(state, (draft) => {
        draft.socketConnection.hostId = action.payload.hostId;
        draft.socketConnection.roomId = action.payload.roomId;
        draft.socketConnection.players.push(action.payload.player);
      });
    case 'OPPONENT_JOINED':
      return produce(state, (draft) => {
        draft.socketConnection.players = action.payload.players;
      });
    case 'ONLINE_GAME_STARTED':
      return produce(state, (draft) => {
        if (
          draft.socketConnection.gameId === action.payload.gameId &&
          draft.gameStatus != 'playing'
        ) {
          draft.gameStatus = 'playing';
        }
      });
    case 'RESET_GAME':
      return produce(state, (draft) => {
        draft.mode = initialState.mode;
        draft.gameStatus = initialState.gameStatus;
        draft.pileCard = initialState.pileCard;
        draft.difficulty = initialState.difficulty;
        draft.timer = initialState.timer;
        draft.players.self = initialState.players.self;
        draft.players.opponent = initialState.players.opponent;
        draft.socketConnection = initialState.socketConnection;
      });
    case 'RESET_ONLINE_GAME':
      return produce(state, (draft) => {
        draft.gameStatus = initialState.gameStatus;
        draft.pileCard = initialState.pileCard;
        draft.players.self = initialState.players.self;
        draft.players.opponent = initialState.players.opponent;
        draft.socketConnection.gameId = initialState.socketConnection.gameId;
      });

    default:
      return state;
  }
}

export const NewGameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const initializeGame = async () => {
    const currentMode = gameState.mode;
    const currentDifficulty = gameState.difficulty;
    const currentState = gameStateRef.current;
    try {
      const deck = await loadDeck(currentDifficulty);
      const uniqueSymbols = [...new Set(deck.flat().map((obj) => obj.symbol))];
      await preloadIcons(uniqueSymbols);
      const result = gameModes[currentMode].init({
        state: currentState,
        deck,
      });
      dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
    } catch (error) {
      console.error('Error initializing game:', error);
      dispatch({ type: 'INITIALIZATION_ERROR', payload: error.message });
    }
  };

  const handleMatch = (symbol) => {
    const currentMode = gameState.mode;
    const currentState = gameStateRef.current;
    const result = gameModes[currentMode].handleMatch({
      state: currentState,
      symbol,
    });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const handleTimerExpired = () => {
    const currentMode = gameState.mode;
    const currentState = gameStateRef.current;
    const result = gameModes[currentMode].handleTimerExpiry({
      state: currentState,
    });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const handleSocketConnection = (socket) => {
    dispatch({ type: 'NEW_SOCKET_CONNECTION', payload: socket });
  };

  const handleRoomCreated = (payload) => {
    dispatch({ type: 'ROOM_CREATED', payload });
  };

  const handleRoomJoined = (payload) => {
    dispatch({ type: 'ROOM_JOINED', payload });
  };

  const handleOpponentJoined = (payload) => {
    dispatch({ type: 'OPPONENT_JOINED', payload });
  };

  const handleOnlineGameInitialized = (payload) => {
    const currentMode = gameState.mode;
    const currentState = gameStateRef.current;
    const result = gameModes[currentMode].init({
      state: currentState,
      serverPayload: payload,
    });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const handleOnlineMatch = (payload) => {
    const currentMode = gameState.mode;
    const currentState = gameStateRef.current;
    const result = gameModes[currentMode].handleMatch({
      state: currentState,
      serverPayload: payload,
    });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const handleOnlineGameOver = (payload) => {
    const currentMode = gameState.mode;
    const currentState = gameStateRef.current;
    const result = gameModes[currentMode].handleGameOver({
      state: currentState,
      serverPayload: payload,
    });
    dispatch({ type: 'UPDATE_GAME_STATE', payload: result });
  };

  const value = {
    gameState,
    setGameModeAction: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    setDifficultyAction: (difficulty) =>
      dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    initializeGameAction: initializeGame,
    handleMatchAction: handleMatch,
    updateTimerAction: (newTime) =>
      dispatch({ type: 'UPDATE_TIMER', payload: newTime }),
    handleTimerExpiredAction: handleTimerExpired,
    handleSocketConnectionAction: handleSocketConnection,
    handleRoomCreatedAction: handleRoomCreated,
    handleRoomJoinedAction: handleRoomJoined,
    handleOpponentJoinedAction: handleOpponentJoined,
    handleOnlineGameInitializedAction: handleOnlineGameInitialized,
    handleOnlineGameStartedAction: (payload) =>
      dispatch({ type: 'ONLINE_GAME_STARTED', payload }),
    handleOnlineMatchSuccessAction: handleOnlineMatch,
    handleOnlineGameOverAction: handleOnlineGameOver,
    handleResetAction: () => dispatch({ type: 'RESET_GAME' }),
    handleOnlineResetAction: () => dispatch({ type: 'RESET_ONLINE_GAME' }),
  };

  return (
    <NewGameContext.Provider value={value}>{children}</NewGameContext.Provider>
  );
};
