import { useThemeContext } from '../../context';
import { Lightbulb, MoonStarIcon } from 'lucide-react';

const DarkModeSwitch = () => {
  const { isDark, toggleTheme } = useThemeContext();
  return (
    <div className="absolute top-1.5 right-2 md:top-6 md:right-6 z-50">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Lightbulb className="w-4 h-4 md:w-8 md:h-8" />
        ) : (
          <MoonStarIcon className="w-4 h-4 md:w-8 md:h-8" />
        )}
      </button>
    </div>
  );
};

export default DarkModeSwitch;
