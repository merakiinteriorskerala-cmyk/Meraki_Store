import { describe, it, expect, vi, beforeEach } from "vitest"
import { retrieveVariant } from "../variants"

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

describe("data/variants", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("returns variant", async () => {
    mockFetch.mockResolvedValue({ variant: { id: "v1" } })
    await expect(retrieveVariant("v1")).resolves.toEqual({ id: "v1" })
  })

  it("returns null if getAuthHeaders returns null", async () => {
    mockGetAuthHeaders.mockResolvedValue(null)
    await expect(retrieveVariant("v1")).resolves.toBeNull()
  })

  it("returns null when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("fail"))
    await expect(retrieveVariant("v1")).resolves.toBeNull()
  })
})