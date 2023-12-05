import __wbg_init, { Model as WasmModel } from "@ironcalc/wasm";
import { CellValue, Diff, ServerDiffs } from "./diffs";
import { CellStyle } from "./types";
import { Area } from "../components/WorksheetCanvas/types";

export async function init() {
  await __wbg_init();
}

interface SelectedArea extends Area {
  sheet: number;
}

export default class Model {
  model: WasmModel;
  authorId: number;
  revision: number;
  history: { undo: Diff[][]; redo: Diff[][] };

  constructor(jsonStr: string | undefined) {
    if (jsonStr) {
      this.model = WasmModel.loadFromJson(jsonStr);
    } else {
      this.model = new WasmModel("en", "UTC");
    }
    this.authorId = 1;
    this.revision = 1;
    this.history = {
      undo: [],
      redo: [],
    };
  }

  deleteHistory() {
    this.history = {
      undo: [],
      redo: []
    }
  }

  setUserInput(sheet: number, row: number, column: number, value: string) {
    const diffs: Diff[] = [
      {
        type: "set_cell_value",
        sheet,
        row,
        column,
        newValue: value,
        oldValue: this.getCellContent(sheet, row, column),
      },
    ];
    this.history.undo.push(diffs);
    this.model.setUserInput(sheet, row, column, value);
    this.sendDiffList(diffs);
  }

  addSheet(): void {
    this.model.addSheet();
  }

  evaluate() {
    this.model.evaluate();
  }

  getCellValue(sheet: number, row: number, column: number): CellValue {
    return this.model.getCellValue(sheet, row, column);
  }

  getCellContent(sheet: number, row: number, column: number): CellValue {
    return this.model.getCellContent(sheet, row, column);
  }

  getFormattedCellValue(sheet: number, row: number, column: number): String {
    return this.model.getFormattedCellValue(sheet, row, column);
  }

  getCellStyle(sheet: number, row: number, column: number): CellStyle {
    return this.model.getCellStyle(sheet, row, column);
  }

  getColumnWidth(sheet: number, column: number): number {
    return this.model.getColumnWidth(sheet, column);
  }

  setColumnWidth(sheet: number, column: number, width: number): void {
    this.history.undo.push([
      {
        type: 'set_column_width',
        sheet,
        column,
        newValue: width,
        oldValue: this.model.getColumnWidth(sheet, column),
      },
    ]);
    this.history.redo = [];
    this.model.setColumnWidth(sheet, column, width);
  }

  getRowHeight(sheet: number, row: number): number {
    return this.model.getRowHeight(sheet, row);
  }

  setRowHeight(sheet: number, row: number, height: number): void {
    this.history.undo.push([
      {
        type: 'set_row_height',
        sheet,
        row,
        newValue: height,
        oldValue: this.model.getRowHeight(sheet, row),
      },
    ]);
    this.history.redo = [];
    this.model.setRowHeight(sheet, row, height);
  }

  getFrozenRowsCount(sheet: number): number {
    return this.model.getFrozenRowsCount(sheet);
  }

  setFrozenRows(sheet: number, row_count: number) {
    this.model.setFrozenRows(sheet, row_count);
  }

  getFrozenColumnsCount(sheet: number): number {
    return this.model.getFrozenColumnsCount(sheet);
  }

  setFrozenColumns(sheet: number, column_count: number) {
    this.model.setFrozenColumns(sheet, column_count);
  }

  getSheetsInfo(): any {
    return this.model.getSheetsInfo();
  }

  extendTo(sheet: number, initialArea: Area, extendedArea: Area): void {
    const diffList: Diff[] = [];
    let { rowStart, rowEnd, columnStart, columnEnd } = initialArea;
    if (rowStart > rowEnd) {
      [rowStart, rowEnd] = [rowEnd, rowStart];
    }
    if (columnStart > columnEnd) {
      [columnStart, columnEnd] = [columnEnd, columnStart];
    }
    if (
      columnStart === extendedArea.columnStart &&
      columnEnd === extendedArea.columnEnd
    ) {
      // extend by rows
      let offsetRow;
      let startRow;
      if (rowEnd + 1 === extendedArea.rowStart) {
        offsetRow = extendedArea.rowStart;
        startRow = rowStart;
      } else {
        offsetRow = extendedArea.rowEnd;
        startRow = rowEnd;
      }

      for (
        let row = extendedArea.rowStart;
        row <= extendedArea.rowEnd;
        row += 1
      ) {
        for (let column = columnStart; column <= columnEnd; column += 1) {
          const sourceRow =
            startRow + ((row - offsetRow) % (rowEnd - rowStart + 1));
          let value = this.model.extendTo(
            sheet,
            sourceRow,
            column,
            row,
            column
          );
          const oldStyle = this.model.getCellStyle(sheet, row, column);
          const newStyle = this.model.getCellStyle(sheet, sourceRow, column);
          if (newStyle.isQuotePrefix && !value.startsWith("'")) {
            value = `'${value}`;
          }
          diffList.push({
            type: "set_cell_value",
            sheet,
            row,
            column,
            newValue: value,
            oldValue: this.getCellContent(sheet, row, column),
          });
          diffList.push({
            type: "set_cell_style",
            sheet,
            row,
            column,
            newValue: newStyle,
            oldValue: oldStyle,
          });
          this.model.setCellStyle(sheet, row, column, newStyle);
          this.model.setUserInput(sheet, row, column, value);
        }
      }
    } else if (
      rowStart === extendedArea.rowStart &&
      rowEnd === extendedArea.rowEnd
    ) {
      // extend by columns
      let offsetColumn;
      let startColumn;
      if (columnEnd + 1 === extendedArea.columnStart) {
        offsetColumn = extendedArea.columnStart;
        startColumn = columnStart;
      } else {
        offsetColumn = extendedArea.columnEnd;
        startColumn = columnEnd;
      }
      for (let row = rowStart; row <= rowEnd; row += 1) {
        for (
          let column = extendedArea.columnStart;
          column <= extendedArea.columnEnd;
          column += 1
        ) {
          const sourceColumn =
            startColumn +
            ((column - offsetColumn) % (columnEnd - columnStart + 1));

          const oldStyle = this.model.getCellStyle(sheet, row, column);
          const newStyle = this.model.getCellStyle(sheet, row, sourceColumn);

          let value = this.model.extendTo(
            sheet,
            row,
            sourceColumn,
            row,
            column
          );
          if (newStyle.isQuotePrefix && !value.startsWith("'")) {
            value = `'${value}`;
          }
          diffList.push({
            type: "set_cell_value",
            sheet,
            row,
            column,
            newValue: value,
            oldValue: this.getCellContent(sheet, row, column),
          });
          diffList.push({
            type: "set_cell_style",
            sheet,
            row,
            column,
            newValue: newStyle,
            oldValue: oldStyle,
          });
          this.model.setCellStyle(sheet, row, column, newStyle);
          this.model.setUserInput(sheet, row, column, value);
        }
      }
    }
    this.history.undo.push(diffList);
    this.history.redo = [];
    this.model.evaluate();
  }

