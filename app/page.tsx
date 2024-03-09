'use client';

import { useEffect, useRef } from "react";

import { useCanvas } from "@/hooks/useCanvas";

import {CANVAS_CONFIG, FIELD_CONFIG} from "@/configs/game.config";
import {createGrid, drawGrid} from "@/utils/canvas";
import {CanvasOptions} from "@/types";
import { checkCell } from "@/utils/game";

import BombImage from '@/assets/images/bomb.png'
import Image from "next/image";

export default function Home() {
  const bombImageRef = useRef<HTMLImageElement | null>(null)
  const {
    ref,
    init,
    destroyEvents,
  } = useCanvas()
  const canvasOptions = useRef<CanvasOptions | null>(null)

  useEffect(() => {
    canvasOptions.current = init()
    const grid = createGrid(
        CANVAS_CONFIG.WIDTH,
        CANVAS_CONFIG.HEIGHT,
        FIELD_CONFIG.CELL_SIZE
    )

    if (!canvasOptions.current.ctx) {
      return
    }

    canvasOptions.current.methods.onClick(
      (e) => checkCell(
        e,
        grid,
        canvasOptions.current as CanvasOptions,
        destroyEvents
      )
    )

    const timerId = setInterval(
      () => {
        canvasOptions.current?.methods.clearCanvas()
        drawGrid(
          canvasOptions.current?.ctx as CanvasRenderingContext2D,
          grid,
          {
            bombImage: bombImageRef.current
          }
        )
      }
    )

    return () => clearTimeout(timerId)
  }, [init, destroyEvents]);

  return <div>
    <h1>Welcome to minesweeper!</h1>

    <Image
      ref={bombImageRef}
      src={BombImage}
      alt="Bomb image"
      className="invisible"
    />

    <div
        className='game-container'
    >
      <canvas
          ref={ref}
          width={CANVAS_CONFIG.WIDTH}
          height={CANVAS_CONFIG.HEIGHT}
      >

      </canvas>
    </div>
  </div>
}
