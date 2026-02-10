import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@medusajs/ui", () => ({
  Badge: ({ children, className, color }: any) => (
    <div data-color={color} className={className}>
      {children}
    </div>
  ),
}))

import PaymentTest from "../index"

describe("PaymentTest", () => {
  it("renders the attention badge", () => {
    render(<PaymentTest className="note" />)

    expect(screen.getByText("Attention:")).toBeInTheDocument()
    expect(screen.getByText("For testing purposes only.")).toBeInTheDocument()

    const badge = screen.getByText("Attention:").closest("div")
    expect(badge?.getAttribute("data-color")).toBe("orange")
    expect(badge?.className).toContain("note")
  })
})