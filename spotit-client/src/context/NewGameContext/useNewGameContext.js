import { useContext } from 'react';
import NewGameContext from './NewGameContext';

export const useNewGameContext = () => {
  const context = useContext(NewGameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
