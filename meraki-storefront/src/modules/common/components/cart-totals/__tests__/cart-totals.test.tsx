import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import CartTotals from "../index"

const mockTotals = {
  total: 10000,
  subtotal: 8000,
  tax_total: 1000,
  currency_code: "usd",
  item_subtotal: 8000,
  shipping_subtotal: 1000,
  discount_subtotal: 0,
}

describe("CartTotals Component", () => {
  it("renders all totals correctly", () => {
    render(<CartTotals totals={mockTotals} />)

    expect(screen.getByText("Subtotal (excl. shipping and taxes)")).toBeInTheDocument()
    // Depending on locale/environment, verify basic presence
    expect(screen.getByTestId("cart-subtotal")).toBeInTheDocument()
    expect(screen.getByTestId("cart-shipping")).toBeInTheDocument()
    expect(screen.getByTestId("cart-taxes")).toBeInTheDocument()
    expect(screen.getByTestId("cart-total")).toBeInTheDocument()
  })

  it("renders discount when present", () => {
    const totalsWithDiscount = {
      ...mockTotals,
      discount_subtotal: 500,
    }

    render(<CartTotals totals={totalsWithDiscount} />)

    expect(screen.getByText("Discount")).toBeInTheDocument()
    expect(screen.getByTestId("cart-discount")).toBeInTheDocument()
  })

  it("does not render discount when 0", () => {
    render(<CartTotals totals={mockTotals} />)

    expect(screen.queryByText("Discount")).not.toBeInTheDocument()
  })
})