import { describe, it, expect, vi, beforeEach } from "vitest"

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

vi.mock("@lib/util/medusa-error", () => ({
  default: (e: any) => {
    throw e
  },
}))

describe("data/regions", () => {
  beforeEach(() => {
    vi.resetModules()
    mockFetch.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("listRegions returns regions", async () => {
    const { listRegions } = await import("../regions")

    mockFetch.mockResolvedValue({ regions: [{ id: "r1" }] })

    await expect(listRegions()).resolves.toEqual([{ id: "r1" }])
  })

  it("retrieveRegion returns region", async () => {
    const { retrieveRegion } = await import("../regions")

    mockFetch.mockResolvedValue({ region: { id: "r1" } })

    await expect(retrieveRegion("r1")).resolves.toEqual({ id: "r1" })
  })

  it("getRegion maps countries and caches result", async () => {
    const { getRegion } = await import("../regions")

    mockFetch.mockResolvedValue({
      regions: [
        { id: "in_reg", countries: [{ iso_2: "in" }] },
        { id: "us_reg", countries: [{ iso_2: "us" }] },
      ],
    })

    const first = await getRegion("us")
    expect(first?.id).toBe("us_reg")

    mockFetch.mockClear()
    const second = await getRegion("us")
    expect(second?.id).toBe("us_reg")
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("getRegion returns null when listRegions fails", async () => {
    const { getRegion } = await import("../regions")

    mockFetch.mockRejectedValue(new Error("fail"))
    await expect(getRegion("us")).resolves.toBeNull()
  })
})