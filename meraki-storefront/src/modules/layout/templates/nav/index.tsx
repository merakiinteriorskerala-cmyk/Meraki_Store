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
    name: "Services",
    href: "/#services",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    name: "About",
    href: "/#about",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
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
      <header className="relative mx-auto border-b border-neutral-200/60 bg-white/80 backdrop-blur-md transition-all duration-300">
        <nav className="content-container flex items-center justify-between w-full h-16 lg:h-20 text-sm font-medium">
          {/* Logo Section */}
          <div className="flex-1 flex items-center justify-start">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <Image
                src="/images/meraki-interiors-logo.png"
                alt="Meraki Interior Factory"
                width={180}
                height={50}
                className="h-10 lg:h-12 w-auto object-contain"
                priority
              />
            </LocalizedClientLink>
          </div>

          {/* Primary Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-center gap-x-1 bg-neutral-100/50 p-1 rounded-full border border-neutral-200/50 backdrop-blur-sm">
            {primaryItems.map((item) => (
              <ActiveLink
                key={item.name}
                href={item.href}
                className="h-9 px-4 inline-flex items-center gap-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-white hover:shadow-sm transition-all duration-200"
                activeClassName="!bg-white !text-neutral-900 shadow-sm border border-neutral-200/50"
                data-testid={`nav-${item.name.toLowerCase()}-link`}
              >
                {item.icon}
                <span>{item.name}</span>
              </ActiveLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex-1 flex items-center justify-end gap-x-3">
            <div className="hidden lg:flex items-center gap-x-3">
              {commerceItems.map((item) => (
                <ActiveLink
                  key={item.name}
                  className={
                    item.name === "Store"
                      ? "h-9 px-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                      : "h-9 px-4 inline-flex items-center gap-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
                  }
                  href={item.href}
                  activeClassName={
                    item.name === "Store"
                      ? "!bg-neutral-800 ring-2 ring-neutral-900 ring-offset-2"
                      : "!bg-neutral-100 !text-neutral-900"
                  }
                  data-testid={`nav-${item.name.toLowerCase()}-link`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </ActiveLink>
              ))}
            </div>

            {/* Cart Button */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="group h-9 w-9 lg:w-auto lg:px-4 inline-flex items-center justify-center gap-2 rounded-full hover:bg-neutral-100 transition-all duration-200 border border-transparent hover:border-neutral-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <div className="relative">
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
                      className="text-neutral-600 group-hover:text-neutral-900"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white ring-2 ring-white">
                      0
                    </span>
                  </div>
                  <span className="hidden lg:block font-medium text-neutral-600 group-hover:text-neutral-900">
                    Cart
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
