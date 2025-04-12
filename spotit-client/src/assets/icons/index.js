// Use Vite's glob import with eager: false for code splitting
const iconModules = import.meta.glob('./*.jsx', { eager: false });

let NEW_ICON_MAP = {};
export const preloadIcons = async (symbolList) => {
  const loadPromises = symbolList.map(async (symbol) => {
    const path = `./${symbol}.jsx`;
    if (iconModules[path]) {
      try {
        const module = await iconModules[path]();
        NEW_ICON_MAP[symbol] = module.default;
      } catch (error) {
        console.log(`Failed to load icon: ${symbol}`, error);
      }
    } else {
      console.log(`Icon not found: ${symbol}`);
    }
  });

  await Promise.all(loadPromises);
  return NEW_ICON_MAP;
};

export const getIcon = (symbol) => NEW_ICON_MAP[symbol];
