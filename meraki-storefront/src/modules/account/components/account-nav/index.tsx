"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-sm font-medium py-2 text-neutral-600"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>Account</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl font-bold font-sans mb-4 px-8">
              Hello {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul className="flex flex-col gap-y-2">
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-3 px-8 border border-neutral-200 rounded-xl bg-white"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>Profile</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 text-neutral-400" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-3 px-8 border border-neutral-200 rounded-xl bg-white"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>Addresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 text-neutral-400" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-3 px-8 border border-neutral-200 rounded-xl bg-white"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>Orders</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-neutral-400" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-3 px-8 border border-neutral-200 rounded-xl bg-white w-full text-red-500"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>Log out</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-neutral-400" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div className="flex flex-col gap-y-2">
          <div className="pb-4 mb-2 border-b border-neutral-200">
             <h3 className="text-base font-semibold text-neutral-900">Account</h3>
          </div>
          <NavLink
            href="/account"
            route={route!}
            data-testid="overview-link"
          >
            Overview
          </NavLink>
          <NavLink
            href="/account/profile"
            route={route!}
            data-testid="profile-link"
          >
            Profile
          </NavLink>
          <NavLink
            href="/account/addresses"
            route={route!}
            data-testid="addresses-link"
          >
            Addresses
          </NavLink>
          <NavLink
            href="/account/orders"
            route={route!}
            data-testid="orders-link"
          >
            Orders
          </NavLink>
          <button
            type="button"
            className="flex items-center gap-x-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition-all duration-200 mt-4 text-sm font-medium"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <ArrowRightOnRectangle />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}

type NavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const NavLink = ({ href, route, children, "data-testid": dataTestId }: NavLinkProps) => {
  const { countryCode } = useParams() as { countryCode: string }

  const active = route === `/${countryCode}${href}`
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
