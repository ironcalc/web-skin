export interface SelectedCell {
  sheet: number;
  row: number;
  column: number;
}

export interface SelectedArea {
  sheet: number;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}

export class WorkbookState {
  selectedSheet: number;
  selectedCell: SelectedCell;
  selectedArea: SelectedArea;

  constructor() {
    console.log('constructor')
    const row = 1;
    const column = 1;
    const sheet = 0;
    this.selectedSheet = sheet;
    this.selectedCell = { sheet, row, column };
    this.selectedArea = {
      sheet,
      rowStart: row,
      rowEnd: row,
      columnStart: column,
      columnEnd: column,
    };
  }

  getSelectedSheet(): number {
    return this.selectedSheet;
  }

  setSelectedSheet(sheet: number): void {
    this.selectedSheet = sheet;
  }

  getSelectedCell(): SelectedCell {
    return this.selectedCell;
  }

  setSelectedCell(cell: SelectedCell): void {
    this.selectedCell = cell;
  }

  getSelectedArea(): SelectedArea {
    return this.selectedArea;
  }

  setSelectedArea(area: SelectedArea): void {
    this.selectedArea = area;
  }

  selectCell(cell: {row: number, column:number}): void {
    const sheet = this.selectedSheet;
    const {row, column} = cell;
    this.selectedArea = {
      sheet,
      rowStart: row,
      rowEnd: row,
      columnStart: column,
      columnEnd: column
    };
    this.selectedCell = {sheet, row, column};
  }
}
