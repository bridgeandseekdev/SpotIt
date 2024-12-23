import { useTheme } from '../context/ThemeContext';

const DarkModeSwitch = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="absolute top-4 right-6">
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
