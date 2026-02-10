import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import OrderCompletedTemplate from "../order-completed-template"

const {
  mockNextCookies,
  mockOnboardingCta,
  mockOrderDetails,
  mockItems,
  mockCartTotals,
  mockShippingDetails,
  mockPaymentDetails,
  mockHelp,
} = vi.hoisted(() => ({
  mockNextCookies: vi.fn(),
  mockOnboardingCta: vi.fn<(props: { orderId: string }) => void>(),
  mockOrderDetails: vi.fn<(props: { order: any }) => void>(),
  mockItems: vi.fn<(props: { order: any }) => void>(),
  mockCartTotals: vi.fn<(props: { totals: any }) => void>(),
  mockShippingDetails: vi.fn<(props: { order: any }) => void>(),
  mockPaymentDetails: vi.fn<(props: { order: any }) => void>(),
  mockHelp: vi.fn<() => void>(),
}))

vi.mock("next/headers", () => ({
  cookies: (...args: any[]) => mockNextCookies(...args),
}))

vi.mock("@medusajs/ui", () => ({
  Heading: ({ level, children, ...props }: any) => {
    const Tag = level ?? "div"
    return <Tag {...props}>{children}</Tag>
  },
}))

vi.mock("@modules/order/components/onboarding-cta", () => ({
  default: (props: any) => {
    mockOnboardingCta(props)
    return <div data-testid="onboarding-cta" />
  },
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

vi.mock("@modules/common/components/cart-totals", () => ({
  default: (props: any) => {
    mockCartTotals(props)
    return <div data-testid="cart-totals" />
  },
}))

vi.mock("@modules/order/components/shipping-details", () => ({
  default: (props: any) => {
    mockShippingDetails(props)
    return <div data-testid="shipping-details" />
  },
}))

vi.mock("@modules/order/components/payment-details", () => ({
  default: (props: any) => {
    mockPaymentDetails(props)
    return <div data-testid="payment-details" />
  },
}))

vi.mock("@modules/order/components/help", () => ({
  default: () => {
    mockHelp()
    return <div data-testid="order-help" />
  },
}))

describe("OrderCompletedTemplate", () => {
  let store: Map<string, string>

  beforeEach(() => {
    store = new Map()

    mockNextCookies.mockReset()
    mockOnboardingCta.mockReset()
    mockOrderDetails.mockReset()
    mockItems.mockReset()
    mockCartTotals.mockReset()
    mockShippingDetails.mockReset()
    mockPaymentDetails.mockReset()
    mockHelp.mockReset()

    mockNextCookies.mockResolvedValue({
      get: (name: string) =>
        store.has(name) ? { value: store.get(name) } : undefined,
    })
  })

  it("renders the order completion UI and subcomponents", async () => {
    const order = { id: "order_1" } as any

    const node = await OrderCompletedTemplate({ order })
    render(<div>{node as any}</div>)

    expect(screen.getByTestId("order-complete-container")).toBeInTheDocument()

    expect(
      screen.getByText("Your order was placed successfully.")
    ).toBeInTheDocument()
    expect(screen.getByText("Summary")).toBeInTheDocument()

    expect(screen.getByTestId("order-details")).toBeInTheDocument()
    expect(screen.getByTestId("order-items")).toBeInTheDocument()
    expect(screen.getByTestId("cart-totals")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-details")).toBeInTheDocument()
    expect(screen.getByTestId("payment-details")).toBeInTheDocument()
    expect(screen.getByTestId("order-help")).toBeInTheDocument()

    expect(mockOrderDetails).toHaveBeenCalledWith({ order })
    expect(mockItems).toHaveBeenCalledWith({ order })
    expect(mockCartTotals).toHaveBeenCalledWith({ totals: order })
    expect(mockShippingDetails).toHaveBeenCalledWith({ order })
    expect(mockPaymentDetails).toHaveBeenCalledWith({ order })
  })

  it("shows onboarding CTA when _medusa_onboarding cookie is true", async () => {
    store.set("_medusa_onboarding", "true")
    const order = { id: "order_2" } as any

    const node = await OrderCompletedTemplate({ order })
    render(<div>{node as any}</div>)

    expect(screen.getByTestId("onboarding-cta")).toBeInTheDocument()
    expect(mockOnboardingCta).toHaveBeenCalledWith({ orderId: "order_2" })
  })

  it("does not show onboarding CTA when cookie is missing/false", async () => {
    const order = { id: "order_3" } as any

    const node = await OrderCompletedTemplate({ order })
    render(<div>{node as any}</div>)

    expect(screen.queryByTestId("onboarding-cta")).toBeNull()
  })
})