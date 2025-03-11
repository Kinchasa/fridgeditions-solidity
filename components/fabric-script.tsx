"use client"

import Script from "next/script"

export function FabricScript() {
  return (
    <Script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js" strategy="beforeInteractive" />
  )
}

