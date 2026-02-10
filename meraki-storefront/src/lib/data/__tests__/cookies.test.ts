import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  getAuthHeaders,
  getCacheTag,
  getCacheOptions,
  setAuthToken,
  removeAuthToken,
  getCartId,
  setCartId,
  removeCartId,
} from "../cookies"

const { mockNextCookies } = vi.hoisted(() => ({
  mockNextCookies: vi.fn(),
}))

vi.mock("next/headers", () => ({
  cookies: mockNextCookies,
}))

describe("data/cookies", () => {
  let store: Map<string, string>
  let setSpy: ReturnType<
    typeof vi.fn<(name: string, value: string, opts?: any) => void>
  >
  const originalWindow = (globalThis as any).window

  beforeEach(() => {
    store = new Map()
    setSpy = vi.fn<(name: string, value: string, opts?: any) => void>(
      (name, value) => {
        store.set(name, value)
      }
    )

    mockNextCookies.mockResolvedValue({
      get: (name: string) =>
        store.has(name) ? { value: store.get(name) } : undefined,
      set: (name: string, value: string, _opts?: any) => setSpy(name, value),
    })
  })

  afterEach(() => {
    ;(globalThis as any).window = originalWindow
    vi.restoreAllMocks()
  })

  it("getAuthHeaders returns {} when jwt cookie missing", async () => {
    await expect(getAuthHeaders()).resolves.toEqual({})
  })

  it("getAuthHeaders returns authorization header when jwt cookie exists", async () => {
    store.set("_medusa_jwt", "token123")
    await expect(getAuthHeaders()).resolves.toEqual({
      authorization: "Bearer token123",
    })
  })

  it("getAuthHeaders returns {} when nextCookies throws", async () => {
    mockNextCookies.mockRejectedValueOnce(new Error("boom"))
    await expect(getAuthHeaders()).resolves.toEqual({})
  })

  it("getCacheTag returns '' when cache id missing", async () => {
    await expect(getCacheTag("products")).resolves.toBe("")
  })

  it("getCacheTag returns `${tag}-${cacheId}` when cache id exists", async () => {
    store.set("_medusa_cache_id", "abc")
    await expect(getCacheTag("products")).resolves.toBe("products-abc")
  })

  it("getCacheOptions returns {} in browser environment", async () => {
    ;(globalThis as any).window = {}
    await expect(getCacheOptions("products")).resolves.toEqual({})
  })

  it("getCacheOptions returns {} on server when no cache tag", async () => {
    ;(globalThis as any).window = undefined
    await expect(getCacheOptions("products")).resolves.toEqual({})
  })

  it("getCacheOptions returns tags on server when cache tag exists", async () => {
    ;(globalThis as any).window = undefined
    store.set("_medusa_cache_id", "abc")
    await expect(getCacheOptions("products")).resolves.toEqual({
      tags: ["products-abc"],
    })
  })

  it("setAuthToken sets _medusa_jwt", async () => {
    await setAuthToken("t1")
    expect(setSpy).toHaveBeenCalledWith("_medusa_jwt", "t1")
  })

  it("removeAuthToken clears _medusa_jwt", async () => {
    await removeAuthToken()
    expect(setSpy).toHaveBeenCalledWith("_medusa_jwt", "")
  })

  it("getCartId returns cart id from cookie", async () => {
    store.set("_medusa_cart_id", "cart_1")
    await expect(getCartId()).resolves.toBe("cart_1")
  })

  it("setCartId sets _medusa_cart_id", async () => {
    await setCartId("cart_2")
    expect(setSpy).toHaveBeenCalledWith("_medusa_cart_id", "cart_2")
  })

  it("removeCartId clears _medusa_cart_id", async () => {
    await removeCartId()
    expect(setSpy).toHaveBeenCalledWith("_medusa_cart_id", "")
  })
})