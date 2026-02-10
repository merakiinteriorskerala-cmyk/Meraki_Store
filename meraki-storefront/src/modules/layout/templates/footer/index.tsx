import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-neutral-900 text-white w-full relative overflow-hidden border-t border-white/5">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-900 to-neutral-900 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="content-container flex flex-col w-full relative z-10">
        <div className="flex flex-col gap-y-12 xsmall:flex-row items-start justify-between py-24 border-b border-white/5">
          <div className="flex flex-col gap-y-6 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="font-sans font-bold text-lg">M</span>
              </div>
              <LocalizedClientLink
                href="/"
                className="text-xl font-sans font-bold tracking-tight text-white hover:text-neutral-300 transition-colors"
              >
                Meraki Interior Factory
              </LocalizedClientLink>
            </div>
            <p className="text-neutral-400 font-light text-sm leading-relaxed">
              Precision manufacturing for interior professionals. 
              We combine advanced technology with artisanal craftsmanship to bring your vision to life.
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Operational
              </div>
            </div>
          </div>
          
          <div className="flex flex-col small:flex-row gap-10 md:gap-x-24">
            <div className="flex flex-col gap-y-4">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Company</span>
              <ul className="flex flex-col gap-y-3 text-neutral-400 font-light text-sm">
                <li>
                  <LocalizedClientLink
                    href="/#about"
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    About Us
                    <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/#services"
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    Services
                    <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                  Categories
                </span>
                <ul className="flex flex-col gap-y-3 text-neutral-400 font-light text-sm">
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return null
                    }
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="hover:text-white transition-colors"
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                  Collections
                </span>
                <ul className="flex flex-col gap-y-3 text-neutral-400 font-light text-sm">
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-white transition-colors"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex w-full py-8 justify-between items-center text-neutral-500 text-xs font-light border-t border-white/5">
          <Text>
            © {new Date().getFullYear()} Meraki Interior Factory. All rights reserved.
          </Text>
          <div className="flex gap-x-6">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
