"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface WalletConnectModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ isOpen, onOpenChange }: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const handleConnect = async (walletType: string) => {
    setConnecting(walletType)
    setError(null)

    // Simulate connection process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, let's simulate a successful connection for MetaMask
      // and errors for others (in a real app, you'd implement actual wallet connections)
      if (walletType === "metamask") {
        console.log(`Connected to ${walletType}`)
        // Simulate a wallet address
        const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
        setWalletAddress(mockAddress)
        setConnected(true)
        onOpenChange(false)
      } else {
        throw new Error(`${walletType} connection not implemented in this demo`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect")
    } finally {
      setConnecting(null)
    }
  }

  // Function to format wallet address (abridged version)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-center">
            Connect with one of our available wallet providers or create a new one
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-between p-4 h-auto"
            onClick={() => handleConnect("metamask")}
            disabled={connecting !== null}
          >
            <div className="text-left">
              <p className="font-medium">MetaMask</p>
              <p className="text-xs text-muted-foreground">Connect to your MetaMask wallet</p>
            </div>
            {connecting === "metamask" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-between p-4 h-auto"
            onClick={() => handleConnect("coinbase")}
            disabled={connecting !== null}
          >
            <div className="text-left">
              <p className="font-medium">Coinbase Wallet</p>
              <p className="text-xs text-muted-foreground">Connect to your Coinbase wallet</p>
            </div>
            {connecting === "coinbase" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-between p-4 h-auto"
            onClick={() => handleConnect("phantom")}
            disabled={connecting !== null}
          >
            <div className="text-left">
              <p className="font-medium">Phantom Wallet</p>
              <p className="text-xs text-muted-foreground">Connect to your Phantom wallet</p>
            </div>
            {connecting === "phantom" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-between p-4 h-auto"
            onClick={() => handleConnect("walletconnect")}
            disabled={connecting !== null}
          >
            <div className="text-left">
              <p className="font-medium">WalletConnect</p>
              <p className="text-xs text-muted-foreground">Connect with WalletConnect</p>
            </div>
            {connecting === "walletconnect" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex items-center justify-between p-4 h-auto"
            onClick={() => handleConnect("social")}
            disabled={connecting !== null}
          >
            <div className="text-left">
              <p className="font-medium">Social Login (Privy)</p>
              <p className="text-xs text-muted-foreground">Connect with Google, Twitter, or Email</p>
            </div>
            {connecting === "social" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </Button>
        </div>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">{error}</div>}

        <div className="text-xs text-center text-muted-foreground mt-2">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}

