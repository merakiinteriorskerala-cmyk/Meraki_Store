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
    <footer className="bg-neutral-900 text-white w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 xsmall:flex-row items-start justify-between py-24 border-b border-neutral-800">
          <div className="flex flex-col gap-y-4 max-w-sm">
            <LocalizedClientLink
              href="/"
              className="text-3xl font-serif tracking-tight text-white hover:text-neutral-300 transition-colors"
            >
              Meraki Interior Factory
            </LocalizedClientLink>
            <p className="text-neutral-400 font-light text-sm leading-relaxed">
              Crafting timeless interior solutions with precision and passion. 
              We bring your vision to life through artisanal woodwork and modern design.
            </p>
          </div>
          
          <div className="flex flex-col small:flex-row gap-10 md:gap-x-24">
            <div className="flex flex-col gap-y-4">
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Company</span>
              <ul className="flex flex-col gap-y-3 text-neutral-400 font-light text-sm">
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Services
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
        
        <div className="flex w-full py-8 justify-between items-center text-neutral-500 text-xs font-light">
          <Text>
            © {new Date().getFullYear()} Meraki Interior Factory. All rights reserved.
          </Text>
          <div className="flex gap-x-4">
             {/* Add social links here if needed later */}
          </div>
        </div>
      </div>
    </footer>
  )
}
