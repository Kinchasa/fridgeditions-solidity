import axios from "axios"
import { NFTStorage } from "nft.storage"

// NFT.Storage client (handles IPFS)
const nftStorageClient = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY || "" })

// Arweave bundling service
const arweaveEndpoint = "https://arweave-bundle-service.vercel.app/api/bundle"

/**
 * Uploads an image to IPFS via NFT.Storage
 * @param file The file to upload
 * @returns IPFS CID
 */
export async function uploadImageToIPFS(file: File): Promise<string> {
  try {
    const blob = new Blob([file], { type: file.type })
    const cid = await nftStorageClient.storeBlob(blob)
    return `ipfs://${cid}`
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    throw new Error("Failed to upload image to IPFS")
  }
}

/**
 * Creates and uploads metadata to IPFS
 * @param metadata The metadata to upload
 * @returns IPFS CID
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" })
    const cid = await nftStorageClient.storeBlob(blob)
    return `ipfs://${cid}`
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error)
    throw new Error("Failed to upload metadata to IPFS")
  }
}

/**
 * Pins an IPFS CID to Arweave for permanent storage
 * @param cid IPFS CID to pin
 * @returns Arweave transaction ID
 */
export async function pinToArweave(cid: string): Promise<string> {
  try {
    const response = await axios.post(arweaveEndpoint, { cid })
    return response.data.transactionId
  } catch (error) {
    console.error("Error pinning to Arweave:", error)
    throw new Error("Failed to pin to Arweave")
  }
}

/**
 * Prepares artwork metadata and uploads to IPFS and Arweave
 * @param file Image file
 * @param title Artwork title
 * @param artist Artist name
 * @param description Artwork description
 * @param age Artist age
 * @returns Metadata URI
 */
export async function prepareArtworkMetadata(
  file: File,
  title: string,
  artist: string,
  description: string,
  age?: number,
): Promise<string> {
  // Upload image to IPFS
  const imageCid = await uploadImageToIPFS(file)

  // Create metadata
  const metadata = {
    name: title,
    description,
    image: imageCid,
    attributes: [
      {
        trait_type: "Artist",
        value: artist,
      },
      {
        trait_type: "Platform",
        value: "Fridgeditions",
      },
    ],
  }

  // Add age if provided
  if (age) {
    metadata.attributes.push({
      trait_type: "Age",
      value: age,
    })
  }

  // Upload metadata to IPFS
  const metadataCid = await uploadMetadataToIPFS(metadata)

  // Pin to Arweave for permanence
  await pinToArweave(metadataCid.replace("ipfs://", ""))

  return metadataCid
}

