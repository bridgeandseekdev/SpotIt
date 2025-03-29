//Version used for refactoring the entire codebase.
import {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { getBaseLayout } from './utils/layoutEngine';
import { getSymbolRotation, getSymbolScale } from './utils/visualEngine';
import Symbol from './components/gameplay/Symbol';
import { DIFFICULTY_CONFIGS } from './constants/gameConstants';
import shuffle from 'lodash.shuffle';

// src/context/GameContext.jsx
const GameContext = createContext();

const initialState = {
  gameMode: null,
  difficulty: null,
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
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'INITIALIZE_GAME_START':
      return { ...state, gameStatus: 'initializing' };
    case 'INITIALIZE_GAME_SUCCESS':
      return { ...state, ...action.payload };
    case 'INITIALIZE_GAME_ERROR':
      return { ...state, gameStatus: 'error', error: action.payload };
    case 'MATCH_FOUND':
      return handleMatchFound(state, action.payload);
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          remaining: action.payload,
        },
      };
    case 'TIMER_EXPIRED':
      return handleTimerExpired(state);
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

async function initializeGame(mode, difficulty) {
  const fullDeck = await loadDeck(difficulty);
  const pileCard = fullDeck.pop();

  const commonState = {
    gameMode: mode,
    difficulty,
    gameStatus: 'playing',
    pileCard,
  };

  if (mode === 'practice' || mode === 'timed') {
    return {
      ...commonState,
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
              type: 'countdown',
            }
          : { enabled: false },
    };
  }
}

function handleMatchFound(state) {
  if (state.gameMode === 'practice') {
    const newDeck = [...state.player.deck];
    newDeck.shift(); //Remove the matched card

    return {
      ...state,
      pileCard: state.player.currentCard,
      player: {
        ...state.player,
        deck: newDeck,
        currentCard: newDeck.length > 0 ? newDeck[0] : null,
        cardsRemaining: newDeck.length,
        score: state.player.score + 1,
      },
      gameStatus: newDeck.length === 0 ? 'game_over' : 'playing',
    };
  }
  return state;
}

function handleTimerExpired(state) {
  return {
    ...state,
    timer: {
      ...state.timer,
      remaining: state.timer.duration, //reset timer
    },
  };
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
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
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

const deckModules = {
  classic: {
    3: () => import('/src/assets/decks/classic_deck_2.json'),
    5: () => import('/src/assets/decks/classic_deck_4.json'),
    8: () => import('/src/assets/decks/classic_deck_7.json'),
  },
};

const getDeckBySettings = async (theme, symbolsPerCard) => {
  try {
    const deckModule = await deckModules[theme][symbolsPerCard]();
    return deckModule.default;
  } catch (error) {
    console.error('Failed to load deck', error);
    return null;
  }
};

//src/utils/gameUtils.js
export async function loadDeck(difficulty) {
  const { symbolsPerCard } = DIFFICULTY_CONFIGS[difficulty];
  const positions = getBaseLayout(symbolsPerCard).positions;

  const rawDeck = await (async () => {
    switch (difficulty) {
      case 'easy':
        return await getDeckBySettings('classic', symbolsPerCard);
      case 'medium':
        return await getDeckBySettings('classic', symbolsPerCard);
      case 'hard':
        return await getDeckBySettings('classic', symbolsPerCard);
      default:
        return null;
    }
  })();

  // Transform each card to include pre-calculated layout values
  return shuffle(
    rawDeck.map((card) =>
      card.map((symbol, index) => ({
        symbol,
        position: positions[index],
        rotation: getSymbolRotation(difficulty),
        scale: getSymbolScale(difficulty, index),
      })),
    ),
  );
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
  const { player, pileCard, handleMatchFound } = useGameContext();
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

function useTimerEffect() {
  const { timer, updateTimer, timerExpired } = useGameContext();
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
  }, [timer.enabled, timer.remaining, timerExpired, updateTimer]);
}

// src/components/common/Card.jsx
function Card({ card, type, onSymbolClick }) {
  if (!card) return null;
  return (
    <div
      className={`relative h-[80%] sm:h-[90%] aspect-square rounded-full bg-bg-secondary dark:bg-bg-dark-primary border ${
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
function PlayArea() {
  const { pileCard, player } = useGameContext();
  const { checkMatch } = useCardMatching();

  const handleSymbolClick = (symbol) => {
    checkMatch(symbol);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card card={pileCard} type="pile" onSymbolClick={() => {}} />
      </div>
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card
          card={player.currentCard}
          type="player"
          onSymbolClick={handleSymbolClick}
        />
      </div>
    </div>
  );
}

// src/pages/MainMenu.jsx
function MainMenu() {
  const navigate = useNavigate();
  const { setGameMode } = useGameContext();
  const handleModeSelection = (mode) => {
    //reset game
    setGameMode(mode);
    navigate('/difficulty');
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <button onClick={() => handleModeSelection('practice')}>Practice</button>
      <button onClick={() => handleModeSelection('timed')}>Timed</button>
      <button onClick={() => handleModeSelection('bot')}>Play with bot</button>
      <button>2 Player Mode(Coming Soon)</button>
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
    //Setup game
    initializeGame();

    navigate('/play');
  };

  useEffect(() => {
    if (!gameMode) {
      navigate('/');
    }
  }, [gameMode, navigate]);

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

function GamePlay() {
  const { resetGame, gameStatus, player, gameMode, timer } = useGameContext();

  //start timer hook
  useTimerEffect();

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);

  return gameStatus === 'playing' ? (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      {gameMode === 'timed' && (
        <div className="absolute top-4 left-4">
          <h1>Time Remaining: {timer.remaining}</h1>
        </div>
      )}

      {/* Play Area (Common to all modes) */}
      <PlayArea />
      <div>
        <h1>Cards Remaining: {player.cardsRemaining}</h1>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

function App_v2() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/difficulty" element={<DifficultySelect />} />
          <Route path="/play" element={<GamePlay />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App_v2;
