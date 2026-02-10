"use client"

import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useState } from "react"

const Hero = () => {
  const videos = ["/videos/intro_video_1.mp4", "/videos/intro_video_2.mp4"]
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
  }

  return (
    <div className="h-[95vh] w-full relative bg-neutral-900 flex flex-col overflow-hidden">
      {/* Background Video with refined overlay */}
      <div className="absolute inset-0 z-0">
        <video
          key={videos[currentVideoIndex]}
          className="w-full h-full object-cover object-center opacity-40 scale-105"
          autoPlay
          muted
          playsInline
          loop
          poster="/images/meraki-front.avif"
          preload="metadata"
          onEnded={handleVideoEnded}
          aria-label="Meraki Woodwork manufacturing process video"
        >
          <source src={videos[currentVideoIndex]} type="video/mp4" />
        </video>
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-neutral-900/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-6 h-full text-white max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            PREMIUM WOODWORK SOLUTIONS
          </div>

          <Heading
            level="h1"
            className="text-5xl md:text-7xl lg:text-8xl leading-tight font-sans font-bold tracking-tight mb-8 text-white"
          >
            Crafting Excellence <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              In Every Detail
            </span>
          </Heading>

          <Heading
            level="h2"
            className="text-lg md:text-xl leading-relaxed text-neutral-300 max-w-2xl mx-auto font-light mb-12"
          >
            Precision manufacturing for interior professionals. 
            We partner with designers and builders to deliver factory-level consistency at scale.
          </Heading>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/store">
              <Button className="bg-white text-black hover:bg-neutral-200 border-none h-12 px-8 rounded-full font-medium text-base transition-all transform hover:-translate-y-1">
                Explore Store
              </Button>
            </a>
            <a href="/#services">
              <Button variant="transparent" className="text-white border border-white/20 hover:bg-white/10 h-12 px-8 rounded-full font-medium text-base backdrop-blur-sm transition-all">
                View Services
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </div>
  )
}

export default Hero
