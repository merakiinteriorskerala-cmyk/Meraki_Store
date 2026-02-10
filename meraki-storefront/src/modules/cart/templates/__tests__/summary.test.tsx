import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Summary from "../summary"

// Mock dependencies
vi.mock("@modules/common/components/cart-totals", () => ({
  default: () => <div data-testid="cart-totals" />,
}))

vi.mock("@modules/checkout/components/discount-code", () => ({
  default: () => <div data-testid="discount-code" />,
}))

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const baseCart: any = {
  id: "cart_1",
  email: "test@example.com",
  shipping_address: {
    address_1: "123 Test St",
  },
  shipping_methods: [{ id: "method_1" }],
  promotions: [],
}

describe("Cart Summary Template", () => {
  it("renders summary components", () => {
    render(<Summary cart={baseCart} />)

    expect(screen.getByText("Order Summary")).toBeInTheDocument()
    expect(screen.getByTestId("cart-totals")).toBeInTheDocument()
    expect(screen.getByTestId("discount-code")).toBeInTheDocument()
    expect(screen.getByTestId("checkout-button")).toBeInTheDocument()
  })

  it("links to address step when address is missing", () => {
    const cartWithoutAddress: any = {
      ...baseCart,
      shipping_address: null,
    }

    render(<Summary cart={cartWithoutAddress} />)

    const link = screen.getByTestId("checkout-button")
    expect(link).toHaveAttribute("href", "/checkout?step=address")
  })

  it("links to delivery step when address is set but no shipping method", () => {
    const cartWithoutShipping: any = {
      ...baseCart,
      shipping_methods: [],
    }

    render(<Summary cart={cartWithoutShipping} />)

    const link = screen.getByTestId("checkout-button")
    expect(link).toHaveAttribute("href", "/checkout?step=delivery")
  })

  it("links to payment step when address and shipping are set", () => {
    render(<Summary cart={baseCart} />)

    const link = screen.getByTestId("checkout-button")
    expect(link).toHaveAttribute("href", "/checkout?step=payment")
  })
})