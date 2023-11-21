import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import Model from "../model/model";
import WorksheetCanvas from "./WorksheetCanvas/worksheetCanvas";
import {
  outlineBackgroundColor,
  outlineColor,
} from "./WorksheetCanvas/constants";
import usePointer from "./usePointer";
import { WorkbookState } from "./workbookState";
import { Cell } from "./WorksheetCanvas/types";

function Worksheet(props: { model: Model; workbookState: WorkbookState }) {
  const canvasElement = useRef<HTMLCanvasElement>(null);

  const worksheetElement = useRef<HTMLDivElement>(null);
  // const scrollElement = useRef<HTMLDivElement>(null);
  // const rootElement = useRef<HTMLDivElement>(null);
  const spacerElement = useRef<HTMLDivElement>(null);
  const cellOutline = useRef<HTMLDivElement>(null);
  const areaOutline = useRef<HTMLDivElement>(null);
  const cellOutlineHandle = useRef<HTMLDivElement>(null);
  const extendToOutline = useRef<HTMLDivElement>(null);
  const columnResizeGuide = useRef<HTMLDivElement>(null);
  const rowResizeGuide = useRef<HTMLDivElement>(null);
  // const contextMenuAnchorElement = useRef<HTMLDivElement>(null);
  const columnHeaders = useRef<HTMLDivElement>(null);
  const worksheetCanvas = useRef<WorksheetCanvas | null>(null);

  const { model, workbookState } = props;
  useEffect(() => {
    const canvasRef = canvasElement.current;
    const columnGuideRef = columnResizeGuide.current;
    const rowGuideRef = rowResizeGuide.current;
    const columnHeadersRef = columnHeaders.current;
    const worksheetRef = worksheetElement.current;

    const outline = cellOutline.current;
    const handle = cellOutlineHandle.current;
    const area = areaOutline.current;
    const extendTo = extendToOutline.current;

    if (
      !canvasRef ||
      !columnGuideRef ||
      !rowGuideRef ||
      !columnHeadersRef ||
      !worksheetRef ||
      !outline ||
      !handle ||
      !area ||
      !extendTo
    )
      return;
    const canvas = new WorksheetCanvas({
      width: worksheetRef.clientWidth,
      height: worksheetRef.clientHeight,
      model,
      workbookState,
      elements: {
        canvas: canvasRef,
        columnGuide: columnGuideRef,
        rowGuide: rowGuideRef,
        columnHeaders: columnHeadersRef,
        cellOutline: outline,
        cellOutlineHandle: handle,
        areaOutline: area,
        extendToOutline: extendTo,
      },
      onColumnWidthChanges(sheet, column, width) {
        model.setColumnWidth(sheet, column, width);
        worksheetCanvas.current?.renderSheet();
      },
      onRowHeightChanges(sheet, row, height) {
        model.setRowHeight(sheet, row, height);
        worksheetCanvas.current?.renderSheet();
      },
    });
    const [sheetWidth, sheetHeight] = canvas.getSheetDimensions();
    if (spacerElement.current) {
      spacerElement.current.style.height = `${sheetHeight}px`;
      spacerElement.current.style.width = `${sheetWidth}px`;
    }
    canvas.renderSheet();
    worksheetCanvas.current = canvas;
  });

  const {
    onPointerMove,
    onPointerDown,
    onPointerHandleDown,
    onPointerUp,
    // onContextMenu,
  } = usePointer({
    onAreaSelected: () => {
      console.log('onAreaSelected');
    }, // editorActions.onAreaSelected,
    onPointerDownAtCell: (cell: Cell, event: React.MouseEvent) => {
      console.log('onPointerDownAtCell');
      event.preventDefault();
      event.stopPropagation();
      workbookState.selectCell(cell);
      worksheetCanvas.current?.renderSheet();
    },
    onPointerMoveToCell: () => {
      console.log('onPointerMoveToCell');
    }, //  editorActions.onPointerMoveToCell,
    onExtendToCell: () => {
      console.log('onExtendToCell');
    }, //  editorActions.onExtendToCell,
    onExtendToEnd: () => {
      console.log('onExtendToEnd');
    }, // editorActions.onExtendToEnd,
    canvasElement,
    worksheetElement,
    worksheetCanvas,
    // rowContextMenuAnchorElement,
    // columnContextMenuAnchorElement,
    // onRowContextMenu,
    // onColumnContextMenu,
  });

  const onScroll = (): void => {
    if (!worksheetElement.current || !worksheetCanvas.current) {
      return;
    }
    const left = worksheetElement.current.scrollLeft;
    const top = worksheetElement.current.scrollTop;

    worksheetCanvas.current.setScrollPosition({ left, top });
    worksheetCanvas.current.renderSheet();
  };

  return (
    <Wrapper ref={worksheetElement} onScroll={onScroll}>
      <Spacer ref={spacerElement} />
      <SheetContainer
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <SheetCanvas ref={canvasElement} />
        <CellOutline ref={cellOutline}>
          {/* <Editor
              data-testid={WorkbookTestId.WorkbookCellEditor}
              onEditChange={onEditChange}
              onEditEnd={onEditEnd}
              onEditEscape={onEditEscape}
              onReferenceCycle={onReferenceCycle}
              display={!!cellEditing}
              focus={cellEditing?.focus === FocusType.Cell}
              html={cellEditing?.html ?? ''}
              cursorStart={cellEditing?.cursorStart ?? 0}
              cursorEnd={cellEditing?.cursorEnd ?? 0}
              mode={cellEditing?.mode ?? 'init'}
            /> */}
        </CellOutline>
        <AreaOutline ref={areaOutline} />
        <ExtendToOutline ref={extendToOutline} />
        <CellOutlineHandle
          ref={cellOutlineHandle}
          onPointerDown={onPointerHandleDown}
        />
        <ColumnResizeGuide ref={columnResizeGuide} />
        <RowResizeGuide ref={rowResizeGuide} />
        <ColumnHeaders ref={columnHeaders} />
      </SheetContainer>
    </Wrapper>
  );
}

