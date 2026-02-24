import type { DieValue, ScoreCard, ScoreCategory } from './types';
import { calculateScore } from './gameLogic';

export function computerDecideHold(dice: DieValue[], currentHeld: boolean[]): boolean[] {
  const held = [...currentHeld];
  
  // If we already have held dice, determine what value we're committed to
  let committedValue: DieValue | null = null;
  for (let i = 0; i < dice.length; i++) {
    if (currentHeld[i]) {
      committedValue = dice[i];
      break;
    }
  }
  
  // If we're committed to a value, hold all dice of that value
  if (committedValue !== null) {
    dice.forEach((die, idx) => {
      if (die === committedValue) {
        held[idx] = true;
      }
    });
    return held;
  }
  
  // First roll - decide what to hold based on most common value
  const counts = new Map<DieValue, number>();
  dice.forEach(die => {
    counts.set(die, (counts.get(die) || 0) + 1);
  });
  
  // Find the most common value (prefer higher values on ties)
  let maxCount = 0;
  let maxValue: DieValue = 1;
  counts.forEach((count, value) => {
    if (count > maxCount || (count === maxCount && value > maxValue)) {
      maxCount = count;
      maxValue = value;
    }
  });
  
  // Hold all dice that match the most common value (if at least 2)
  if (maxCount >= 2) {
    dice.forEach((die, idx) => {
      if (die === maxValue) {
        held[idx] = true;
      }
    });
  }
  
  return held;
}

export function computerSelectCategory(
  dice: DieValue[],
  scoreCard: ScoreCard
): ScoreCategory {
  const availableCategories = (Object.keys(scoreCard) as ScoreCategory[]).filter(
    cat => scoreCard[cat] === null
  );
  
  if (availableCategories.length === 0) {
    return 'ones';
  }
  
  let bestCategory: ScoreCategory = availableCategories[0];
  let bestScore = calculateScore(dice, bestCategory);
  
  availableCategories.forEach(category => {
    const score = calculateScore(dice, category);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  });
  
  return bestCategory;
}
