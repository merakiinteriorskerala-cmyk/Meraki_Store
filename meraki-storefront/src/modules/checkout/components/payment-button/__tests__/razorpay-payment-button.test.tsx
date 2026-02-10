import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  mockUseRazorpay,
  mockAuthorizePayment,
  mockWaitForPaymentCompletion,
  mockPlaceOrder,
} = vi.hoisted(() => ({
  mockUseRazorpay: vi.fn(),
  mockAuthorizePayment: vi.fn(),
  mockWaitForPaymentCompletion: vi.fn(),
  mockPlaceOrder: vi.fn(),
}))

vi.mock("react-razorpay", () => ({
  useRazorpay: () => mockUseRazorpay(),
}))

vi.mock("@lib/data/cart", () => ({
  authorizePayment: (...args: any[]) => mockAuthorizePayment(...args),
  waitForPaymentCompletion: (...args: any[]) =>
    mockWaitForPaymentCompletion(...args),
  placeOrder: (...args: any[]) => mockPlaceOrder(...args),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, disabled, onClick, "data-testid": testId }: any) => (
    <button disabled={disabled} onClick={onClick} data-testid={testId || "button"}>
      {children}
    </button>
  ),
}))

vi.mock("@modules/common/icons/spinner", () => ({
  default: () => <span data-testid="spinner" />,
}))

import { RazorpayPaymentButton } from "../razorpay-payment-button"

const baseCart: any = {
  id: "cart_1",
  total: 1000,
  currency_code: "inr",
  email: "test@example.com",
  billing_address: { first_name: "A", last_name: "B", phone: "123" },
  shipping_address: { phone: "321" },
}

const baseSession: any = {
  provider_id: "pp_razorpay_razorpay",
  amount: 1000,
  data: { id: "order_1" },
}

describe("RazorpayPaymentButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_RAZORPAY_KEY = "rzp_test"
    mockAuthorizePayment.mockResolvedValue({})
    mockWaitForPaymentCompletion.mockResolvedValue({})
    mockPlaceOrder.mockResolvedValue({})
  })

  it("shows error when SDK is not loaded", async () => {
    const user = userEvent.setup()
    mockUseRazorpay.mockReturnValue({ Razorpay: undefined, isLoading: false })

    render(
      <RazorpayPaymentButton
        session={baseSession}
        notReady={false}
        cart={baseCart}
        data-testid="rzp-pay"
      />
    )

    await user.click(screen.getByTestId("rzp-pay"))
    expect(
      screen.getByText("Razorpay SDK not loaded")
    ).toBeInTheDocument()
  })

  it("shows error when Razorpay is not a constructor", async () => {
    const user = userEvent.setup()
    mockUseRazorpay.mockReturnValue({ Razorpay: {}, isLoading: false })

    render(
      <RazorpayPaymentButton
        session={baseSession}
        notReady={false}
        cart={baseCart}
        data-testid="rzp-pay"
      />
    )

    await user.click(screen.getByTestId("rzp-pay"))
    expect(
      screen.getByText("Payment gateway failed to initialize. Please refresh.")
    ).toBeInTheDocument()
  })

  it("authorizes and places order on successful handler", async () => {
    const user = userEvent.setup()

    const RazorpayConstructor = function (this: any, options: any) {
      this.options = options
      return {
        on: vi.fn(),
        open: () => options.handler({
          razorpay_payment_id: "pay_1",
          razorpay_order_id: "order_1",
          razorpay_signature: "sig_1",
        }),
      }
    }

    mockUseRazorpay.mockReturnValue({ Razorpay: RazorpayConstructor, isLoading: false })

    render(
      <RazorpayPaymentButton
        session={baseSession}
        notReady={false}
        cart={baseCart}
        data-testid="rzp-pay"
      />
    )

    await user.click(screen.getByTestId("rzp-pay"))

    expect(mockAuthorizePayment).toHaveBeenCalledWith(
      "cart_1",
      "pp_razorpay_razorpay",
      {
        razorpay_payment_id: "pay_1",
        razorpay_order_id: "order_1",
        razorpay_signature: "sig_1",
      }
    )
    expect(mockWaitForPaymentCompletion).toHaveBeenCalledWith({
      cartId: "cart_1",
      providerId: "pp_razorpay_razorpay",
    })
    expect(mockPlaceOrder).toHaveBeenCalledWith("cart_1")
  })
})