const LEFTS = ['4px', 'calc(4px + 100% / 3)', 'calc(4px + 200% / 3)'];

export interface Position {
  left: number; // Column
  top: number; // Pixels from start
}

export class Positioning {
  private _pageHeight: number;
  private _page: number;
  private _left: number;
  top: number;

  constructor(pageHeight: number) {
    this._pageHeight = pageHeight;
    this._page = 0;
    this._left = 0;
    this.top = 0;
  }

  public apply(block: HTMLElement) {
    block.style.left = this.left;
    block.style.top = this.totalTop;
    this.top += block.getBoundingClientRect().height ?? 0;
  }

  public moveLeft() {
    this._left = (this._left + 1) % LEFTS.length;
    this.top = 0;
    this._page += this._left == 0 ? 1 : 0;
  }

  public leftRelative(boxPos: Position) {
    const shift = this._left - boxPos.left;
    return `calc(${shift}00% + ${
      Math.sign(shift) * (Math.abs(shift) == 2 ? 21 : 9)
    }px`;
  }

  public topRelative(boxPos: Position) {
    return this._pageHeight * this.page + this.top - boxPos.top + 'px';
  }

  public get pos() {
    return {
      left: this._left,
      top: this._pageHeight * this.page + this.top,
    };
  }

  public get pageHeight() {
    return this._pageHeight;
  }

  public get totalTop() {
    return this._pageHeight * this.page + this.top + 'px';
  }

  public get left() {
    return LEFTS[this._left];
  }

  public get page() {
    return this._page;
  }
}

export function positionHeader(pos: Positioning, box: HTMLElement) {
  box.style.left = pos.left;
  box.style.top = pos.totalTop;
  const boxPos = pos.pos;
  const height = box.getBoundingClientRect().height;
  /*while (pos.top + height >= pos.pageHeight) {
    const remainder = binaryDivHeightSearch(
      box,
      chunk,
      pos.pageHeight - pos.top
    );
    pos.moveLeft();
    if (remainder.length > 0) {
      chunk = makeChunk(description, remainder, boxPos, pos);
      height = chunk.getBoundingClientRect().height;
    } else height = 0;
  }*/
  pos.top += height;
}

export function position(
  pos: Positioning,
  box: HTMLElement,
  description: HTMLElement,
  descriptionHTML: string
) {
  box.style.removeProperty('borderBottom');
  box.style.removeProperty('top');
  box.style.removeProperty('left');
  description.style.removeProperty('top');
  description.style.removeProperty('left');
  description.innerHTML = descriptionHTML;
  // Completely move to next if only small space left
  const infoHeight = description.offsetTop - box.offsetTop;
  if (pos.top + infoHeight >= pos.pageHeight) {
    pos.moveLeft();
  }
  box.style.left = pos.left;
  box.style.top = pos.totalTop;
  const boxPos = pos.pos;
  let height = box.getBoundingClientRect().height;
  description.innerHTML = '';
  let chunk = makeChunk(
    description,
    descriptionHTML,
    {
      left: pos.pos.left,
      top: pos.pos.top - infoHeight,
    },
    pos
  );
  chunk.classList.add('first-chunk');
  while (pos.top + height >= pos.pageHeight) {
    const remainder = binaryHeightSearch(box, chunk, pos.pageHeight - pos.top);
    pos.moveLeft();
    if (remainder.length > 0) {
      chunk = makeChunk(description, remainder, boxPos, pos);
      height = chunk.getBoundingClientRect().height;
    } else height = 0;
  }
  pos.top += height;
}

function binaryHeightSearch(
  box: HTMLElement,
  text: HTMLElement,
  maxHeight: number
) {
  const contents = text.innerHTML;
  if (contents === null || contents === undefined) return '';
  let start = 0;
  let end = contents.length;
  while (start < end) {
    let middle = contents.indexOf(' ', Math.ceil((start + end) / 2));
    if (middle === -1) middle = end;
    text.innerHTML = contents.substring(0, middle);
    if ((box.getBoundingClientRect().height ?? 0) > maxHeight) {
      end = Math.ceil((start + end) / 2) - 1;
    } else {
      start = middle;
    }
  }
  text.innerHTML = contents.substring(0, start);
  if (end < contents.length) {
    box.style.borderBottom = 'none';
  }
  return contents.substring(start);
}

function makeChunk(
  description: HTMLElement,
  contents: string,
  boxPos: Position,
  pos: Positioning
) {
  const chunk = document.createElement('div');
  chunk.classList.add('description-chunk');
  chunk.innerHTML = contents;
  description.appendChild(chunk);
  chunk.style.left = pos.leftRelative(boxPos);
  chunk.style.top = pos.topRelative(boxPos);
  return chunk;
}