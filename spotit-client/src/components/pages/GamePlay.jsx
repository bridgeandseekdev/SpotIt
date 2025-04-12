import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewGameContext } from '../../context';
import PlayArea from '../common/PlayArea';
import GameResult from './GameResult';
import { useTimerEffect } from '../../hooks/useTimerEffect';
import OpponentSection from '../game/OpponentSection';
import PlayerSection from '../game/PlayerSection';
import gameModes from '../../gameModes';
import QuitGameButton from '../common/QuitGameButton';

function GamePlay({ onlineCheckMatch }) {
  const {
    gameState: {
      mode,
      gameStatus,
      difficulty,
      timer,
      players: { self, opponent },
    },
  } = useNewGameContext();
  const navigate = useNavigate();
  const currentMode = gameModes[mode];

  useTimerEffect();

  useEffect(() => {
    if (!mode) navigate('/');
  }, [mode, navigate]);

  switch (gameStatus) {
    case 'idle':
    case 'initializing':
      return (
        <div className="flex items-center justify-center h-[100dvh]">
          <div className="text-xl">Loading...</div>
        </div>
      );
    case 'stand_by':
      return (
        <div className="flex items-center justify-center h-[100dvh]">
          <div className="text-xl">Get ready..starting game...</div>
        </div>
      );
    case 'playing':
      return (
        <div className="h-[100dvh] flex flex-col overflow-hidden">
          {currentMode.config.needsOpponent && (
            <OpponentSection opponent={opponent} />
          )}
          <div className="flex-1 flex flex-col justify-center items-center overflow-hidden relative">
            <PlayArea
              handleCheckMatch={mode === 'online' ? onlineCheckMatch : null}
            />
          </div>
          <div className="flex flex-col">
            <PlayerSection
              player={self}
              timer={currentMode.config.needsTimer ? timer : null}
              difficulty={difficulty}
              gameMode={mode}
            />
            {mode !== 'online' && <QuitGameButton />}
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
