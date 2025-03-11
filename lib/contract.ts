import { ethers } from "ethers"
import FridgeditionsNFTAbi from "../artifacts/contracts/FridgeditionsNFT.sol/FridgeditionsNFT.json"

// Contract deployed addresses
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

// Check if the environment is browser or server
const isBrowser = typeof window !== "undefined"

/**
 * Get ethers provider based on environment
 */
export const getProvider = () => {
  if (isBrowser) {
    // Browser provider (MetaMask, etc.)
    if (window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    } else {
      throw new Error("No Ethereum browser provider found. Please install MetaMask.")
    }
  } else {
    // Server provider using environment variable RPC URL
    return new ethers.JsonRpcProvider(process.env.BASE_RPC_URL || "https://mainnet.base.org")
  }
}

/**
 * Get contract instance
 */
export const getContract = async (withSigner = false) => {
  const provider = getProvider()

  if (withSigner && isBrowser) {
    const signer = await provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, FridgeditionsNFTAbi.abi, signer)
  }

  return new ethers.Contract(CONTRACT_ADDRESS, FridgeditionsNFTAbi.abi, provider)
}

/**
 * Create artwork metadata
 */
export interface ArtworkMetadata {
  name: string
  description: string
  artist: string
  artistAge?: number
  image: string
  external_url?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

/**
 * Pin metadata to IPFS (using Pinata or similar service)
 */
export const pinMetadataToIPFS = async (metadata: ArtworkMetadata): Promise<string> => {
  // In a real implementation, this would call a backend API that pins to IPFS
  // For demo purposes, we'll just return a mock CID
  console.log("Pinning metadata to IPFS:", metadata)
  return "QmXuTSpihVhbRBvujoPxWZWo4jLhRhVHBq3SVrhHMkYNHB"
}

/**
 * Create a new artwork on the contract
 */
export const createArtwork = async (
  maxSupply: number,
  artistAddress: string,
  price: string,
  metadataUri: string,
): Promise<number> => {
  try {
    const contract = await getContract(true)

    // Convert price from ETH to wei
    const priceInWei = ethers.parseEther(price)

    // Call the contract
    const tx = await contract.createArtwork(maxSupply, artistAddress, priceInWei, metadataUri)
    const receipt = await tx.wait()

    // Find the ArtworkCreated event to get the token ID
    const event = receipt.logs
      .filter((log: any) => log.fragment?.name === "ArtworkCreated")
      .map((log: any) => contract.interface.parseLog(log))[0]

    if (event && event.args) {
      return event.args.tokenId
    }

    throw new Error("Failed to get token ID from transaction")
  } catch (error) {
    console.error("Error creating artwork:", error)
    throw error
  }
}

/**
 * Mint artwork tokens
 */
export const mintArtwork = async (tokenId: number, amount: number, price: string): Promise<boolean> => {
  try {
    const contract = await getContract(true)

    // Calculate total price
    const priceInWei = ethers.parseEther(price)
    const totalPrice = priceInWei * BigInt(amount)

    // Call the contract
    const tx = await contract.sponsoredMint(await (await getProvider().getSigner()).getAddress(), tokenId, amount, {
      value: totalPrice,
    })

    await tx.wait()
    return true
  } catch (error) {
    console.error("Error minting artwork:", error)
    throw error
  }
}

/**
 * Get artwork details
 */
export const getArtworkDetails = async (tokenId: number) => {
  try {
    const contract = await getContract()

    const [uri, maxSupply, currentSupply, price, artist, isOneOfOne] = await Promise.all([
      contract.uri(tokenId),
      contract.maxSupply(tokenId),
      contract.currentSupply(tokenId),
      contract.tokenPrice(tokenId),
      contract.artistAddress(tokenId),
      contract.isOneOfOne(tokenId),
    ])

    return {
      tokenId,
      uri,
      maxSupply,
      currentSupply,
      price: ethers.formatEther(price),
      artist,
      isOneOfOne,
    }
  } catch (error) {
    console.error("Error getting artwork details:", error)
    throw error
  }
}

/**
 * Get user's balance of a specific token
 */
export const getUserBalance = async (userAddress: string, tokenId: number): Promise<number> => {
  try {
    const contract = await getContract()
    const balance = await contract.balanceOf(userAddress, tokenId)
    return Number(balance)
  } catch (error) {
    console.error("Error getting user balance:", error)
    throw error
  }
}

