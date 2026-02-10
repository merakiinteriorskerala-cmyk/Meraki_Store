import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("../items", () => ({
  default: () => <div data-testid="cart-items" />,
}))

vi.mock("../summary", () => ({
  default: () => <div data-testid="cart-summary" />,
}))

vi.mock("@modules/common/components/divider", () => ({
  default: () => <div data-testid="divider" />,
}))

vi.mock("@modules/cart/components/empty-cart-message", () => ({
  default: () => <div data-testid="empty-cart" />,
}))

vi.mock("@modules/cart/components/sign-in-prompt", () => ({
  default: () => <div data-testid="sign-in-prompt" />,
}))

import CartTemplate from "../index"

describe("CartTemplate", () => {
  it("renders items, summary, and sign-in prompt when cart has items and no customer", () => {
    const cart: any = {
      id: "cart_1",
      items: [{ id: "i1" }],
      region: { id: "reg_1" },
    }

    render(<CartTemplate cart={cart} customer={null} />)

    expect(screen.getByTestId("cart-container")).toBeInTheDocument()
    expect(screen.getByTestId("sign-in-prompt")).toBeInTheDocument()
    expect(screen.getByTestId("divider")).toBeInTheDocument()
    expect(screen.getByTestId("cart-items")).toBeInTheDocument()
    expect(screen.getByTestId("cart-summary")).toBeInTheDocument()
  })

  it("renders empty cart message when no items", () => {
    const cart: any = { id: "cart_1", items: [] }

    render(<CartTemplate cart={cart} customer={null} />)

    expect(screen.getByTestId("empty-cart")).toBeInTheDocument()
  })
})