import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("../stripe-wrapper", () => ({
  default: ({ children, paymentSession, stripeKey, stripePromise }: any) => (
    <div
      data-testid="stripe-wrapper"
      data-provider={paymentSession?.provider_id}
      data-key={stripeKey}
      data-has-promise={String(!!stripePromise)}
    >
      {children}
    </div>
  ),
}))

vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(() => Promise.resolve({} as any)),
}))

vi.mock("@lib/constants", () => ({
  isStripeLike: (pid?: string) => pid?.startsWith("pp_stripe") || pid?.startsWith("pp_medusa-"),
}))

describe("PaymentWrapper", () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.NEXT_PUBLIC_STRIPE_KEY = "pk_test_123"
    process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY = ""
    process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID = ""
  })

  const baseCart: any = {
    payment_collection: {
      payment_sessions: [
        { status: "pending", provider_id: "pp_stripe_card", data: { client_secret: "cs_123" } },
      ],
    },
  }

  it("wraps children in StripeWrapper when stripe-like and key present", async () => {
    const PaymentWrapper = (await import("../index")).default
    render(
      <PaymentWrapper cart={baseCart}>
        <div data-testid="child" />
      </PaymentWrapper>
    )
    expect(screen.getByTestId("stripe-wrapper")).toBeInTheDocument()
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })

  it("falls back to plain div when not stripe-like", async () => {
    const PaymentWrapper = (await import("../index")).default
    const cart = {
      payment_collection: {
        payment_sessions: [{ status: "pending", provider_id: "pp_system_default" }],
      },
    } as any
    render(
      <PaymentWrapper cart={cart}>
        <div data-testid="child" />
      </PaymentWrapper>
    )
    expect(screen.queryByTestId("stripe-wrapper")).toBeNull()
    expect(screen.getByTestId("child")).toBeInTheDocument()
  })
})