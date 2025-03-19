import { useContext } from 'react';
import BotGameContext from './BotGameContext';

export const useBotGameContext = () => {
  const context = useContext(BotGameContext);
  if (!context) {
    throw new Error('useGame must be used within a BotGameProvider');
  }
  return context;
};
