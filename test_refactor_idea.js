// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// src/context/GameContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import { loadDeck, getRandomCard, getDifficultyTime, getRandomBotTime } from '../utils/gameUtils';

const GameContext = createContext();

const initialState = {
  gameMode: null,
  difficulty: null,
  gameState: 'menu',
  pileCard: null,
  player: {
    deck: [],
    currentCard: null,
    cardsRemaining: 0,
    score: 0
  },
  opponent: null,
  timer: {
    enabled: false,
    duration: 0,
    remaining: 0,
    type: 'countdown' ////unused
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'INITIALIZE_GAME':
      return initializeGame(state.gameMode, state.difficulty);
    case 'MATCH_FOUND':
      return handleMatchFound(state, action.payload);
    case 'UPDATE_TIMER':
      return { 
        ...state, 
        timer: {
          ...state.timer,
          remaining: action.payload
        }
      };
    case 'TIMER_EXPIRED':
      return handleTimerExpired(state);
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

function initializeGame(mode, difficulty) {
  const fullDeck = loadDeck(difficulty);
  const pileCard = getRandomCard(fullDeck);
  const remainingDeck = fullDeck.filter(card => card !== pileCard);
  
  const commonState = {
    gameMode: mode,
    difficulty,
    gameState: 'playing',
    pileCard
  };
  
  // Single-player modes
  if (mode === 'practice' || mode === 'timed') {
    return {
      ...commonState,
      player: {
        deck: remainingDeck,
        currentCard: remainingDeck[0],
        cardsRemaining: remainingDeck.length,
        score: 0
      },
      opponent: null,
      timer: mode === 'timed' ? {
        enabled: true,
        duration: getDifficultyTime(difficulty),
        remaining: getDifficultyTime(difficulty),
        type: 'countdown'
      } : { enabled: false }
    };
  }
  
  // Competitive modes (bot and multiplayer)
  if (mode === 'bot' || mode === 'multiplayer') {
    const midpoint = Math.floor(remainingDeck.length / 2);
    const playerDeck = remainingDeck.slice(0, midpoint);
    const opponentDeck = remainingDeck.slice(midpoint);
    
    return {
      ...commonState,
      player: {
        deck: playerDeck,
        currentCard: playerDeck[0],
        cardsRemaining: playerDeck.length,
        score: 0
      },
      opponent: {
        deck: opponentDeck,
        currentCard: opponentDeck[0],
        cardsRemaining: opponentDeck.length,
        score: 0,
        isBot: mode === 'bot' //unused
      },
      timer: {
        enabled: true,
        duration: getRandomBotTime(difficulty),
        remaining: getRandomBotTime(difficulty),
        type: 'random' //unused
      }
    };
  }
  
  return commonState;
}

function handleMatchFound(state, symbolId) {
  // Process match based on game mode
  if (state.gameMode === 'practice' || state.gameMode === 'timed') {
    const newDeck = [...state.player.deck];
    newDeck.shift(); // Remove the matched card
    
    return {
      ...state,
      pileCard: state.player.currentCard,
      player: {
        ...state.player,
        deck: newDeck,
        currentCard: newDeck.length > 0 ? newDeck[0] : null,
        cardsRemaining: newDeck.length,
        score: state.player.score + 1
      },
      timer: state.timer.enabled ? {
        ...state.timer,
        remaining: state.timer.duration // Reset timer
      } : state.timer,
      gameState: newDeck.length === 0 ? 'gameOver' : 'playing'
    };
  } else if (state.gameMode === 'bot' || state.gameMode === 'multiplayer') {
    // Handle bot/multiplayer match logic
    const newPlayerDeck = [...state.player.deck];
    newPlayerDeck.shift();
    
    return {
      ...state,
      pileCard: state.player.currentCard,
      player: {
        ...state.player,
        deck: newPlayerDeck,
        currentCard: newPlayerDeck.length > 0 ? newPlayerDeck[0] : null,
        cardsRemaining: newPlayerDeck.length,
        score: state.player.score + 1
      },
      timer: {
        ...state.timer,
        remaining: getRandomBotTime(state.difficulty) // New random time
      },
      gameState: (newPlayerDeck.length === 0 || 
                 (state.opponent && state.opponent.deck.length === 0)) 
                 ? 'gameOver' : 'playing'
    };
  }
  
  return state;
}

function handleTimerExpired(state) {
  if (state.gameMode === 'timed') {
    const newDeck = [...state.player.deck];
    newDeck.shift(); // Move to next card without scoring
    
    return {
      ...state,
      pileCard: state.player.currentCard,
      player: {
        ...state.player,
        deck: newDeck,
        currentCard: newDeck.length > 0 ? newDeck[0] : null,
        cardsRemaining: newDeck.length
        // No score increment
      },
      timer: {
        ...state.timer,
        remaining: state.timer.duration // Reset timer
      },
      gameState: newDeck.length === 0 ? 'gameOver' : 'playing'
    };
  } else if (state.gameMode === 'bot') {
    // Bot wins this round
    const newOpponentDeck = [...state.opponent.deck];
    newOpponentDeck.shift();
    
    return {
      ...state,
      pileCard: state.opponent.currentCard,
      opponent: {
        ...state.opponent,
        deck: newOpponentDeck,
        currentCard: newOpponentDeck.length > 0 ? newOpponentDeck[0] : null,
        cardsRemaining: newOpponentDeck.length,
        score: state.opponent.score + 1
      },
      timer: {
        ...state.timer,
        remaining: getRandomBotTime(state.difficulty) // New random time
      },
      gameState: newOpponentDeck.length === 0 ? 'gameOver' : 'playing'
    };
  }
  
  return state;
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const value = {
    ...state,
    setGameMode: (mode) => dispatch({ type: 'SET_GAME_MODE', payload: mode }),
    setDifficulty: (difficulty) => dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }),
    initializeGame: () => dispatch({ type: 'INITIALIZE_GAME' }),
    handleMatchFound: (symbolId) => dispatch({ type: 'MATCH_FOUND', payload: symbolId }),
    updateTimer: (newTime) => dispatch({ type: 'UPDATE_TIMER', payload: newTime }),
    timerExpired: () => dispatch({ type: 'TIMER_EXPIRED' }),
    resetGame: () => dispatch({ type: 'RESET_GAME' })
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

// src/utils/gameUtils.js
// Simplified utility functions
export function loadDeck(difficulty) {
  // In a real implementation, this would load from your JSON files
  // Simulating deck loading for this example
  const deckSizes = {
    'easy': 3,
    'medium': 5,
    'hard': 8
  };
  
  const symbolsPerCard = deckSizes[difficulty];
  const totalCards = 15; // Example deck size
  const deck = [];
  
  // Generate sample cards
  for (let i = 0; i < totalCards; i++) {
    const card = [];
    for (let j = 0; j < symbolsPerCard; j++) {
      // This is just a placeholder - real implementation would use your JSON data
      card.push(`symbol-${(i + j) % 20}`);
    }
    deck.push(card);
  }
  
  return deck;
}

export function getRandomCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

export function findMatchingSymbol(card1, card2) {
  return card1.find(symbol => card2.includes(symbol));
}

export function getDifficultyTime(difficulty) {
  const times = {
    'easy': 20,
    'medium': 15,
    'hard': 10
  };
  
  return times[difficulty];
}

export function getRandomBotTime(difficulty) {
  const ranges = {
    'easy': { min: 5, max: 10 },
    'medium': { min: 10, max: 15 },
    'hard': { min: 15, max: 20 }
  };
  
  const { min, max } = ranges[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// src/hooks/useGameSetup.js
import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

export function useGameSetup() {
  const { initializeGame } = useGame();
  
  useEffect(() => {
    initializeGame();
  }, []);
}

// src/hooks/useTimerEffect.js
import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export function useTimerEffect() {
  const { timer, updateTimer, timerExpired } = useGame();
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

// src/hooks/useCardMatching.js
import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { findMatchingSymbol } from '../utils/gameUtils';

export function useCardMatching() {
  const { pileCard, player, handleMatchFound } = useGame();
  
  const checkMatch = useCallback((clickedSymbolId) => {
    if (!pileCard || !player.currentCard) return false;
    
    const matchingSymbol = findMatchingSymbol(pileCard, player.currentCard);
    if (matchingSymbol === clickedSymbolId) {
      handleMatchFound(clickedSymbolId);
      return true;
    }
    
    return false;
  }, [pileCard, player.currentCard, handleMatchFound]);
  
  return { checkMatch };
}

// src/components/common/SymbolIcon.jsx
import React from 'react';

export default function SymbolIcon({ id, position, scale, rotation, onClick }) {
  // In a real implementation, you would load the SVG based on the symbol id
  
  return (
    <div 
      className="symbol-icon"
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `scale(${scale || 1}) rotate(${rotation || 0}deg)`,
        cursor: 'pointer'
      }}
      onClick={() => onClick(id)}
    >
      {/* Placeholder for SVG icon */}
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
        {id.split('-')[1]}
      </div>
    </div>
  );
}

// src/components/common/Card.jsx
import React from 'react';
import SymbolIcon from './SymbolIcon';
import { useGame } from '../../context/GameContext';

export default function Card({ card, type, onSymbolClick }) {
  const { difficulty } = useGame();
  
  if (!card) return null;
  
  // Generate symbol positions based on difficulty
  const getSymbolPosition = (index, total) => {
    if (difficulty === 'easy') {
      // Evenly spaced positions
      const angle = (360 / total) * index;
      const radius = 35;
      return {
        x: 50 + radius * Math.cos(angle * Math.PI / 180),
        y: 50 + radius * Math.sin(angle * Math.PI / 180)
      };
    } else if (difficulty === 'medium') {
      // Varied positions with consistent scale
      const angle = (360 / total) * index;
      const radius = 35 + (index % 3) * 5; // Varied radius
      return {
        x: 50 + radius * Math.cos(angle * Math.PI / 180),
        y: 50 + radius * Math.sin(angle * Math.PI / 180)
      };
    } else {
      // Random positions with rotation for hard mode
      return {
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60
      };
    }
  };
  
  // Generate symbol scales and rotations based on difficulty
  const getSymbolAttributes = (index) => {
    if (difficulty === 'hard') {
      return {
        scale: 0.7 + Math.random() * 0.6,
        rotation: Math.random() * 360
      };
    } else if (difficulty === 'medium') {
      return {
        scale: 0.8 + (index % 3) * 0.1,
        rotation: 0
      };
    } else {
      return {
        scale: 1,
        rotation: 0
      };
    }
  };
  
  return (
    <div className={`relative w-64 h-64 rounded-full ${type === 'pile' ? 'bg-yellow-100' : 'bg-blue-100'} m-4`}>
      {card.map((symbolId, index) => {
        const position = getSymbolPosition(index, card.length);
        const { scale, rotation } = getSymbolAttributes(index);
        
        return (
          <SymbolIcon
            key={symbolId}
            id={symbolId}
            position={position}
            scale={scale}
            rotation={rotation}
            onClick={onSymbolClick}
          />
        );
      })}
    </div>
  );
}

// src/components/common/MatchArea.jsx
import React from 'react';
import Card from './Card';
import { useGame } from '../../context/GameContext';
import { useCardMatching } from '../../hooks/useCardMatching';

export default function MatchArea() {
  const { pileCard, player } = useGame();
  const { checkMatch } = useCardMatching();
  
  const handleSymbolClick = (symbolId) => {
    checkMatch(symbolId);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mt-4">
        <h3 className="text-center font-semibold mb-2">Pile Card</h3>
        <Card card={pileCard} type="pile" onSymbolClick={() => {}} />
      </div>
      
      <div className="mt-4">
        <h3 className="text-center font-semibold mb-2">Your Card</h3>
        <Card 
          card={player.currentCard} 
          type="player" 
          onSymbolClick={handleSymbolClick} 
        />
      </div>
    </div>
  );
}

// src/components/common/Deck.jsx
import React from 'react';

export default function Deck({ cardsRemaining }) {
  return (
    <div className="flex flex-col items-center mt-4">
      <h3 className="font-semibold">Remaining Cards</h3>
      <div className="relative w-16 h-20 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-2xl font-bold">{cardsRemaining}</span>
      </div>
    </div>
  );
}

// src/components/mode-specific/TimerDisplay.jsx
import React from 'react';

export default function TimerDisplay({ time }) {
  // Add visual indicators when time is running low
  const timeClass = time <= 5 ? 'text-red-600' : 'text-gray-800';
  
  return (
    <div className="flex flex-col items-center mt-2 mb-4">
      <h3 className="font-semibold">Time Remaining</h3>
      <div className={`text-3xl font-bold ${timeClass}`}>
        {time}s
      </div>
    </div>
  );
}

// src/components/mode-specific/ScoreBoard.jsx
import React from 'react';

export default function ScoreBoard({ playerScore, botScore = null }) {
  return (
    <div className="flex justify-center space-x-8 mt-4 mb-4">
      <div className="text-center">
        <h3 className="font-semibold">Your Score</h3>
        <div className="text-2xl font-bold">{playerScore}</div>
      </div>
      
      {botScore !== null && (
        <div className="text-center">
          <h3 className="font-semibold">Bot Score</h3>
          <div className="text-2xl font-bold">{botScore}</div>
        </div>
      )}
    </div>
  );
}

// src/components/mode-specific/BotDeck.jsx
import React from 'react';

export default function BotDeck({ cardsRemaining }) {
  return (
    <div className="flex flex-col items-center mt-4">
      <h3 className="font-semibold">Bot's Remaining Cards</h3>
      <div className="relative w-16 h-20 bg-red-100 rounded-md flex items-center justify-center">
        <span className="text-2xl font-bold">{cardsRemaining}</span>
      </div>
    </div>
  );
}

// src/pages/MainMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

export default function MainMenu() {
  const navigate = useNavigate();
  const { setGameMode, resetGame } = useGame();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const handleModeSelection = (mode) => {
    resetGame();
    setGameMode(mode);
    navigate('/difficulty');
  };
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-4xl font-bold mb-8">Dobble/Spot It</h1>
      
      <div className="flex flex-col space-y-4 w-64">
        <button 
          className="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => handleModeSelection('practice')}
        >
          Practice Mode
        </button>
        
        <button 
          className="py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => handleModeSelection('timed')}
        >
          Timed Mode
        </button>
        
        <button 
          className="py-3 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          onClick={() => handleModeSelection('bot')}
        >
          Bot Mode
        </button>
        
        <button 
          className="py-3 px-6 bg-purple-500 text-white rounded-md hover:bg-purple-600 opacity-50 cursor-not-allowed"
        >
          2 Player Mode (Coming Soon)
        </button>
      </div>
      
      <button 
        className="mt-8 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        onClick={toggleTheme}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}

// src/pages/DifficultySelect.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

export default function DifficultySelect() {
  const navigate = useNavigate();
  const { gameMode, setDifficulty } = useGame();
  const { isDarkMode } = useTheme();
  
  const handleDifficultySelection = (difficulty) => {
    setDifficulty(difficulty);
    navigate('/gameplay');
  };
  
  if (!gameMode) {
    navigate('/');
    return null;
  }
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-4xl font-bold mb-4">Select Difficulty</h1>
      <h2 className="text-xl mb-8">Mode: {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</h2>
      
      <div className="flex flex-col space-y-4 w-64">
        <button 
          className="py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => handleDifficultySelection('easy')}
        >
          Easy (3 symbols)
        </button>
        
        <button 
          className="py-3 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          onClick={() => handleDifficultySelection('medium')}
        >
          Medium (5 symbols)
        </button>
        
        <button 
          className="py-3 px-6 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => handleDifficultySelection('hard')}
        >
          Hard (8 symbols)
        </button>
      </div>
      
      <button 
        className="mt-8 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        onClick={() => navigate('/')}
      >
        Back to Menu
      </button>
    </div>
  );
}

// src/pages/GamePlay.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import { useGameSetup } from '../hooks/useGameSetup';
import { useTimerEffect } from '../hooks/useTimerEffect';

// Common components
import MatchArea from '../components/common/MatchArea';
import Deck from '../components/common/Deck';

// Mode-specific components
import TimerDisplay from '../components/mode-specific/TimerDisplay';
import ScoreBoard from '../components/mode-specific/ScoreBoard';
import BotDeck from '../components/mode-specific/BotDeck';

export default function GamePlay() {
  const navigate = useNavigate();
  const { 
    gameMode, 
    difficulty,
    gameState,
    player,
    opponent,
    timer,
    resetGame
  } = useGame();
  const { isDarkMode } = useTheme();
  
  // Setup game and start timer
  useGameSetup();
  useTimerEffect();
  
  // Check for navigation to game over
  useEffect(() => {
    if (gameState === 'gameOver') {
      navigate('/gameover');
    }
  }, [gameState, navigate]);
  
  if (!gameMode || !difficulty) {
    navigate('/');
    return null;
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode - 
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
          </h1>
          
          <button 
            className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => {
              resetGame();
              navigate('/');
            }}
          >
            Quit Game
          </button>
        </div>
        
        {/* Bot Mode Top Section */}
        {gameMode === 'bot' && opponent && (
          <>
            <BotDeck cardsRemaining={opponent.cardsRemaining} />
            <ScoreBoard playerScore={player.score} botScore={opponent.score} />
          </>
        )}
        
        {/* Timed Mode Score and Timer */}
        {gameMode === 'timed' && (
          <>
            <TimerDisplay time={timer.remaining} />
            <ScoreBoard playerScore={player.score} />
          </>
        )}
        
        {/* Bot Mode Timer */}
        {gameMode === 'bot' && timer.enabled && (
          <TimerDisplay time={timer.remaining} />
        )}
        
        {/* Match Area (Common to all modes) */}
        <MatchArea />
        
        {/* Player's Deck (Common to all modes) */}
        <Deck cardsRemaining={player.cardsRemaining} />
      </div>
    </div>
  );
}

// src/pages/GameOver.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';

export default function GameOver() {
  const navigate = useNavigate();
  const { gameMode, player, opponent, resetGame } = useGame();
  const { isDarkMode } = useTheme();
  
  const getGameResult = () => {
    if (gameMode === 'practice') {
      return "Practice Complete!";
    } else if (gameMode === 'timed') {
      return `Game Over! Your score: ${player.score}`;
    } else if (gameMode === 'bot') {
      if (player.score > opponent.score) {
        return `You Win! ${player.score} - ${opponent.score}`;
      } else if (player.score < opponent.score) {
        return `Bot Wins! ${opponent.score} - ${player.score}`;
      } else {
        return `It's a Tie! ${player.score} - ${opponent.score}`;
      }
    }
    return "Game Over!";
  };
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      
      <div className="text-2xl mb-8">
        {getGameResult()}
      </div>
      
      <div className="flex space-x-4">
        <button 
          className="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => {
            resetGame();
            navigate('/');
          }}
        >
          Main Menu
        </button>
        
        <button 
          className="py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => {
            // Keep game mode and navigate to difficulty select
            navigate('/difficulty');
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';

// Pages
import MainMenu from './pages/MainMenu';
import DifficultySelect from './pages/DifficultySelect';
import GamePlay from './pages/GamePlay';
import GameOver from './pages/GameOver';

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/difficulty" element={<DifficultySelect />} />
            <Route path="/gameplay" element={<GamePlay />} />
            <Route path="/gameover" element={<GameOver />} />
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(