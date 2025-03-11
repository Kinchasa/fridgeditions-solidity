"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { MobileMenu } from "./mobile-menu"
import { WalletConnectModal } from "./wallet-connect-modal"

export function SiteHeader() {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Function to format wallet address (abridged version)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Simulate a connected wallet for demo purposes
  const simulateConnection = () => {
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    setWalletAddress(mockAddress)
    setConnected(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Link href="/" className="flex items-center space-x-2">
            <span
              className="font-bold text-lg text-primary font-dynapuff"
              style={{
                letterSpacing: "0.05em",
                textShadow: "0 1px 1px rgba(0,0,0,0.15), 0 -1px 1px rgba(255,255,255,0.3)",
              }}
            >
              Fridgeditions
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {connected && walletAddress ? (
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              {formatAddress(walletAddress)}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => setWalletModalOpen(true)}
            >
              Connect
            </Button>
          )}
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
            <Link href="/mint">Add Art</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>

      <WalletConnectModal isOpen={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </header>
  )
}

