import type { DieValue, ScoreCard as ScoreCardType, ScoreCategory, GameMode, PlayerType, PlayerData } from '../types';
import { calculateScore, CATEGORY_LABELS, calculateUpperSectionTotal, calculateUpperBonus, calculateTotalScore } from '../gameLogic';

interface ScoreCardProps {
  mode: GameMode;
  players: {
    human: PlayerData;
    computer: PlayerData;
  };
  dice: DieValue[];
  onScoreSelect: (category: ScoreCategory) => void;
  rollsLeft: number;
  currentPlayer: PlayerType;
}

export function ScoreCard({ mode, players, dice, onScoreSelect, rollsLeft, currentPlayer }: ScoreCardProps) {
  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  const lowerCategories: ScoreCategory[] = [
    'threeOfAKind',
    'fourOfAKind',
    'fullHouse',
    'smallStraight',
    'largeStraight',
    'yahtzee',
    'chance',
  ];

  const canSelectScore = rollsLeft < 3 && currentPlayer === 'human';

  if (mode === 'single') {
    const scoreCard = players.human.scoreCard;
    const yahtzeeBonus = players.human.yahtzeeBonus;

    const renderScoreRow = (category: ScoreCategory) => {
      const score = scoreCard[category];
      const potentialScore = calculateScore(dice, category);
      const isAvailable = score === null;

      return (
        <tr
          key={category}
          className={`border-b ${
            isAvailable && canSelectScore
              ? 'hover:bg-blue-50 cursor-pointer'
              : ''
          }`}
          onClick={() => {
            if (isAvailable && canSelectScore) {
              onScoreSelect(category);
            }
          }}
        >
          <td className="px-4 py-2 text-left font-medium">{CATEGORY_LABELS[category]}</td>
          <td className="px-4 py-2 text-center">
            {score !== null ? (
              <span className="font-bold">{score}</span>
            ) : canSelectScore ? (
              <span className="text-blue-600 font-semibold">{potentialScore}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
        </tr>
      );
    };

    const upperTotal = calculateUpperSectionTotal(scoreCard);
    const upperBonus = calculateUpperBonus(scoreCard);
    const totalScore = calculateTotalScore(scoreCard, yahtzeeBonus);

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Score Card</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Upper Section</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-center w-24">Score</th>
              </tr>
            </thead>
            <tbody>{upperCategories.map(renderScoreRow)}</tbody>
          </table>
          <div className="mt-2 bg-gray-100 rounded overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-left font-medium">Upper Total:</td>
                  <td className="px-4 py-2 text-center w-24 font-bold">{upperTotal}</td>
                </tr>
                <tr className="text-sm">
                  <td className="px-4 py-2 text-left text-gray-600">Bonus (if ≥ 63):</td>
                  <td className={`px-4 py-2 text-center w-24 ${upperBonus > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                    {upperBonus}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Lower Section</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-center w-24">Score</th>
              </tr>
            </thead>
            <tbody>{lowerCategories.map(renderScoreRow)}</tbody>
          </table>
          {yahtzeeBonus > 0 && (
            <div className="mt-2 bg-yellow-100 rounded overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-left font-medium">Yahtzee Bonus (×{yahtzeeBonus}):</td>
                    <td className="px-4 py-2 text-center w-24 font-bold text-yellow-700">{yahtzeeBonus * 100}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 bg-blue-100 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-4 py-3 text-left text-xl font-bold">Total Score:</td>
                <td className="px-4 py-3 text-center w-24 text-2xl font-bold text-blue-600">{totalScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Two-player mode
  const renderTwoPlayerScoreRow = (category: ScoreCategory) => {
    const humanScore = players.human.scoreCard[category];
    const computerScore = players.computer.scoreCard[category];
    const potentialScore = calculateScore(dice, category);
    const isAvailable = currentPlayer === 'human' ? humanScore === null : computerScore === null;

    return (
      <tr
        key={category}
        className={`border-b ${
          isAvailable && canSelectScore
            ? 'hover:bg-blue-50 cursor-pointer'
            : ''
        }`}
        onClick={() => {
          if (isAvailable && canSelectScore) {
            onScoreSelect(category);
          }
        }}
      >
        <td className="px-4 py-2 text-left font-medium">{CATEGORY_LABELS[category]}</td>
        <td className="px-4 py-2 w-28">
          <div className="text-center">
            {humanScore !== null ? (
              <span className="font-bold">{humanScore}</span>
            ) : canSelectScore ? (
              <span className="text-blue-600 font-semibold">{potentialScore}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </td>
        <td className="px-4 py-2 w-28">
          <div className="text-center">
            {computerScore !== null ? (
              <span className="font-bold">{computerScore}</span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const humanUpperTotal = calculateUpperSectionTotal(players.human.scoreCard);
  const humanUpperBonus = calculateUpperBonus(players.human.scoreCard);
  const humanTotalScore = calculateTotalScore(players.human.scoreCard, players.human.yahtzeeBonus);
  const humanUpperComplete = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].every(
    cat => players.human.scoreCard[cat as ScoreCategory] !== null
  );

  const computerUpperTotal = calculateUpperSectionTotal(players.computer.scoreCard);
  const computerUpperBonus = calculateUpperBonus(players.computer.scoreCard);
  const computerTotalScore = calculateTotalScore(players.computer.scoreCard, players.computer.yahtzeeBonus);
  const computerUpperComplete = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].every(
    cat => players.computer.scoreCard[cat as ScoreCategory] !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Score Card</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Upper Section</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center text-blue-600 w-28">You</th>
              <th className="px-4 py-2 text-center text-purple-600 w-28">Computer</th>
            </tr>
          </thead>
          <tbody>{upperCategories.map(renderTwoPlayerScoreRow)}</tbody>
        </table>
        <div className="mt-2 bg-gray-100 rounded overflow-hidden">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-4 py-2 text-left font-medium">Upper Total:</td>
                <td className="px-4 py-2 text-center font-bold w-28">{humanUpperTotal}</td>
                <td className="px-4 py-2 text-center font-bold w-28">{computerUpperTotal}</td>
              </tr>
              <tr className="text-sm">
                <td className="px-4 py-2 text-left text-gray-600">Bonus (≥ 63):</td>
                <td className={`px-4 py-2 text-center w-28 ${humanUpperBonus > 0 ? 'text-green-600 font-bold' : humanUpperComplete ? 'font-bold' : 'text-gray-400'}`}>
                  {humanUpperBonus}
                </td>
                <td className={`px-4 py-2 text-center w-28 ${computerUpperBonus > 0 ? 'text-green-600 font-bold' : computerUpperComplete ? 'font-bold' : 'text-gray-400'}`}>
                  {computerUpperBonus}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Lower Section</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center text-blue-600 w-28">You</th>
              <th className="px-4 py-2 text-center text-purple-600 w-28">Computer</th>
            </tr>
          </thead>
          <tbody>{lowerCategories.map(renderTwoPlayerScoreRow)}</tbody>
        </table>
        {(players.human.yahtzeeBonus > 0 || players.computer.yahtzeeBonus > 0) && (
          <div className="mt-2 bg-yellow-100 rounded overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-left font-medium">Yahtzee Bonus:</td>
                  <td className="px-4 py-2 text-center font-bold text-yellow-700 w-28">
                    {players.human.yahtzeeBonus > 0 ? `×${players.human.yahtzeeBonus} (${players.human.yahtzeeBonus * 100})` : '-'}
                  </td>
                  <td className="px-4 py-2 text-center font-bold text-yellow-700 w-28">
                    {players.computer.yahtzeeBonus > 0 ? `×${players.computer.yahtzeeBonus} (${players.computer.yahtzeeBonus * 100})` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 bg-blue-100 rounded-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="px-4 py-3 text-left text-xl font-bold">Total:</td>
              <td className="px-4 py-3 text-center text-2xl font-bold text-blue-600 w-28">{humanTotalScore}</td>
              <td className="px-4 py-3 text-center text-2xl font-bold text-purple-600 w-28">{computerTotalScore}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
