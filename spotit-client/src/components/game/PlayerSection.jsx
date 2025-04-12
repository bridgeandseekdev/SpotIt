import { GAME_MODES } from '../../constants/gameConstants';
import PlayerInfo from './PlayerInfo';
import TimerDisplay from './TimerDisplay';

function PlayerSection({ player, timer, difficulty, gameMode }) {
  const showTimer = timer?.enabled && gameMode !== GAME_MODES.BOT;

  return (
    <div
      className={`h-[4vh] md:h-[8vh] flex items-center justify-center bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 ${
        timer?.remaining <= 3 && showTimer ? 'animate-shake' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {showTimer && <TimerDisplay timer={timer} difficulty={difficulty} />}
        <PlayerInfo
          name={player.username || 'You'}
          deckCount={player.deck.length}
        />
      </div>
    </div>
  );
}

export default PlayerSection;
