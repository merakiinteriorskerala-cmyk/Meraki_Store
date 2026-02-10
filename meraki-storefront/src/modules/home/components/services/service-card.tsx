'use client'

import { useRef, useState } from 'react'
import Image from "next/image"

type ServiceProps = {
  title: string
  description: string
  features: string[]
  imageSrc?: string
}

export default function ServiceCard({ title, description, features, imageSrc }: ServiceProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col h-full rounded-xl border border-neutral-200 bg-white overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-lg"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,0,0,0.04), transparent 40%)`,
        }}
      />
      
      {/* Image Section */}
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden border-b border-neutral-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-50 flex items-center justify-center">
            <span className="text-neutral-400 text-xs font-medium tracking-wider uppercase">
              No Image
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-20">
        <h3 className="text-lg font-semibold mb-2 text-neutral-900 tracking-tight">
          {title}
        </h3>
        <p className="text-neutral-500 mb-6 text-sm leading-relaxed flex-grow">
          {description}
        </p>

        <div className="space-y-3 mb-6">
          {features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start text-sm text-neutral-600">
              <span className="mr-2 text-neutral-400 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="text-xs">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100 mt-auto">
          <span className="inline-flex items-center text-xs font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
            Learn more
            <svg className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}