"use client"

import { useEffect, useRef } from "react"
import { fabric } from "fabric"

interface MetallicFridgeProps {
  width: number
  height: number
  className?: string
  darkMode?: boolean
}

export function MetallicFridge({ width, height, className, darkMode = false }: MetallicFridgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (typeof fabric === "undefined") return

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: false,
      renderOnAddRemove: true,
      backgroundColor: "transparent",
    })

    fabricCanvasRef.current = canvas

    // Create metallic gradient background
    const createMetallicBackground = () => {
      // Colors based on dark mode
      const baseColor = darkMode ? "#2a2a2a" : "#e0e0e0"
      const midColor = darkMode ? "#3a3a3a" : "#f5f5f5"
      const highlightColor = darkMode ? "#4a4a4a" : "#ffffff"
      const handleColor = darkMode ? "#222222" : "#d0d0d0"
      const lineColor = darkMode ? "#333333" : "#d9d9d9"

      // Create gradient for metallic effect
      const gradient = new fabric.Gradient({
        type: "linear",
        coords: {
          x1: 0,
          y1: 0,
          x2: width,
          y2: height,
        },
        colorStops: [
          { offset: 0, color: baseColor },
          { offset: 0.3, color: midColor },
          { offset: 0.5, color: highlightColor },
          { offset: 0.7, color: midColor },
          { offset: 1, color: baseColor },
        ],
      })

      // Create rectangle with gradient
      const background = new fabric.Rect({
        left: 0,
        top: 0,
        width: width,
        height: height,
        fill: gradient,
        selectable: false,
        evented: false,
        rx: 5,
        ry: 5,
      })

      // Add subtle details to make it look like a fridge
      const handleBar = new fabric.Rect({
        left: width - 15,
        top: height / 2 - 40,
        width: 8,
        height: 80,
        fill: handleColor,
        rx: 2,
        ry: 2,
        selectable: false,
        evented: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.2)",
          blur: 3,
          offsetX: -1,
          offsetY: 0,
        }),
      })

      // Add some subtle horizontal lines to simulate fridge panels
      const topPanel = new fabric.Line([0, height * 0.25, width, height * 0.25], {
        stroke: lineColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })

      const bottomPanel = new fabric.Line([0, height * 0.75, width, height * 0.75], {
        stroke: lineColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })

      // Add some magnets
      const createMagnet = (x: number, y: number, color: string, size: number) => {
        return new fabric.Circle({
          left: x,
          top: y,
          radius: size,
          fill: color,
          selectable: false,
          evented: false,
          shadow: new fabric.Shadow({
            color: "rgba(0,0,0,0.2)",
            blur: 2,
            offsetX: 1,
            offsetY: 1,
          }),
        })
      }

      // Add random magnets
      const magnet1 = createMagnet(20, 20, "#ff5252", 5)
      const magnet2 = createMagnet(width - 30, 30, "#4caf50", 6)
      const magnet3 = createMagnet(30, height - 30, "#2196f3", 5)

      // Add subtle shadow to create depth
      background.setShadow(
        new fabric.Shadow({
          color: "rgba(0,0,0,0.1)",
          blur: 10,
          offsetX: 0,
          offsetY: 0,
        }),
      )

      // Add all elements to canvas
      canvas.add(background)
      canvas.add(topPanel)
      canvas.add(bottomPanel)
      canvas.add(handleBar)
      canvas.add(magnet1)
      canvas.add(magnet2)
      canvas.add(magnet3)
      canvas.renderAll()
    }

    createMetallicBackground()

    // Cleanup
    return () => {
      canvas.dispose()
      fabricCanvasRef.current = null
    }
  }, [width, height, darkMode])

  return (
    <div className={className}>
      <canvas ref={canvasRef} />
    </div>
  )
}

