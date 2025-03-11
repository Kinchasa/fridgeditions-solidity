import { type NextRequest, NextResponse } from "next/server"
import { ethers } from "ethers"
import { prepareGaslessMint } from "@/lib/contract-service"

export async function POST(req: NextRequest) {
  try {
    const { userAddress, tokenId, amount } = await req.json()

    // Validate inputs
    if (!userAddress || !tokenId || !amount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate Ethereum address
    if (!ethers.utils.isAddress(userAddress)) {
      return NextResponse.json({ error: "Invalid Ethereum address" }, { status: 400 })
    }

    // Process the gasless mint transaction
    const receipt = await prepareGaslessMint(userAddress, Number(tokenId), Number(amount))

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
    })
  } catch (error: any) {
    console.error("Error processing gasless mint:", error)

    return NextResponse.json({ error: error.message || "Failed to process mint request" }, { status: 500 })
  }
}

