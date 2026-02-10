import { describe, it, expect } from "vitest"
import compareAddresses from "../compare-addresses"

describe("compareAddresses", () => {
  it("returns true when selected address fields match", () => {
    const a1 = {
      first_name: "A",
      last_name: "B",
      address_1: "Street",
      company: "Co",
      postal_code: "123",
      city: "City",
      country_code: "us",
      province: "CA",
      phone: "555",
      ignored: "x",
    }

    const a2 = {
      ...a1,
      ignored: "y",
    }

    expect(compareAddresses(a1, a2)).toBe(true)
  })

  it("returns false when a selected field differs", () => {
    const a1 = { first_name: "A", last_name: "B", address_1: "Street" }
    const a2 = { first_name: "A", last_name: "C", address_1: "Street" }

    expect(compareAddresses(a1, a2)).toBe(false)
  })
})