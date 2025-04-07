import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../context';
import PlayArea from '../common/PlayArea';
import ScoreBoard from '../common/ScoreBoard';
import GameResult from './GameResult';
import { useTimerEffect } from '../../hooks/useTimerEffect';

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

export default GamePlay;
