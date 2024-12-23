/* eslint-disable react/prop-types */
import { ICON_MAP } from '../assets/icons';
import { SYMBOL_POSITIONS } from '../constants/symbolPositions';

// Components
const SymbolIcon = ({ symbol, className }) => {
  const IconComponent = ICON_MAP[symbol];

  if (!IconComponent) {
    console.warn(`No icon found for symbol: ${symbol}`);
    return null;
  }

  return <IconComponent className={className} aria-label={symbol} />;
};

const GameCard = ({ symbols, isInteractive = false, onSymbolClick }) => {
  return (
    <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl bg-bg-secondary border border-neutral-200 dark:bg-bg-dark-primary dark:shadow-md dark:shadow-gray-500">
      {symbols.map((symbol, index) => {
        const rotation = Math.floor(Math.random() * (isInteractive ? -45 : 45));
        const position = SYMBOL_POSITIONS[index];
        const scaleUp = Math.random() < 0.5;
        const scaleDown = Math.random() < 0.5;
        console.log(scaleUp, scaleDown);
        const mh = scaleUp ? 'h-20' : scaleDown ? 'h-12' : 'h-14';
        const mw = scaleUp ? 'w-20' : scaleDown ? 'w-12' : 'w-14';
        const h = scaleUp ? 'h-14' : scaleDown ? 'h-8' : 'h-10';
        const w = scaleUp ? 'w-14' : scaleDown ? 'w-8' : 'w-10';

        const symbolContent = (
          <SymbolIcon symbol={symbol} className="w-full h-full" />
        );

        return (
          <div
            key={`${symbol}-${index}`}
            className={`absolute ${w} ${h} md:${mw} md:${mh}`}
            style={{
              ...position,
              transform: `${position.transform || ''} rotate(${rotation}deg)`,
            }}
          >
            {isInteractive ? (
              <button
                onClick={() => onSymbolClick(symbol)}
                className="w-full h-full"
                aria-label={`Select ${symbol}`}
              >
                {symbolContent}
              </button>
            ) : (
              symbolContent
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameCard;
