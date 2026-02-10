import { describe, it, expect, vi, beforeEach } from "vitest"
import { listLocales } from "../locales"

const { mockFetch, mockGetCacheOptions } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetCacheOptions: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: { client: { fetch: (...args: any[]) => mockFetch(...args) } },
}))

vi.mock("../cookies", () => ({
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
}))

describe("data/locales", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("returns locales list", async () => {
    mockFetch.mockResolvedValue({ locales: [{ code: "en", name: "English" }] })
    await expect(listLocales()).resolves.toEqual([{ code: "en", name: "English" }])
  })

  it("returns null on error (e.g., 404/not configured)", async () => {
    mockFetch.mockRejectedValue(new Error("404"))
    await expect(listLocales()).resolves.toBeNull()
  })
})