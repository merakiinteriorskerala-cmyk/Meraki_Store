import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@medusajs/ui", () => {
  const Table: any = ({ children }: any) => <table>{children}</table>
  Table.Row = ({ children, ...props }: any) => <tr {...props}>{children}</tr>
  Table.Cell = ({ children, ...props }: any) => <td {...props}>{children}</td>
  return { Table, Text: ({ children, ...props }: any) => <span {...props}>{children}</span> }
})

vi.mock("@modules/common/components/line-item-options", () => ({
  default: () => <div data-testid="line-item-options" />,
}))

vi.mock("@modules/common/components/line-item-price", () => ({
  default: () => <div data-testid="line-item-price" />,
}))

vi.mock("@modules/common/components/line-item-unit-price", () => ({
  default: () => <div data-testid="line-item-unit-price" />,
}))

vi.mock("@modules/products/components/thumbnail", () => ({
  default: () => <div data-testid="thumbnail" />,
}))

import Item from "../index"

describe("Order Item", () => {
  it("renders product info, quantity, and pricing components", () => {
    const item: any = {
      id: "i1",
      product_title: "Test Product",
      quantity: 2,
      thumbnail: "t.jpg",
      variant: { id: "v1" },
    }

    render(
      <table>
        <tbody>
          <Item item={item} currencyCode="usd" />
        </tbody>
      </table>
    )

    expect(screen.getByTestId("product-row")).toBeInTheDocument()
    expect(screen.getByTestId("product-name")).toHaveTextContent("Test Product")
    expect(screen.getByTestId("product-quantity")).toHaveTextContent("2")
    expect(screen.getByTestId("thumbnail")).toBeInTheDocument()
    expect(screen.getByTestId("line-item-options")).toBeInTheDocument()
    expect(screen.getByTestId("line-item-unit-price")).toBeInTheDocument()
    expect(screen.getByTestId("line-item-price")).toBeInTheDocument()
  })
})