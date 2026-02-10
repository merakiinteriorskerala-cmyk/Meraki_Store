import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockPaginatedProducts } = vi.hoisted(() => ({
  mockPaginatedProducts: vi.fn(),
}))

vi.mock("@modules/store/components/refinement-list", () => ({
  default: ({ sortBy }: any) => (
    <div data-testid="refinement-list" data-sortby={sortBy} />
  ),
}))

vi.mock("@modules/skeletons/templates/skeleton-product-grid", () => ({
  default: () => <div data-testid="skeleton-product-grid" />,
}))

vi.mock("../paginated-products", () => ({
  default: (props: any) => {
    mockPaginatedProducts(props)
    return <div data-testid="paginated-products" />
  },
}))

import StoreTemplate from "../index"

describe("StoreTemplate", () => {
  beforeEach(() => {
    mockPaginatedProducts.mockReset()
  })

  it("renders store header and passes default sort/page to PaginatedProducts", () => {
    render(<StoreTemplate countryCode="us" />)

    expect(screen.getByTestId("category-container")).toBeInTheDocument()
    expect(screen.getByTestId("store-page-title")).toHaveTextContent(
      "The Collection"
    )

    expect(screen.getByTestId("refinement-list")).toBeInTheDocument()
    expect(screen.getByTestId("paginated-products")).toBeInTheDocument()

    expect(mockPaginatedProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "created_at",
        page: 1,
        countryCode: "us",
      })
    )
  })

  it("parses page and uses provided sortBy", () => {
    render(
      <StoreTemplate
        countryCode="in"
        page="2"
        sortBy={"price_desc" as any}
      />
    )

    expect(mockPaginatedProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "price_desc",
        page: 2,
        countryCode: "in",
      })
    )
  })
})