import { ICON_MAP } from '../../assets/icons';
import { getSymbolStyles } from '../../utils/visualEngine';

const SymbolIcon = ({ symbol, className }) => {
  const IconComponent = ICON_MAP[symbol];

  if (!IconComponent) {
    console.warn(`No icon found for symbol: ${symbol}`);
    return null;
  }

  return <IconComponent className={className} aria-label={symbol} />;
};

const Symbol = ({ symbol, position, rotation, scale, onClick, type }) => {
  const styles = getSymbolStyles(scale);
  const symbolContent = (
    <SymbolIcon symbol={symbol} className="w-full h-full" />
  );

  return (
    <div
      className={`absolute ${styles.mobile} ${styles.desktop}`}
      style={{
        ...position,
        transform: `${position.transform || ''} rotate(${rotation}deg)`,
      }}
    >
      <button
        onClick={() => onClick(symbol)}
        className={`w-full h-full ${
          type === 'player' ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-label={`Select ${symbol}`}
      >
        {symbolContent}
      </button>
    </div>
  );
};

export default Symbol;
