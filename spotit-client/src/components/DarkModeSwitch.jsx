import { useThemeContext } from '../context';

const DarkModeSwitch = () => {
  const { isDark, toggleTheme } = useThemeContext();
  return (
    <div className="absolute top-4 right-6 z-50">
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? 'Light' : 'Dark'}
      </button>
    </div>
  );
};

export default DarkModeSwitch;
