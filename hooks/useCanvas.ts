import {useCallback, useRef} from "react";
import {CanvasOptions} from "@/types";

export const useCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null> ( null)

    const init = useCallback(
        function init(): CanvasOptions {
            if (!canvasRef.current) {
                return {} as CanvasOptions;
            }

            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")

            const canvasSize = {
                width: canvas.width,
                height: canvas.height,
            }

            function changeColor(color: string) {
                if (!ctx) {
                    return;
                }

                ctx.fillStyle = color;
                ctx.strokeStyle = color;
            }

            function clearCanvas() {
                if (!ctx) {
                    return false;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height)
                return true
            }

            function onClick(callback: (e: MouseEvent) => void) {
                canvasRef.current!.onclick = e => {
                    callback(e)
                }
            }

            return {
                ctx,
                canvasSize,

                methods: {
                    changeColor,
                    clearCanvas,
                    onClick
                }
            }
        },
        []
    )

    const destroyEvents = useCallback(
        () => {
           canvasRef.current!.onclick = () => {}
        },
        []
    )

    return {
        ref: canvasRef,
        destroyEvents,
        init,
    }
}
