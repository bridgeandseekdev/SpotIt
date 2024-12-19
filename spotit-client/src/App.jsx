/* eslint-disable no-unused-vars */
import { useState } from 'react';
import deck from '../public/decks/classic_deck.json';
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
    { top: '45%', left: '60%', transform: 'translate(-50%, -50%)' },
  ];

  const getSymbolPath = (symbol) => {
    const color = symbol.split('_')[0];
    return `/public/symbols/${color}/${symbol}.svg`;
  };

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
    <div className="h-screen w-full flex flex-col">
      <div className="h-1/2 flex items-center justify-center">
        <div className="relative h-[80%] sm:h-[90%] aspect-square rounded-full shadow-md backdrop-blur-3xl border border-neutral-200">
          {topCard.map((symbol, index) => {
            const rotation = Math.floor(Math.random() * 360);
            const position = positions[index];
            return (
              <img
                key={index}
                src={getSymbolPath(symbol)}
                alt={symbol}
                className="w-10 h-10 absolute"
                style={{ ...position }}
              />
            );
          })}
        </div>
      </div>

      {remainingCards.length > 0 && (
        <div className="relative h-1/2 flex items-center justify-center">
          <div className="h-[80%] sm:h-[90%] aspect-square rounded-full shadow-lg backdrop-blur-3xl border border-neutral-200 ">
            {shuffle([...remainingCards[0]]).map((symbol, index) => {
              const rotation = Math.floor(Math.random() * 360);
              const position = positions[index];
              return (
                <button
                  key={index}
                  className="absolute"
                  onClick={() => handleMatch(symbol)}
                  style={{ ...position }}
                >
                  <img
                    src={getSymbolPath(symbol)}
                    alt={symbol}
                    className="w-10 h-10"
                  />
                </button>
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
