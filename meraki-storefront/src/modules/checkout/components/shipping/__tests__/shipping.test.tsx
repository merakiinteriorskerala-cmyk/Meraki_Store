import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/us/checkout",
  useSearchParams: () => new URLSearchParams("step=delivery"),
}))

const setShippingMethodMock = vi.fn(() => Promise.resolve())

vi.mock("@lib/data/cart", () => ({
  setShippingMethod: (...args: any[]) => setShippingMethodMock(...args),
}))

vi.mock("@lib/data/fulfillment", () => ({
  calculatePriceForShippingOption: vi.fn(),
}))

import Shipping from "../index"

const baseCart: any = {
  id: "cart_1",
  currency_code: "usd",
  shipping_methods: [],
}

const shippingOption: any = {
  id: "so_1",
  name: "Standard",
  price_type: "flat",
  amount: 500,
  service_zone: {
    fulfillment_set: {
      type: "shipping",
    },
  },
}

beforeEach(() => {
  pushMock.mockReset()
  setShippingMethodMock.mockClear()
  vi.spyOn(console, "log").mockImplementation(() => {})
})

describe("Checkout Shipping", () => {
  it("disables Continue to payment when cart has no shipping_methods", () => {
    render(
      <Shipping cart={baseCart} availableShippingMethods={[shippingOption]} />
    )

    const btn = screen.getByTestId("submit-delivery-option-button")
    expect(btn).toBeDisabled()
  })

  it("enables Continue to payment when cart already has a shipping method", () => {
    const cartWithMethod: any = {
      ...baseCart,
      shipping_methods: [
        { name: "Standard", amount: 500, shipping_option_id: "so_1" },
      ],
    }

    render(
      <Shipping
        cart={cartWithMethod}
        availableShippingMethods={[shippingOption]}
      />
    )

    const btn = screen.getByTestId("submit-delivery-option-button")
    expect(btn).toBeEnabled()
  })

  it("calls setShippingMethod when selecting a shipping option", async () => {
    const user = userEvent.setup()

    render(
      <Shipping cart={baseCart} availableShippingMethods={[shippingOption]} />
    )

    await user.click(screen.getByText("Standard"))

    expect(setShippingMethodMock).toHaveBeenCalledWith({
      cartId: "cart_1",
      shippingMethodId: "so_1",
    })
  })

  it("navigates to payment step when Continue to payment is clicked (when enabled)", async () => {
    const user = userEvent.setup()

    const cartWithMethod: any = {
      ...baseCart,
      shipping_methods: [
        { name: "Standard", amount: 500, shipping_option_id: "so_1" },
      ],
    }

    render(
      <Shipping
        cart={cartWithMethod}
        availableShippingMethods={[shippingOption]}
      />
    )

    await user.click(screen.getByTestId("submit-delivery-option-button"))
    expect(pushMock).toHaveBeenCalledWith("/us/checkout?step=payment", {
      scroll: false,
    })
  })
})