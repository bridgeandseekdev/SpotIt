import PlayerInfo from './PlayerInfo';
import TimerDisplay from './TimerDisplay';

function PlayerSection({ player, timer, difficulty }) {
  const showTimer = timer?.enabled;

  return (
    <div
      className={`h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 ${
        timer?.remaining <= 3 && showTimer ? 'animate-shake' : ''
      }`}
    >
      {showTimer ? (
        <div className="flex items-center gap-4">
          <TimerDisplay timer={timer} difficulty={difficulty} />
          <div className="text-gray-600 dark:text-gray-300">
            <span>{player.deck.length}</span>
          </div>
        </div>
      ) : (
        <PlayerInfo
          name={player.username || 'You'}
          deckCount={player.deck.length}
        />
      )}
    </div>
  );
}

export default PlayerSection;