  deleteCells(sheet:number, area: Area): void {
    const diffList: Diff[] = [];
    for (let row = area.rowStart; row <= area.rowEnd; row += 1) {
      for (let column = area.columnStart; column <= area.columnEnd; column += 1) {
        const oldValue = this.getCellContent(sheet, row, column);
        diffList.push({
          type: 'delete_cell',
          sheet,
          row,
          column,
          oldValue
        });
        this.model.deleteCell(sheet, row, column);
      }
    }
    this.history.undo.push(diffList);
    this.history.redo = [];
    this.model.evaluate();
  }
  undo() {
    const diffList = this.history.undo.pop();
    if (!diffList) {
      return;
    }
    this.history.redo.push(diffList);
    this.applyDiffList(diffList);
  }

  redo() {
    const diffList = this.history.redo.pop();
    if (!diffList) {
      return;
    }
    this.history.undo.push(diffList);
    this.applyDiffList(diffList);
  }

  canRedo(): boolean {
    return this.history.redo.length > 0;
  }

  canUndo(): boolean {
    return this.history.undo.length > 0;
  }

  newSheet(): void {
    this.model.newSheet();
  }

  updateStyle(area: SelectedArea, update: (style: CellStyle) => void): void {
    const { sheet, rowStart, rowEnd, columnStart, columnEnd } = area;
    const diffs: Diff[] = [];
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let column = columnStart; column <= columnEnd; column++) {
        const style = this.model.getCellStyle(sheet, row, column);
        // TODO: better clone method
        let newStyle = JSON.parse(JSON.stringify(style));
        update(newStyle);
        diffs.push({
          type: "set_cell_style",
          sheet,
          row,
          column,
          newValue: newStyle,
          oldValue: style,
        });
        this.model.setCellStyle(sheet, row, column, newStyle);
      }
    }
    this.history.undo.push(diffs);
    this.history.redo = [];
  }

  applyDiffList(diffs: Diff[]) {
    const { model } = this;
    let needsEvaluation = false;
    for (const diff of diffs) {
      switch (diff.type) {
        case "set_cell_value": {
          if (diff.newValue !== null) {
            model.setUserInput(
              diff.sheet,
              diff.row,
              diff.column,
              diff.newValue
            );
          } else {
            // we need to set the style
            model.setUserInput(diff.sheet, diff.row, diff.column, "");
            model.deleteCell(diff.sheet, diff.row, diff.column);
          }
          needsEvaluation = true;
          break;
        }
        case "set_column_width": {
          model.setColumnWidth(diff.sheet, diff.column, diff.newValue);
          break;
        }
        case "set_row_height": {
          model.setRowHeight(diff.sheet, diff.row, diff.newValue);
          break;
        }
        case "delete_cell": {
          model.deleteCell(diff.sheet, diff.row, diff.column);
          needsEvaluation = true;
          break;
        }
        case "remove_cell": {
          // model.removeCell(diff.sheet, diff.row, diff.column);
          needsEvaluation = true;
          break;
        }
        case "set_cell_style": {
          model.setCellStyle(diff.sheet, diff.row, diff.column, diff.newValue);
          break;
        }
        case "insert_row": {
          model.insertRows(diff.sheet, diff.row, 1);
          needsEvaluation = true;
          break;
        }
        case "delete_row": {
          model.deleteRows(diff.sheet, diff.row, 1);
          needsEvaluation = true;
          break;
        }
        /* istanbul ignore next */
        default: {
          const unrecognized: never = diff;
          throw new Error(`Unrecognized diff type - ${unrecognized}}.`);
        }
      }
    }
    if (needsEvaluation) {
      model.evaluate();
    }
  }

  applyServerDiffList(serverDiffs: ServerDiffs) {
    this.applyDiffList(serverDiffs.diffs);
  }

  private sendDiffList(diffs: Diff[]) {
    const serverDiffs = {
      authorId: this.authorId,
      revision: this.revision,
      diffs,
    };
  }
}
