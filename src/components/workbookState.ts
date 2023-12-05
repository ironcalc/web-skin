export interface Cell {
  row: number;
  column: number;
}

export interface Area {
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}

interface Scroll {
  left: number;
  top: number;
}

export class WorkbookState {
  selectedSheet: number;
  selectedCell: Cell;
  selectedArea: Area;
  scroll: Scroll;
  extendToArea: Area | null;

  constructor() {
    const row = 1;
    const column = 1;
    const sheet = 0;
    this.selectedSheet = sheet;
    this.selectedCell = { row, column };
    this.selectedArea = {
      rowStart: row,
      rowEnd: row,
      columnStart: column,
      columnEnd: column,
    };
    this.extendToArea = null;
    this.scroll = {
      left: 0,
      top: 0,
    };
  }

  getSelectedSheet(): number {
    return this.selectedSheet;
  }

  setSelectedSheet(sheet: number): void {
    this.selectedSheet = sheet;
  }

  getSelectedCell(): Cell {
    return this.selectedCell;
  }

  setSelectedCell(cell: Cell): void {
    this.selectedCell = cell;
  }

  getSelectedArea(): Area {
    return this.selectedArea;
  }

  setSelectedArea(area: Area): void {
    this.selectedArea = area;
  }

  selectCell(cell: { row: number; column: number }): void {
    const { row, column } = cell;
    this.selectedArea = {
      rowStart: row,
      rowEnd: row,
      columnStart: column,
      columnEnd: column,
    };
    this.selectedCell = { row, column };
  }

  getScroll(): Scroll {
    return this.scroll;
  }

  setScroll(scroll: Scroll): void {
    this.scroll = scroll;
  }

  getExtendToArea(): Area | null {
    return this.extendToArea;
  }
  
  clearExtendToArea(): void {
    this.extendToArea = null;
  }

  setExtendToArea(area: Area): void {
    this.extendToArea = area;
  }
}
