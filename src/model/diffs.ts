import { CellStyle } from "./types";

interface RowDiff {
  rowHeight: number;
  rowData: string;
}

interface SetColumnWidthDiff {
  type: "set_column_width";
  sheet: number;
  column: number;
  newValue: number;
  oldValue: number;
}

interface SetRowHeightDiff {
  type: "set_row_height";
  sheet: number;
  row: number;
  newValue: number;
  oldValue: number;
}

export type CellValue = string | null;

interface SetCellValueDiff {
  type: "set_cell_value";
  sheet: number;
  column: number;
  row: number;
  newValue: CellValue;
  oldValue: CellValue;
}

interface DeleteCellDiff {
  type: "delete_cell";
  sheet: number;
  column: number;
  row: number;
  oldValue: CellValue;
  oldStyle: number;
}

interface RemoveCellDiff {
  type: "remove_cell";
  sheet: number;
  column: number;
  row: number;
  oldValue: CellValue;
  oldStyle: number;
}

interface SetCellStyleDiff {
  type: "set_cell_style";
  sheet: number;
  column: number;
  row: number;
  oldValue: CellStyle;
  newValue: CellStyle;
}

interface InsertRowDiff {
  type: "insert_row";
  sheet: number;
  row: number;
}

interface DeleteRowDiff {
  type: "delete_row";
  sheet: number;
  row: number;
  oldValue: RowDiff;
}

export type Diff =
  | SetCellValueDiff
  | SetColumnWidthDiff
  | SetRowHeightDiff
  | DeleteCellDiff
  | RemoveCellDiff
  | SetCellStyleDiff
  | InsertRowDiff
  | DeleteRowDiff;

export interface ServerDiffs {
  authorId: number;
  revision: number;
  diffs: Diff[];
}
