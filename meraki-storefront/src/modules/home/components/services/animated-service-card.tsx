'use client'

import ServiceCard from "./service-card"

interface AnimatedServiceCardProps {
  service: {
    title: string
    description: string
    features: string[]
    imageSrc?: string
  }
  index: number
}

export default function AnimatedServiceCard({ service, index }: AnimatedServiceCardProps) {
  return (
    <div 
      className="h-full transform transition-all duration-500 ease-out animate-fade-in-up"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <ServiceCard {...service} />
    </div>
  )
}