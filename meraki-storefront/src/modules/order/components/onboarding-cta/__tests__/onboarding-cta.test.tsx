import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

const { mockResetOnboardingState } = vi.hoisted(() => ({
  mockResetOnboardingState: vi.fn(),
}))

vi.mock("@lib/data/onboarding", () => ({
  resetOnboardingState: (...args: any[]) => mockResetOnboardingState(...args),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Container: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

import OnboardingCta from "../index"

describe("OnboardingCta", () => {
  it("renders message and calls resetOnboardingState on click", () => {
    render(<OnboardingCta orderId="order_1" />)

    expect(
      screen.getByText("Your test order was successfully created! 🎉")
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText("Complete setup in admin"))

    expect(mockResetOnboardingState).toHaveBeenCalledWith("order_1")
  })
})