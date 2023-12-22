import { GridCellChange, XY } from './types';

export class TerminalFramebuffer {
  private _container: HTMLDivElement;
  private _elementMap: Map<string, HTMLDivElement> = new Map();
  private _containerSize: XY;
  private _cellSize: XY;

  get container() {
    return this._container;
  }

  constructor() {
    this._container = document.createElement('div');
    this._container.style.position = 'relative';
    this._containerSize = { x: 0, y: 0 };
    this._cellSize = { x: 0, y: 0 };
  }

  setBounds(containerSize: XY, cellSize: XY) {
    this._containerSize = containerSize;
    this._cellSize = cellSize;
  }

  cloneBuffer(currentBuffer: TerminalFramebuffer) {
    const clonedata = currentBuffer.clone();
    this._container = clonedata.container;
    this._elementMap = new Map(clonedata.elementMap);
  }

  clone() {
    return {
      container: this._container.cloneNode(true) as HTMLDivElement,
      elementMap: this._elementMap.entries(),
    };
  }

  applyChanges(changes: GridCellChange[]) {
    changes.forEach(([row, col, val]) => {
      const id = `${row}:${col}`;
      const existing_element = this._elementMap.get(id);

      if (!existing_element) {
        if (!val) {
          return;
        }

        const el = document.createElement('div');
        val[0] && (el.innerHTML = val[0]);
        val[1] && (el.style.color = val[1]);
        val[2] && (el.style.backgroundColor = val[2]);
        el.style.position = 'absolute';
        el.style.top = `${row * this._cellSize.y}px`;
        el.style.left = `${col * this._cellSize.x}px`;

        this._container.appendChild(el);
        this._elementMap.set(id, el);
        return;
      }

      if (!val) {
        existing_element.remove();
        this._elementMap.delete(id);
      } else {
        val[0] && (existing_element.innerHTML = val[0]);
        val[1] && (existing_element.style.color = val[1]);
        val[2] && (existing_element.style.backgroundColor = val[2]);
      }
    });
  }

  swap(buffer: TerminalFramebuffer) {
    this._container.replaceWith(buffer._container);
  }
}
