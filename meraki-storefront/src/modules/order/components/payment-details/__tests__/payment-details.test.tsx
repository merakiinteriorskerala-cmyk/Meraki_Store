import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@lib/constants", () => ({
  isStripeLike: (id: string) => id === "stripe",
  paymentInfoMap: {
    stripe: { title: "Stripe", icon: <span data-testid="stripe-icon" /> },
    manual: { title: "Manual", icon: <span data-testid="manual-icon" /> },
  },
}))

vi.mock("@lib/util/money", () => ({
  convertToLocale: () => "$10.00",
}))

vi.mock("@modules/common/components/divider", () => ({
  default: () => <div data-testid="divider" />,
}))

vi.mock("@medusajs/ui", () => ({
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

import PaymentDetails from "../index"

describe("PaymentDetails", () => {
  it("renders stripe-like payment with card last4", () => {
    const order: any = {
      currency_code: "usd",
      payment_collections: [
        {
          payments: [
            {
              provider_id: "stripe",
              amount: 1000,
              data: { card_last4: "4242" },
              created_at: "2024-01-01T00:00:00.000Z",
            },
          ],
        },
      ],
    }

    render(<PaymentDetails order={order} />)

    expect(screen.getByTestId("payment-method")).toHaveTextContent("Stripe")
    expect(screen.getByTestId("payment-amount")).toHaveTextContent(
      "**** **** **** 4242"
    )
  })

  it("renders non-stripe payment with amount and timestamp", () => {
    const order: any = {
      currency_code: "usd",
      payment_collections: [
        {
          payments: [
            {
              provider_id: "manual",
              amount: 1000,
              created_at: "2024-01-01T00:00:00.000Z",
            },
          ],
        },
      ],
    }

    render(<PaymentDetails order={order} />)

    expect(screen.getByTestId("payment-method")).toHaveTextContent("Manual")
    expect(screen.getByTestId("payment-amount").textContent).toContain(
      "$10.00 paid at"
    )
  })
})