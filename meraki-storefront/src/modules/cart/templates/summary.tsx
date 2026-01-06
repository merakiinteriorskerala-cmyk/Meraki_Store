"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-6 sticky top-24 bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <Heading level="h2" className="text-2xl font-serif font-medium text-neutral-900">
        Order Summary
      </Heading>
      <DiscountCode cart={cart} />
      <div className="h-px bg-neutral-100 w-full" />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="w-full"
      >
        <Button className="w-full h-12 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-base font-medium">
          Proceed to Checkout
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
