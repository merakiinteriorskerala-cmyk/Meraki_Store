import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockPaginatedProducts } = vi.hoisted(() => ({
  mockPaginatedProducts: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found")
  },
}))

vi.mock("@modules/common/components/interactive-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@modules/store/components/refinement-list", () => ({
  default: ({ sortBy }: any) => (
    <div data-testid="refinement-list" data-sortby={sortBy} />
  ),
}))

vi.mock("@modules/skeletons/templates/skeleton-product-grid", () => ({
  default: ({ numberOfProducts }: any) => (
    <div data-testid="skeleton-product-grid" data-count={numberOfProducts} />
  ),
}))

vi.mock("@modules/store/templates/paginated-products", () => ({
  default: (props: any) => {
    mockPaginatedProducts(props)
    return <div data-testid="paginated-products" />
  },
}))

import CategoryTemplate from "../index"

describe("CategoryTemplate", () => {
  beforeEach(() => {
    mockPaginatedProducts.mockReset()
  })

  it("renders category header, parents, description, children, and product grid", () => {
    const category: any = {
      id: "cat_child",
      name: "Chairs",
      handle: "chairs",
      description: "Seating for every space",
      products: [{ id: "p1" }],
      parent_category: {
        id: "cat_parent",
        name: "Furniture",
        handle: "furniture",
        parent_category: {
          id: "cat_root",
          name: "Home",
          handle: "home",
          parent_category: null,
        },
      },
      category_children: [{ id: "cat_sub", name: "Office", handle: "office" }],
    }

    render(<CategoryTemplate category={category} countryCode="us" />)

    expect(screen.getByTestId("category-container")).toBeInTheDocument()
    expect(screen.getByTestId("category-page-title")).toHaveTextContent("Chairs")
    expect(screen.getByText("Furniture")).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Seating for every space")).toBeInTheDocument()

    const childLink = screen.getByText("Office") as HTMLAnchorElement
    expect(childLink.getAttribute("href")).toBe("/categories/office")

    expect(screen.getByTestId("refinement-list")).toHaveAttribute(
      "data-sortby",
      "created_at"
    )
    expect(screen.getByTestId("paginated-products")).toBeInTheDocument()

    expect(mockPaginatedProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "created_at",
        page: 1,
        categoryId: "cat_child",
        countryCode: "us",
      })
    )
  })

  it("parses page and uses provided sortBy", () => {
    const category: any = {
      id: "cat_1",
      name: "Tables",
      handle: "tables",
      parent_category: null,
      category_children: [],
    }

    render(
      <CategoryTemplate
        category={category}
        countryCode="in"
        page="3"
        sortBy={"price_desc" as any}
      />
    )

    expect(mockPaginatedProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "price_desc",
        page: 3,
        categoryId: "cat_1",
        countryCode: "in",
      })
    )
  })

  it("calls notFound when category is missing", () => {
    expect(() =>
      render(
        <CategoryTemplate category={null as any} countryCode="us" />
      )
    ).toThrow("not-found")
  })

  it("calls notFound when countryCode is missing", () => {
    const category: any = {
      id: "cat_1",
      name: "Tables",
      handle: "tables",
      parent_category: null,
      category_children: [],
    }

    expect(() =>
      render(<CategoryTemplate category={category} countryCode={""} />)
    ).toThrow("not-found")
  })
})