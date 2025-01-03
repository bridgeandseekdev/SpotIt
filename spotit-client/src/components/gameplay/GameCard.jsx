/* eslint-disable react/prop-types */
import {
  getSymbolPositions,
  getScale,
  getRotation,
} from '../../utils/gameUtils';

import Symbol from './Symbol';

const GameCard = ({
  symbols,
  isInteractive = false,
  onSymbolClick,
  gameSettings,
}) => {
  const { symbolsPerCard, difficulty } = gameSettings;
  const positions = getSymbolPositions(symbolsPerCard);
  return (
    <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl bg-bg-secondary border border-neutral-200 dark:bg-bg-dark-primary dark:shadow-md dark:shadow-gray-500">
      {symbols.map((symbol, index) => (
        <Symbol
          key={`${symbol}-${index}`}
          symbol={symbol}
          position={positions[index]}
          rotation={getRotation(difficulty, isInteractive)}
          scale={getScale(difficulty, index, symbolsPerCard)}
          isInteractive={isInteractive}
          onSymbolClick={onSymbolClick}
        />
      ))}
    </div>
  );
};

export default GameCard;
