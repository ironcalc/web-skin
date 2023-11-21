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
  sheet_id: string;
}

const Workbook = (props: { model: Model, workbookState: WorkbookState }) => {
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
  };

  const onUndo = () => {
    model.undo();
  };

  const onToggleUnderline = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
      style.font.u = !style.font.u;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleItalic = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
      style.font.i = !style.font.i;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleBold = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
      style.font.b = !style.font.b;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleStrike = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
      style.font.strike = !style.font.strike;
    });
    setRedrawId((id) => id + 1);
  };

  const onToggleAlignLeft = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
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

  const onToggleAlignCenter = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
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

  const onToggleAlignRight = () => {
    model.updateStyle(workbookState.getSelectedArea(), (style) => {
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

  const { onKeyDown } = useKeyboardNavigation({
    onCellsDeleted: function (): void {
      throw new Error("Function not implemented.");
    },
    onExpandAreaSelectedKeyboard: function (
      key: "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown"
    ): void {
      throw new Error("Function not implemented.");
    },
    onEditKeyPressStart: function (initText: string): void {
      throw new Error("Function not implemented.");
    },
    onCellEditStart: function (): void {
      throw new Error("Function not implemented.");
    },
    onBold: onToggleBold,
    onItalic: onToggleItalic,
    onUnderline: onToggleUnderline,
    onNavigationToEdge: function (direction: NavigationKey): void {
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
      workbookState.selectCell({row, column: cell.column})
      setRedrawId((id) => id + 1);
    },
    onArrowUp: function (): void {
      const cell = workbookState.getSelectedCell();
      const row = cell.row - 1;
      if (row < 1) {
        return;
      }
      workbookState.selectCell({row, column: cell.column})
      setRedrawId((id) => id + 1);
    },
    onArrowLeft: function (): void {
      const cell = workbookState.getSelectedCell();
      const column = cell.column - 1;
      if (column < 1) {
        return;
      }
      workbookState.selectCell({row: cell.row, column})
      setRedrawId((id) => id + 1);
    },
    onArrowRight: function (): void {
      const cell = workbookState.getSelectedCell();
      const column = cell.column + 1;
      if (column > LAST_COLUMN) {
        return;
      }
      workbookState.selectCell({row: cell.row, column})
      setRedrawId((id) => id + 1);
    },
    onKeyHome: function (): void {
      throw new Error("Function not implemented.");
    },
    onKeyEnd: function (): void {
      throw new Error("Function not implemented.");
    },
    onUndo: function (): void {
      throw new Error("Function not implemented.");
    },
    onRedo: function (): void {
      throw new Error("Function not implemented.");
    },
    root: rootRef,
  });

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }
    rootRef.current.focus();
  });

  const cellAddress = getCellAddress(workbookState.getSelectedArea(), workbookState.getSelectedCell());

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
        onToggleAlignLeft={onToggleAlignLeft}
        onToggleAlignCenter={onToggleAlignCenter}
        onToggleAlignRight={onToggleAlignRight}
        onCopyStyles={function (): void {
          throw new Error("Function not implemented.");
        }}
        onTextColorPicked={function (_hex: string): void {
          throw new Error("Function not implemented.");
        }}
        onFillColorPicked={function (_hex: string): void {
          throw new Error("Function not implemented.");
        }}
        onNumberFormatPicked={function (_numberFmt: string): void {
          throw new Error("Function not implemented.");
        }}
        onBorderChanged={function (_border: BorderOptions): void {
          throw new Error("Function not implemented.");
        }}
        fillColor={""}
        fontColor={""}
        bold={false}
        underline={false}
        italic={false}
        strike={false}
        alignment={""}
        canEdit={true}
        numFmt={""}
      />
      <FormulaBar cellAddress={cellAddress} />
      <Worksheet model={model} workbookState={workbookState} />
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
          throw new Error("Function not implemented.");
        }}
        onSheetRenamed={function (name: string): void {
          throw new Error("Function not implemented.");
        }}
        conSheetDeleted={function (): void {
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
