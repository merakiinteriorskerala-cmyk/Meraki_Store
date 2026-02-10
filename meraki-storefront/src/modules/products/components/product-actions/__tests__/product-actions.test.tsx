import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import ProductActions from "../index"
import { addToCart } from "@lib/data/cart"

// Mock dependencies
vi.mock("@lib/data/cart", () => ({
  addToCart: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
  useParams: () => ({
    countryCode: "us",
  }),
  usePathname: () => "/us/products/test-product",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock ProductPrice
vi.mock("../product-price", () => ({
  default: () => <div data-testid="product-price" />,
}))

// Mock MobileActions
vi.mock("./mobile-actions", () => ({
  default: () => <div data-testid="mobile-actions" />,
}))

// Mock useIntersection hook
vi.mock("@lib/hooks/use-in-view", () => ({
  useIntersection: () => true,
}))

const mockProduct: any = {
  id: "prod_1",
  title: "Test Product",
  options: [
    {
      id: "opt_1",
      title: "Size",
      values: [{ value: "S" }, { value: "M" }],
    },
    {
      id: "opt_2",
      title: "Color",
      values: [{ value: "Red" }, { value: "Blue" }],
    },
  ],
  variants: [
    {
      id: "var_1",
      title: "S / Red",
      options: [
        { option_id: "opt_1", value: "S" },
        { option_id: "opt_2", value: "Red" },
      ],
      manage_inventory: true,
      inventory_quantity: 10,
    },
    {
      id: "var_2",
      title: "M / Blue",
      options: [
        { option_id: "opt_1", value: "M" },
        { option_id: "opt_2", value: "Blue" },
      ],
      manage_inventory: true,
      inventory_quantity: 0, // Out of stock
    },
  ],
}

const mockRegion: any = {
  id: "reg_1",
  name: "US",
  currency_code: "usd",
  countries: [{ iso_2: "us" }],
}

describe("ProductActions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders product options", () => {
    render(<ProductActions product={mockProduct} region={mockRegion} />)

    expect(screen.getByText("Select Size")).toBeInTheDocument()
    expect(screen.getByText("Select Color")).toBeInTheDocument()
    // 2 options * 2 values = 4 buttons
    expect(screen.getAllByTestId("option-button")).toHaveLength(4)
  })

  it("disables add to cart button initially (no selection)", () => {
    render(<ProductActions product={mockProduct} region={mockRegion} />)

    const addButton = screen.getByTestId("add-product-button")
    expect(addButton).toBeDisabled()
    expect(addButton).toHaveTextContent("Select Options")
  })

  it("enables add to cart when valid options selected", () => {
    render(<ProductActions product={mockProduct} region={mockRegion} />)

    // Select Size S
    fireEvent.click(screen.getByText("S"))
    // Select Color Red
    fireEvent.click(screen.getByText("Red"))

    const addButton = screen.getByTestId("add-product-button")
    expect(addButton).toBeEnabled()
    expect(addButton).toHaveTextContent("Add to Cart")
  })

  it("calls addToCart when button clicked", async () => {
    render(<ProductActions product={mockProduct} region={mockRegion} />)

    fireEvent.click(screen.getByText("S"))
    fireEvent.click(screen.getByText("Red"))

    const addButton = screen.getByTestId("add-product-button")
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith({
        variantId: "var_1",
        quantity: 1,
        countryCode: "us",
      })
    })
  })

  it("shows Out of Stock for out of stock variant", () => {
    render(<ProductActions product={mockProduct} region={mockRegion} />)

    // Select Size M (var_2 is M/Blue and quantity 0)
    fireEvent.click(screen.getByText("M"))
    fireEvent.click(screen.getByText("Blue"))

    const addButton = screen.getByTestId("add-product-button")
    expect(addButton).toBeDisabled()
    expect(addButton).toHaveTextContent("Out of Stock")
  })

  it("automatically selects options if only 1 variant exists", () => {
    const singleVariantProduct = {
      ...mockProduct,
      variants: [mockProduct.variants[0]],
      options: mockProduct.options, // Kept same options for structure
    }

    render(<ProductActions product={singleVariantProduct} region={mockRegion} />)

    const addButton = screen.getByTestId("add-product-button")
    // Should be pre-selected and enabled
    expect(addButton).toBeEnabled()
  })
})