"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { WalletConnectModal } from "./wallet-connect-modal"

interface MobileMenuProps {
  walletAddress?: string | null
  onDisconnect?: () => void
}

export function MobileMenu({ walletAddress, onDisconnect }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [walletModalOpen, setWalletModalOpen] = React.useState(false)

  // Function to format wallet address
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <span
                className="font-bold text-primary font-dynapuff"
                style={{
                  letterSpacing: "0.05em",
                  textShadow: "0 1px 1px rgba(0,0,0,0.15), 0 -1px 1px rgba(255,255,255,0.3)",
                }}
              >
                Fridgeditions
              </span>
            </Link>
          </div>
          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/mint"
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Add Art
            </Link>
            <Link
              href="/about"
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            {walletAddress ? (
              <div className="space-y-2">
                <div className="text-lg font-medium">{formatAddress(walletAddress)}</div>
                <div className="flex flex-col gap-2">
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress)
                      setOpen(false)
                    }}
                  >
                    Copy Address
                  </button>
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => {
                      if (onDisconnect) onDisconnect()
                      setOpen(false)
                    }}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="text-left text-lg font-medium transition-colors hover:text-primary"
                onClick={() => {
                  setOpen(false)
                  setWalletModalOpen(true)
                }}
              >
                Connect Wallet
              </button>
            )}
          </nav>
          <div className="mt-auto pt-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>

      <WalletConnectModal isOpen={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </>
  )
}

