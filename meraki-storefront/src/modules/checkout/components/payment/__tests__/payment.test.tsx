import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/us/checkout",
  useSearchParams: () => new URLSearchParams("step=payment"),
}))

const initiatePaymentSessionMock = vi.fn(() => Promise.resolve())

vi.mock("@lib/data/cart", () => ({
  initiatePaymentSession: (...args: any[]) => initiatePaymentSessionMock(...args),
}))

import Payment from "../index"

const baseCart: any = {
  id: "cart_1",
  total: 1000,
  gift_cards: [],
  shipping_methods: [{ name: "Shipping", amount: 0 }],
  payment_collection: {
    payment_sessions: [],
  },
}

const manualProvider: any = { id: "pp_system_default" }

beforeEach(() => {
  pushMock.mockReset()
  initiatePaymentSessionMock.mockClear()
})

describe("Checkout Payment", () => {
  it("disables Continue to review when no payment method is selected", () => {
    render(<Payment cart={baseCart} availablePaymentMethods={[manualProvider]} />)

    const btn = screen.getByTestId("submit-payment-button")
    expect(btn).toBeDisabled()
  })

  it("enables Continue to review after selecting manual payment", async () => {
    const user = userEvent.setup()

    render(<Payment cart={baseCart} availablePaymentMethods={[manualProvider]} />)

    await user.click(screen.getByText("Manual Payment"))

    const btn = screen.getByTestId("submit-payment-button")
    expect(btn).toBeEnabled()
  })

  it("initiates payment session and navigates to review for manual payment", async () => {
    const user = userEvent.setup()

    render(<Payment cart={baseCart} availablePaymentMethods={[manualProvider]} />)

    await user.click(screen.getByText("Manual Payment"))
    await user.click(screen.getByTestId("submit-payment-button"))

    expect(initiatePaymentSessionMock).toHaveBeenCalledTimes(1)
    expect(initiatePaymentSessionMock).toHaveBeenCalledWith(baseCart, {
      provider_id: "pp_system_default",
    })

    expect(pushMock).toHaveBeenCalledWith("/us/checkout?step=review", {
      scroll: false,
    })
  })

  it("does not re-initiate payment session if there is already a pending session for the selected provider", async () => {
    const user = userEvent.setup()

    const cartWithPendingSession: any = {
      ...baseCart,
      payment_collection: {
        payment_sessions: [{ status: "pending", provider_id: "pp_system_default" }],
      },
    }

    render(
      <Payment
        cart={cartWithPendingSession}
        availablePaymentMethods={[manualProvider]}
      />
    )

    expect(screen.getByTestId("submit-payment-button")).toBeEnabled()

    await user.click(screen.getByTestId("submit-payment-button"))

    expect(initiatePaymentSessionMock).not.toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith("/us/checkout?step=review", {
      scroll: false,
    })
  })
})