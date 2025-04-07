import Symbol from '../Symbol';

function Card({ card, type, onSymbolClick }) {
  if (!card) return null;
  return (
    <div
      className={`relative h-[80%] sm:h-[90%] aspect-square rounded-full bg-white dark:bg-bg-dark-primary border ${
        type === 'pile'
          ? 'border-neutral-200'
          : 'border-green-400 dark:shadow-md dark:shadow-gray-500 shadow-md backdrop-blur-3xl'
      }`}
    >
      {card.map(({ symbol, position, rotation, scale }, index) => (
        <Symbol
          key={`${symbol}-${index}`}
          symbol={symbol}
          position={position}
          rotation={rotation}
          scale={scale}
          onClick={onSymbolClick}
          type={type}
        />
      ))}
    </div>
  );
}

export default Card;
