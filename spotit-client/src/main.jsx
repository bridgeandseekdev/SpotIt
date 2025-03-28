import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import App_v2 from './App_v2.jsx';
import { ThemeProvider } from './context';
import DarkModeSwitch from './components/DarkModeSwitch.jsx';
import AppVersionSwitch from './components/AppVersionSwitch.jsx';
import { useThemeContext } from './context';
// import Trial from './Trial.jsx';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-purple-100 dark:bg-none dark:bg-bg-dark-tertiary dark:text-text-dark-primary">
      <DarkModeSwitch />
      <AppVersionSwitch />
      {children}
    </div>
  );
};

const AppContainer = () => {
  const { isRefactoredVersion } = useThemeContext();

  return isRefactoredVersion ? <App_v2 /> : <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppLayout>
        <AppContainer />
      </AppLayout>
    </ThemeProvider>
  </StrictMode>,
);
