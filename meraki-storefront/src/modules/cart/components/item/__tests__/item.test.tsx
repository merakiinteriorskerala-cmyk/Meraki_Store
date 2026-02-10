import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Item from "../index"
import { updateLineItem, deleteLineItem } from "@lib/data/cart"

// Mock the cart data functions
vi.mock("@lib/data/cart", () => ({
  updateLineItem: vi.fn(),
  deleteLineItem: vi.fn(),
}))

// Mock LocalizedClientLink to avoid routing issues
vi.mock("@modules/common/components/localized-client-link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock Thumbnail to avoid Next.js Image issues
vi.mock("@modules/products/components/thumbnail", () => ({
  default: () => <div data-testid="thumbnail" />,
}))

// Mock LineItemOptions as it might be complex
vi.mock("@modules/common/components/line-item-options", () => ({
  default: () => <div data-testid="line-item-options" />,
}))

// Mock Price components
vi.mock("@modules/common/components/line-item-price", () => ({
  default: () => <div data-testid="line-item-price" />,
}))

vi.mock("@modules/common/components/line-item-unit-price", () => ({
  default: () => <div data-testid="line-item-unit-price" />,
}))

// Mock ErrorMessage
vi.mock("@modules/checkout/components/error-message", () => ({
  default: ({ error }: { error: string }) => (
    error ? <div data-testid="product-error-message">{error}</div> : null
  ),
}))

const mockItem: any = {
  id: "line_1",
  title: "Test Product",
  product_title: "Test Product",
  product_handle: "test-product",
  quantity: 1,
  thumbnail: "test.jpg",
  variant: {
    id: "variant_1",
    title: "Test Variant",
    sku: "TEST-SKU",
    product: {
      images: [],
    },
    manage_inventory: false,
    allow_backorder: false,
    inventory_quantity: 10,
  },
  unit_price: 1000,
  total: 1000,
}

describe("Cart Item Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders item details correctly", () => {
    render(
      <table>
        <tbody>
          <Item item={mockItem} currencyCode="usd" />
        </tbody>
      </table>
    )

    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByTestId("thumbnail")).toBeInTheDocument()
    expect(screen.getByTestId("product-select-button")).toBeInTheDocument()
    expect(screen.getByTestId("product-delete-button")).toBeInTheDocument()
  })

  it("calls updateLineItem when quantity is changed", async () => {
    (updateLineItem as any).mockResolvedValue({})

    render(
      <table>
        <tbody>
          <Item item={mockItem} currencyCode="usd" />
        </tbody>
      </table>
    )

    const select = screen.getByTestId("product-select-button")
    // The test id is on the select element itself in CartItemSelect
    fireEvent.change(select, { target: { value: "2" } })

    await waitFor(() => {
      expect(updateLineItem).toHaveBeenCalledWith({
        lineId: "line_1",
        quantity: 2,
      })
    })
  })

  it("calls deleteLineItem when delete button is clicked", async () => {
    (deleteLineItem as any).mockResolvedValue({})

    render(
      <table>
        <tbody>
          <Item item={mockItem} currencyCode="usd" />
        </tbody>
      </table>
    )

    const deleteBtnContainer = screen.getByTestId("product-delete-button")
    const deleteBtn = deleteBtnContainer.querySelector("button")
    if (!deleteBtn) throw new Error("Delete button not found")

    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(deleteLineItem).toHaveBeenCalledWith("line_1")
    })
  })

  it("handles update error gracefully", async () => {
    (updateLineItem as any).mockRejectedValue(new Error("Update failed"))

    render(
      <table>
        <tbody>
          <Item item={mockItem} currencyCode="usd" />
        </tbody>
      </table>
    )
    
    const select = screen.getByTestId("product-select-button")
    
    fireEvent.change(select, { target: { value: "2" } })
    
    await waitFor(() => {
      expect(screen.getByTestId("product-error-message")).toHaveTextContent("Update failed")
    })
  })
})