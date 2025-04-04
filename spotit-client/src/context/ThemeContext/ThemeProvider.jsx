import { useState, useEffect } from 'react';
import ThemeContext from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    //Check local storage or system preference on initial load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isRefactoredVersion, setIsRefactoredVersion] = useState(true);

  useEffect(() => {
    //Update document class when theme changes
    document.documentElement.classList.toggle('dark', isDark);
    //save preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleRefactoredApp = () => setIsRefactoredVersion((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, toggleRefactoredApp, isRefactoredVersion }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
