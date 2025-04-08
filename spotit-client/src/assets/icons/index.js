let NEW_ICON_MAP = {};
export const preloadIcons = async (symbolList) => {
  const loadPromises = symbolList.map(async (symbol) => {
    try {
      const module = await import(/* @vite-ignore */ `./${symbol}.jsx`);
      NEW_ICON_MAP[symbol] = module.default;
    } catch (error) {
      console.log(`Failed to load icon: ${symbol}`, error);
    }
  });

  await Promise.all(loadPromises);
  console.log(NEW_ICON_MAP);
  return NEW_ICON_MAP;
};

export const getIcon = (symbol) => NEW_ICON_MAP[symbol];
