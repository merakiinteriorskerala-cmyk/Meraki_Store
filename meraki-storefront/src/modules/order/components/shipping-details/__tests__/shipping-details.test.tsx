import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@lib/util/money", () => ({
  convertToLocale: () => "$15.00",
}))

vi.mock("@modules/common/components/divider", () => ({
  default: () => <div data-testid="divider" />,
}))

vi.mock("@medusajs/ui", () => ({
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

import ShippingDetails from "../index"

describe("ShippingDetails", () => {
  it("renders address, contact, and method summaries", () => {
    const order: any = {
      currency_code: "usd",
      email: "user@example.com",
      shipping_address: {
        first_name: "Jane",
        last_name: "Doe",
        address_1: "123 Main",
        address_2: "Apt 4",
        postal_code: "12345",
        city: "Pune",
        country_code: "in",
        phone: "1234567890",
      },
      shipping_methods: [{ name: "Express", total: 1500 }],
    }

    render(<ShippingDetails order={order} />)

    const address = screen.getByTestId("shipping-address-summary")
    const contact = screen.getByTestId("shipping-contact-summary")
    const method = screen.getByTestId("shipping-method-summary")

    expect(address).toBeInTheDocument()
    expect(contact).toBeInTheDocument()
    expect(method).toBeInTheDocument()

    expect(address).toHaveTextContent("Jane")
    expect(address).toHaveTextContent("Doe")
    expect(address).toHaveTextContent("123 Main")
    expect(address).toHaveTextContent("Apt 4")
    expect(address).toHaveTextContent("12345")
    expect(address).toHaveTextContent("Pune")
    expect(address).toHaveTextContent("IN")

    expect(contact).toHaveTextContent("1234567890")
    expect(contact).toHaveTextContent("user@example.com")

    expect(method).toHaveTextContent("Express")
    expect(method).toHaveTextContent("$15.00")
  })
})