import { describe, it, expect, vi, beforeEach } from "vitest"
import { listProducts, listProductsWithSort } from "../products"

const {
  mockFetch,
  mockGetAuthHeaders,
  mockGetCacheOptions,
  mockGetRegion,
  mockRetrieveRegion,
  mockSortProducts,
} = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheOptions: vi.fn(),
  mockGetRegion: vi.fn(),
  mockRetrieveRegion: vi.fn(),
  mockSortProducts: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    client: {
      fetch: (...args: any[]) => mockFetch(...args),
    },
  },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
}))

vi.mock("../regions", () => ({
  getRegion: (...args: any[]) => mockGetRegion(...args),
  retrieveRegion: (...args: any[]) => mockRetrieveRegion(...args),
}))

vi.mock("@lib/util/sort-products", () => ({
  sortProducts: (...args: any[]) => mockSortProducts(...args),
}))

describe("data/products", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetRegion.mockReset()
    mockRetrieveRegion.mockReset()
    mockSortProducts.mockReset()

    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
    mockSortProducts.mockImplementation((products: any[]) => products)
  })

  it("throws if neither countryCode nor regionId provided", async () => {
    await expect(listProducts({} as any)).rejects.toThrow(
      "Country code or region ID is required"
    )
  })

  it("returns empty response when region is missing", async () => {
    mockGetRegion.mockResolvedValue(null)

    const res = await listProducts({ countryCode: "us" })

    expect(res).toEqual({
      response: { products: [], count: 0 },
      nextPage: null,
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("lists products using countryCode -> getRegion and computes nextPage", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })
    mockFetch.mockResolvedValue({ products: [{ id: "p1" }], count: 13 })

    const res = await listProducts({
      pageParam: 1,
      countryCode: "us",
      queryParams: { limit: 12 } as any,
    })

    expect(res.response.products).toEqual([{ id: "p1" }])
    expect(res.response.count).toBe(13)
    expect(res.nextPage).toBe(2)

    expect(mockFetch).toHaveBeenCalledWith(
      "/store/products",
      expect.objectContaining({
        method: "GET",
        query: expect.objectContaining({
          limit: 12,
          offset: 0,
          region_id: "reg_1",
        }),
        cache: "force-cache",
      })
    )
  })

  it("lists products using regionId -> retrieveRegion", async () => {
    mockRetrieveRegion.mockResolvedValue({ id: "reg_2" })
    mockFetch.mockResolvedValue({ products: [], count: 0 })

    const res = await listProducts({
      pageParam: 1,
      regionId: "reg_2",
      queryParams: { limit: 12 } as any,
    })

    expect(res.response.count).toBe(0)
    expect(res.nextPage).toBeNull()
    expect(mockRetrieveRegion).toHaveBeenCalledWith("reg_2")
  })

  it("listProductsWithSort sorts and paginates", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })
    mockFetch.mockResolvedValue({
      products: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      count: 4,
    })

    mockSortProducts.mockImplementation((products: any[]) => [
      ...products,
    ].reverse())

    const res = await listProductsWithSort({
      page: 1,
      queryParams: { limit: 2 } as any,
      sortBy: "created_at" as any,
      countryCode: "us",
    })

    expect(mockSortProducts).toHaveBeenCalled()
    expect(res.response.products.map((p: any) => p.id)).toEqual(["d", "c"])
    expect(res.nextPage).toBe(2)
  })
})

