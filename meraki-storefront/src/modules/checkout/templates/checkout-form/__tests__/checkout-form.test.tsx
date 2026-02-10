import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  mockListShippingMethods,
  mockListPaymentMethods,
  mockAddresses,
  mockShipping,
  mockPayment,
  mockReview,
} = vi.hoisted(() => ({
  mockListShippingMethods: vi.fn(),
  mockListPaymentMethods: vi.fn(),
  mockAddresses: vi.fn(),
  mockShipping: vi.fn(),
  mockPayment: vi.fn(),
  mockReview: vi.fn(),
}))

vi.mock("@lib/data/fulfillment", () => ({
  listCartShippingMethods: (...args: any[]) => mockListShippingMethods(...args),
}))

vi.mock("@lib/data/payment", () => ({
  listCartPaymentMethods: (...args: any[]) => mockListPaymentMethods(...args),
}))

vi.mock("@modules/checkout/components/addresses", () => ({
  default: (props: any) => {
    mockAddresses(props)
    return <div data-testid="addresses" />
  },
}))

vi.mock("@modules/checkout/components/shipping", () => ({
  default: (props: any) => {
    mockShipping(props)
    return <div data-testid="shipping" />
  },
}))

vi.mock("@modules/checkout/components/payment", () => ({
  default: (props: any) => {
    mockPayment(props)
    return <div data-testid="payment" />
  },
}))

vi.mock("@modules/checkout/components/review", () => ({
  default: (props: any) => {
    mockReview(props)
    return <div data-testid="review" />
  },
}))

import CheckoutForm from "../index"

describe("CheckoutForm", () => {
  beforeEach(() => {
    mockListShippingMethods.mockReset()
    mockListPaymentMethods.mockReset()
    mockAddresses.mockReset()
    mockShipping.mockReset()
    mockPayment.mockReset()
    mockReview.mockReset()
  })

  it("returns null when cart is missing", async () => {
    const ui = await CheckoutForm({ cart: null, customer: null })
    expect(ui).toBeNull()
  })

  it("returns null when shipping methods are missing", async () => {
    mockListShippingMethods.mockResolvedValue(null)
    mockListPaymentMethods.mockResolvedValue([{ id: "pm_1" }])

    const cart: any = { id: "cart_1", region: { id: "reg_1" } }
    const ui = await CheckoutForm({ cart, customer: null })

    expect(ui).toBeNull()
  })

  it("returns null when payment methods are missing", async () => {
    mockListShippingMethods.mockResolvedValue([{ id: "sm_1" }])
    mockListPaymentMethods.mockResolvedValue(null)

    const cart: any = { id: "cart_1", region: { id: "reg_1" } }
    const ui = await CheckoutForm({ cart, customer: null })

    expect(ui).toBeNull()
  })

  it("renders addresses, shipping, payment, and review when data is available", async () => {
    const shippingMethods = [{ id: "sm_1" }]
    const paymentMethods = [{ id: "pm_1" }]

    mockListShippingMethods.mockResolvedValue(shippingMethods)
    mockListPaymentMethods.mockResolvedValue(paymentMethods)

    const cart: any = { id: "cart_1", region: { id: "reg_1" } }
    const customer: any = { id: "cust_1" }

    const ui = await CheckoutForm({ cart, customer })

    render(<>{ui}</>)

    expect(screen.getByTestId("addresses")).toBeInTheDocument()
    expect(screen.getByTestId("shipping")).toBeInTheDocument()
    expect(screen.getByTestId("payment")).toBeInTheDocument()
    expect(screen.getByTestId("review")).toBeInTheDocument()

    expect(mockAddresses).toHaveBeenCalledWith({ cart, customer })
    expect(mockShipping).toHaveBeenCalledWith({
      cart,
      availableShippingMethods: shippingMethods,
    })
    expect(mockPayment).toHaveBeenCalledWith({
      cart,
      availablePaymentMethods: paymentMethods,
    })
    expect(mockReview).toHaveBeenCalledWith({ cart })
  })
})