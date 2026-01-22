export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

export type Rank = (typeof RANKS)[number];

export interface HandPosition {
  hand: string;
  row: number;
  col: number;
}

export function generatePokerGrid(): HandPosition[] {
  const grid: HandPosition[] = [];

  for (let row = 0; row < 13; row++) {
    for (let col = 0; col < 13; col++) {
      const rank1 = RANKS[row];
      const rank2 = RANKS[col];

      let hand: string;

      if (row === col) {
        hand = `${rank1}${rank2}`;
      } else if (col > row) {
        hand = `${rank1}${rank2}s`;
      } else {
        hand = `${rank2}${rank1}o`;
      }

      grid.push({ hand, row, col });
    }
  }

  return grid;
}

export function getHandAtPosition(row: number, col: number): string {
  const rank1 = RANKS[row];
  const rank2 = RANKS[col];

  if (row === col) {
    return `${rank1}${rank2}`;
  } else if (col > row) {
    return `${rank1}${rank2}s`;
  } else {
    return `${rank2}${rank1}o`;
  }
}

export function getHandCombos(hand: string): number {
  if (hand.endsWith('s')) {
    return 4;
  } else if (hand.endsWith('o')) {
    return 12;
  } else {
    return 6;
  }
}

export function calculateTotalCombos(hands: { [hand: string]: string }): number {
  return Object.keys(hands).reduce((total, hand) => {
    return total + getHandCombos(hand);
  }, 0);
}
