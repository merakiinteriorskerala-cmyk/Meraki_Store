import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-neutral-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-neutral-300 flex flex-col">
        <Divider className="my-6 small:hidden border-neutral-100" />
        <Heading
          level="h2"
          className="flex flex-row text-xl font-sans font-bold text-neutral-900 items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-6 border-neutral-100" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
