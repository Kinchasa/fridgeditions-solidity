import { ethers } from "ethers"
import type { MinimalForwarder, FridgeditionsNFT } from "../typechain-types"
import MinimalForwarderABI from "../artifacts/contracts/MinimalForwarder.sol/MinimalForwarder.json"
import FridgeditionsNFTABI from "../artifacts/contracts/FridgeditionsNFT.sol/FridgeditionsNFT.json"

// Contract addresses (to be updated after deployment)
const FORWARDER_ADDRESS = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS || ""
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || ""

// RPC URL for Base network
const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"

/**
 * Get contract instances
 * @param provider Ethereum provider
 * @returns Contract instances
 */
export function getContracts(provider: ethers.providers.Provider) {
  const forwarder = new ethers.Contract(FORWARDER_ADDRESS, MinimalForwarderABI.abi, provider) as MinimalForwarder

  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, FridgeditionsNFTABI.abi, provider) as FridgeditionsNFT

  return { forwarder, nftContract }
}

/**
 * Create a new artwork
 * @param signer Ethereum signer
 * @param artistAddress Artist's Ethereum address
 * @param maxSupply Maximum supply of the token
 * @param price Price in ETH
 * @param metadataURI Metadata URI
 * @returns Transaction receipt
 */
export async function createArtwork(
  signer: ethers.Signer,
  artistAddress: string,
  maxSupply: number,
  price: string,
  metadataURI: string,
) {
  const { nftContract } = getContracts(signer.provider!)
  const connectedContract = nftContract.connect(signer)

  // Convert price from ETH to wei
  const priceInWei = ethers.utils.parseEther(price)

  const tx = await connectedContract.createArtwork(artistAddress, maxSupply, priceInWei, metadataURI)

  return await tx.wait()
}

/**
 * Mint an artwork (with payment)
 * @param signer Ethereum signer
 * @param to Recipient address
 * @param tokenId Token ID
 * @param amount Amount to mint
 * @param price Price in ETH
 * @returns Transaction receipt
 */
export async function mintArtwork(signer: ethers.Signer, to: string, tokenId: number, amount: number, price: string) {
  const { nftContract } = getContracts(signer.provider!)
  const connectedContract = nftContract.connect(signer)

  // Convert price from ETH to wei
  const priceInWei = ethers.utils.parseEther(price)
  const totalPrice = priceInWei.mul(amount)

  const tx = await connectedContract.mint(to, tokenId, amount, {
    value: totalPrice,
  })

  return await tx.wait()
}

/**
 * Prepare a gasless transaction for minting
 * @param userAddress User's Ethereum address
 * @param tokenId Token ID
 * @param amount Amount to mint
 * @returns Signed request data
 */
export async function prepareGaslessMint(userAddress: string, tokenId: number, amount: number) {
  // Create a provider for the backend
  const provider = new ethers.providers.JsonRpcProvider(BASE_RPC_URL)

  // Use the backend wallet (platform wallet)
  const platformWallet = new ethers.Wallet(process.env.PLATFORM_PRIVATE_KEY || "", provider)

  const { nftContract } = getContracts(provider)
  const connectedContract = nftContract.connect(platformWallet)

  // Create and sign the gasless transaction
  const tx = await connectedContract.mintGasless(userAddress, tokenId, amount)

  return await tx.wait()
}

/**
 * Get artwork details
 * @param provider Ethereum provider
 * @param tokenId Token ID
 * @returns Artwork details
 */
export async function getArtworkDetails(provider: ethers.providers.Provider, tokenId: number) {
  const { nftContract } = getContracts(provider)

  const [uri, maxSupply, currentSupply, price, artist] = await Promise.all([
    nftContract.uri(tokenId),
    nftContract.maxSupply(tokenId),
    nftContract.currentSupply(tokenId),
    nftContract.price(tokenId),
    nftContract.artist(tokenId),
  ])

  return {
    tokenId,
    uri,
    maxSupply: maxSupply.toNumber(),
    currentSupply: currentSupply.toNumber(),
    price: ethers.utils.formatEther(price),
    artist,
  }
}

