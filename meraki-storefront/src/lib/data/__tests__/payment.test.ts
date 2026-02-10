import { describe, it, expect, vi, beforeEach } from "vitest"
import { listCartPaymentMethods } from "../payment"

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

describe("data/payment", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("returns sorted payment providers by id", async () => {
    mockFetch.mockResolvedValue({
      payment_providers: [{ id: "z" }, { id: "a" }, { id: "m" }],
    })

    const res = await listCartPaymentMethods("reg_1")
    expect(res?.map((p: any) => p.id)).toEqual(["a", "m", "z"])
  })

  it("returns null on error", async () => {
    mockFetch.mockRejectedValue(new Error("fail"))
    await expect(listCartPaymentMethods("reg_1")).resolves.toBeNull()
  })
})