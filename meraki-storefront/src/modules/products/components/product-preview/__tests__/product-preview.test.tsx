import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

import PreviewPrice from "../price"
import ProductPreview from "../index"

const { mockGetProductPrice } = vi.hoisted(() => ({
  mockGetProductPrice: vi.fn(),
}))

vi.mock("@lib/util/get-product-price", () => ({
  getProductPrice: (...args: any[]) => mockGetProductPrice(...args),
}))

vi.mock("@lib/data/products", () => ({
  listProducts: vi.fn(),
}))

vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("../../thumbnail", () => ({
  default: (props: any) => <div data-testid="thumbnail" {...props} />,
}))

describe("product-preview", () => {
  beforeEach(() => {
    mockGetProductPrice.mockReset()
  })

  it("PreviewPrice renders sale and non-sale prices", async () => {
    const saleNode = await PreviewPrice({
      price: {
        calculated_price_number: 100,
        calculated_price: "$1.00",
        original_price_number: 200,
        original_price: "$2.00",
        currency_code: "usd",
        price_type: "sale",
        percentage_diff: "50",
      },
    } as any)

    const { rerender } = render(<div>{saleNode as any}</div>)
    expect(screen.getByTestId("original-price")).toHaveTextContent("$2.00")
    expect(screen.getByTestId("price")).toHaveTextContent("$1.00")

    const defaultNode = await PreviewPrice({
      price: {
        calculated_price_number: 100,
        calculated_price: "$1.00",
        original_price_number: 100,
        original_price: "$1.00",
        currency_code: "usd",
        price_type: "default",
        percentage_diff: "0",
      },
    } as any)

    rerender(<div>{defaultNode as any}</div>)
    expect(screen.queryByTestId("original-price")).toBeNull()
    expect(screen.getByTestId("price")).toHaveTextContent("$1.00")
  })

  it("ProductPreview renders title and link and uses getProductPrice", async () => {
    mockGetProductPrice.mockReturnValue({
      cheapestPrice: null,
    })

    const node = await ProductPreview({
      product: {
        id: "p1",
        handle: "test-product",
        title: "Test Product",
        thumbnail: "t.jpg",
        images: [],
      } as any,
      isFeatured: false,
      region: { id: "reg_1" } as any,
    })

    const { container } = render(<div>{node as any}</div>)

    const link = screen.getByTestId("product-wrapper").closest("a")
    expect(link).toBeTruthy()
    expect(link?.getAttribute("href")).toMatch(/\/products\/test-product$/)

    expect(screen.getByTestId("product-title")).toHaveTextContent("Test Product")
    expect(screen.getByTestId("thumbnail")).toBeInTheDocument()
    expect(mockGetProductPrice).toHaveBeenCalledWith({ product: expect.any(Object) })
  })
})