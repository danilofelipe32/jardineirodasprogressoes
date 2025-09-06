export type GameState = 'playing' | 'correct' | 'incorrect';

export type ProgressionType = 'PA' | 'PG' | '';

export type FlowerType = 'sunflower' | 'rose' | 'tulip';

export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Problem {
  fullSequence: number[];
  displaySequence: (number | null)[];
  missingIndexes: number[];
  type: ProgressionType;
  reason: number;
}

export interface UserAnswers {
  [key: number]: string;
}

export interface UserProgression {
  type: ProgressionType;
  reason: string;
}

export type PotStatusValue = 'correct' | 'incorrect';

export interface PotStatus {
  [key: number]: PotStatusValue;
}
