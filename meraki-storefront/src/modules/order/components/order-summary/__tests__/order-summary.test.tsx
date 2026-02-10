import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import OrderSummary from "../index"

const mockOrder: any = {
  id: "order_1",
  currency_code: "usd",
  subtotal: 10000,
  shipping_total: 1000,
  tax_total: 500,
  discount_total: 0,
  gift_card_total: 0,
  total: 11500,
}

describe("OrderSummary Component", () => {
  it("renders order totals correctly", () => {
    render(<OrderSummary order={mockOrder} />)

    expect(screen.getByText("Order Summary")).toBeInTheDocument()
    expect(screen.getByText("Subtotal")).toBeInTheDocument()
    expect(screen.getByText("Shipping")).toBeInTheDocument()
    expect(screen.getByText("Taxes")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()

    // Verify amounts (assuming en-US locale defaults for USD)
    // $100.00 -> 10,000 if not divided. 
    // Wait, let's remember `convertToLocale` does NOT divide. 
    // So 10000 -> $10,000.00.
    // I will expect formatted strings.
    expect(screen.getByText("$10,000.00")).toBeInTheDocument()
    expect(screen.getByText("$1,000.00")).toBeInTheDocument()
    expect(screen.getByText("$500.00")).toBeInTheDocument()
    expect(screen.getByText("$11,500.00")).toBeInTheDocument()
  })

  it("renders discount when present", () => {
    const orderWithDiscount = {
      ...mockOrder,
      discount_total: 2000,
      total: 9500,
    }

    render(<OrderSummary order={orderWithDiscount} />)

    // There might be multiple "Discount" labels if gift cards are also present?
    // Code: 
    // {order.discount_total > 0 && ( ... <span>Discount</span> ... )}
    // {order.gift_card_total > 0 && ( ... <span>Discount</span> ... )}
    // Both use the label "Discount".
    
    expect(screen.getByText("Discount")).toBeInTheDocument()
    expect(screen.getByText("- $2,000.00")).toBeInTheDocument()
  })

  it("renders gift card when present", () => {
    const orderWithGiftCard = {
      ...mockOrder,
      gift_card_total: 5000,
      total: 6500,
    }

    render(<OrderSummary order={orderWithGiftCard} />)

    expect(screen.getByText("Discount")).toBeInTheDocument() // Gift card also labelled Discount in code
    expect(screen.getByText("- $5,000.00")).toBeInTheDocument()
  })
})