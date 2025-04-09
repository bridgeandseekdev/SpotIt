import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext, useNewGameContext } from '../../context';
import PlayArea from '../common/PlayArea';
import GameResult from './GameResult';
import { useTimerEffect } from '../../hooks/useTimerEffect';
import { Layers, User2, Timer } from 'lucide-react';
import { DIFFICULTY_CONFIGS } from '../../constants/gameConstants';

function GamePlay({ onlineCheckMatch }) {
  const {
    gameMode,
    difficulty,
    offline: { gameStatus, player, opponent },
    online: {
      gameStatus: onlineGameStatus,
      player: onlinePlayer,
      opponent: onlineOpponent,
    },
  } = useGameContext();
  const {
    gameState: {
      timer,
      players: { self },
    },
  } = useNewGameContext();
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
        <div className="flex items-center justify-center h-[100dvh]">
          <div className="text-xl">Loading...</div>
        </div>
      );
    case 'playing':
      return (
        <div className="h-[100dvh] flex flex-col overflow-hidden">
          {(gameMode === 'bot' || gameMode === 'online') && (
            <div className="h-[10vh] flex shrink-0 items-center justify-center bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <div className="flex items-center gap-4">
                <User2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">
                  {gameMode === 'online' ? onlineOpponent.username : 'Bot'}
                </span>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Layers className="w-5 h-5" />
                  <span>
                    {gameMode === 'bot'
                      ? opponent.cardsRemaining
                      : onlineOpponent.cardsRemaining}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center items-center overflow-hidden relative">
            <PlayArea
              handleCheckMatch={gameMode === 'online' ? onlineCheckMatch : null}
            />
          </div>

          <div
            className={`h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 ${
              timer.remaining <= 3 && gameMode === 'timed'
                ? 'animate-shake'
                : ''
            }`}
          >
            {gameMode === 'timed' ? (
              <div className="flex items-center gap-4 relative">
                <div
                  className={`${
                    timer.remaining <= 3 ? 'bg-red-400' : 'bg-green-400'
                  } h-1 transition-all duration-1000 ease-linear fixed bottom-0 left-0 right-0 mx-auto w-[70%]`}
                  style={{
                    width: `${
                      (timer.remaining /
                        DIFFICULTY_CONFIGS[difficulty].timerSeconds) *
                      100
                    }%`,
                  }}
                ></div>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    {timer.remaining}s
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Layers className="w-5 h-5" />
                  <span>{self.deck.length}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <User2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">You</span>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Layers className="w-5 h-5" />
                  <span>
                    {gameMode === 'online'
                      ? onlinePlayer.cardsRemaining
                      : player.cardsRemaining}
                  </span>
                </div>
              </div>
            )}
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

export default GamePlay;
