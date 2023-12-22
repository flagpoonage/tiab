import { GridCell, GridCellChange, GridCellUpdate } from './types';

export class TerminalGrid {
  private _data: GridCell[][] = [];
  private _changes: boolean[][] = [];

  constructor() {}

  updateCells = (updates: GridCellUpdate[]) => {
    updates.forEach(([row, col, content, color, bgColor]) => {
      let currrow = this._data[row];
      const isnull = content === null && color === null && bgColor === null;

      if (!currrow) {
        if (isnull) {
          return;
        }

        const newrow: GridCell[] = [];
        newrow[col] = [content, color, bgColor];
        this._data[row] = newrow;
      } else {
        if (isnull) {
          delete currrow[col];
        } else {
          currrow[col] = [content, color, bgColor];
        }
      }
      this.addChange(row, col);
    });
  };

  private addChange = (row: number, col: number) => {
    if (this._changes[row]) {
      this._changes[row][col] = true;
    } else {
      this._changes[row] = [];
      this._changes[row][col] = true;
    }
  };

  flushChanges(): GridCellChange[] {
    const changes = this._changes;
    this._changes = [];
    return changes.flatMap((r, i) =>
      r.map((_, c) => {
        const cell = this._data[i]?.[c];
        if (!cell) {
          return [i, c, null];
        } else {
          return [i, c, cell];
        }
      }),
    );
  }

  clear() {
    this._data.forEach((row, rowIndex) => {
      row.forEach((v, colIndex) => {
        this.addChange(rowIndex, colIndex);
      });
    });

    this._data = [];
  }
}
