import { useState } from 'react';
import type { GameState, ScoreCategory, DieValue } from './types';
import { rollDice, calculateScore, isGameOver, isYahtzee } from './gameLogic';
import { Die } from './components/Die';
import { ScoreCard } from './components/ScoreCard';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    dice: [1, 1, 1, 1, 1],
    heldDice: [false, false, false, false, false],
    rollsLeft: 3,
    scoreCard: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yahtzee: null,
      chance: null,
    },
    yahtzeeBonus: 0,
    gameOver: false,
  });

  const handleRoll = () => {
    if (gameState.rollsLeft > 0) {
      const newDice = gameState.dice.map((die, idx) =>
        gameState.heldDice[idx] ? die : rollDice(1)[0]
      ) as DieValue[];

      setGameState({
        ...gameState,
        dice: newDice,
        rollsLeft: gameState.rollsLeft - 1,
      });
    }
  };

  const handleDieClick = (index: number) => {
    if (gameState.rollsLeft < 3) {
      const newHeldDice = [...gameState.heldDice];
      newHeldDice[index] = !newHeldDice[index];
      setGameState({
        ...gameState,
        heldDice: newHeldDice,
      });
    }
  };

  const handleScoreSelect = (category: ScoreCategory) => {
    const score = calculateScore(gameState.dice, category);
    const newScoreCard = {
      ...gameState.scoreCard,
      [category]: score,
    };

    // Check for Yahtzee bonus
    let newYahtzeeBonus = gameState.yahtzeeBonus;
    const rolledYahtzee = isYahtzee(gameState.dice);
    const yahtzeeBoxFilled = gameState.scoreCard.yahtzee === 50;
    
    if (rolledYahtzee && yahtzeeBoxFilled) {
      newYahtzeeBonus += 1;
    }

    const gameOver = isGameOver(newScoreCard);

    setGameState({
      dice: rollDice(5),
      heldDice: [false, false, false, false, false],
      rollsLeft: 3,
      scoreCard: newScoreCard,
      yahtzeeBonus: newYahtzeeBonus,
      gameOver,
    });
  };

  const handleNewGame = () => {
    setGameState({
      dice: [1, 1, 1, 1, 1],
      heldDice: [false, false, false, false, false],
      rollsLeft: 3,
      scoreCard: {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
      },
      yahtzeeBonus: 0,
      gameOver: false,
    });
  };

  const activeDice = gameState.dice
    .map((die, idx) => ({ die, idx }))
    .filter(({ idx }) => !gameState.heldDice[idx]);

  const heldDiceData = gameState.dice
    .map((die, idx) => ({ die, idx }))
    .filter(({ idx }) => gameState.heldDice[idx])
    .sort((a, b) => a.die - b.die);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {gameState.gameOver && (
          <div className="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-6 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Game Over!</h2>
            <p className="text-lg text-green-700 mb-4">
              Check your final score below
            </p>
            <button
              onClick={handleNewGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              New Game
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Rolls Left: <span className="text-blue-600">{gameState.rollsLeft}</span>
                </h2>
                {!gameState.gameOver && (
                  <button
                    onClick={handleNewGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    New Game
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Held Dice {heldDiceData.length > 0 && `(${heldDiceData.length})`}
                </h3>
                <div className="min-h-[80px] bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  {heldDiceData.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {heldDiceData.map(({ die, idx }) => (
                        <Die
                          key={idx}
                          value={die}
                          isHeld={true}
                          onClick={() => handleDieClick(idx)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 italic">
                      Click dice to hold them here
                    </p>
                  )}
                </div>
              </div>

              {gameState.rollsLeft < 3 && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Click dice to hold/release them between rolls
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Active Dice {activeDice.length > 0 && `(${activeDice.length})`}
                </h3>
                <div className="min-h-[80px] bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  {activeDice.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {activeDice.map(({ die, idx }) => (
                        <Die
                          key={idx}
                          value={die}
                          isHeld={false}
                          onClick={() => handleDieClick(idx)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 italic">
                      All dice are held
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleRoll}
              disabled={gameState.rollsLeft === 0 || gameState.gameOver}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                gameState.rollsLeft === 0 || gameState.gameOver
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Roll Dice
            </button>
          </div>

          <div>
            <ScoreCard
              scoreCard={gameState.scoreCard}
              dice={gameState.dice}
              onScoreSelect={handleScoreSelect}
              rollsLeft={gameState.rollsLeft}
              yahtzeeBonus={gameState.yahtzeeBonus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
