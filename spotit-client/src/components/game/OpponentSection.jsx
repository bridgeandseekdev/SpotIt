import PlayerInfo from './PlayerInfo';

function OpponentSection({ opponent }) {
  return (
    <div className="h-[10vh] flex shrink-0 items-center justify-center bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
      <PlayerInfo
        name={opponent.username || 'Bot'}
        deckCount={opponent.deck.length}
      />
    </div>
  );
}

export default OpponentSection;
