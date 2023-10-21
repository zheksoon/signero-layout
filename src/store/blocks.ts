import { produce } from "immer";
import { get } from "lodash";
import { observable, action, shallowEquals } from "onek";
import { getRandomColor } from "../utils";

function makeRow(columns) {
  return { type: "row", columns };
}

function makeColumn(items, width = 1.0) {
  return { type: "column", width, items };
}

function makeBlock(color = getRandomColor()) {
  return { type: "block", color };
}

function randomWalk(rows = 30, maxBlocks = 150, maxDepth = 3) {
  let blocksCount = maxBlocks;

  function walk(parentType, depth) {
    if (depth > maxDepth) {
      return null;
    }
    if (parentType === "row") {
      const columnsCount = Math.floor(Math.random() * 3 + 1);
      const columns = Array.from({ length: columnsCount }, () =>
        walk("column", depth + 1)
      ).filter(Boolean);
      if (columns.length === 0) return null;
      return makeRow(columns);
    }
    if (parentType === "column") {
      blocksCount = maxBlocks;
      const choise = ["row", "block"][Math.floor(Math.random() * 2)];
      const columnWidth = Math.random() * 0.8 + 0.5;
      if (choise === "row") {
        const rowsCount = Math.floor(Math.random() * 4 + 1);
        const rows = Array.from({ length: rowsCount }, () =>
          walk("row", depth + 1)
        ).filter(Boolean);
        if (rows.length === 0) return null;
        return makeColumn(rows, columnWidth);
      }
      if (choise === "block") {
        if (blocksCount == 0) return null;
        const block = makeBlock();
        blocksCount -= 1;
        return makeColumn([block], columnWidth);
      }
      return walk(choise, depth + 1);
    }
  }

  return Array.from({ length: rows }, () => walk("row", 0)).filter(Boolean);
}

// const defaultBlocks = randomWalk(20, 2, 3);

const defaultBlocks = makeColumn([
  makeRow([makeColumn([makeBlock()])]),
  makeRow([
    makeColumn([makeBlock()]),
    makeColumn([
      makeRow([makeColumn([makeBlock()]), makeColumn([makeBlock()])]),
      makeRow([makeColumn([makeBlock()])])
    ])
  ]),
  makeRow([
    makeColumn([makeBlock()]),
    makeColumn([makeBlock()]),
    makeColumn([makeBlock()])
  ])
]);

const [currentBlocks, setCurrentBlocks] = observable(defaultBlocks);

export const insertBlock = action((path, side, data) => {
  const blocks = currentBlocks();

  const newBlocks = produce(blocks, (draft) => {
    const blockIndex = path[path.length - 1];
    const columnIndex = path[path.length - 3];

    const block = get(draft, path);
    const column = get(draft, path.slice(0, -1));
    const row = get(draft, path.slice(0, -3));

    const newBlock = makeBlock(data.color);
    const newColumn = makeColumn([newBlock]);
    const newRow = makeRow([newColumn]);
    const wrappedColumn = makeColumn([block]);
    const wrappedRow = makeRow([wrappedColumn]);

    if (side === "top") {
      column.splice(blockIndex, 1, newRow, wrappedRow);
    }

    if (side === "bottom") {
      column.splice(blockIndex, 1, wrappedRow, newRow);
    }

    if (side === "left") {
      row.splice(columnIndex, 1, newColumn, wrappedColumn);
    }

    if (side === "right") {
      row.splice(columnIndex, 1, wrappedColumn, newColumn);
    }
  });

  setCurrentBlocks(newBlocks);
});

function sumWidth(columns) {
  return columns.reduce((acc, col) => {
    return acc + col.width;
  }, 0);
}

export const adjustColumnWidth = action((path, relativePosition) => {
  const blocks = currentBlocks();

  let previousMultiplier = 1.0;
  let multiplier = 1.0;
  let columnStart = 0.0;
  let totalColumnsWidth = 0.0;

  for (let i = 2; i <= path.length; i += 4) {
    const rowPath = path.slice(0, i);
    const columnPath = path.slice(0, i + 2);
    const columnIndex = columnPath[columnPath.length - 1];

    const row = get(blocks, rowPath);
    const column = get(blocks, columnPath);

    totalColumnsWidth = sumWidth(row.columns);

    const currentColumnStart = sumWidth(row.columns.slice(0, columnIndex));

    const relativeColumnWidth = column.width / totalColumnsWidth;
    const relativeColumnStart = currentColumnStart / totalColumnsWidth;

    columnStart = columnStart + relativeColumnStart / multiplier;

    previousMultiplier = multiplier;
    multiplier /= relativeColumnWidth + 1e-5;
  }

  const startDelta =
    (relativePosition - columnStart) * previousMultiplier * totalColumnsWidth;

  const newBlocks = produce(blocks, (draft) => {
    const columns = get(draft, path.slice(0, -1));
    const columnIndex = path[path.length - 1];

    const currentColumn = columns[columnIndex];
    const nextColumn = columns[columnIndex + 1];

    const currentWidth = currentColumn.width;
    const nextWidth = nextColumn.width;

    const sumWidth = currentWidth + nextWidth;
    const newWidth = Math.min(Math.max(startDelta, 0), sumWidth);

    currentColumn.width = newWidth;
    nextColumn.width = sumWidth - newWidth;
  });

  setCurrentBlocks(newBlocks);
});

export const removeBlock = action((path) => {
  const blocks = currentBlocks();

  const newBlocks = produce(blocks, (draft) => {
    let columnsPath = path.slice(0, -3);
    let columnIndex = path[path.length - 3];
    
    let columns = get(draft, columnsPath);
    
    columns.splice(columnIndex, 1);

    while (columns.length === 0) {
      const rowPath = columnsPath.slice(0, -2);
      const rowIndex = columnsPath[columnsPath.length - 2];
      
      const rows = get(draft, rowPath);

      rows.splice(rowIndex, 1);

      columnsPath = rowPath.slice(0, -2);
      columnIndex = rowPath[rowPath.length - 2];
      
      columns = get(draft, columnsPath);

      if (!columns) {
        break;
      }

      if (rows.length === 0) {
        columns.splice(columnIndex, 1);
      }
    }

    if (columns && columns.length === 1) {
      const column = columns[0];
      column.width = 1.0;
    }
  });

  const normalizedBlocks = normalizeBlocks(newBlocks);

  setCurrentBlocks(normalizedBlocks);
});

export const moveBlock = action((oldPath, newPath, side, data) => {
  insertBlock(newPath, side, data);
  removeBlock(oldPath);
});

function normalizeBlocks(blocks) {
  // TODO: impelment
  return blocks;
} 

export { currentBlocks, setCurrentBlocks };
