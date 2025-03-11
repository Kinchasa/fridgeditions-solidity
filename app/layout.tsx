import type React from "react"
import type { Metadata } from "next"
import { Inter, DynaPuff } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FabricScript } from "@/components/fabric-script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const dynaPuff = DynaPuff({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dynapuff",
})

export const metadata: Metadata = {
  title: "Fridgeditions | Children's Art the World Can Enjoy",
  description: "Immortalize your child's artwork on-chain with Fridgeditions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <FabricScript />
      </head>
      <body className={`${inter.className} ${dynaPuff.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'