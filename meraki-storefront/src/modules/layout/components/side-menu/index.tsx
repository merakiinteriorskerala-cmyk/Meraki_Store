"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const primaryItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
]

const commerceItems = [
  { name: "Store", href: "/store" },
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()

  const normalizedPath = (() => {
    if (!pathname) {
      return "/"
    }

    if (countryCode && pathname.startsWith(`/${countryCode}`)) {
      const p = pathname.slice(countryCode.length + 1)
      return p === "" ? "/" : p
    }

    return pathname
  })()

  const isActive = (href: string) => {
    if (href === "/") {
      return normalizedPath === "/"
    }

    return normalizedPath === href || normalizedPath.startsWith(`${href}/`)
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="h-full flex items-center gap-x-3 px-3 -mx-3 rounded-md transition-colors duration-200 focus:outline-none hover:bg-neutral-50 hover:text-ui-fg-base"
                >
                  <span className="flex flex-col justify-center gap-1.5">
                    <span className="block h-[2px] w-5 bg-current" />
                    <span className="block h-[2px] w-5 bg-current" />
                    <span className="block h-[2px] w-5 bg-current" />
                  </span>
                  <span className="txt-compact-small-plus uppercase tracking-widest">Menu</span>
                </Popover.Button>
              </div>

              <Transition show={open} as={Fragment}>
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="fixed inset-0 z-[50] bg-black/30 backdrop-blur-sm"
                    onClick={close}
                    data-testid="side-menu-backdrop"
                  />
                </Transition.Child>

                <Transition.Child
                  as={Fragment}
                  enter="transition ease-out duration-250"
                  enterFrom="opacity-0 -translate-x-2"
                  enterTo="opacity-100 translate-x-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-x-0"
                  leaveTo="opacity-0 -translate-x-2"
                >
                  <PopoverPanel className="fixed inset-y-0 left-0 z-[51] w-[calc(100%-1rem)] max-w-[420px] m-2">
                    <div
                      data-testid="nav-menu-popup"
                      className="flex flex-col h-full rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_40px_80px_rgba(0,0,0,0.12)] bg-white text-neutral-900 backdrop-blur-xl"
                    >
                      <div className="px-8 pt-8 pb-6 border-b border-neutral-100 bg-gradient-to-b from-white to-white/95 backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-6">
                          <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">MERAKI INTERIOR FACTORY</div>
                            <div className="mt-3 font-serif text-3xl leading-none text-neutral-900 tracking-tight">Menu</div>
                            <div className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-xs">Premium woodwork solutions, crafted with precision and passion.</div>
                          </div>
                          <button
                            data-testid="close-menu-button"
                            onClick={close}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-neutral-50 transition-all duration-200 hover:scale-105"
                            aria-label="Close menu"
                          >
                            <XMark className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <LocalizedClientLink
                            href="/contact"
                            onClick={close}
                            className="flex-1 inline-flex items-center justify-center rounded-full bg-neutral-900 text-white h-12 text-sm font-medium hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                          >
                            Get a Quote
                          </LocalizedClientLink>
                          <LocalizedClientLink
                            href="/#services"
                            onClick={close}
                            className="flex-1 inline-flex items-center justify-center rounded-full border border-neutral-200 text-neutral-900 h-12 text-sm font-medium hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300 hover:-translate-y-0.5"
                          >
                            View Services
                          </LocalizedClientLink>
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto px-6 py-8">
                        <div className="px-2">
                          <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium mb-5">EXPLORE</div>
                          <ul className="flex flex-col">
                            {primaryItems.map((item) => (
                              <li key={item.name}>
                                <LocalizedClientLink
                                  href={item.href}
                                  onClick={close}
                                  data-testid={`${item.name.toLowerCase()}-link`}
                                  className={clx(
                                    "group flex items-center justify-between w-full px-5 py-4 rounded-xl transition-all duration-300",
                                    isActive(item.href)
                                      ? "bg-neutral-900 text-white shadow-md"
                                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-sm"
                                  )}
                                >
                                  <span className="font-serif text-xl leading-snug">{item.name}</span>
                                  <ArrowRightMini
                                    className={clx(
                                      "transition-all duration-200",
                                      isActive(item.href)
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                    )}
                                  />
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-10 px-2">
                          <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium mb-5">SHOP</div>
                          <ul className="flex flex-col">
                            {commerceItems.map((item) => (
                              <li key={item.name}>
                                <LocalizedClientLink
                                  href={item.href}
                                  onClick={close}
                                  data-testid={`${item.name.toLowerCase()}-link`}
                                  className={clx(
                                    "group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors",
                                    isActive(item.href)
                                      ? "bg-neutral-900 text-white"
                                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                                  )}
                                >
                                  <span className="text-base font-medium">{item.name}</span>
                                  <ArrowRightMini
                                    className={clx(
                                      "transition-all duration-200",
                                      isActive(item.href)
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                                    )}
                                  />
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-12 px-2">
                          <div className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium mb-5">PREFERENCES</div>
                          <div className="flex flex-col gap-y-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5 backdrop-blur-sm">
                            {!!locales?.length && (
                              <div
                                className="flex justify-between items-center"
                                onMouseEnter={languageToggleState.open}
                                onMouseLeave={languageToggleState.close}
                              >
                                <LanguageSelect
                                  toggleState={languageToggleState}
                                  locales={locales}
                                  currentLocale={currentLocale}
                                />
                                <ArrowRightMini
                                  className={clx(
                                    "transition-transform duration-150",
                                    languageToggleState.state ? "-rotate-90" : ""
                                  )}
                                />
                              </div>
                            )}
                            <div
                              className="flex justify-between items-center"
                              onMouseEnter={countryToggleState.open}
                              onMouseLeave={countryToggleState.close}
                            >
                              {regions && (
                                <CountrySelect
                                  toggleState={countryToggleState}
                                  regions={regions}
                                />
                              )}
                              <ArrowRightMini
                                className={clx(
                                  "transition-transform duration-150",
                                  countryToggleState.state ? "-rotate-90" : ""
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="px-8 py-6 border-t border-neutral-100 bg-white/50">
                        <Text className="text-sm text-neutral-400 tracking-wide">
                          © {new Date().getFullYear()} Meraki Interior Factory. All rights reserved.
                        </Text>
                      </div>
                    </div>
                  </PopoverPanel>
                </Transition.Child>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
