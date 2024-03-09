export type CanvasOptions = {
    ctx: CanvasRenderingContext2D | null,
    canvasSize: {
        width: number,
        height: number,
    },

    methods: {
        changeColor: (color: string) => void
        clearCanvas: () => void,
        onClick: (callback: (e: MouseEvent) => void) => any
    }
}

export type Cell = {
    value: number,
    drawStyle: 'fill' | 'stroke' | 'clear'
    color: string,
    x: number,
    y: number,
    width: number,
    height: number,
    isOpened: boolean
}
