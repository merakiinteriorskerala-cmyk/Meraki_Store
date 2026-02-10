import { Metadata } from "next"
import Image from "next/image"
import { Suspense } from "react"
import { getBaseURL } from "@lib/util/env"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Package from "@modules/common/icons/package"
import Refresh from "@modules/common/icons/refresh"
import User from "@modules/common/icons/user"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Services from "@modules/home/components/services"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Meraki Interior Factory - Premium Woodwork Solutions",
  description:
    "Expert woodwork solutions with precision cutting, lamination pressing, and edge banding services. Bringing excellence to every cut, press, and finish.",
  alternates: {
    canonical: "/",
  },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Meraki Interior Factory",
    url: getBaseURL(),
    logo: `${getBaseURL()}/images/meraki-interiors-logo.png`,
    sameAs: [
      "https://facebook.com/merakiwoodwork",
      "https://www.instagram.com/merakiinteriors_tcr",
      "https://linkedin.com/company/merakiwoodwork",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+917025115000",
      contactType: "customer service",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      
      {/* Detailed Services Section */}
      <Services />

      {/* Featured Collections */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="content-container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                OUR WORK
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-neutral-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-lg text-neutral-500 font-light">
                Explore our premium woodwork collections and discover the perfect pieces for your space.
              </p>
            </div>
            
            <a href="/store" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-all">
              View All Products
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          <Suspense fallback={<SkeletonProductGrid numberOfProducts={6} />}>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeaturedProducts collections={collections} region={region} />
            </ul>
          </Suspense>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-32 bg-neutral-900 text-white relative overflow-hidden">
        {/* Subtle Mesh Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-900 to-neutral-900" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="content-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
            {/* Left Column: Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                ABOUT MERAKI
              </div>
              
              <h2 className="text-4xl md:text-6xl font-sans font-bold mb-8 leading-tight tracking-tight">
                Crafting Excellence <br/>
                <span className="text-neutral-500">At Industrial Scale</span>
              </h2>
              
              <p className="text-lg text-neutral-400 leading-relaxed mb-10 font-light max-w-xl">
                We bridge the gap between design and production. By combining advanced machinery with skilled craftsmanship, we deliver factory-level precision for every interior project.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 shrink-0 group-hover:bg-neutral-700 transition-colors">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white mb-1">Precision Manufacturing</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">Automated cutting and edge banding for zero-error tolerance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                   <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center border border-white/5 shrink-0 group-hover:bg-neutral-700 transition-colors">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-white mb-1">Consistent Quality</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">Rigorous quality control processes for high-volume production.</p>
                  </div>
                </div>
              </div>

              <button className="text-sm font-medium text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                Read our full story &rarr;
              </button>
            </div>
            
            {/* Right Column: Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               {[
                 { icon: <Refresh className="w-6 h-6 text-blue-400" />, title: "Modern Tech", desc: "CNC Precision" },
                 { icon: <User className="w-6 h-6 text-purple-400" />, title: "Expert Team", desc: "Skilled Craftsmen" },
                 { icon: <Package className="w-6 h-6 text-amber-400" />, title: "Quality Materials", desc: "Premium Sourcing" },
                 { icon: <FastDelivery className="w-6 h-6 text-emerald-400" />, title: "Timely Delivery", desc: "On-Schedule" }
               ].map((stat, i) => (
                 <div key={i} className={`bg-neutral-800/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-neutral-800/60 transition-all duration-300 ${i % 2 !== 0 ? 'mt-8' : ''}`}>
                    <div className="mb-4">{stat.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{stat.title}</h3>
                    <p className="text-xs text-neutral-500">{stat.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Bottom Section: Partners */}
          <div className="border-t border-white/5 pt-12">
            <p className="text-sm text-neutral-500 mb-6 uppercase tracking-wider font-medium">Trusted by Industry Professionals</p>
            <div className="flex flex-wrap gap-3">
              {[
                "Interior Designers",
                "Carpenters",
                "Modular Kitchen Dealers",
                "Builders",
                "Furniture Makers",
              ].map((item, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-neutral-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-neutral-900 relative overflow-hidden text-white">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-900 to-neutral-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="content-container relative z-10">
           <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                GET IN TOUCH
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 text-white tracking-tight">Contact Us</h2>
              <p className="text-lg text-neutral-400 mb-8 font-light max-w-2xl mx-auto">
                Ready to start your project? Let's discuss your requirements and build something exceptional.
              </p>
           </div>

           <div className="bg-neutral-800/30 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/5 max-w-5xl mx-auto hover:border-white/10 transition-colors duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/5">
                 <div className="text-center md:text-left md:pr-8">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Visit Us</h3>
                    <p className="text-neutral-400 leading-relaxed text-sm">
                      8/244-F, Alumkunnu,<br />
                      Chottupara, Kilannur,<br />
                      Thrissur, Kerala - 680 581
                    </p>
                 </div>
                 <div className="text-center md:text-left md:px-8 pt-8 md:pt-0">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Call Us</h3>
                    <p className="text-2xl font-medium text-white tracking-tight">+91 7025115000</p>
                    <p className="text-xs text-neutral-500 mt-2">Mon-Sat, 9am - 6pm</p>
                 </div>
                 <div className="text-center md:text-left md:pl-8 pt-8 md:pt-0">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Email Us</h3>
                    <a href="mailto:merakiinteriorskerala@gmail.com" className="text-lg font-medium text-white hover:text-blue-400 transition-colors break-words">
                      merakiinteriorskerala<br/>@gmail.com
                    </a>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </>
  )
}
