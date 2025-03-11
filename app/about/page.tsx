import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl font-bold">About Fridgeditions</h1>
              <p className="mt-4 text-xl text-muted-foreground">The Story Behind Our Mission</p>
            </div>

            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">Why it Matters</h2>
              <p>
                Art is ephemeral. Paper fades, crayon marks blur, and refrigerator doors get too cluttered.
                Fridgeditions exists to pluck the Picassos of the future into the present, preserving childhood
                creativity forever on-chain.
              </p>

              <p>
                The idea was born from Kinchasa, the founder of Fridgeditions, inspired by something his Aunt Suzy once
                told him:
              </p>

              <blockquote>"Art Can Save the World.."</blockquote>

              <p>Kin believed her then and knows it now.</p>

              <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">The Mission</h2>
              <ul>
                <li>Empower young artists by cementing their work in digital permanence.</li>
                <li>Build confidence by celebrating their creativity in a global gallery.</li>
                <li>Preserve art forever, ensuring childhood expressions never fade.</li>
                <li>
                  Encourage lifelong play, reminding everyone to never grow up, but always be honest about their age.
                </li>
              </ul>

              <p>
                For those under 13, we encourage participation with the help of an adult. Everyone deserves to create with joy and intention.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">How It Works</h2>
              <p>
                Fridgeditions is built on the Base network, an "L2" or layer-2 blockchain solution that enables
                <strong> No Cost Sponsored Minting</strong> with gas fees covered by Fridgeditions, while allowing
                collectors to upgrade their individual edition to Ethereum Mainnet for true permanence and greater visibility.
              </p>

              <p>
                Each artwork is securely stored via IPFS and Arweave's Permaweb for longevity, ensuring that these childhood treasures will be preserved for generations to come.
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4">The Fridge is the Frame</h2>
              <p>
                The design language of Fridgeditions is no frills as fridges serve as playful digital frames. The platform isn't about making money it's about tapping into the artworld at any age, making sharing and enjoying art more accessible.
              </p>

              <p>
                Fridgeditions is for the young and the young at heart. A place where every doodle, finger-painted piece, and every macaroni collage can find its eternal home. Because art isn't just for the fridge anymore—it's for the world.
              </p>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/mint">Add Art Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="font-medium">Fridgeditions</span>
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

