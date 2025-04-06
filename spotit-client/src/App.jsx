//Version used for refactoring the entire codebase.
import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { loadDeck } from './utils/gameUtils';
import Symbol from './components/Symbol';
import { DIFFICULTY_CONFIGS } from './constants/gameConstants';

//src/context/SocketContext.jsx
const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const initialState = {
    isConnected: false,
    roomId: null,
    hostId: null,
    players: [],
    myPlayerId: null,
  };
  const [onlineState, setOnlineState] = useState(initialState);
  const onlineStateRef = useRef(initialState);

  const {
    difficulty,
    handleOnlineGameInitialized,
    handleOnlineGameStarted,
    online: { gameId },
    handleOnlineMatchFound,
    handleOnlineGameover,
  } = useGameContext();

  useEffect(() => {
    // Update ref whenever state changes
    onlineStateRef.current = onlineState;
  }, [onlineState]);

  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000',
    );

    newSocket.on('connect', () => {
      setOnlineState((prev) => ({ ...prev, isConnected: true }));
    });

    newSocket.on('room_created', handleRoomCreated);

    newSocket.on('room_joined', handleRoomJoined);
    newSocket.on('player_joined', handlePlayerJoined);
    newSocket.on('game_initialized', (payload) =>
      handleOnlineGameInitialized(payload, onlineStateRef.current.myPlayerId),
    );
    newSocket.on('game_started', handleOnlineGameStarted);
    newSocket.on('match_success', (payload) =>
      handleOnlineMatchFound(payload, onlineStateRef.current.myPlayerId),
    );
    newSocket.on('match_failed', (data) => console.log(data));
    newSocket.on('game_over', (payload) =>
      handleOnlineGameover(
        payload,
        onlineStateRef.current.myPlayerId,
        onlineStateRef.current.players,
      ),
    );
    newSocket.on('error', (err) => console.log(err));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleRoomCreated = ({ roomInfo: { hostId, players }, roomId }) => {
    setOnlineState((prev) => ({
      ...prev,
      roomId,
      hostId,
      players,
      myPlayerId: hostId,
    }));
  };

  const handleRoomJoined = ({ roomId, player, hostId }) => {
    setOnlineState((prev) => ({
      ...prev,
      roomId,
      myPlayerId: player.id,
      hostId,
    }));
  };

  const handlePlayerJoined = ({ players }) => {
    setOnlineState((prev) => ({
      ...prev,
      players,
    }));
  };

  const createRoom = ({ username }) => {
    socket.emit('create_room', { username });
  };

  const joinRoom = ({ roomId, username }) => {
    socket.emit('join_room', { roomId, username });
  };

  const startGame = async () => {
    const deck = await loadDeck(difficulty);
    socket.emit('initialize_game', { roomId: onlineState.roomId, deck });
  };

  const startOnlineCountdown = () => {
    socket.emit('start_countdown', { roomId: onlineState.roomId, gameId });
  };

  const checkMatch = (symbol) => {
    console.log('sending data', gameId, symbol);
    socket.emit('check_match', { gameId, symbol });
  };

  const resetSocket = () => {
    setSocket(null);
    setOnlineState(initialState);
  };

  return (
    <SocketContext.Provider
      value={{
        onlineState,
        createRoom,
        joinRoom,
        resetSocket,
        startGame,
        startOnlineCountdown,
        checkMatch,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

// src/context/GameContext.jsx
const GameContext = createContext();

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

// function handleOnlineGameover(state, {payload, myPlayerId}) {
//   const {winner, finalScores} = payload;
// }

async function initializeGame(mode, difficulty) {
  const fullDeck = await loadDeck(difficulty);
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

export function GameProvider({ children }) {
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
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

function getRandomBotTime(difficulty) {
  const ranges = {
    easy: { min: 5, max: 10 },
    medium: { min: 3, max: 8 },
    hard: { min: 3, max: 5 },
  };

  const { min, max } = ranges[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findMatchingSymbol(card1, card2) {
  const card1Symbols = card1.map((item) => item.symbol);
  const card2Symbols = card2.map((item) => item.symbol);

  // Find the symbol that exists in both cards
  for (const symbol of card1Symbols) {
    if (card2Symbols.includes(symbol)) {
      return symbol;
    }
  }

  return null;
}

// src/hooks/useCardMatching.js
function useCardMatching() {
  const {
    offline: { player, pileCard },
    handleMatchFound,
  } = useGameContext();
  const checkMatch = useCallback(
    (clickedSymbol) => {
      if (!pileCard || !player.currentCard) return false;

      const matchingSymbol = findMatchingSymbol(pileCard, player.currentCard);
      if (matchingSymbol === clickedSymbol) {
        handleMatchFound(clickedSymbol);
        return true;
      }
      return false;
    },
    [pileCard, player.currentCard, handleMatchFound],
  );
  return { checkMatch };
}

// src/hooks/useTimerEffect.js
function useTimerEffect() {
  const {
    offline: { timer },
    updateTimer,
    timerExpired,
  } = useGameContext();
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer.enabled && timer.remaining > 0) {
      timerRef.current = setInterval(() => {
        updateTimer(timer.remaining - 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    } else if (timer.enabled && timer.remaining <= 0) {
      clearInterval(timerRef.current);
      timerExpired();
    }
  }, [timer.enabled, timer.remaining]);
}

// src/components/common/Card.jsx
function Card({ card, type, onSymbolClick }) {
  if (!card) return null;
  return (
    <div
      className={`relative h-[80%] sm:h-[90%] aspect-square rounded-full noise-svg dark:noise-svg-none bg-white dark:bg-bg-dark-primary border ${
        type === 'pile'
          ? 'border-neutral-200'
          : 'border-green-400 dark:shadow-md dark:shadow-gray-500 shadow-md backdrop-blur-3xl'
      }`}
    >
      {card.map(({ symbol, position, rotation, scale }, index) => (
        <Symbol
          key={`${symbol}-${index}`}
          symbol={symbol}
          position={position}
          rotation={rotation}
          scale={scale}
          onClick={onSymbolClick}
          type={type}
        />
      ))}
    </div>
  );
}

// src/components/common/PlayArea.jsx
function PlayArea({ handleCheckMatch: handleOnlineCheckMatch }) {
  const {
    gameMode,
    offline: { pileCard, player },
    online: { pileCard: OnlinePileCard, player: onlinePlayer },
  } = useGameContext();
  const { checkMatch } = useCardMatching();

  const handleSymbolClick = (symbol) => {
    if (handleOnlineCheckMatch) {
      handleOnlineCheckMatch(symbol);
    } else {
      checkMatch(symbol);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card
          card={gameMode === 'online' ? OnlinePileCard : pileCard}
          type="pile"
          onSymbolClick={() => {}}
        />
      </div>
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card
          card={
            gameMode === 'online'
              ? onlinePlayer.currentCard
              : player.currentCard
          }
          type="player"
          onSymbolClick={handleSymbolClick}
        />
      </div>
    </div>
  );
}

// src/components/mode-specific/ScoreBoard.jsx
function ScoreBoard({ playerScore, botScore = null, opponentName }) {
  return (
    <div className="flex justify-center space-x-8 mt-4 mb-4">
      <div className="text-center">
        <h3 className="font-semibold">Your Score</h3>
        <div className="text-2xl font-bold">{playerScore}</div>
      </div>

      {botScore !== null && (
        <div className="text-center">
          <h3 className="font-semibold">{`${
            opponentName ? opponentName : 'Bot'
          } Score`}</h3>
          <div className="text-2xl font-bold">{botScore}</div>
        </div>
      )}
    </div>
  );
}

// src/pages/MainMenu.jsx
function MainMenu() {
  const navigate = useNavigate();
  const {
    setGameMode,
    offline: { gameStatus },
    resetGame,
  } = useGameContext();

  const handleModeSelection = (mode) => {
    resetGame();
    setGameMode(mode);
    if (mode === 'online') {
      navigate('/online/create');
      return;
    }
    navigate('/difficulty');
  };

  useEffect(() => {
    if (gameStatus !== 'idle') {
      resetGame();
    }
  }, [gameStatus, resetGame]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <button onClick={() => handleModeSelection('practice')}>Practice</button>
      <button onClick={() => handleModeSelection('timed')}>Timed</button>
      <button onClick={() => handleModeSelection('bot')}>Play with bot</button>
      <button onClick={() => handleModeSelection('online')}>
        2 Player: Play with your friend online
      </button>
    </div>
  );
}

function DifficultySelect() {
  const navigate = useNavigate();
  const { setDifficulty, gameMode, initializeGame, difficulty } =
    useGameContext();

  const handleDifficultySelection = (difficulty) => {
    setDifficulty(difficulty);
  };

  const handleStartGame = () => {
    initializeGame();
    navigate('/play');
  };

  return (
    <div className=" h-screen flex flex-col items-center justify-center gap-8">
      <h1>Choose Difficulty</h1>
      <h2>Game Mode: {gameMode}</h2>
      <div className="flex flex-col items-center justify-center gap-8">
        <button
          className={`${difficulty === 'easy' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('easy')}
        >
          Easy
        </button>
        <button
          className={`${difficulty === 'medium' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('medium')}
        >
          Medium
        </button>
        <button
          className={`${difficulty === 'hard' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('hard')}
        >
          Hard
        </button>
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleStartGame}
      >
        Start Game
      </button>
    </div>
  );
}

function GameResult() {
  const navigate = useNavigate();
  const {
    gameMode,
    offline: { player: offlinePlayer, opponent: offlineOpponent },
    online: { player: onlinePlayer, opponent: onlineOpponent },
    initializeGame,
    resetGame,
    difficulty,
    resetOnlineGame,
  } = useGameContext();
  let totalScore;

  if (gameMode === 'timed') {
    const n = DIFFICULTY_CONFIGS[difficulty].symbolsPerCard - 1;
    totalScore = Math.pow(n, 2) + n;
  }

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleBackToMenu = () => {
    if (gameMode === 'online') {
      resetOnlineGame();
      navigate('/online');
    } else {
      resetGame();
      navigate('/');
    }
  };

  const player = gameMode === 'online' ? onlinePlayer : offlinePlayer;
  const opponent = gameMode === 'online' ? onlineOpponent : offlineOpponent;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <h1 className="text-2xl font-bold">Game Over!</h1>
      {gameMode === 'bot' || gameMode === 'online' ? (
        <div>
          <h2>
            {player.score > opponent.score
              ? 'You Win!'
              : player.score < opponent.score
              ? opponent.username
                ? `${opponent.username} wins!`
                : 'Bot Wins!'
              : "It's a Tie!"}
          </h2>

          {gameMode === 'online' && (
            <div>
              Final Score:
              <p>
                {player.username}: {player.score}
              </p>
              <p>
                {opponent.username}: {opponent.score}
              </p>
            </div>
          )}

          {gameMode === 'bot' && (
            <div>
              Final Score:
              <p>You: {player.score}</p>
              <p>Bot: {opponent.score}</p>
            </div>
          )}
        </div>
      ) : null}

      {gameMode === 'timed' && (
        <h2>
          Final Score: {player.score} /{totalScore}
        </h2>
      )}

      {gameMode === 'online' ? (
        <div>
          <button onClick={handleBackToMenu}>Back to Lobby</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button onClick={handlePlayAgain}>Play Again</button>
          <button onClick={handleBackToMenu}>Back to Menu</button>
        </div>
      )}
    </div>
  );
}

function GamePlay({ onlineCheckMatch }) {
  const {
    gameMode,
    offline: { gameStatus, player, opponent, timer },
    online: {
      gameStatus: onlineGameStatus,
      player: onlinePlayer,
      opponent: onlineOpponent,
    },
  } = useGameContext();
  const navigate = useNavigate();

  useTimerEffect();

  useEffect(() => {
    if (!gameMode) {
      navigate('/');
    }
  }, [gameMode, navigate]);

  switch (gameMode === 'online' ? onlineGameStatus : gameStatus) {
    case 'idle':
    case 'initializing':
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      );
    case 'playing':
      return (
        <div className="relative flex flex-col" style={{ height: '100dvh' }}>
          {gameMode === 'bot' || gameMode === 'online' ? (
            <div className="absolute top-4 left-4">
              <h2>
                Opponent Cards Remaining:{' '}
                {gameMode === 'bot'
                  ? opponent.cardsRemaining
                  : onlineOpponent.cardsRemaining}
              </h2>
              <ScoreBoard
                playerScore={
                  gameMode === 'bot' ? player.score : onlinePlayer.score
                }
                botScore={
                  gameMode === 'bot' ? opponent.score : onlineOpponent.score
                }
                opponentName={
                  gameMode === 'online' ? onlineOpponent.username : null
                }
              />
              {gameMode === 'bot' && <h2>Time Remaining: {timer.remaining}</h2>}
            </div>
          ) : null}

          {gameMode === 'timed' && (
            <div className="absolute top-4 left-4">
              <h1>Time Remaining: {timer.remaining}</h1>
              <ScoreBoard playerScore={player.score} />
            </div>
          )}

          <PlayArea
            handleCheckMatch={gameMode === 'online' ? onlineCheckMatch : null}
          />
          <div>
            <h1>
              Cards Remaining:{' '}
              {gameMode === 'online'
                ? onlinePlayer.cardsRemaining
                : player.cardsRemaining}
            </h1>
          </div>
        </div>
      );
    case 'game_over':
      return <GameResult />;
    default:
      return (
        <div className="flex items-center justify-center h-screen">
          <h2>Some error occured</h2>
          <button onClick={() => navigate('/')}>Go to Menu</button>
        </div>
      );
  }
}

function OnlineDifficultySelect() {
  const { setDifficulty, difficulty } = useGameContext();

  const handleDifficultySelection = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <h1>Choose Difficulty</h1>
      <div className="flex items-center justify-center gap-4">
        <button
          className={`${difficulty === 'easy' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('easy')}
        >
          Easy
        </button>
        <button
          className={`${difficulty === 'medium' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('medium')}
        >
          Medium
        </button>
        <button
          className={`${difficulty === 'hard' ? 'bg-blue-400' : null}`}
          onClick={() => handleDifficultySelection('hard')}
        >
          Hard
        </button>
      </div>
    </div>
  );
}

function CreateRoom() {
  const {
    createRoom,
    joinRoom,
    onlineState: { roomId },
  } = useSocketContext();
  const navigate = useNavigate();

  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');

  const handleCreate = () => {
    createRoom({ username: createName });
  };

  const handleJoin = () => {
    joinRoom({ roomId: joinCode, username: joinName });
  };

  useEffect(() => {
    if (roomId) navigate('/online');
  }, [roomId, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-36">
      <div className="flex flex-col gap-4 items-center">
        <h1>Create a private game room</h1>
        <input
          type="text"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          placeholder="Enter your game name"
        />
        <button onClick={handleCreate}>Create Room</button>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h2>Join room</h2>
        <p>If you already have an invite code, join here</p>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter invite code"
        />
        <input
          type="text"
          value={joinName}
          onChange={(e) => setJoinName(e.target.value)}
          placeholder="Enter your game name"
        />
        <button onClick={handleJoin}>Join Room</button>
      </div>
    </div>
  );
}

function RoomHome() {
  const navigate = useNavigate();
  const {
    onlineState: { roomId, hostId, myPlayerId, players },
    startGame,
  } = useSocketContext();

  const {
    online: { gameId },
  } = useGameContext();

  useEffect(() => {
    if (gameId) {
      navigate('/online/play');
    }
  }, [gameId, navigate]);

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <h1 className="font-bold text-xl">Welcome! to lobby</h1>
      {players.map(({ username, id }) => (
        <p key={id}>
          {myPlayerId === id ? 'You, ' : 'Your friend, '} {username} Joined{' '}
          {hostId === id ? '[HOST]' : null}
        </p>
      ))}
      {players.length === 1 && (
        <div>
          <p>Waiting for another player..</p>
          <p>Share this code with your friend to join: {roomId}</p>
        </div>
      )}

      {players.length === 2 &&
        (hostId === myPlayerId ? (
          <div>
            <OnlineDifficultySelect />
            <button className="mt-4" onClick={() => startGame()}>
              Start Game
            </button>
          </div>
        ) : (
          'Waiting for host to start the game'
        ))}
    </div>
  );
}

function OnlineGamePlay() {
  const { startOnlineCountdown, checkMatch } = useSocketContext();
  useEffect(() => {
    startOnlineCountdown();
  }, []);
  return <GamePlay onlineCheckMatch={checkMatch} />;
}

function OnlineRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomHome />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/play" element={<OnlineGamePlay />} />
    </Routes>
  );
}

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/difficulty" element={<DifficultySelect />} />
          <Route path="/play" element={<GamePlay />} />
          <Route
            path="/online/*"
            element={
              <SocketProvider>
                <OnlineRouter />
              </SocketProvider>
            }
          />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
