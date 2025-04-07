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
    <div className="flex-1 grid grid-rows-2 border border-red-400 p-4">
      <div className="flex items-center justify-center">
        <div className="w-[90%] max-w-[400px] aspect-square">
          <Card
            card={gameMode === 'online' ? OnlinePileCard : pileCard}
            type="pile"
            onSymbolClick={() => {}}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-[95%] max-w-[420px] aspect-square">
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
    </div>
  );
}

export default PlayArea;
