import Symbol from '../Symbol';

function Card({ card, type, onSymbolClick }) {
  if (!card) return null;
  return (
    <div
      className={`relative w-full h-full rounded-full flex items-center justify-center
        ${
          type === 'pile'
            ? 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 transform -rotate-3'
            : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg dark:shadow-gray-900'
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
