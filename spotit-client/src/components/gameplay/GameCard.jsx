/* eslint-disable react/prop-types */
import { SYMBOL_POSITIONS } from '../../constants/symbolPositions';
import { getRandomRotation, getRandomScale } from '../../utils/gameUtils';

import Symbol from './Symbol';

const GameCard = ({ symbols, isInteractive = false, onSymbolClick }) => {
  return (
    <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl bg-bg-secondary border border-neutral-200 dark:bg-bg-dark-primary dark:shadow-md dark:shadow-gray-500">
      {symbols.map((symbol, index) => (
        <Symbol
          key={`${symbol}-${index}`}
          symbol={symbol}
          position={SYMBOL_POSITIONS[index]}
          rotation={getRandomRotation(isInteractive)}
          scale={getRandomScale()}
          isInteractive={isInteractive}
          onSymbolClick={onSymbolClick}
        />
      ))}
    </div>
  );
};

export default GameCard;
