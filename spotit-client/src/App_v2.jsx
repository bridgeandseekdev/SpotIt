//Version used for refactoring the entire codebase.
import { createContext, useReducer, useContext, useEffect } from 'react';
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

  if (mode === 'practice') {
    return {
      ...commonState,
      player: {
        deck: fullDeck,
        score: 0,
        currentCard: fullDeck[0],
        cardsRemaining: fullDeck.length,
      },
      opponent: null,
    };
  }
  return commonState;
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
  const baseRotation = getSymbolRotation(difficulty);

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
  return rawDeck.map((card) =>
    card.map((symbol, index) => ({
      symbol,
      position: positions[index],
      rotation: baseRotation,
      scale: getSymbolScale(difficulty, index),
    })),
  );
}

// src/components/common/Card.jsx
function Card({ card, type }) {
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
        />
      ))}
    </div>
  );
}

// src/components/common/PlayArea.jsx
function PlayArea() {
  const { pileCard, player } = useGameContext();

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card card={pileCard} type="pile" />
      </div>
      <div className="flex-1 max-h-full flex items-center justify-center">
        <Card card={player.currentCard} type="player" />
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
    //Setup game and start timer
    //TODO: start timer hook
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
  const { resetGame, gameStatus } = useGameContext();

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);

  return (
    <div className="relative flex flex-col" style={{ height: '100dvh' }}>
      {/* Play Area (Common to all modes) */}
      {gameStatus === 'playing' ? (
        <PlayArea />
      ) : (
        <div className="">Loading...</div>
      )}
    </div>
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
