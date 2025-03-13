import { SYMBOL_POSITIONS } from '../constants/gameConstants';

export const getSymbolPositions = (symbolCount) => {
  return SYMBOL_POSITIONS[symbolCount] || [];
};

export const getBaseLayout = (symbolCount) => {
  return {
    positions: getSymbolPositions(symbolCount),
    containerClass: 'relative h-[80%] sm:h-[90%] aspect-square',
  };
};
