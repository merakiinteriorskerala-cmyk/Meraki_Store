import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

const pendingRef = { current: false }

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, isLoading, variant, className, "data-testid": testId }: any) => (
    <button
      data-testid={testId || "button"}
      data-loading={String(isLoading)}
      data-variant={variant}
      data-class={className}
      type="submit"
    >
      {children}
    </button>
  ),
}))

vi.mock("react-dom", () => ({
  useFormStatus: () => ({ pending: pendingRef.current }),
}))

import { SubmitButton } from "../index"

describe("SubmitButton", () => {
  beforeEach(() => {
    pendingRef.current = false
  })

  it("renders children and uses pending=false", () => {
    render(<SubmitButton data-testid="submit" className="x" variant="secondary">Pay</SubmitButton>)
    const btn = screen.getByTestId("submit")
    expect(btn).toHaveTextContent("Pay")
    expect(btn).toHaveAttribute("data-loading", "false")
    expect(btn).toHaveAttribute("data-variant", "secondary")
    expect(btn).toHaveAttribute("data-class", "x")
  })

  it("uses primary when variant is null", () => {
    render(<SubmitButton data-testid="submit" variant={null}>Go</SubmitButton>)
    const btn = screen.getByTestId("submit")
    expect(btn).toHaveAttribute("data-variant", "primary")
  })

  it("sets isLoading when pending=true", () => {
    pendingRef.current = true
    render(<SubmitButton data-testid="submit">Submit</SubmitButton>)
    expect(screen.getByTestId("submit")).toHaveAttribute("data-loading", "true")
  })
})