import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

const { mockCartTotals, mockItemsPreview, mockDiscount } = vi.hoisted(() => ({
  mockCartTotals: vi.fn(),
  mockItemsPreview: vi.fn(),
  mockDiscount: vi.fn(),
}))

vi.mock("@modules/common/components/cart-totals", () => ({
  default: (props: any) => {
    mockCartTotals(props)
    return <div data-testid="cart-totals" />
  },
}))

vi.mock("@modules/cart/templates/preview", () => ({
  default: (props: any) => {
    mockItemsPreview(props)
    return <div data-testid="items-preview" />
  },
}))

vi.mock("@modules/checkout/components/discount-code", () => ({
  default: (props: any) => {
    mockDiscount(props)
    return <div data-testid="discount-code" />
  },
}))

vi.mock("@modules/common/components/divider", () => ({
  default: ({ "data-testid": testId }: any) => <div data-testid={testId || "divider"} />,
}))

vi.mock("@medusajs/ui", () => ({
  Heading: ({ level, children, ...props }: any) => {
    const Tag = level || "div"
    return <Tag {...props}>{children}</Tag>
  },
}))

import CheckoutSummary from "../index"

describe("CheckoutSummary", () => {
  it("renders heading and subcomponents with cart", () => {
    const cart: any = { id: "cart_1" }

    render(<CheckoutSummary cart={cart} />)

    expect(screen.getByText("In your Cart")).toBeInTheDocument()
    expect(screen.getByTestId("cart-totals")).toBeInTheDocument()
    expect(screen.getByTestId("items-preview")).toBeInTheDocument()
    expect(screen.getByTestId("discount-code")).toBeInTheDocument()

    expect(mockCartTotals).toHaveBeenCalledWith({ totals: cart })
    expect(mockItemsPreview).toHaveBeenCalledWith({ cart })
    expect(mockDiscount).toHaveBeenCalledWith({ cart })
  })
})