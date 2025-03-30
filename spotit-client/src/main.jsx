import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context';
import DarkModeSwitch from './components/DarkModeSwitch.jsx';
// import Trial from './Trial.jsx';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-purple-100 dark:bg-none dark:bg-bg-dark-tertiary dark:text-text-dark-primary">
      <DarkModeSwitch />
      {children}
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AppLayout>
        <App />
      </AppLayout>
    </ThemeProvider>
  </StrictMode>,
);
