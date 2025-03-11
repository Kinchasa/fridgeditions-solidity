import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { ArtworkCard } from "@/components/artwork-card"

// Update the artworks data at the top of the file
const artworks = [
  {
    id: 1,
    title: "Girl in Stripes",
    artist: "Olivia, 8",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/91169674_212323026709170_9045526018177105920_n.jpg-vXGy7ugCADp8ls0tWaylFL7Y1vZDDB.jpeg",
    description:
      "A contemplative sketch of a girl in a striped dress. Olivia captures emotion through simple lines and thoughtful composition.",
  },
  {
    id: 2,
    title: "Sisters on a Swing",
    artist: "Emma, 10",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swing.jpg-YMBGB27Gey3GI05VxyUlpdOIF6DDv8.jpeg",
    description:
      "Two sisters sharing a moment on a swing, capturing the joy of childhood and sibling bonds. Emma's use of color brings warmth to this scene.",
  },
  {
    id: 3,
    title: "Rainy Day Dreams",
    artist: "Sophie, 9",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rain.jpg-GGHnlY58sjANSMoNZcfcHBMl6bYTaT.jpeg",
    description:
      "A whimsical scene of a girl with an umbrella, dancing in the rain. Sophie's imagination turns a rainy day into a magical adventure.",
  },
  {
    id: 4,
    title: "Circles of Joy",
    artist: "Nola, 6",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nola.jpg-O34PRw6cXoLh0Z4QcPKDUXmNCcpY0o.jpeg",
    description:
      "Abstract exploration of circles and colors that radiates happiness. Nola's intuitive approach to art creates a sense of pure joy and freedom.",
  },
  {
    id: 5,
    title: "The Bride",
    artist: "Isabella, 11",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dress.jpg-NZlafV4ex8yjOtVXOittc7iljDJeQJ.jpeg",
    description:
      "An elegant sketch of a bride in her gown, showing Isabella's attention to detail and interest in fashion design. The flowing lines capture movement beautifully.",
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section - Updated with new GIF and playful title */}
      <section className="relative py-16 md:py-20">
        <div className="container flex flex-col items-center text-center">
          <div className="w-full max-w-2xl mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fridgedition-magic-2t9ofmgjYpd26avQtVpWn2cRfwk0rR.gif"
              alt="Fridgeditions"
              width={800}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Playful title added below the GIF */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wide mb-6 text-primary font-dynapuff"
            style={{
              letterSpacing: "0.05em",
              textShadow: "0 2px 2px rgba(0,0,0,0.15), 0 -1px 1px rgba(255,255,255,0.5)",
            }}
          >
            Fridgeditions
          </h1>

          <p className="mt-2 text-xl text-muted-foreground max-w-2xl">Children's Art the World Can Enjoy</p>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl">
            Immortalize your child's masterpieces on-chain, ensuring their creativity lasts beyond the fleeting years of
            childhood. Plus, it's nice having art in your pocket.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/mint">Add Art</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Gallery Section */}
      <section className="py-12 bg-muted/30 dark:bg-muted/10">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Recent
              </Button>
              <Button variant="outline" size="sm">
                Featured
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                id={artwork.id}
                title={artwork.title}
                artist={artwork.artist}
                image={artwork.image}
                description={artwork.description}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline">Load More Masterpieces</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Fridgeditions?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-medium mb-3">No Cost to Create</h3>
              <p className="text-muted-foreground">
                Fridgeditions sponsors "minting" on-chain as it's built on an affordable Ethereum Layer-2 called BASE
                making transaction costs low enough for us to bear on our end.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-medium mb-3">Digital Durability</h3>
              <p className="text-muted-foreground">
                Artwork is securely storied on the InterPlanetary File System (IPFS) as well as Arweave's Permaweb
                storage for true digital longevity through their endowment model.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-medium mb-3">It Supports Kids!</h3>
              <p className="text-muted-foreground">
                Fridgeditions is a labor of love. We take no royalties from sales. We are seeking a modest grant in the
                web3 community to offset hosting and sponsored minting costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card/50 dark:bg-card/20 border-y">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">From Fridge to Forever</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Doodle. Mint. Immortalize. No Magnets Required!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/mint">Add Art Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span
              className="font-medium font-dynapuff"
              style={{
                textShadow: "0 1px 1px rgba(0,0,0,0.15), 0 -1px 1px rgba(255,255,255,0.3)",
              }}
            >
              Fridgeditions
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Gallery
            </Link>
            <Link href="/mint" className="hover:text-foreground">
              Add Art
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fridgeditions
          </div>
        </div>
      </footer>
    </div>
  )
}

