import { describe, it, expect } from "vitest"
import { sortProducts } from "../sort-products"

describe("sortProducts", () => {
  it("sorts by price_asc using min variant calculated_amount", () => {
    const products: any[] = [
      {
        id: "p1",
        variants: [
          { calculated_price: { calculated_amount: 500 } },
          { calculated_price: { calculated_amount: 200 } },
        ],
      },
      {
        id: "p2",
        variants: [{ calculated_price: { calculated_amount: 300 } }],
      },
    ]

    const sorted = sortProducts(products as any, "price_asc" as any) as any[]

    expect(sorted.map((p) => p.id)).toEqual(["p1", "p2"])
    expect(sorted[0]._minPrice).toBe(200)
    expect(sorted[1]._minPrice).toBe(300)
  })

  it("sorts by price_desc", () => {
    const products: any[] = [
      {
        id: "p1",
        variants: [
          { calculated_price: { calculated_amount: 500 } },
          { calculated_price: { calculated_amount: 200 } },
        ],
      },
      {
        id: "p2",
        variants: [{ calculated_price: { calculated_amount: 300 } }],
      },
    ]

    const sorted = sortProducts(products as any, "price_desc" as any) as any[]
    expect(sorted.map((p) => p.id)).toEqual(["p2", "p1"])
  })

  it("treats missing variants as Infinity for price sorting", () => {
    const products: any[] = [
      { id: "p1", variants: [{ calculated_price: { calculated_amount: 10 } }] },
      { id: "p2", variants: [] },
      { id: "p3" },
    ]

    const asc = sortProducts([...products] as any, "price_asc" as any) as any[]
    expect(asc.map((p) => p.id)).toEqual(["p1", "p2", "p3"])

    const desc = sortProducts([...products] as any, "price_desc" as any) as any[]
    expect(desc.map((p) => p.id)).toEqual(["p2", "p3", "p1"])
  })

  it("treats missing calculated_amount as 0", () => {
    const products: any[] = [
      {
        id: "p1",
        variants: [{ calculated_price: {} }],
      },
      {
        id: "p2",
        variants: [{ calculated_price: { calculated_amount: 5 } }],
      },
    ]

    const asc = sortProducts(products as any, "price_asc" as any) as any[]
    expect(asc.map((p) => p.id)).toEqual(["p1", "p2"])
  })

  it("sorts by created_at (descending, newest first)", () => {
    const products: any[] = [
      { id: "old", created_at: "2020-01-01T00:00:00.000Z" },
      { id: "new", created_at: "2024-01-01T00:00:00.000Z" },
      { id: "mid", created_at: "2022-01-01T00:00:00.000Z" },
    ]

    const sorted = sortProducts(products as any, "created_at" as any) as any[]
    expect(sorted.map((p) => p.id)).toEqual(["new", "mid", "old"])
  })
})