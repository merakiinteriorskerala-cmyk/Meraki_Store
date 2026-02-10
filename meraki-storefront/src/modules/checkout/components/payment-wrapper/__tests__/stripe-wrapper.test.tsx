import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import React from "react"

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: any) => <div data-testid="elements">{children}</div>,
}))

import StripeWrapper from "../stripe-wrapper"

const baseSession: any = { data: { client_secret: "cs_123" }, provider_id: "pp_stripe_card" }

describe("StripeWrapper", () => {
  it("throws when stripeKey is missing", () => {
    expect(() =>
      render(
        <StripeWrapper paymentSession={baseSession} stripeKey={undefined as any} stripePromise={Promise.resolve({} as any)}>
          <div />
        </StripeWrapper>
      )
    ).toThrow("Stripe key is missing")
  })

  it("throws when stripePromise is missing", () => {
    expect(() =>
      render(
        <StripeWrapper paymentSession={baseSession} stripeKey={"pk_test"} stripePromise={null}>
          <div />
        </StripeWrapper>
      )
    ).toThrow("Stripe promise is missing")
  })

  it("throws when client_secret is missing", () => {
    const badSession: any = { data: {}, provider_id: "pp_stripe_card" }
    expect(() =>
      render(
        <StripeWrapper paymentSession={badSession} stripeKey={"pk_test"} stripePromise={Promise.resolve({} as any)}>
          <div />
        </StripeWrapper>
      )
    ).toThrow("Stripe client secret is missing")
  })

  it("renders Elements with children when valid", () => {
    const { getByTestId } = render(
      <StripeWrapper paymentSession={baseSession} stripeKey={"pk_test"} stripePromise={Promise.resolve({} as any)}>
        <div data-testid="child" />
      </StripeWrapper>
    )
    expect(getByTestId("elements")).toBeInTheDocument()
    expect(getByTestId("child")).toBeInTheDocument()
  })
})