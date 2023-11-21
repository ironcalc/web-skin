import __wbg_init, { Model as WasmModel } from "@ironcalc/wasm";
import { CellValue, Diff, ServerDiffs } from "./diffs";
import { CellStyle } from "./types";
import { SelectedArea } from "../components/workbookState";

export async function init() {
  await __wbg_init();
}

export default class Model {
  model: WasmModel;
  authorId: number;
  revision: number;
  history: { undo: Diff[][]; redo: Diff[][] };
  // selectedSheet: number;
  // selectedArea: Area;
  // selectedCell: Cell;

  constructor(jsonStr: string) {
    this.model = WasmModel.loadFromJson(jsonStr);
    this.authorId = 1;
    this.revision = 1;
    this.history = {
      undo: [],
      redo: [],
    };
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
    this.model.setColumnWidth(sheet, column, width);
  }

  getRowHeight(sheet: number, row: number): number {
    return this.model.getRowHeight(sheet, row);
  }

  setRowHeight(sheet: number, row: number, height: number): void {
    this.model.setRowHeight(sheet, row, height);
  }

  getFrozenRowsCount(sheet: number): number {
    return this.model.getFrozenRowsCount(sheet);
  }

  getFrozenColumnsCount(sheet: number): number {
    return this.model.getFrozenColumnsCount(sheet);
  }

  getSheetsInfo(): any {
    return this.model.getSheetsInfo();
  }

  undo() {}

  redo() {
    const diffs = this.history.redo.pop();
    if (!diffs) {
      return;
    }
    this.history.undo.push(diffs);
    this.applyDiffList(diffs);
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
