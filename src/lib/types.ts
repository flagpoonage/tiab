export type GridCell = [string | null, string | null, string | null] | null;
export type GridCellUpdate = [
  number,
  number,
  string | null,
  string | null,
  string | null,
];

export type GridCellChange = [number, number, GridCell | null];

export interface XY {
  x: number;
  y: number;
}
