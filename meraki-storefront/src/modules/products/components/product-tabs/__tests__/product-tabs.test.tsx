import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import ProductTabs from "../index"

vi.mock("../accordion", () => {
  const Accordion: any = ({ children }: any) => <div data-testid="accordion">{children}</div>
  Accordion.Item = ({ children, title }: any) => (
    <section data-testid={`tab-${title}`}>{children}</section>
  )
  return { default: Accordion }
})

describe("product-tabs", () => {
  it("renders product info + shipping sections", () => {
    render(
      <ProductTabs
        product={{
          material: undefined,
          origin_country: undefined,
          type: undefined,
          weight: undefined,
          length: undefined,
          width: undefined,
          height: undefined,
        } as any}
      />
    )

    expect(screen.getByTestId("tab-Product Information")).toBeInTheDocument()
    expect(screen.getByTestId("tab-Shipping & Returns")).toBeInTheDocument()

    expect(screen.getByText("Material")).toBeInTheDocument()
    expect(screen.getAllByText("-").length).toBeGreaterThan(0)

    expect(screen.getByText("Fast delivery")).toBeInTheDocument()
    expect(screen.getByText("Simple exchanges")).toBeInTheDocument()
    expect(screen.getByText("Easy returns")).toBeInTheDocument()
  })

  it("formats dimensions and weight when present", () => {
    render(
      <ProductTabs
        product={{
          material: "Cotton",
          origin_country: "in",
          type: { value: "Shirt" },
          weight: 250,
          length: 10,
          width: 20,
          height: 30,
        } as any}
      />
    )

    expect(screen.getByText("Cotton")).toBeInTheDocument()
    expect(screen.getByText("in")).toBeInTheDocument()
    expect(screen.getByText("Shirt")).toBeInTheDocument()
    expect(screen.getByText("250 g")).toBeInTheDocument()
    expect(screen.getByText("10L x 20W x 30H")).toBeInTheDocument()
  })
})