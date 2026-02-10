import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockItem } = vi.hoisted(() => ({
  mockItem: vi.fn(),
}))

vi.mock("@lib/util/repeat", () => ({
  default: (n: number) => Array.from({ length: n }, (_, i) => i),
}))

vi.mock("@medusajs/ui", () => {
  const Table: any = ({ children }: any) => <table>{children}</table>
  Table.Header = ({ children, ...props }: any) => <thead {...props}>{children}</thead>
  Table.Row = ({ children, ...props }: any) => <tr {...props}>{children}</tr>
  Table.HeaderCell = ({ children, ...props }: any) => (
    <th {...props}>{children}</th>
  )
  Table.Body = ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>
  return {
    Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    Table,
  }
})

vi.mock("@modules/cart/components/item", () => ({
  default: (props: any) => {
    mockItem(props)
    return (
      <tr data-testid="cart-item" data-id={props.item?.id}>
        <td>{props.item?.id}</td>
      </tr>
    )
  },
}))

vi.mock("@modules/skeletons/components/skeleton-line-item", () => ({
  default: () => <tr data-testid="skeleton-line-item" />,
}))

import ItemsTemplate from "../items"

describe("Cart ItemsTemplate", () => {
  beforeEach(() => {
    mockItem.mockReset()
  })

  it("renders heading and sorted items", () => {
    const cart: any = {
      currency_code: "usd",
      items: [
        { id: "i1", created_at: "2024-01-01T00:00:00.000Z" },
        { id: "i2", created_at: "2024-01-02T00:00:00.000Z" },
      ],
    }

    render(<ItemsTemplate cart={cart} />)

    expect(screen.getByText("Cart")).toBeInTheDocument()

    const rows = screen.getAllByTestId("cart-item")
    expect(rows[0].getAttribute("data-id")).toBe("i2")
    expect(rows[1].getAttribute("data-id")).toBe("i1")
  })

  it("renders skeleton rows when cart is missing", () => {
    render(<ItemsTemplate cart={undefined} />)

    expect(screen.getAllByTestId("skeleton-line-item")).toHaveLength(5)
  })
})