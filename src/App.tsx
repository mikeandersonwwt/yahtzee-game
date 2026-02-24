import { useState, useEffect } from 'react';
import type { GameState, ScoreCategory, DieValue, GameMode, PlayerType } from './types';
import { rollDice, calculateScore, isGameOver, isYahtzee } from './gameLogic';
import { computerDecideHold, computerSelectCategory } from './computerAI';
import { Die } from './components/Die';
import { ScoreCard } from './components/ScoreCard';

const emptyScoreCard = {
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
};

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    mode: 'single',
    dice: [1, 1, 1, 1, 1],
    heldDice: [false, false, false, false, false],
    rollsLeft: 3,
    currentPlayer: 'human',
    players: {
      human: {
        scoreCard: { ...emptyScoreCard },
        yahtzeeBonus: 0,
      },
      computer: {
        scoreCard: { ...emptyScoreCard },
        yahtzeeBonus: 0,
      },
    },
    gameOver: false,
  });

  const currentPlayerData = gameState.players[gameState.currentPlayer];

  useEffect(() => {
    if (gameState.mode === 'vsComputer' && gameState.currentPlayer === 'computer' && !gameState.gameOver) {
      playComputerTurn();
    }
  }, [gameState.currentPlayer, gameState.rollsLeft]);

  const playComputerTurn = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (gameState.rollsLeft === 3) {
      handleRoll();
    } else if (gameState.rollsLeft > 0) {
      const heldDecision = computerDecideHold(gameState.dice, gameState.heldDice);
      
      // Show each dice selection individually with delays
      const changes: number[] = [];
      for (let i = 0; i < heldDecision.length; i++) {
        if (heldDecision[i] !== gameState.heldDice[i]) {
          changes.push(i);
        }
      }
      
      // Apply changes one at a time for visual feedback
      let currentHeld = [...gameState.heldDice];
      for (const idx of changes) {
        currentHeld[idx] = heldDecision[idx];
        setGameState(prev => ({
          ...prev,
          heldDice: [...currentHeld],
        }));
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleRoll();
    } else {
      const category = computerSelectCategory(gameState.dice, currentPlayerData.scoreCard);
      await new Promise(resolve => setTimeout(resolve, 1200));
      handleScoreSelect(category);
    }
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    setGameState({
      mode,
      dice: [1, 1, 1, 1, 1],
      heldDice: [false, false, false, false, false],
      rollsLeft: 3,
      currentPlayer: 'human',
      players: {
        human: {
          scoreCard: { ...emptyScoreCard },
          yahtzeeBonus: 0,
        },
        computer: {
          scoreCard: { ...emptyScoreCard },
          yahtzeeBonus: 0,
        },
      },
      gameOver: false,
    });
  };

  const handleRoll = () => {
    if (gameState.rollsLeft > 0 && gameState.currentPlayer === 'human') {
      const newDice = gameState.dice.map((die, idx) =>
        gameState.heldDice[idx] ? die : rollDice(1)[0]
      ) as DieValue[];

      setGameState({
        ...gameState,
        dice: newDice,
        rollsLeft: gameState.rollsLeft - 1,
      });
    } else if (gameState.rollsLeft > 0 && gameState.currentPlayer === 'computer') {
      setGameState(prev => {
        const newDice = prev.dice.map((die, idx) =>
          prev.heldDice[idx] ? die : rollDice(1)[0]
        ) as DieValue[];

        return {
          ...prev,
          dice: newDice,
          rollsLeft: prev.rollsLeft - 1,
        };
      });
    }
  };

  const handleDieClick = (index: number) => {
    if (gameState.rollsLeft < 3 && gameState.currentPlayer === 'human') {
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
      ...currentPlayerData.scoreCard,
      [category]: score,
    };

    let newYahtzeeBonus = currentPlayerData.yahtzeeBonus;
    const rolledYahtzee = isYahtzee(gameState.dice);
    const yahtzeeBoxFilled = currentPlayerData.scoreCard.yahtzee === 50;
    
    if (rolledYahtzee && yahtzeeBoxFilled) {
      newYahtzeeBonus += 1;
    }

    const updatedPlayers = {
      ...gameState.players,
      [gameState.currentPlayer]: {
        scoreCard: newScoreCard,
        yahtzeeBonus: newYahtzeeBonus,
      },
    };

    const bothPlayersFinished = gameState.mode === 'vsComputer'
      ? isGameOver(updatedPlayers.human.scoreCard) && isGameOver(updatedPlayers.computer.scoreCard)
      : isGameOver(newScoreCard);

    const nextPlayer: PlayerType = gameState.mode === 'vsComputer' && !bothPlayersFinished
      ? (gameState.currentPlayer === 'human' ? 'computer' : 'human')
      : gameState.currentPlayer;

    setGameState({
      ...gameState,
      dice: rollDice(5),
      heldDice: [false, false, false, false, false],
      rollsLeft: 3,
      currentPlayer: nextPlayer,
      players: updatedPlayers,
      gameOver: bothPlayersFinished,
    });
  };

  const handleNewGame = () => {
    setGameMode(null);
  };

  const activeDice = gameState.dice
    .map((die, idx) => ({ die, idx }))
    .filter(({ idx }) => !gameState.heldDice[idx]);

  const heldDiceData = gameState.dice
    .map((die, idx) => ({ die, idx }))
    .filter(({ idx }) => gameState.heldDice[idx])
    .sort((a, b) => a.die - b.die);

  if (gameMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-800 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Yahtzee</h1>
          <div className="space-y-4">
            <button
              onClick={() => handleModeSelect('single')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Single Player
            </button>
            <button
              onClick={() => handleModeSelect('vsComputer')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              vs Computer
            </button>
          </div>
        </div>
      </div>
    );
  }

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

              {gameState.mode === 'vsComputer' && (
                <div className="mb-4 text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    Current Turn: <span className={gameState.currentPlayer === 'human' ? 'text-blue-600' : 'text-purple-600'}>
                      {gameState.currentPlayer === 'human' ? 'You' : 'Computer'}
                    </span>
                  </p>
                </div>
              )}

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
                          onClick={() => gameState.currentPlayer === 'human' ? handleDieClick(idx) : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 italic">
                      {gameState.currentPlayer === 'human' ? 'Click dice to hold them here' : 'No dice held'}
                    </p>
                  )}
                </div>
              </div>

              {gameState.rollsLeft < 3 && gameState.currentPlayer === 'human' && (
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
                          onClick={() => gameState.currentPlayer === 'human' ? handleDieClick(idx) : undefined}
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
              disabled={gameState.rollsLeft === 0 || gameState.gameOver || gameState.currentPlayer === 'computer'}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-colors ${
                gameState.rollsLeft === 0 || gameState.gameOver || gameState.currentPlayer === 'computer'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Roll Dice
            </button>
          </div>

          <div>
            <ScoreCard
              mode={gameState.mode}
              players={gameState.players}
              dice={gameState.dice}
              onScoreSelect={handleScoreSelect}
              rollsLeft={gameState.rollsLeft}
              currentPlayer={gameState.currentPlayer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
