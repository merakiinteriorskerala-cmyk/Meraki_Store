import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

const { mockListProducts, mockProductActions } = vi.hoisted(() => ({
  mockListProducts: vi.fn(),
  mockProductActions: vi.fn(),
}))

vi.mock("@lib/data/products", () => ({
  listProducts: (...args: any[]) => mockListProducts(...args),
}))

vi.mock("@modules/products/components/product-actions", () => ({
  default: (props: any) => {
    mockProductActions(props)
    return <div data-testid="product-actions" />
  },
}))

import ProductActionsWrapper from "../index"

describe("ProductActionsWrapper", () => {
  beforeEach(() => {
    mockListProducts.mockReset()
    mockProductActions.mockReset()
  })

  it("returns null if product not found", async () => {
    mockListProducts.mockResolvedValue({ response: { products: [] } })
    const ui = await ProductActionsWrapper({ id: "p1", region: { id: "reg_1" } as any })
    expect(ui).toBeNull()
    expect(mockListProducts).toHaveBeenCalledWith({
      queryParams: { id: ["p1"] },
      regionId: "reg_1",
    })
  })

  it("renders ProductActions with fetched product and region", async () => {
    const product = { id: "p1" }
    mockListProducts.mockResolvedValue({ response: { products: [product] } })
    const ui = await ProductActionsWrapper({ id: "p1", region: { id: "reg_1" } as any })
    render(<>{ui}</>)
    expect(screen.getByTestId("product-actions")).toBeInTheDocument()
    expect(mockProductActions).toHaveBeenCalledWith({ product, region: { id: "reg_1" } })
  })
})