import type { DieValue, ScoreCard, ScoreCategory } from './types';

export function rollDie(): DieValue {
  return (Math.floor(Math.random() * 6) + 1) as DieValue;
}

export function rollDice(count: number): DieValue[] {
  return Array.from({ length: count }, () => rollDie());
}

function countDice(dice: DieValue[]): Map<DieValue, number> {
  const counts = new Map<DieValue, number>();
  dice.forEach(die => {
    counts.set(die, (counts.get(die) || 0) + 1);
  });
  return counts;
}

function sumDice(dice: DieValue[]): number {
  return dice.reduce((sum, die) => sum + die, 0);
}

export function calculateScore(dice: DieValue[], category: ScoreCategory): number {
  const counts = countDice(dice);
  const countsArray = Array.from(counts.values());
  const sum = sumDice(dice);

  switch (category) {
    case 'ones':
      return (counts.get(1) || 0) * 1;
    case 'twos':
      return (counts.get(2) || 0) * 2;
    case 'threes':
      return (counts.get(3) || 0) * 3;
    case 'fours':
      return (counts.get(4) || 0) * 4;
    case 'fives':
      return (counts.get(5) || 0) * 5;
    case 'sixes':
      return (counts.get(6) || 0) * 6;
    case 'threeOfAKind':
      return countsArray.some(count => count >= 3) ? sum : 0;
    case 'fourOfAKind':
      return countsArray.some(count => count >= 4) ? sum : 0;
    case 'fullHouse': {
      const hasThree = countsArray.includes(3);
      const hasTwo = countsArray.includes(2);
      return hasThree && hasTwo ? 25 : 0;
    }
    case 'smallStraight': {
      const sortedUnique = Array.from(new Set(dice)).sort((a, b) => a - b);
      const hasSmallStraight = 
        sortedUnique.join('').includes('1234') ||
        sortedUnique.join('').includes('2345') ||
        sortedUnique.join('').includes('3456');
      return hasSmallStraight ? 30 : 0;
    }
    case 'largeStraight': {
      const sortedUnique = Array.from(new Set(dice)).sort((a, b) => a - b);
      const hasLargeStraight = 
        sortedUnique.join('') === '12345' ||
        sortedUnique.join('') === '23456';
      return hasLargeStraight ? 40 : 0;
    }
    case 'yahtzee':
      return countsArray.includes(5) ? 50 : 0;
    case 'chance':
      return sum;
    default:
      return 0;
  }
}

export function calculateUpperSectionTotal(scoreCard: ScoreCard): number {
  const upperCategories: (keyof ScoreCard)[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return upperCategories.reduce((total, category) => {
    return total + (scoreCard[category] || 0);
  }, 0);
}

export function calculateUpperBonus(scoreCard: ScoreCard): number {
  return calculateUpperSectionTotal(scoreCard) >= 63 ? 35 : 0;
}

export function calculateTotalScore(scoreCard: ScoreCard): number {
  const allScores = Object.values(scoreCard).reduce((total, score) => {
    return total + (score || 0);
  }, 0);
  return allScores + calculateUpperBonus(scoreCard);
}

export function isGameOver(scoreCard: ScoreCard): boolean {
  return Object.values(scoreCard).every(score => score !== null);
}

export const CATEGORY_LABELS: Record<ScoreCategory, string> = {
  ones: 'Ones',
  twos: 'Twos',
  threes: 'Threes',
  fours: 'Fours',
  fives: 'Fives',
  sixes: 'Sixes',
  threeOfAKind: 'Three of a Kind',
  fourOfAKind: 'Four of a Kind',
  fullHouse: 'Full House',
  smallStraight: 'Small Straight',
  largeStraight: 'Large Straight',
  yahtzee: 'Yahtzee',
  chance: 'Chance',
};
