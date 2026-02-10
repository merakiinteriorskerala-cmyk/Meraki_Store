import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockListProductsWithSort, mockGetRegion } = vi.hoisted(() => ({
  mockListProductsWithSort: vi.fn(),
  mockGetRegion: vi.fn(),
}))

vi.mock("@lib/data/products", () => ({
  listProductsWithSort: (...args: any[]) => mockListProductsWithSort(...args),
}))

vi.mock("@lib/data/regions", () => ({
  getRegion: (...args: any[]) => mockGetRegion(...args),
}))

vi.mock("@modules/products/components/product-preview", () => ({
  default: ({ product }: any) => (
    <div data-testid="product-preview" data-product-id={product?.id} />
  ),
}))

vi.mock("@modules/store/components/product-grid-item", () => ({
  default: ({ children }: any) => (
    <li data-testid="product-grid-item">{children}</li>
  ),
}))

vi.mock("@modules/store/components/pagination", () => ({
  Pagination: ({ page, totalPages, ...props }: any) => (
    <div {...props}>
      {page}/{totalPages}
    </div>
  ),
}))

import PaginatedProducts from "../paginated-products"

describe("PaginatedProducts", () => {
  beforeEach(() => {
    mockListProductsWithSort.mockReset()
    mockGetRegion.mockReset()
  })

  it("returns null when region is missing", async () => {
    mockGetRegion.mockResolvedValue(null)

    await expect(
      PaginatedProducts({ page: 1, countryCode: "us" })
    ).resolves.toBeNull()
  })

  it("builds query params, renders products, and shows pagination when multiple pages", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })

    mockListProductsWithSort.mockResolvedValue({
      response: {
        products: new Array(12)
          .fill(0)
          .map((_, i) => ({ id: `p${i}`, handle: `h${i}`, title: `P${i}` })),
        count: 30,
      },
    })

    const node = await PaginatedProducts({
      sortBy: "created_at" as any,
      page: 2,
      countryCode: "us",
      collectionId: "col_1",
      categoryId: "cat_1",
      productsIds: ["p1", "p2"],
    })

    render(<div>{node as any}</div>)

    expect(mockListProductsWithSort).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        sortBy: "created_at",
        countryCode: "us",
        queryParams: expect.objectContaining({
          limit: 12,
          collection_id: ["col_1"],
          category_id: ["cat_1"],
          id: ["p1", "p2"],
          order: "created_at",
        }),
      })
    )

    expect(screen.getByTestId("products-list")).toBeInTheDocument()
    expect(screen.getAllByTestId("product-preview")).toHaveLength(12)
    expect(screen.getByTestId("product-pagination")).toHaveTextContent("2/3")
  })

  it("does not show pagination when there is only one page", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })

    mockListProductsWithSort.mockResolvedValue({
      response: { products: [{ id: "p1" }], count: 1 },
    })

    const node = await PaginatedProducts({
      sortBy: "created_at" as any,
      page: 1,
      countryCode: "us",
    })

    render(<div>{node as any}</div>)

    expect(screen.queryByTestId("product-pagination")).toBeNull()
  })
})