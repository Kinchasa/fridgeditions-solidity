import type React from "react"
import { cn } from "@/lib/utils"

interface AsciiFridgeProps {
  type?: "fridge" | "freezer"
  className?: string
  children?: React.ReactNode
}

export function AsciiFridge({ type = "fridge", className, children }: AsciiFridgeProps) {
  const fridgeAscii = `
+------------------+
|  .-----------,   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  '-----------'   |
|                  |
|   .---------,    |
|   |         |    |
|   '---------'    |
+------------------+
  `

  const freezerAscii = `
+------------------+
|                  |
|  .-----------,   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  |           |   |
|  '-----------'   |
|                  |
+------------------+
  `

  return (
    <div className={cn("relative group", className)}>
      <pre className="ascii-fridge text-muted-foreground">{type === "fridge" ? fridgeAscii : freezerAscii}</pre>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

