export type OneXTwo = 1 | 2 | 3;
export type SelectionValue = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CouponRow = OneXTwo[];

export interface SvenskaFolket {
  one: number;
  x: number;
  two: number;
}

export interface Odds {
  one: string;
  x: string;
  two: string;
}

export interface DrawEvent {
  eventNumber: number;
  eventDescription: string;
  svenskaFolket?: SvenskaFolket;
  odds?: Odds;
}

export interface CouponEvent {
  eventNumber: number;
  description: string;
  odds?: Odds;
  svenskaFolket?: SvenskaFolket;
}

export interface MinMaxRule {
  value: OneXTwo;
  min: number;
  max: number;
}

export interface Draw {
  currentNetSale: string;
  regCloseDescription: string;
  drawEvents: DrawEvent[];
}

export interface DrawsResponse {
  draws: Draw[];
}

export type EuropatipsetDrawsResponse = DrawsResponse;
export type EuropatipsetResultsResponse = DrawsResponse;
export type StryktipsetDrawsResponse = DrawsResponse;
export type StryktipsetResultsResponse = DrawsResponse;