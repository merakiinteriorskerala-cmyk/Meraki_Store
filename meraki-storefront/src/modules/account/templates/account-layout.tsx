import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 min-h-screen bg-neutral-50 relative" data-testid="account-page">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="flex-1 content-container h-full max-w-7xl mx-auto flex flex-col pt-12">
        <div className="grid grid-cols-1 small:grid-cols-[260px_1fr] gap-x-12 py-12">
          <div className="hidden small:block sticky top-24 self-start">
            {customer && <AccountNav customer={customer} />}
          </div>
          <div className="small:hidden mb-8">
            {customer && <AccountNav customer={customer} />}
          </div>
          <div className="flex-1 bg-white/60 backdrop-blur-md border border-neutral-200 rounded-3xl p-8 shadow-sm">
            {children}
          </div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between border-t border-neutral-200 py-12 gap-8">
          <div>
            <h3 className="text-xl font-bold font-sans text-neutral-900 mb-4">Got questions?</h3>
            <span className="text-neutral-600">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
