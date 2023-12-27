import { Diff } from "./diffs";

export default class ModelHistory {
  private undoStack: Diff[][];
  private redoStack: Diff[][];

  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  push(diffList: Diff[]) {
    this.redoStack = [];
    this.undoStack.push(diffList);
  }

  undo(): Diff[] {
    const diffList = this.undoStack.pop();
    if (!diffList) {
      return [];
    }
    this.redoStack.push(diffList);
    return diffList;
  }

  redo(): Diff[] {
    const diffList = this.redoStack.pop();
    if (!diffList) {
      return [];
    }
    this.undoStack.push(diffList);
    return diffList;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  delete() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
