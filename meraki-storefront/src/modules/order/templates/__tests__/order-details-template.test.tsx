import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import OrderDetailsTemplate from "../order-details-template"

const {
  mockOrderDetails,
  mockItems,
  mockShippingDetails,
  mockOrderSummary,
  mockHelp,
} = vi.hoisted(() => ({
  mockOrderDetails: vi.fn<(props: { order: any; showStatus?: boolean }) => void>(),
  mockItems: vi.fn<(props: { order: any }) => void>(),
  mockShippingDetails: vi.fn<(props: { order: any }) => void>(),
  mockOrderSummary: vi.fn<(props: { order: any }) => void>(),
  mockHelp: vi.fn<() => void>(),
}))

vi.mock("@medusajs/icons", () => ({
  XMark: () => <span data-testid="xmark-icon" />,
}))

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@modules/order/components/order-details", () => ({
  default: (props: any) => {
    mockOrderDetails(props)
    return <div data-testid="order-details" />
  },
}))

vi.mock("@modules/order/components/items", () => ({
  default: (props: any) => {
    mockItems(props)
    return <div data-testid="order-items" />
  },
}))

vi.mock("@modules/order/components/shipping-details", () => ({
  default: (props: any) => {
    mockShippingDetails(props)
    return <div data-testid="shipping-details" />
  },
}))

vi.mock("@modules/order/components/order-summary", () => ({
  default: (props: any) => {
    mockOrderSummary(props)
    return <div data-testid="order-summary" />
  },
}))

vi.mock("@modules/order/components/help", () => ({
  default: () => {
    mockHelp()
    return <div data-testid="order-help" />
  },
}))

describe("OrderDetailsTemplate", () => {
  beforeEach(() => {
    mockOrderDetails.mockReset()
    mockItems.mockReset()
    mockShippingDetails.mockReset()
    mockOrderSummary.mockReset()
    mockHelp.mockReset()
  })

  it("renders header, back link, and order details sections", () => {
    const order = { id: "order_1" } as any

    render(<OrderDetailsTemplate order={order} />)

    expect(screen.getByText("Order details")).toBeInTheDocument()

    const back = screen.getByTestId("back-to-overview-button")
    expect(back).toBeInTheDocument()
    expect(back.getAttribute("href")).toBe("/account/orders")
    expect(screen.getByTestId("xmark-icon")).toBeInTheDocument()

    expect(screen.getByTestId("order-details-container")).toBeInTheDocument()
    expect(screen.getByTestId("order-details")).toBeInTheDocument()
    expect(screen.getByTestId("order-items")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-details")).toBeInTheDocument()
    expect(screen.getByTestId("order-summary")).toBeInTheDocument()
    expect(screen.getByTestId("order-help")).toBeInTheDocument()

    expect(mockOrderDetails).toHaveBeenCalledWith({ order, showStatus: true })
    expect(mockItems).toHaveBeenCalledWith({ order })
    expect(mockShippingDetails).toHaveBeenCalledWith({ order })
    expect(mockOrderSummary).toHaveBeenCalledWith({ order })
  })
})