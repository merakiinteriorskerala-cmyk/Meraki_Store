import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ShippingAddress from "../index"

// Mock dependencies
vi.mock("@modules/common/components/input", () => ({
  default: ({ name, label, value, onChange, "data-testid": testId }: any) => (
    <div data-testid="input-wrapper">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  ),
}))

vi.mock("@modules/common/components/checkbox", () => ({
  default: ({ name, label, checked, onChange, "data-testid": testId }: any) => (
    <div data-testid="checkbox-wrapper">
      <label htmlFor={name}>{label}</label>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        data-testid={testId}
      />
    </div>
  ),
}))

vi.mock("../../address-select", () => ({
  default: () => <div data-testid="address-select" />,
}))

vi.mock("../../country-select", () => ({
  default: ({ name, value, onChange, "data-testid": testId }: any) => (
    <select name={name} value={value} onChange={onChange} data-testid={testId}>
      <option value="">Select Country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
    </select>
  ),
}))

const mockRegion = {
  id: "reg_1",
  countries: [{ iso_2: "us" }, { iso_2: "ca" }],
}

const mockCart: any = {
  id: "cart_1",
  email: "test@example.com",
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New York",
    country_code: "us",
    postal_code: "10001",
    phone: "1234567890",
  },
  region: mockRegion,
}

const mockCustomer: any = {
  id: "cus_1",
  first_name: "John",
  email: "test@example.com",
  addresses: [
    {
      id: "addr_1",
      first_name: "John",
      country_code: "us",
    },
  ],
}

describe("ShippingAddress Component", () => {
  it("renders all form fields correctly", () => {
    render(
      <ShippingAddress
        cart={mockCart}
        customer={null}
        checked={true}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByTestId("shipping-first-name-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-last-name-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-address-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-city-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-postal-code-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-country-select")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-email-input")).toBeInTheDocument()
    expect(screen.getByTestId("shipping-phone-input")).toBeInTheDocument()
  })

  it("prefills form data from cart", () => {
    render(
      <ShippingAddress
        cart={mockCart}
        customer={null}
        checked={true}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByTestId("shipping-first-name-input")).toHaveValue("John")
    expect(screen.getByTestId("shipping-last-name-input")).toHaveValue("Doe")
    expect(screen.getByTestId("shipping-address-input")).toHaveValue("123 Main St")
    expect(screen.getByTestId("shipping-country-select")).toHaveValue("us")
  })

  it("updates form data on input change", () => {
    render(
      <ShippingAddress
        cart={mockCart}
        customer={null}
        checked={true}
        onChange={vi.fn()}
      />
    )

    const firstNameInput = screen.getByTestId("shipping-first-name-input")
    fireEvent.change(firstNameInput, { target: { value: "Jane" } })

    expect(firstNameInput).toHaveValue("Jane")
  })

  it("shows address select if customer has saved addresses in region", () => {
    render(
      <ShippingAddress
        cart={mockCart}
        customer={mockCustomer}
        checked={true}
        onChange={vi.fn()}
      />
    )

    expect(screen.getByTestId("address-select")).toBeInTheDocument()
    expect(screen.getByText(/Hi John, do you want to use/)).toBeInTheDocument()
  })

  it("does not show address select if customer has no addresses in region", () => {
    const customerWithForeignAddress = {
      ...mockCustomer,
      addresses: [
        {
          id: "addr_2",
          country_code: "fr", // Not in mockRegion (us, ca)
        },
      ],
    }

    render(
      <ShippingAddress
        cart={mockCart}
        customer={customerWithForeignAddress}
        checked={true}
        onChange={vi.fn()}
      />
    )

    expect(screen.queryByTestId("address-select")).not.toBeInTheDocument()
  })
})