import { useThemeContext } from '../../context';
import { Lightbulb, MoonStarIcon } from 'lucide-react';

const DarkModeSwitch = () => {
  const { isDark, toggleTheme } = useThemeContext();
  return (
    <div className="absolute top-8 right-6 z-50">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Lightbulb size={24} /> : <MoonStarIcon size={24} />}
      </button>
    </div>
  );
};

export default DarkModeSwitch;
