import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
  useParams: () => ({ countryCode: "in" }),
  usePathname: () => "/in/account",
}))

vi.mock("@modules/common/components/interactive-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("../components/account-nav", () => ({
  default: () => <div data-testid="account-nav" />,
}))

import AccountLayout from "../account-layout"

describe("AccountLayout", () => {
  it("renders account nav when customer exists", () => {
    render(
      <AccountLayout customer={{ id: "cust_1" } as any}>
        <div data-testid="account-children" />
      </AccountLayout>
    )

    expect(screen.getByTestId("account-page")).toBeInTheDocument()
    expect(screen.getByTestId("account-nav")).toBeInTheDocument()
    expect(screen.getByTestId("account-children")).toBeInTheDocument()

    const link = screen.getByText("Customer Service") as HTMLAnchorElement
    expect(link.getAttribute("href")).toBe("/customer-service")
  })

  it("does not render account nav when customer is null", () => {
    render(
      <AccountLayout customer={null}>
        <div data-testid="account-children" />
      </AccountLayout>
    )

    expect(screen.queryByTestId("account-nav")).toBeNull()
  })
})