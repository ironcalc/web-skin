import Model from "../model";

function setUpModel(): Model {
  const model = Model.new("en", "Europe/Berlin", () => {});
  // Adds two extra sheets
  model.addSheet();
  model.addSheet();

  // first sheet (index = 0)
  model.setUserInput(0, 1, 1, "23");
  model.setUserInput(0, 1, 2, "=A1*3");
  model.setUserInput(0, 4, 2, "Calculation!");
  model.setUserInput(0, 17, 1, "25");

  // second sheet (index = 1)

  // third sheet (index = 2)
  model.setFrozenRows(2, 3);
  model.setFrozenColumns(2, 4);

  model.evaluate();
  model.deleteHistory();

  return model;
}

describe("Model tests", () => {
  test("Frozen rows and columns", async () => {
    const model = setUpModel();
    expect(model.getFrozenRowsCount(0)).toBe(0);
    expect(model.getFrozenColumnsCount(0)).toBe(0);

    expect(model.getFrozenRowsCount(2)).toBe(3);
    expect(model.getFrozenColumnsCount(2)).toBe(4);
  });

  test("Row height", () => {
    const model = setUpModel();
    expect(model.getRowHeight(0, 3)).toBe(21);

    model.setRowHeight(0, 3, 32);
    expect(model.getRowHeight(0, 3)).toBe(32);

    model.undo();
    expect(model.getRowHeight(0, 3)).toBe(21);

    model.redo();
    expect(model.getRowHeight(0, 3)).toBe(32);

    model.setRowHeight(0, 3, 320);
    expect(model.getRowHeight(0, 3)).toBe(320);
  });

  test("Basic API", () => {
    const model = setUpModel();
    expect(model.canUndo()).toEqual(false);
    expect(model.canRedo()).toEqual(false);
    expect(model.getColumnWidth(0, 3)).toBe(100);

    // setColumnWidth works
    model.setColumnWidth(0, 3, 32);
    expect(model.getColumnWidth(0, 3)).toBe(32);

    expect(model.canUndo()).toEqual(true);
    expect(model.canRedo()).toEqual(false);

    // Undo
    model.undo();
    expect(model.canUndo()).toEqual(false);
    expect(model.canRedo()).toEqual(true);
    expect(model.getColumnWidth(0, 3)).toBe(100);

    // getRowHeight works
    expect(model.getRowHeight(0, 3)).toBe(21);

    // Value is 69 in B1 and formula =A1*3
    expect(model.getCellValue(0, 1, 1)).toBe(23);
    expect(model.getCellValue(0, 1, 2)).toBe(69);
    expect(model.getCellContent(0, 1, 2)).toBe("=A1*3");

    expect(model.canUndo()).toEqual(false);
    expect(model.canRedo()).toEqual(true);

    // / Lets set A1 to 42
    model.setUserInput(0, 1, 1, "42");
    expect(model.getCellValue(0, 1, 1)).toBe(42);
    expect(model.getCellValue(0, 1, 2)).toBe(42 * 3);

    expect(model.canUndo()).toEqual(true);
    expect(model.canRedo()).toEqual(false);

    // Let's undo that:
    model.undo();
    expect(model.getCellValue(0, 1, 2)).toBe(69);
    expect(model.getCellValue(0, 1, 1)).toBe(23);

    expect(model.canUndo()).toEqual(false);
    expect(model.canRedo()).toEqual(true);

    // And redo!
    model.redo();
    expect(model.getCellValue(0, 1, 2)).toBe(42 * 3);
    expect(model.getCellValue(0, 1, 1)).toBe(42);

    expect(model.canUndo()).toEqual(true);
    expect(model.canRedo()).toEqual(false);

    // Undo again
    model.undo();

    expect(model.canUndo()).toEqual(false);
    expect(model.canRedo()).toEqual(true);

    // deleteCells
    // Delete A1
    model.deleteCells(0, {
      rowStart: 1,
      rowEnd: 1,
      columnStart: 1,
      columnEnd: 1,
    });
    expect(model.getCellValue(0, 1, 2)).toBe(0);
    expect(model.getCellValue(0, 1, 1)).toBe(null);

    expect(model.canUndo()).toEqual(true);
    expect(model.canRedo()).toEqual(false);
    model.undo();

    expect(model.getCellValue(0, 1, 2)).toBe(69);
    expect(model.getCellValue(0, 1, 1)).toBe(23);
  });
});
