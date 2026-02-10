import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

import ProductInfo from "../product-info"

describe("ProductInfo", () => {
  it("renders collection link when collection exists", () => {
    render(
      <ProductInfo
        product={{
          title: "Chair",
          description: "A great chair",
          collection: { handle: "seating", title: "Seating" },
        } as any}
      />
    )

    const link = screen.getByText("Seating") as HTMLAnchorElement
    expect(link.getAttribute("href")).toBe("/collections/seating")
    expect(screen.getByTestId("product-title")).toHaveTextContent("Chair")
    expect(screen.getByTestId("product-description")).toHaveTextContent(
      "A great chair"
    )
  })

  it("does not render collection link when collection is missing", () => {
    render(
      <ProductInfo
        product={{ title: "Table", description: "Solid wood" } as any}
      />
    )

    expect(screen.queryByText("Seating")).toBeNull()
    expect(screen.getByTestId("product-title")).toHaveTextContent("Table")
  })
})