import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("not-found")
  },
}))

vi.mock("@modules/products/components/image-gallery", () => ({
  default: () => <div data-testid="image-gallery" />,
}))

vi.mock("@modules/products/components/product-actions", () => ({
  default: () => <div data-testid="product-actions" />,
}))

vi.mock("@modules/products/components/product-tabs", () => ({
  default: () => <div data-testid="product-tabs" />,
}))

vi.mock("@modules/products/components/related-products", () => ({
  default: () => <div data-testid="related-products" />,
}))

vi.mock("@modules/products/templates/product-info", () => ({
  default: () => <div data-testid="product-info" />,
}))

vi.mock("@modules/skeletons/templates/skeleton-related-products", () => ({
  default: () => <div data-testid="skeleton-related-products" />,
}))

vi.mock("../product-actions-wrapper", () => ({
  default: () => <div data-testid="product-actions-wrapper" />,
}))

import ProductTemplate from "../index"

describe("ProductTemplate", () => {
  it("renders main product layout and related products section", () => {
    render(
      <ProductTemplate
        product={{ id: "p1" } as any}
        region={{ id: "reg_1" } as any}
        countryCode="us"
        images={[]}
      />
    )

    expect(screen.getByTestId("product-container")).toBeInTheDocument()
    expect(screen.getByTestId("related-products-container")).toBeInTheDocument()

    expect(screen.getByTestId("image-gallery")).toBeInTheDocument()
    expect(screen.getByTestId("product-info")).toBeInTheDocument()
    expect(screen.getByTestId("product-actions-wrapper")).toBeInTheDocument()
    expect(screen.getByTestId("product-tabs")).toBeInTheDocument()
    expect(screen.getByTestId("related-products")).toBeInTheDocument()
  })

  it("calls notFound when product is missing", () => {
    expect(() =>
      render(
        <ProductTemplate
          product={null as any}
          region={{ id: "reg_1" } as any}
          countryCode="us"
          images={[]}
        />
      )
    ).toThrow("not-found")
  })
})