const Spacer = styled("div")`
  position: absolute;
  height: 5000px;
  width: 5000px;
`;

const SheetContainer = styled("div")`
  position: sticky;
  top: 0px;
  left: 0px;
  height: 100%;

  .column-resize-handle {
    position: absolute;
    top: 0px;
    width: 3px;
    opacity: 0;
    background: ${outlineColor};
    border-radius: 5px;
    cursor: col-resize;
  }

  .column-resize-handle:hover {
    opacity: 1;
  }
  .row-resize-handle {
    position: absolute;
    left: 0px;
    height: 3px;
    opacity: 0;
    background: ${outlineColor};
    border-radius: 5px;
    cursor: row-resize;
  }

  .row-resize-handle:hover {
    opacity: 1;
  }
`;

const Wrapper = styled("div")({
  position: "absolute",
  overflow: "scroll",
  top: 71,
  left: 0,
  right: 0,
  bottom: 41,
});

const SheetCanvas = styled("canvas")`
  position: relative;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 40px;
`;

const ColumnResizeGuide = styled("div")`
  position: absolute;
  top: 0px;
  display: none;
  height: 100%;
  width: 0px;
  border-left: 1px dashed ${outlineColor};
`;

const ColumnHeaders = styled("div")`
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
  display: flex;
  & .column-header {
    display: inline-block;
    text-align: center;
    overflow: hidden;
    height: 100%;
    user-select: none;
  }
`;

const RowResizeGuide = styled("div")`
  position: absolute;
  display: none;
  left: 0px;
  height: 0px;
  width: 100%;
  border-top: 1px dashed ${outlineColor};
`;

const AreaOutline = styled("div")`
  position: absolute;
  border: 1px solid ${outlineColor};
  border-radius: 3px;
  background-color: ${outlineBackgroundColor};
`;

const CellOutline = styled("div")`
  position: absolute;
  border: 2px solid ${outlineColor};
  border-radius: 3px;
  word-break: break-word;
  font-size: 13px;
  display: flex;
`;

const CellOutlineHandle = styled("div")`
  position: absolute;
  width: 5px;
  height: 5px;
  background: ${outlineColor};
  cursor: crosshair;
  // border: 1px solid white;
  border-radius: 1px;
`;

const ExtendToOutline = styled("div")`
  position: absolute;
  border: 1px dashed ${outlineColor};
  border-radius: 3px;
`;

export default Worksheet;
