import { useNewGameContext } from '../../context';
import Card from './Card';
import QuitGameButton from './QuitGameButton';

function PlayArea({ handleCheckMatch: handleOnlineCheckMatch }) {
  const {
    handleMatchAction,
    gameState: {
      mode,
      pileCard,
      players: { self },
    },
  } = useNewGameContext();

  const handleSymbolClick = (symbol) => {
    if (handleOnlineCheckMatch) {
      handleOnlineCheckMatch(symbol);
    } else {
      handleMatchAction(symbol);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center p-4 mt-10 gap-4">
      <div className="h-[45%] w-full flex justify-center p-[2%] md:p-2">
        <div className="h-full max-w-full rounded-full aspect-square">
          <Card card={pileCard} type="pile" onSymbolClick={() => {}} />
        </div>
      </div>
      <div className="h-[55%] w-full flex justify-center p-[3%] md:p-2">
        <div className="h-full max-w-full rounded-full aspect-square">
          <Card
            card={self.currentCard}
            type="player"
            onSymbolClick={handleSymbolClick}
          />
        </div>
      </div>
      {mode !== 'online' ? <QuitGameButton /> : null}
    </div>
  );
}

export default PlayArea;
