import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockListProducts } = vi.hoisted(() => ({
  mockListProducts: vi.fn(),
}))

vi.mock("@lib/data/products", () => ({
  listProducts: (...args: any[]) => mockListProducts(...args),
}))

vi.mock("@modules/products/components/product-actions", () => ({
  default: ({ product, region }: any) => (
    <div
      data-testid="product-actions"
      data-product-id={product?.id}
      data-region-id={region?.id}
    />
  ),
}))

import ProductActionsWrapper from "../product-actions-wrapper"

describe("ProductActionsWrapper", () => {
  beforeEach(() => {
    mockListProducts.mockReset()
  })

  it("renders ProductActions when product is found", async () => {
    mockListProducts.mockResolvedValue({
      response: { products: [{ id: "p1" }] },
    })

    const node = await ProductActionsWrapper({
      id: "p1",
      region: { id: "reg_1" } as any,
    })

    render(<div>{node as any}</div>)

    expect(mockListProducts).toHaveBeenCalledWith({
      queryParams: { id: ["p1"] },
      regionId: "reg_1",
    })
    expect(screen.getByTestId("product-actions")).toBeInTheDocument()
    expect(screen.getByTestId("product-actions")).toHaveAttribute(
      "data-product-id",
      "p1"
    )
  })

  it("returns null when product is not found", async () => {
    mockListProducts.mockResolvedValue({
      response: { products: [] },
    })

    await expect(
      ProductActionsWrapper({ id: "p2", region: { id: "reg_1" } as any })
    ).resolves.toBeNull()
  })
})