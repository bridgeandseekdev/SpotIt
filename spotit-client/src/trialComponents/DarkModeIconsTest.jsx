/* eslint-disable react/prop-types */

// import deck from '../assets/decks/classic_deck_7.json';
import cards from '../assets/cards_theme/classic_7.json';
import { ICON_MAP } from '../assets/icons';
import { useThemeContext } from '../context';

const SymbolIcon = ({ symbol, className }) => {
  const IconComponent = ICON_MAP[symbol];

  if (!IconComponent) {
    console.warn(`No icon found for symbol: ${symbol}`);
    return null;
  }

  return <IconComponent className={className} aria-label={symbol} />;
};

function DarkModeIconsTest() {
  const { isDark, toggleTheme } = useThemeContext();
  const cardsArray = Object.values(cards).flat();

  return (
    <div className="relative flex flex-col items-center dark:bg-bg-dark-primary">
      <div className="absolute top-4 right-6">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>
      <div className="dark:bg-bg-dark-tertiary border-2 border-gray-700 px-10">
        {cardsArray.map((symbol, index) => (
          <div key={index} className="w-16 h-16 my-4">
            <SymbolIcon symbol={symbol} className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DarkModeIconsTest;
