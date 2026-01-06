import { Suspense } from "react"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ActiveLink from "@modules/common/components/active-link"
import CartButton from "@modules/layout/components/cart-button"

const primaryItems = [
  {
    name: "Home",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "About",
    href: "/about",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
  },
  {
    name: "Services",
    href: "/services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
]

const commerceItems = [
  {
    name: "Store",
    href: "/store",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
  {
    name: "Account",
    href: "/account",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b border-ui-border-base bg-white/70 backdrop-blur-xl duration-200">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-20 text-small-regular">
          <div className="flex-1 flex items-center justify-start">
            <LocalizedClientLink
              href="/"
              className="hover:text-ui-fg-base uppercase tracking-wide"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/meraki-interiors-logo.png"
                alt="Meraki Interior Factory"
                width={200}
                height={55}
                className="h-14 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          <div className="hidden small:flex flex-1 items-center justify-center gap-x-2">
            {primaryItems.map((item) => (
              <ActiveLink
                key={item.name}
                href={item.href}
                className="h-10 px-5 inline-flex items-center gap-2 rounded-full text-base font-medium text-ui-fg-subtle hover:text-ui-fg-base transition-all duration-200"
                activeClassName="!bg-neutral-900 !text-white shadow-md"
                data-testid={`nav-${item.name.toLowerCase()}-link`}
              >
                {item.icon}
                <span className="tracking-wide">{item.name}</span>
              </ActiveLink>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end gap-x-4">
            <div className="hidden small:flex items-center gap-x-4">
              {commerceItems.map((item) => (
                <ActiveLink
                  key={item.name}
                  className={
                    item.name === "Store"
                      ? "group h-10 px-6 inline-flex items-center gap-2 rounded-full text-base font-medium border border-neutral-900/10 bg-white text-neutral-900 hover:border-neutral-900/20 hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300"
                      : "h-10 px-5 inline-flex items-center gap-2 rounded-full text-base font-medium text-ui-fg-subtle hover:text-ui-fg-base transition-all duration-200"
                  }
                  href={item.href}
                  activeClassName={
                    item.name === "Store"
                      ? "!bg-neutral-900 !text-white !border-neutral-900 shadow-lg hover:shadow-xl"
                      : "!bg-neutral-900 !text-white shadow-md"
                  }
                  data-testid={`nav-${item.name.toLowerCase()}-link`}
                >
                  {item.icon}
                  <span className={
                    item.name === "Store"
                      ? "tracking-wide font-medium"
                      : "tracking-wide"
                  }>
                    {item.name}
                  </span>
                </ActiveLink>
              ))}
            </div>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="group h-10 px-4 inline-flex items-center gap-2 rounded-full hover:bg-ui-bg-subtle hover:text-ui-fg-base transition-all duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ui-fg-subtle group-hover:text-ui-fg-base transition-colors"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span className="font-medium text-ui-fg-subtle group-hover:text-ui-fg-base">
                    Cart
                  </span>
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white shadow-sm">
                    0
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>

        <div className="small:hidden border-t border-ui-border-base bg-transparent">
          <div className="content-container py-2">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[...primaryItems, ...commerceItems].map((item) => (
                <ActiveLink
                  key={item.name}
                  href={item.href}
                  className="shrink-0 h-9 px-4 inline-flex items-center rounded-full bg-ui-bg-subtle text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-field-hover transition-colors"
                  activeClassName="!bg-neutral-900 !text-white"
                  data-testid={`nav-mobile-${item.name.toLowerCase()}-link`}
                >
                  <span className="uppercase tracking-widest">{item.name}</span>
                </ActiveLink>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
