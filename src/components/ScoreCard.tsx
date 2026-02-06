import type { DieValue, ScoreCard as ScoreCardType, ScoreCategory } from '../types';
import { calculateScore, CATEGORY_LABELS, calculateUpperSectionTotal, calculateUpperBonus, calculateTotalScore } from '../gameLogic';

interface ScoreCardProps {
  scoreCard: ScoreCardType;
  dice: DieValue[];
  onScoreSelect: (category: ScoreCategory) => void;
  rollsLeft: number;
}

export function ScoreCard({ scoreCard, dice, onScoreSelect, rollsLeft }: ScoreCardProps) {
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

  const canSelectScore = rollsLeft < 3;

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
  const totalScore = calculateTotalScore(scoreCard);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Score Card</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Upper Section</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>{upperCategories.map(renderScoreRow)}</tbody>
        </table>
        <div className="mt-2 px-4 py-2 bg-gray-100 rounded">
          <div className="flex justify-between">
            <span className="font-medium">Upper Total:</span>
            <span className="font-bold">{upperTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bonus (if ≥ 63):</span>
            <span className={upperBonus > 0 ? 'text-green-600 font-bold' : 'text-gray-400'}>
              {upperBonus}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Lower Section</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>{lowerCategories.map(renderScoreRow)}</tbody>
        </table>
      </div>

      <div className="mt-4 px-4 py-3 bg-blue-100 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total Score:</span>
          <span className="text-2xl font-bold text-blue-600">{totalScore}</span>
        </div>
      </div>
    </div>
  );
}
