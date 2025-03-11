import { type NextRequest, NextResponse } from "next/server"
import { prepareArtworkMetadata } from "@/lib/storage-service"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Get form data
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const description = formData.get("description") as string
    const ageStr = formData.get("age") as string

    // Validate inputs
    if (!file || !title || !artist) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Parse age if provided
    const age = ageStr ? Number.parseInt(ageStr, 10) : undefined

    // Process the upload
    const metadataUri = await prepareArtworkMetadata(file, title, artist, description, age)

    return NextResponse.json({
      success: true,
      metadataUri,
    })
  } catch (error: any) {
    console.error("Error processing upload:", error)

    return NextResponse.json({ error: error.message || "Failed to process upload request" }, { status: 500 })
  }
}

