import { useState } from 'react';
import deck from '/src/assets/decks/classic_deck_7.json';
import { ICON_MAP } from './assets/icons';
import shuffle from 'lodash.shuffle';

function App() {
  const shuffledDeck = shuffle(deck);
  const [topCard, setTopCard] = useState(shuffledDeck[0]);
  const [remainingCards, setRemainingCards] = useState(shuffledDeck.slice(1));
  const [cardsRemaining, setCardsRemaining] = useState(shuffledDeck.length - 1);

  // Positions for 7 symbols in a circular pattern
  const positions = [
    { top: '12%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '25%', right: '15%' },
    { bottom: '25%', right: '15%' },
    { bottom: '12%', left: '50%', transform: 'translate(-50%, 0)' },
    { bottom: '25%', left: '15%' },
    { top: '25%', left: '15%' },
    { top: '55%', left: '40%', transform: 'translate(-50%, -50%)' },
    { top: '50%', left: '65%', transform: 'translate(-50%, -50%)' },
  ];

  function renderSymbol(symbol) {
    const IconComponent = ICON_MAP[symbol];

    if (!IconComponent) {
      console.warn(`No icon found for symbol: ${symbol}`);
      return null;
    }

    return IconComponent;
  }

  const handleMatch = (symbol) => {
    if (remainingCards.length === 0) return;

    const nextCard = remainingCards[0];
    if (topCard.includes(symbol)) {
      setTopCard(nextCard);
      setRemainingCards(remainingCards.slice(1));
      setCardsRemaining(cardsRemaining - 1);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex flex-col">
      <div className="h-1/2 flex items-center justify-center">
        <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl border border-neutral-200">
          {topCard.map((symbol, index) => {
            const rotation = Math.floor(Math.random() * 180);
            const position = positions[index];
            const IconComponent = renderSymbol(symbol);

            return (
              <div
                key={index}
                className="absolute w-10 h-10 md:w-16 md:h-16"
                style={{
                  ...position,
                  transform: `${
                    position.transform || ''
                  } rotate(${rotation}deg)`,
                }}
              >
                {IconComponent && (
                  <IconComponent
                    className="w-full h-full"
                    aria-label={symbol}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {remainingCards.length > 0 && (
        <div className="relative h-1/2 flex items-center justify-center">
          <div className="h-[80%] sm:h-[90%] aspect-square rounded-full shadow-lg backdrop-blur-3xl border border-neutral-200 ">
            {shuffle([...remainingCards[0]]).map((symbol, index) => {
              const rotation = Math.floor(Math.random() * -90);
              const position = positions[index];
              const IconComponent = renderSymbol(symbol);

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    ...position,
                    transform: `${
                      position.transform || ''
                    } rotate(${rotation}deg)`,
                  }}
                >
                  <button
                    onClick={() => handleMatch(symbol)}
                    className="w-10 h-10 md:w-16 md:h-16"
                  >
                    {IconComponent && (
                      <IconComponent
                        className="w-full h-full"
                        aria-label={symbol}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold">
        Cards Remaining: {cardsRemaining}
      </h2>
    </div>
  );
}

export default App;

// {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
// <header className="w-full text-center py-4 font-bold text-xl">
//   SpotIt - Single Player
// </header>

// <div className="flex flex-col flex-grow items-center w-full border-red-300 border">
//   {/* Top Row - Top Card */}
//   <div className="w-full flex flex-col items-center border-b-4 border-x-gray-400 mb-4">
//     <h2 className="text-lg font-semibold mb-2">
//       Spot the pictures with the symbols in this card
//     </h2>
//     <div className="relative card w-72 h-72 bg-white shadow-lg rounded-full p-4 border border-red-400">
//       {topCard.map((symbol, index) => (
//         <img
//           key={index}
//           src={getSymbolPath(symbol)}
//           alt={symbol}
//           className="w-10 h-10 absolute"
//         />
//       ))}
//     </div>
//   </div>

//   <div className="flex flex-col items-center">
//     <h2 className="text-lg font-semibold mb-2">
//       Your cards : {cardsRemaining} Remaining
//     </h2>
//     {remainingCards.length > 0 && (
//       <div className="relative w-72 h-72 card bg-white shadow-lg rounded-full p-4">
//         {remainingCards[0].map((symbol, index) => (
//           <button key={index}>
//             <img
//               key={index}
//               src={getSymbolPath(symbol)}
//               alt={symbol}
//               className="w-10 h-10 absolute"
//             />
//           </button>
//         ))}
//       </div>
//     )}
//   </div>
// </div>
// </div> */}
