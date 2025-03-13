import PropTypes from 'prop-types';

const GameStatus = ({ cardsRemaining }) => (
  <div className="flex-none text-center pb-4">
    <h2 className="text-lg font-semibold">Cards Remaining: {cardsRemaining}</h2>
  </div>
);

GameStatus.propTypes = {
  cardsRemaining: PropTypes.number.isRequired,
};

export default GameStatus;
