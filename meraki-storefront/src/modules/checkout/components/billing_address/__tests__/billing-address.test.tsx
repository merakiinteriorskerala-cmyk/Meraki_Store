import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import BillingAddress from "../index"

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
  billing_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "New York",
    country_code: "us",
    postal_code: "10001",
    phone: "1234567890",
    province: "NY",
    company: "Acme Inc",
  },
  region: mockRegion,
}

describe("BillingAddress Component", () => {
  it("renders all form fields correctly", () => {
    render(<BillingAddress cart={mockCart} />)

    expect(screen.getByTestId("billing-first-name-input")).toBeInTheDocument()
    expect(screen.getByTestId("billing-last-name-input")).toBeInTheDocument()
    expect(screen.getByTestId("billing-address-input")).toBeInTheDocument()
    expect(screen.getByTestId("billing-company-input")).toBeInTheDocument()
    expect(screen.getByTestId("billing-postal-input")).toBeInTheDocument()
    // City input doesn't have a test id in the component code I read!
    // Line 78-83:
    // <Input label="City" ... />
    // It is missing data-testid. I'll check if I can add it or target by label.
    // I mocked Input to render label. So I can target by label text "City".
    expect(screen.getByLabelText("City")).toBeInTheDocument()
    
    expect(screen.getByTestId("billing-country-select")).toBeInTheDocument()
    expect(screen.getByTestId("billing-province-input")).toBeInTheDocument()
    expect(screen.getByTestId("billing-phone-input")).toBeInTheDocument()
  })

  it("prefills form data from cart", () => {
    render(<BillingAddress cart={mockCart} />)

    expect(screen.getByTestId("billing-first-name-input")).toHaveValue("John")
    expect(screen.getByTestId("billing-last-name-input")).toHaveValue("Doe")
    expect(screen.getByTestId("billing-address-input")).toHaveValue("123 Main St")
    expect(screen.getByTestId("billing-country-select")).toHaveValue("us")
  })

  it("updates form data on input change", () => {
    render(<BillingAddress cart={mockCart} />)

    const firstNameInput = screen.getByTestId("billing-first-name-input")
    fireEvent.change(firstNameInput, { target: { value: "Jane" } })

    expect(firstNameInput).toHaveValue("Jane")
  })
})