export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type ScoreCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance';

export interface ScoreCard {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  yahtzee: number | null;
  chance: number | null;
}

export type GameMode = 'single' | 'vsComputer';

export type PlayerType = 'human' | 'computer';

export interface PlayerData {
  scoreCard: ScoreCard;
  yahtzeeBonus: number;
}

export interface GameState {
  mode: GameMode;
  dice: DieValue[];
  heldDice: boolean[];
  rollsLeft: number;
  currentPlayer: PlayerType;
  players: {
    human: PlayerData;
    computer: PlayerData;
  };
  gameOver: boolean;
}
