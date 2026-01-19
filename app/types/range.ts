export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface RangeData {
  labels: Label[];
  hands: {
    [hand: string]: string;
  };
  customName?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface RangesState {
  ranges: {
    [rangeId: string]: RangeData;
  };
  categories?: Category[];
  rangeDefinitions?: RangeDefinition[];
}

export interface RangeDefinition {
  id: string;
  name: string;
  categoryId: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'open', name: 'Opens' },
  { id: 'response', name: 'Responses' },
  { id: 'blind', name: 'Blinds' },
  { id: '3bet', name: '3Bet' },
];

export const DEFAULT_RANGE_DEFINITIONS: RangeDefinition[] = [
  { id: 'utg', name: 'UTG', categoryId: 'open' },
  { id: 'hj', name: 'HJ', categoryId: 'open' },
  { id: 'co', name: 'CO', categoryId: 'open' },
  { id: 'bu', name: 'BU', categoryId: 'open' },
  { id: 'sb-open', name: 'SB', categoryId: 'open' },

  { id: 'any-vs-utg', name: 'Any vs UTG', categoryId: 'response' },
  { id: 'any-vs-bu', name: 'Any vs BU', categoryId: 'response' },
  { id: 'any-vs-co', name: 'Any vs CO', categoryId: 'response' },

  { id: 'bb-vs-ep-mp', name: 'BB vs EP/MP', categoryId: 'blind' },
  { id: 'bb-vs-bu', name: 'BB vs BU', categoryId: 'blind' },
  { id: 'bb-vs-sb', name: 'BB vs SB', categoryId: 'blind' },
  { id: 'sb-vs-ep', name: 'SB vs EP', categoryId: 'blind' },
  { id: 'sb-vs-mp-lp', name: 'SB vs MP/LP', categoryId: 'blind' },

  { id: 'polar-3bet', name: 'Polar 3Bet', categoryId: '3bet' },
  { id: 'linear-3bet', name: 'Linear 3Bet', categoryId: '3bet' },
];

// Backwards compatibility
export const RANGE_DEFINITIONS = DEFAULT_RANGE_DEFINITIONS;
