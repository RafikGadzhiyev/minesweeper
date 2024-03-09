import { FIELD_CONFIG } from "@/configs/game.config";
import { CanvasOptions, Cell } from "@/types";
import { drawGrid, revealAllBombs } from "./canvas";

export const checkCell = (
  e: MouseEvent,
  grid: Array<Array<Cell>>,
  canvasOptions: CanvasOptions,
  destroyEvents: () => void
) => {
  let x = e.offsetX;
  let y = e.offsetY;

  let row = Math.floor(y / FIELD_CONFIG.CELL_SIZE)
  let col = Math.floor(x / FIELD_CONFIG.CELL_SIZE)

  let isFirstCell = true;

  const queue = [
    [row, col]
  ]

  while (queue.length) {
    const [
      y,
      x
    ] = queue.shift() || []

    const cell = grid[y][x];

    if (isFirstCell) {
      if (cell.value === -1) {
        destroyEvents()
        revealAllBombs(grid)
        alert('Ooops! It seems you lose! Restart, please')

        break;
      }

      isFirstCell = false;
    }

    if (cell.isOpened) {
      continue;
    }

    cell.isOpened = true
    cell.color = 'rgb(50 255 50 / 0.1)';
    cell.drawStyle = 'fill'

    if (cell.value !== 0) {
      continue;
    }

    if (cell.value === 0) {
      const cells: [number, number][] = getNeighbors(y, x, grid);

      queue.push(
          ...cells
      )
    }
  }
}

function getNeighbors(row: number, col: number, grid: Array<Array<Cell>>): [number, number][] {
  const availableNeighbors: [number, number][] = [

  ]

  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]

  for (const [drow, dcol] of dirs) {
    const nrow = row + drow
    const ncol = col + dcol

    if (
      nrow < 0
      || nrow >= grid.length
      || ncol < 0
      || ncol >= grid[0].length
    ) {
      continue;
    }

    const cell = grid[nrow][ncol]

    if (
      cell.isOpened
      || cell.value === -1
    ) {
      continue;
    }

    availableNeighbors.push(
      [nrow, ncol]
    )
  }

  return availableNeighbors
}