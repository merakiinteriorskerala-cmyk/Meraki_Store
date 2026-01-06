import { Metadata } from "next"
import Image from "next/image"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Package from "@modules/common/icons/package"
import Refresh from "@modules/common/icons/refresh"
import User from "@modules/common/icons/user"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Meraki Interior Factory - Premium Woodwork Solutions",
  description:
    "Expert woodwork solutions with precision cutting, lamination pressing, and edge banding services. Bringing excellence to every cut, press, and finish.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      
      {/* Premium Services Section */}
      <section className="py-32 bg-neutral-50">
        <div className="content-container">
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-widest text-neutral-500 mb-4 block">Our Craftsmanship</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Precision in Every Detail</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
              We combine traditional woodworking expertise with modern technology to deliver exceptional results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Precision Cutting",
                desc: "State-of-the-art CNC cutting for flawless accuracy in plywood and multiwood.",
                icon: "⚡",
                imageSrc: "/images/cutting.jpg",
              },
              {
                title: "Lamination Pressing",
                desc: "Perfect surface finishes with durable, high-quality lamination for lasting beauty.",
                icon: "✨",
                imageSrc: "/images/pressing.avif",
              },
              {
                title: "Edge Banding",
                desc: "Seamless edge finishing that elevates your furniture to professional standards.",
                icon: "🔍",
                imageSrc: "/images/edge-banding-meraki.jpg",
              },
            ].map((item, i) => (
              <div key={i} className="group p-10 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100 hover:border-neutral-200">
                {item.imageSrc ? (
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 320px, 100vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ) : (
                  <div className="text-4xl mb-6 text-neutral-600 group-hover:text-neutral-900 transition-colors">{item.icon}</div>
                )}
                <h3 className="text-2xl font-serif mb-4 text-neutral-900 group-hover:text-neutral-800 transition-colors">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed group-hover:text-neutral-600 transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-neutral-900 text-white">
        <div className="content-container">
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-widest text-neutral-400 mb-4 block">Why Meraki</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Excellence in Woodwork</h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto font-light">
              We bring passion and precision to every project, ensuring your vision becomes reality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Modern Machinery",
                desc: "Cutting-edge technology for perfect results every time",
                icon: <Refresh size="22" />,
              },
              {
                title: "Expert Craftsmanship",
                desc: "Skilled artisans with years of experience",
                icon: <User size="22" />,
              },
              {
                title: "Quality Materials",
                desc: "Premium woods and finishes for lasting durability",
                icon: <Package size="22" />,
              },
              {
                title: "Timely Delivery",
                desc: "Reliable service that respects your schedule",
                icon: <FastDelivery size="22" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group text-center p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-white/80 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-32 bg-white">
        <div className="content-container">
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-widest text-neutral-500 mb-4 block">Our Work</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Featured Collections</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-light">
              Explore our premium woodwork collections and discover the perfect pieces for your space
            </p>
          </div>
          
          <div className="mb-12 flex justify-between items-center">
            <h3 className="text-2xl font-serif text-neutral-900">Latest Creations</h3>
            <a href="/store" className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium">
              View All Collections
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeaturedProducts collections={collections} region={region} />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-neutral-100">
        <div className="content-container text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-neutral-900">Ready to Start Your Project?</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-12 font-light">
            Let's discuss your woodwork needs and bring your vision to life with precision and care
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="px-12 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-lg">
              Get a Quote
            </a>
            <a href="/services" className="px-12 py-4 border-2 border-neutral-900 text-neutral-900 rounded-lg hover:bg-neutral-900 hover:text-white transition-colors font-medium text-lg">
              View Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
