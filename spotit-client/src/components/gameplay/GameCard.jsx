/* eslint-disable react/prop-types */
import { getBaseLayout } from '../../utils/layoutEngine';
import { getSymbolScale, getSymbolRotation } from '../../utils/visualEngine';
import Symbol from './Symbol';

const GameCard = ({
  symbols,
  isInteractive = false,
  onSymbolClick,
  gameSettings,
}) => {
  const { symbolsPerCard, difficulty } = gameSettings;
  const { positions, containerClass } = getBaseLayout(symbolsPerCard);

  return (
    <div
      className={`${containerClass} rounded-full shadow-md backdrop-blur-3xl bg-bg-secondary border border-neutral-200 dark:bg-bg-dark-primary dark:shadow-md dark:shadow-gray-500`}
    >
      {symbols.map((symbol, index) => (
        <Symbol
          key={`${symbol}-${index}`}
          symbol={symbol}
          position={positions[index]}
          rotation={getSymbolRotation(difficulty, isInteractive)}
          scale={getSymbolScale(difficulty, index, symbolsPerCard)}
          isInteractive={isInteractive}
          onSymbolClick={onSymbolClick}
        />
      ))}
    </div>
  );
};

export default GameCard;
