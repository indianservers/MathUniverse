import type { BoardDocument, BoardElement } from "./types";
import { moveElement } from "./boardGeometry";

export type BoardCommand =
  | { type: "add"; elements: BoardElement[] }
  | { type: "delete"; elements: BoardElement[] }
  | { type: "move"; ids: string[]; dx: number; dy: number }
  | { type: "clear"; elements: BoardElement[] }
  | { type: "background"; before: BoardDocument["background"]; after: BoardDocument["background"] }
  | { type: "edit-math"; id: string; before: string; after: string };

export type BoardHistory = {
  undo: BoardCommand[];
  redo: BoardCommand[];
};

export const emptyBoardHistory = (): BoardHistory => ({ undo: [], redo: [] });

export function executeCommand(document: BoardDocument, command: BoardCommand): BoardDocument {
  return apply(document, command, false);
}

export function undoCommand(document: BoardDocument, command: BoardCommand): BoardDocument {
  return apply(document, command, true);
}

export function recordCommand(history: BoardHistory, command: BoardCommand): BoardHistory {
  return { undo: [...history.undo.slice(-79), command], redo: [] };
}

function apply(document: BoardDocument, command: BoardCommand, reverse: boolean): BoardDocument {
  let elements = document.elements;
  let background = document.background;
  if (command.type === "add") {
    elements = reverse ? without(elements, command.elements) : merge(elements, command.elements);
  } else if (command.type === "delete" || command.type === "clear") {
    elements = reverse ? merge(elements, command.elements) : without(elements, command.elements);
  } else if (command.type === "move") {
    const direction = reverse ? -1 : 1;
    elements = elements.map((element) => command.ids.includes(element.id)
      ? moveElement(element, command.dx * direction, command.dy * direction)
      : element);
  } else if (command.type === "background") {
    background = reverse ? command.before : command.after;
  } else if (command.type === "edit-math") {
    elements = elements.map((element) => element.id === command.id && element.type === "math-expression"
      ? { ...element, latex: reverse ? command.before : command.after }
      : element);
  }
  return { ...document, background, elements, updatedAt: new Date().toISOString() };
}

function without(source: BoardElement[], removed: BoardElement[]) {
  const ids = new Set(removed.map((element) => element.id));
  return source.filter((element) => !ids.has(element.id));
}

function merge(source: BoardElement[], added: BoardElement[]) {
  const ids = new Set(source.map((element) => element.id));
  return [...source, ...added.filter((element) => !ids.has(element.id))];
}

