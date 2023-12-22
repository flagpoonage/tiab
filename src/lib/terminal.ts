import { TerminalFramebuffer } from './framebuffer';
import { TerminalGrid } from './grid';
import { GridCellUpdate, XY } from './types';

export interface TerminalOptions {
  backgroundColor: string;
  fontColor: string;
  fontSizePixels: number;
  lineHeightPixels: number;
}

export class Terminal {
  private _grid = new TerminalGrid();
  private _resizeObserver: ResizeObserver;
  private _container: HTMLElement | undefined;
  private _cellSize: XY = { x: 12, y: 14 };
  private _containerSize: XY = { x: 0, y: 0 };
  private _measureCell: HTMLDivElement = document.createElement('div');
  private _options: TerminalOptions = {
    backgroundColor: 'black',
    fontColor: 'white',
    fontSizePixels: 14,
    lineHeightPixels: 16,
  };

  private _frameBuffer = {
    current: new TerminalFramebuffer(),
    next: new TerminalFramebuffer(),
  };

  bind<T extends keyof Terminal>(...args: T[]) {
    args.forEach((v) => {
      if (typeof this[v] === 'function') {
        // @ts-ignore
        this[v] = this[v].bind(this);
      }
    });
  }

  constructor(container?: HTMLElement) {
    this.bind('setContainer', 'setOptions');

    this._measureCell.style.visibility = 'hidden';
    this._measureCell.style.pointerEvents = 'none';
    this._measureCell.style.position = 'absolute';
    this._measureCell.style.fontFamily = 'monospace';
    this._measureCell.innerHTML = 'W';

    this._resizeObserver = new ResizeObserver(this.onResize);

    this._frameBuffer.current = new TerminalFramebuffer();
    this._frameBuffer.next = new TerminalFramebuffer();
    this._frameBuffer.next.cloneBuffer(this._frameBuffer.current);

    if (container) {
      this.setContainer(container);
    }
  }

  private onResize(entries: ResizeObserverEntry[]) {
    console.log('Resize triggered', entries);
  }

  private updateMeasurements() {
    if (this._container) {
      const container_rect = this._container?.getBoundingClientRect();

      this._containerSize = {
        x: container_rect.width,
        y: container_rect.height,
      };
    }

    this._measureCell.style.lineHeight = `${this._options.lineHeightPixels}px`;
    this._measureCell.style.fontSize = `${this._options.fontSizePixels}px`;

    const rect = this._measureCell.getBoundingClientRect();

    this._cellSize = {
      x: rect.width,
      y: rect.height,
    };

    this._frameBuffer.next.setBounds(this._containerSize, this._cellSize);
  }

  setContainer(container: HTMLElement) {
    if (this._container) {
      this._resizeObserver.unobserve(this._container);
    }

    this._container = container;
    this._resizeObserver.observe(this._container);
    this._container.appendChild(this._measureCell);
    this._container.appendChild(this._frameBuffer.current.container);
    this.setOptions(this._options);
  }

  setOptions(options: Partial<TerminalOptions>) {
    this._options = {
      ...this._options,
      ...options,
    };

    if (this._container) {
      this._container.style.fontFamily = 'monospace';
      this._container.style.fontSize = `${this._options.fontSizePixels}px`;
      this._container.style.lineHeight = `${this._options.lineHeightPixels}px`;
      this._container.style.color = this._options.fontColor;
      this._container.style.backgroundColor = this._options.backgroundColor;
    }

    this.updateMeasurements();
  }

  writeUpdates(updates: GridCellUpdate[]) {
    this._grid.updateCells(updates);
  }

  render() {
    this._frameBuffer.next.applyChanges(this._grid.flushChanges());
    this._frameBuffer.current.swap(this._frameBuffer.next);

    const old = this._frameBuffer.current;

    this._frameBuffer.current = this._frameBuffer.next;
    this._frameBuffer.next = old;
    this._frameBuffer.next.cloneBuffer(this._frameBuffer.current);
  }
}
