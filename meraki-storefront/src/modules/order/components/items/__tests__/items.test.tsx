import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockItem } = vi.hoisted(() => ({
  mockItem: vi.fn(),
}))

vi.mock("@medusajs/ui", () => {
  const Table: any = ({ children }: any) => <table>{children}</table>
  Table.Body = ({ children, ...props }: any) => (
    <tbody {...props}>{children}</tbody>
  )
  return { Table }
})

vi.mock("@modules/common/components/divider", () => ({
  default: () => <div data-testid="divider" />,
}))

vi.mock("@modules/order/components/item", () => ({
  default: (props: any) => {
    mockItem(props)
    return (
      <tr data-testid="order-item" data-id={props.item?.id}>
        <td>{props.item?.id}</td>
      </tr>
    )
  },
}))

vi.mock("@modules/skeletons/components/skeleton-line-item", () => ({
  default: () => <tr data-testid="skeleton-line-item" />,
}))

import Items from "../index"

describe("Items", () => {
  beforeEach(() => {
    mockItem.mockReset()
  })

  it("renders items sorted by created_at descending", () => {
    const order: any = {
      currency_code: "usd",
      items: [
        { id: "i1", created_at: "2024-01-01T00:00:00.000Z" },
        { id: "i2", created_at: "2024-01-02T00:00:00.000Z" },
      ],
    }

    render(<Items order={order} />)

    const rows = screen.getAllByTestId("order-item")
    expect(rows[0].getAttribute("data-id")).toBe("i2")
    expect(rows[1].getAttribute("data-id")).toBe("i1")
  })

  it("renders skeletons when no items", () => {
    const order: any = { currency_code: "usd", items: [] }

    render(<Items order={order} />)

    expect(screen.getAllByTestId("skeleton-line-item")).toHaveLength(5)
  })
})