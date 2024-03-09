import { Cell } from "@/types";
import { FIELD_CONFIG } from '@/configs/game.config'

import BombImage from '@/assets/images/bomb.png'

export const createGrid = (canvasWidth: number, canvasHeight: number, cellSize: number): Array<Array<Cell>> => {
    const ROWS = Math.floor(canvasHeight / cellSize)
    const COLS = Math.floor(canvasWidth / cellSize)

    const grid: Array<Array<Cell>> = [];

    for (let i = 0; i < ROWS; i++) {
        grid.push([])
        for (let j = 0; j < COLS; j++) {
            grid[grid.length - 1].push(
                {
                    value: 0,
                    drawStyle: 'stroke',
                    color: 'red',
                    x: j * cellSize,
                    y: i * cellSize,
                    width: cellSize,
                    height: cellSize,
                    isOpened: false,
                }
            )
        }
    }

    placeBombsInGrid(grid)
    countBombsForEachCellInGrid(grid)

    return grid
}

export const placeBombsInGrid = (grid: Array<Array<Cell>>) => {
    for (let i = 0; i < FIELD_CONFIG.TOTAL_BOMBS; ++i) {
        const cell = getEmptyCell(grid);

        cell.value = -1;
    }
}

export const drawGrid = (
    ctx: CanvasRenderingContext2D,
    grid: Array<Array<Cell>>,
    assets = {} as Record<string, HTMLImageElement | null>
) => {
    const {
        bombImage
    } = assets

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j]

            let drawMethodKey = `${cell.drawStyle}Rect` as keyof CanvasRenderingContext2D
            let drawMethod = (ctx[drawMethodKey] as Function).bind(ctx)

            ctx.fillStyle = cell.color

            drawMethod(
                cell.x,
                cell.y,
                cell.width,
                cell.height
            )


            // if (cell.isOpened) {
                if(cell.value === -1) {
                    drawBomb(ctx, cell, bombImage)
                }
                else if (cell.value > 0) {
                    drawNumber(ctx, cell)
                }
            // }
        }
    }
}

export const drawNumber = (ctx: CanvasRenderingContext2D, cell: Cell) => {
    let color = ctx.fillStyle

    ctx.fillStyle = 'black';

    ctx.font = `${cell.width / 2.5}px monospace`
    ctx.fillText(cell.value + '', cell.x + cell.width / 2, cell.y + cell.height / 2)

    ctx.fillStyle = color;
}

export const drawBomb = (ctx: CanvasRenderingContext2D, cell: Cell, image: HTMLImageElement | null) => {
    let cx = cell.x + cell.width / 2
    let cy = cell.y + cell.height / 2

    let color = ctx.fillStyle

    ctx.fillStyle = 'black';

    ctx.beginPath()
    if (image){
        ctx.drawImage(image, cx - cell.width / 2, cy - cell.height / 2, cell.width, cell.height)
    }
    else {
        ctx.arc(cx, cy, cell.width / 2, 0, Math.PI * 2)
    }
    ctx.fill()
    ctx.closePath()

    ctx.fillStyle = color;
}

export const drawFlag = (ctx: CanvasRenderingContext2D, cell: Cell) => {

}

export const revealAllBombs = (grid: Array<Array<Cell>>) => {
    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value === -1) {
                grid[i][j].isOpened = true
            }
        }
    }
}

export const getEmptyCell = (grid: Array<Array<Cell>>) => {
    let isFinished = false;

    let cell = grid[0][0];

    while (!isFinished) {
        let randomRow = grid[Math.floor(Math.random() * grid.length)]
        let randomCell = randomRow[Math.floor(Math.random() * randomRow.length)]

        if (randomCell.value === -1) {
            continue
        }

        cell = randomCell;
        isFinished = true;
    }

    return cell
}

function countBombsForEachCellInGrid(grid: Array<Array<Cell>>) {
    const copy = JSON.parse(JSON.stringify(grid))
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

    for (let i = 0; i < grid.length; ++i) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].value === -1) {
                continue
            }

            for (const [dx, dy] of dirs) {
                let x = j + dx;
                let y = i + dy;

                if (
                    x < 0
                    || y < 0
                    || x > grid[0].length - 1
                    || y > grid.length - 1
                ) {
                    continue;
                }

                const cell = copy[y][x]

                if (cell.value === -1) {
                    grid[i][j].value++;
                }
            }
        }
    }
}
