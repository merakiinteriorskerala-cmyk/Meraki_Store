import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  listCartShippingMethods,
  calculatePriceForShippingOption,
} from "../fulfillment"

const { mockFetch, mockGetAuthHeaders, mockGetCacheOptions } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheOptions: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: { client: { fetch: (...args: any[]) => mockFetch(...args) } },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
}))

describe("data/fulfillment", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("listCartShippingMethods returns shipping_options", async () => {
    mockFetch.mockResolvedValue({ shipping_options: [{ id: "so_1" }] })

    await expect(listCartShippingMethods("cart_1")).resolves.toEqual([{ id: "so_1" }])
    expect(mockFetch).toHaveBeenCalledWith(
      "/store/shipping-options",
      expect.objectContaining({
        method: "GET",
        query: { cart_id: "cart_1" },
        cache: "force-cache",
      })
    )
  })

  it("listCartShippingMethods returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("fail"))
    await expect(listCartShippingMethods("cart_1")).resolves.toBeNull()
  })

  it("calculatePriceForShippingOption returns shipping_option", async () => {
    mockFetch.mockResolvedValue({ shipping_option: { id: "so_1" } })

    await expect(
      calculatePriceForShippingOption("so_1", "cart_1", { a: 1 })
    ).resolves.toEqual({ id: "so_1" })

    expect(mockFetch).toHaveBeenCalledWith(
      "/store/shipping-options/so_1/calculate",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({ cart_id: "cart_1", data: { a: 1 } }),
      })
    )
  })

  it("calculatePriceForShippingOption returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("fail"))
    await expect(calculatePriceForShippingOption("so_1", "cart_1")).resolves.toBeNull()
  })
})