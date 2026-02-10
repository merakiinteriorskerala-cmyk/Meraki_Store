import { describe, it, expect, vi, beforeEach } from "vitest"
import { listCategories, getCategoryByHandle } from "../categories"

const { mockFetch, mockGetCacheOptions } = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetCacheOptions: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    client: {
      fetch: (...args: any[]) => mockFetch(...args),
    },
  },
}))

vi.mock("../cookies", () => ({
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
}))

describe("data/categories", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheOptions.mockResolvedValue({ tags: ["t"] })
  })

  it("listCategories returns product_categories", async () => {
    mockFetch.mockResolvedValue({
      product_categories: [{ id: "c1" }, { id: "c2" }],
    })

    const res = await listCategories({ limit: 2 })

    expect(res).toEqual([{ id: "c1" }, { id: "c2" }])
    expect(mockFetch).toHaveBeenCalledWith(
      "/store/product-categories",
      expect.objectContaining({
        cache: "force-cache",
        query: expect.objectContaining({ limit: 2 }),
      })
    )
  })

  it("getCategoryByHandle returns first category", async () => {
    mockFetch.mockResolvedValue({
      product_categories: [{ id: "cat_1" }],
    })

    const res = await getCategoryByHandle(["a", "b"])

    expect(res).toEqual({ id: "cat_1" })
    expect(mockFetch).toHaveBeenCalledWith(
      "/store/product-categories",
      expect.objectContaining({
        query: expect.objectContaining({ handle: "a/b" }),
      })
    )
  })
})