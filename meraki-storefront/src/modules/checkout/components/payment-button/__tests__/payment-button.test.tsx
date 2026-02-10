import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  mockUseStripe,
  mockUseElements,
  mockPlaceOrder,
  mockRazorpay,
} = vi.hoisted(() => ({
  mockUseStripe: vi.fn(),
  mockUseElements: vi.fn(),
  mockPlaceOrder: vi.fn(),
  mockRazorpay: vi.fn(),
}))

vi.mock("@stripe/react-stripe-js", () => ({
  useStripe: () => mockUseStripe(),
  useElements: () => mockUseElements(),
}))

vi.mock("@lib/data/cart", () => ({
  placeOrder: (...args: any[]) => mockPlaceOrder(...args),
}))

vi.mock("../razorpay-payment-button", () => ({
  RazorpayPaymentButton: (props: any) => {
    mockRazorpay(props)
    return <div data-testid="razorpay-payment-button" />
  },
}))

vi.mock("../error-message", () => ({
  default: ({ error, "data-testid": testId }: any) =>
    error ? <div data-testid={testId}>{error}</div> : null,
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({
    children,
    disabled,
    isLoading,
    onClick,
    "data-testid": testId,
  }: any) => (
    <button
      disabled={disabled}
      data-testid={testId || "button"}
      data-loading={String(!!isLoading)}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}))

import PaymentButton from "../index"

const fullCart: any = {
  id: "cart_1",
  email: "test@example.com",
  shipping_address: { id: "sa_1" },
  billing_address: { first_name: "A", last_name: "B" },
  shipping_methods: [{ id: "sm_1" }],
  payment_collection: {
    payment_sessions: [
      { status: "pending", provider_id: "pp_stripe_card", data: { client_secret: "cs_123" } },
    ],
  },
}

describe("PaymentButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseStripe.mockReturnValue(null)
    mockUseElements.mockReturnValue({ getElement: vi.fn(() => null) })
    mockPlaceOrder.mockResolvedValue({ id: "order_1" })
  })

  it("renders stripe payment button and is disabled when stripe is not ready", () => {
    render(<PaymentButton cart={fullCart} data-testid="submit-payment-button" />)

    const btn = screen.getByTestId("submit-payment-button")
    expect(btn).toBeDisabled()
  })

  it("renders razorpay button when provider is razorpay", () => {
    const cart: any = {
      ...fullCart,
      payment_collection: {
        payment_sessions: [
          { status: "pending", provider_id: "pp_razorpay_razorpay", data: {} },
        ],
      },
    }

    render(<PaymentButton cart={cart} data-testid="submit-payment-button" />)

    expect(screen.getByTestId("razorpay-payment-button")).toBeInTheDocument()
    expect(mockRazorpay).toHaveBeenCalledWith(
      expect.objectContaining({ cart, notReady: false })
    )
  })

  it("renders manual payment button and calls placeOrder on click", async () => {
    const user = userEvent.setup()
    const cart: any = {
      ...fullCart,
      payment_collection: {
        payment_sessions: [
          { status: "pending", provider_id: "pp_system_default", data: {} },
        ],
      },
    }

    render(<PaymentButton cart={cart} data-testid="submit-payment-button" />)

    const btn = screen.getByTestId("submit-order-button")
    expect(btn).toBeEnabled()

    await user.click(btn)
    expect(mockPlaceOrder).toHaveBeenCalledTimes(1)
  })

  it("shows fallback when no payment session matches", () => {
    const cart: any = {
      ...fullCart,
      payment_collection: { payment_sessions: [] },
    }

    render(<PaymentButton cart={cart} data-testid="submit-payment-button" />)

    expect(screen.getByText("Select a payment method")).toBeInTheDocument()
  })
})