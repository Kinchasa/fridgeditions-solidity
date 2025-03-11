"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MetallicFridgeSvg } from "./metallic-fridge-svg"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { mintArtwork } from "@/lib/contract-service"
import { Loader2 } from "lucide-react"

interface ArtworkCardProps {
  title: string
  artist: string
  image: string
  id: number | string
  description?: string
  tokenId?: number
  price?: string
  maxSupply?: number
  remainingSupply?: number
}

export function ArtworkCard({
  title,
  artist,
  image,
  id,
  description,
  tokenId,
  price: propPrice,
  maxSupply: propMaxSupply,
  remainingSupply: propRemainingSupply,
}: ArtworkCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isCollecting, setIsCollecting] = useState(false)
  const { address, connect, signer, switchToBase, isBase } = useWallet()
  const { toast } = useToast()

  // Generate random price from standard options if not provided
  const priceOptions = ["Free", "$0.50", "$1.00", "$5.00"]
  const randomPrice = priceOptions[Math.floor(Math.random() * priceOptions.length)]
  const price = propPrice || randomPrice

  // Generate random edition data if not provided
  const totalEditions = propMaxSupply || [1, 3, 5, 10, 25][Math.floor(Math.random() * 5)]
  const remainingEditions = propRemainingSupply || Math.max(1, Math.floor(Math.random() * (totalEditions + 1)))

  // Generate a description if none provided
  const artDescription =
    description ||
    `This wonderful piece by ${artist} captures the imagination and creativity of youth. Each stroke tells a story of wonder and possibility.`

  const incrementQuantity = () => {
    if (quantity < remainingEditions) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= remainingEditions) {
      setQuantity(value)
    }
  }

  const handleCollect = async () => {
    // Connect wallet if not connected
    if (!address) {
      try {
        await connect()
        if (!address) {
          throw new Error("Failed to connect wallet")
        }
      } catch (error) {
        toast({
          title: "Wallet Connection Failed",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        })
        return
      }
    }

    // Switch to Base network if not on it
    if (!isBase) {
      const switched = await switchToBase()
      if (!switched) {
        toast({
          title: "Network Switch Failed",
          description: "Please switch to the Base network to continue",
          variant: "destructive",
        })
        return
      }
    }

    setIsCollecting(true)

    try {
      // If we have a tokenId, use the contract
      if (tokenId && signer) {
        // Convert price to ETH value
        let ethPrice = "0"
        if (price === "$0.50") ethPrice = "0.0002"
        else if (price === "$1.00") ethPrice = "0.0004"
        else if (price === "$5.00") ethPrice = "0.002"

        // Mint the artwork
        const receipt = await mintArtwork(signer, address, tokenId, quantity, ethPrice)

        toast({
          title: "Artwork Collected!",
          description: `You've successfully collected ${quantity} edition(s) of "${title}"`,
        })
      } else {
        // For demo purposes, simulate a successful collection
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
          title: "Artwork Collected!",
          description: `You've successfully collected ${quantity} edition(s) of "${title}"`,
        })
      }

      // Close the dialog
      setIsOpen(false)
    } catch (error: any) {
      console.error("Error collecting artwork:", error)
      toast({
        title: "Collection Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsCollecting(false)
    }
  }

  // Convert price string to ETH value for display
  const getPriceDisplay = () => {
    if (price === "Free") return "Free"
    return price
  }

  return (
    <div className="group relative">
      <div className="aspect-[3/4] relative overflow-hidden rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        {/* Metallic fridge background */}
        <MetallicFridgeSvg />

        {/* Artwork image */}
        <div className="absolute inset-0 z-10 p-6">
          <div className="relative h-full w-full">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="object-contain" />
          </div>
        </div>

        {/* Subtle reflection overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">by {artist}</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="transition-opacity hover:bg-primary/10">
              Collect
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Collect "{title}"</DialogTitle>
              <DialogDescription>Support {artist}'s creativity by collecting this artwork.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg border shadow-sm w-full max-w-xs mx-auto">
                <MetallicFridgeSvg />
                <div className="absolute inset-0 z-10 p-6">
                  <div className="relative h-full w-full">
                    <Image src={image || "/placeholder.svg"} alt={title} fill className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="text-lg font-bold">{getPriceDisplay()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Editions:</span>
                  <span>
                    {remainingEditions} of {totalEditions} remaining
                  </span>
                </div>

                <div className="pt-2">
                  <Label htmlFor="quantity">Quantity to collect:</Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <span className="sr-only">Decrease</span>
                      <span className="text-lg">-</span>
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={remainingEditions}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= remainingEditions}
                    >
                      <span className="sr-only">Increase</span>
                      <span className="text-lg">+</span>
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-medium mb-1">About this artwork:</h4>
                  <p className="text-sm text-muted-foreground">{artDescription}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isCollecting}>
                  Cancel
                </Button>
                <Button onClick={handleCollect} disabled={isCollecting}>
                  {isCollecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : price === "Free" ? (
                    "Collect Now"
                  ) : (
                    `Purchase (${price})`
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

