import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-12 min-h-[calc(100vh-64px)] bg-neutral-50/50 relative">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full relative z-10">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-3xl h-full bg-white w-full py-12 px-8 md:px-12 rounded-3xl border border-neutral-200 shadow-sm"
          data-testid="order-complete-container"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <Heading
              level="h1"
              className="text-3xl md:text-4xl font-sans font-bold text-neutral-900 tracking-tight mb-2"
            >
              Order Confirmed
            </Heading>
            <p className="text-neutral-500 text-lg">
              Thank you for your purchase. Your order was placed successfully.
            </p>
          </div>

          <OrderDetails order={order} />
          
          <div className="border-t border-neutral-100 mt-8 pt-8">
            <Heading level="h2" className="text-xl font-sans font-bold text-neutral-900 mb-6">
              Order Summary
            </Heading>
            <Items order={order} />
            <CartTotals totals={order} />
          </div>

          <div className="border-t border-neutral-100 mt-8 pt-8">
            <ShippingDetails order={order} />
            <PaymentDetails order={order} />
          </div>

          <div className="border-t border-neutral-100 mt-8 pt-8">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
