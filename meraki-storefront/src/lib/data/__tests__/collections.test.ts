import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  retrieveCollection,
  listCollections,
  getCollectionByHandle,
} from "../collections"

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

describe("data/collections", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheOptions.mockResolvedValue({ tags: ["t"] })
  })

  it("retrieveCollection returns collection", async () => {
    mockFetch.mockResolvedValue({ collection: { id: "col_1" } })

    await expect(retrieveCollection("col_1")).resolves.toEqual({ id: "col_1" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/store/collections/col_1",
      expect.objectContaining({ cache: "force-cache" })
    )
  })

  it("listCollections returns collections and count", async () => {
    mockFetch.mockResolvedValue({ collections: [{ id: "c1" }, { id: "c2" }], count: 2 })

    const res = await listCollections()
    expect(res.collections).toEqual([{ id: "c1" }, { id: "c2" }])
    expect(res.count).toBe(2)
  })

  it("getCollectionByHandle returns first collection", async () => {
    mockFetch.mockResolvedValue({ collections: [{ id: "c1" }] })

    await expect(getCollectionByHandle("handle")).resolves.toEqual({ id: "c1" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/store/collections",
      expect.objectContaining({
        query: expect.objectContaining({ handle: "handle", fields: "*products" }),
      })
    )
  })
})