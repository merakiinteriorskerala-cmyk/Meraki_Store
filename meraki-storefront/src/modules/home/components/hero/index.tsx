import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[95vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle flex flex-col">
      <div className="absolute inset-0 bg-neutral-900 z-0">
        <div className="w-full h-full opacity-30 bg-[url('/images/meraki-front.avif')] bg-cover bg-center" />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center text-center small:p-32 h-full text-white">
        <Heading
          level="h1"
          className="text-5xl md:text-7xl leading-tight font-serif tracking-tight mb-6 drop-shadow-lg"
        >
          Meraki Interior Factory
        </Heading>
        <Heading
          level="h2"
          className="text-lg md:text-2xl leading-relaxed text-gray-100 max-w-3xl mx-auto drop-shadow-md font-normal"
        >
          Precision Manufacturing Solutions for Interior Professionals. Partnering
          with designers, contractors, and manufacturers.
        </Heading>
        <div className="flex gap-4 mt-10">
            <a href="/store">
            <Button variant="secondary" className="bg-white text-black hover:bg-gray-100 border-none px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Shop Products
            </Button>
            </a>
            <a href="/services">
            <Button variant="transparent" className="text-white border border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium backdrop-blur-sm">
                Our Services
            </Button>
            </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
