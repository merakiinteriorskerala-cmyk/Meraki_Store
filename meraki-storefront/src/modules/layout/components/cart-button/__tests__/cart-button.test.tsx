import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockRetrieveCart, mockCartDropdown } = vi.hoisted(() => ({
  mockRetrieveCart: vi.fn(),
  mockCartDropdown: vi.fn(),
}))

vi.mock("@lib/data/cart", () => ({
  retrieveCart: (...args: any[]) => mockRetrieveCart(...args),
}))

vi.mock("../../cart-dropdown", () => ({
  default: (props: any) => {
    mockCartDropdown(props)
    return <div data-testid="cart-dropdown" />
  },
}))

import CartButton from "../index"

describe("CartButton", () => {
  beforeEach(() => {
    mockRetrieveCart.mockReset()
    mockCartDropdown.mockReset()
  })

  it("renders cart dropdown with retrieved cart", async () => {
    const cart = { id: "cart_1" }
    mockRetrieveCart.mockResolvedValue(cart)

    const ui = await CartButton()
    render(<>{ui}</>)

    expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument()
    expect(mockCartDropdown).toHaveBeenCalledWith({ cart })
  })

  it("renders cart dropdown with null when retrieveCart fails", async () => {
    mockRetrieveCart.mockRejectedValue(new Error("fail"))

    const ui = await CartButton()
    render(<>{ui}</>)

    expect(screen.getByTestId("cart-dropdown")).toBeInTheDocument()
    expect(mockCartDropdown).toHaveBeenCalledWith({ cart: null })
  })
})