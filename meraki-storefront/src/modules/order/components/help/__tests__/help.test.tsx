import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

import Help from "../index"

describe("Help", () => {
  it("renders help header and contact links", () => {
    render(<Help />)

    expect(screen.getByText("Need help?")).toBeInTheDocument()

    const contact = screen.getByText("Contact") as HTMLAnchorElement
    const returns = screen.getByText("Returns & Exchanges") as HTMLAnchorElement

    expect(contact.getAttribute("href")).toBe("/contact")
    expect(returns.getAttribute("href")).toBe("/contact")
  })
})