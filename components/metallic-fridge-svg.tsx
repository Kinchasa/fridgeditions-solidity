"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

interface MetallicFridgeSvgProps {
  className?: string
}

export function MetallicFridgeSvg({ className }: MetallicFridgeSvgProps) {
  const id = useId()

  return (
    <div className={cn("metallic-fridge w-full h-full", className)}>
      {/* SVG overlay for refrigerator details */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Horizontal panel lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--fridge-line))" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="hsl(var(--fridge-line))" strokeWidth="0.5" />

        {/* Handle */}
        <rect
          x="92"
          y="35"
          width="3"
          height="30"
          rx="1"
          fill="hsl(var(--fridge-handle))"
          filter={`url(#shadow-${id})`}
        />

        {/* Brushed metal texture */}
        <rect x="0" y="0" width="100" height="100" fill={`url(#brushed-metal-${id})`} opacity="0.05" />

        {/* Filters and gradients */}
        <defs>
          <filter id={`shadow-${id}`} x="-0.5" y="-0.5" width="2" height="2">
            <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodOpacity="0.2" />
          </filter>

          {/* Brushed metal pattern */}
          <pattern
            id={`brushed-metal-${id}`}
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="100" stroke="#ffffff" strokeWidth="1" />
            <line x1="20" y1="0" x2="20" y2="100" stroke="#ffffff" strokeWidth="1" />
            <line x1="40" y1="0" x2="40" y2="100" stroke="#ffffff" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="100" stroke="#ffffff" strokeWidth="1" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#ffffff" strokeWidth="1" />
          </pattern>
        </defs>
      </svg>

      {/* Edge highlight */}
      <div className="absolute inset-0 rounded-lg border border-white/10" />
    </div>
  )
}

