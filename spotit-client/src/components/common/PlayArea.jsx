import { useGameContext } from '../../context';
import { useCardMatching } from '../../hooks/useCardMatching';
import Card from './Card';

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

export default PlayArea;
