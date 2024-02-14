import Toolbar from "./toolbar";
import FormulaBar from "./formulabar";
import Navigation from "./navigation/navigation";
import Worksheet from "./worksheet";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Model from "../model/model";
import { BorderOptions } from "../model/types";
import useKeyboardNavigation from "./useKeyboardNavigation";
import { NavigationKey, getCellAddress } from "./WorksheetCanvas/util";
import { LAST_COLUMN, LAST_ROW } from "./WorksheetCanvas/constants";
import { WorkbookState } from "./workbookState";

interface SheetInfo {
  name: string;
  color: string;
  sheet_id: number;
}

const Workbook = (props: { model: Model; workbookState: WorkbookState }) => {
  const { model, workbookState } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const [_redrawId, setRedrawId] = useState(0);
  const info = model
    .getSheetsInfo()
    .map(({ name, color, sheet_id }: SheetInfo) => {
      return { name, color: color ? color : "#FFF", sheetId: sheet_id };
    });

  const onRedo = () => {
    model.redo();
    setRedrawId((id) => id + 1);
  };

  const onUndo = () => {
    model.undo();
    setRedrawId((id) => id + 1);
  };

  const onToggleUnderline = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.font.u = !style.font.u;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleItalic = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.font.i = !style.font.i;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleBold = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.font.b = !style.font.b;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleStrike = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.font.strike = !style.font.strike;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleHorizontalAlignLeft = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "left",
          vertical: "center",
          wrap_text: false,
        };
      } else {
        if (style.alignment.horizontal === "left") {
          style.alignment.horizontal = "general";
        } else {
          style.alignment.horizontal = "left";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleHorizontalAlignCenter = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "center",
          vertical: "center",
          wrap_text: false,
        };
      } else {
        if (style.alignment.horizontal === "center") {
          style.alignment.horizontal = "general";
        } else {
          style.alignment.horizontal = "center";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleHorizontalAlignRight = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "right",
          vertical: "center",
          wrap_text: false,
        };
      } else {
        if (style.alignment.horizontal === "right") {
          style.alignment.horizontal = "general";
        } else {
          style.alignment.horizontal = "right";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleVerticalAlignTop = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "general",
          vertical: "top",
          wrap_text: false,
        };
      } else {
        if (style.alignment.vertical === "top") {
          style.alignment.vertical = "bottom";
        } else {
          style.alignment.vertical = "top";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleVerticalAlignCenter = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "general",
          vertical: "top",
          wrap_text: false,
        };
      } else {
        if (style.alignment.vertical === "center") {
          style.alignment.vertical = "bottom";
        } else {
          style.alignment.vertical = "center";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleVerticalAlignBottom = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      if (!style.alignment) {
        style.alignment = {
          horizontal: "general",
          vertical: "bottom",
          wrap_text: false,
        };
      } else {
        if (style.alignment.vertical === "bottom") {
          style.alignment.vertical = "bottom";
        } else {
          style.alignment.vertical = "bottom";
        }
      }
    });
    setRedrawId((id) => id + 1);
  };

  const onTextColorPicked = (hex: string) => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.font.color = hex;
    });
    setRedrawId((id) => id + 1);
  };

  const onFillColorPicked = (hex: string) => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.fill.fg_color = hex;
    });
    setRedrawId((id) => id + 1);
  };

  const onNumberFormatPicked = (numberFmt: string) => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    model.updateStyle(area, (style) => {
      style.num_fmt = numberFmt;
    });
    setRedrawId((id) => id + 1);
  };

  const onCopyStyles = () => {
    const area = {
      sheet: workbookState.getSelectedSheet(),
      ...workbookState.getSelectedArea(),
    };
    const styles = [];
    for (let row=area.rowStart; row < area.rowEnd; row++) {
      const styleRow = []
      for (let column = area.columnStart; column < area.columnEnd; column++) {
        styleRow.push(model.getCellStyle(area.sheet, row, column));
      }
      styles.push(styleRow);
    }
  }

  const { onKeyDown } = useKeyboardNavigation({
    onCellsDeleted: function (): void {
      throw new Error("Function not implemented.");
    },
    onExpandAreaSelectedKeyboard: function (
      key: "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown"
    ): void {
      console.log(key);
      throw new Error("Function not implemented.");
    },
    onEditKeyPressStart: function (initText: string): void {
      console.log(initText);
      throw new Error("Function not implemented.");
    },
    onCellEditStart: function (): void {
      throw new Error("Function not implemented.");
    },
    onBold: onToggleBold,
    onItalic: onToggleItalic,
    onUnderline: onToggleUnderline,
    onNavigationToEdge: function (direction: NavigationKey): void {
      console.log(direction);
      throw new Error("Function not implemented.");
    },
    onPageDown: function (): void {
      throw new Error("Function not implemented.");
    },
    onPageUp: function (): void {
      throw new Error("Function not implemented.");
    },
    onArrowDown: function (): void {
      const cell = workbookState.getSelectedCell();
      const row = cell.row + 1;
      if (row > LAST_ROW) {
        return;
      }
      workbookState.selectCell({ row, column: cell.column });
      setRedrawId((id) => id + 1);
    },
    onArrowUp: function (): void {
      const cell = workbookState.getSelectedCell();
      const row = cell.row - 1;
      if (row < 1) {
        return;
      }
      workbookState.selectCell({ row, column: cell.column });
      setRedrawId((id) => id + 1);
    },
    onArrowLeft: function (): void {
      const cell = workbookState.getSelectedCell();
      const column = cell.column - 1;
      if (column < 1) {
        return;
      }
      workbookState.selectCell({ row: cell.row, column });
      setRedrawId((id) => id + 1);
    },
    onArrowRight: function (): void {
      const cell = workbookState.getSelectedCell();
      const column = cell.column + 1;
      if (column > LAST_COLUMN) {
        return;
      }
      workbookState.selectCell({ row: cell.row, column });
      setRedrawId((id) => id + 1);
    },
    onKeyHome: function (): void {
      throw new Error("Function not implemented.");
    },
    onKeyEnd: function (): void {
      throw new Error("Function not implemented.");
    },
    onUndo: function (): void {
      model.undo();
      setRedrawId((id) => id + 1);
    },
    onRedo: function (): void {
      model.redo();
      setRedrawId((id) => id + 1);
    },
    root: rootRef,
  });

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    rootRef.current.focus();
  });

  const cellAddress = getCellAddress(
    workbookState.getSelectedArea(),
    workbookState.getSelectedCell()
  );
 
  const sheet = workbookState.getSelectedSheet();
  const {row, column} = workbookState.getSelectedCell();

  const style = model.getCellStyle(sheet, row, column);
  console.log("data", sheet, row, column, style)

  return (
    <Container ref={rootRef} onKeyDown={onKeyDown} tabIndex={0}>
      <Toolbar
        canUndo={model.canUndo()}
        canRedo={model.canRedo()}
        onRedo={onRedo}
        onUndo={onUndo}
        onToggleUnderline={onToggleUnderline}
        onToggleBold={onToggleBold}
        onToggleItalic={onToggleItalic}
        onToggleStrike={onToggleStrike}
        onToggleHorizontalAlignLeft={onToggleHorizontalAlignLeft}
        onToggleHorizontalAlignCenter={onToggleHorizontalAlignCenter}
        onToggleHorizontalAlignRight={onToggleHorizontalAlignRight}
        onToggleVerticalAlignTop={onToggleVerticalAlignTop}
        onToggleVerticalAlignCenter={onToggleVerticalAlignCenter}
        onToggleVerticalAlignBottom={onToggleVerticalAlignBottom}
        onCopyStyles={onCopyStyles}
        onTextColorPicked={onTextColorPicked}
        onFillColorPicked={onFillColorPicked}
        onNumberFormatPicked={onNumberFormatPicked}
        onBorderChanged={function (_border: BorderOptions): void {
          throw new Error("Function not implemented.");
        }}
        fillColor={style.fill.fg_color || "#FFF"}
        fontColor={style.font.color}
        bold={style.font.b}
        underline={style.font.u}
        italic={style.font.i}
        strike={style.font.strike}
        horizontalAlign={style.alignment ?  style.alignment.horizontal : "general"}
        verticalAlign={style.alignment ? style.alignment.vertical: "center"}
        canEdit={true}
        numFmt={""}
      />
      <FormulaBar cellAddress={cellAddress} />
      <Worksheet
        model={model}
        workbookState={workbookState}
        refresh={(): void => {
          setRedrawId((id) => id + 1);
        }}
      />
      <Navigation
        sheets={info}
        selectedIndex={workbookState.getSelectedSheet()}
        onSheetSelected={function (sheet: number): void {
          workbookState.setSelectedSheet(sheet);
          setRedrawId((value) => value + 1);
        }}
        onAddBlankSheet={function (): void {
          model.newSheet();
        }}
        onSheetColorChanged={function (hex: string): void {
          console.log(hex);
          throw new Error("Function not implemented.");
        }}
        onSheetRenamed={function (name: string): void {
          console.log(name);
          throw new Error("Function not implemented.");
        }}
        onSheetDeleted={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Container>
  );
};

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};

  &:focus {
    outline: none;
  }
`;

export default Workbook;
