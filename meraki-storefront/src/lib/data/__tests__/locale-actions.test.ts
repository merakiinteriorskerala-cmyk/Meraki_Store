import { describe, it, expect, vi, beforeEach } from "vitest"
import { getLocale, setLocaleCookie, updateLocale } from "../locale-actions"

const {
  mockNextCookies,
  mockRevalidateTag,
  mockGetAuthHeaders,
  mockGetCacheTag,
  mockGetCartId,
  mockCartUpdate,
} = vi.hoisted(() => ({
  mockNextCookies: vi.fn(),
  mockRevalidateTag: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheTag: vi.fn(),
  mockGetCartId: vi.fn(),
  mockCartUpdate: vi.fn(),
}))

vi.mock("next/headers", () => ({
  cookies: mockNextCookies,
}))

vi.mock("next/cache", () => ({
  revalidateTag: (...args: any[]) => mockRevalidateTag(...args),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    store: {
      cart: {
        update: (...args: any[]) => mockCartUpdate(...args),
      },
    },
  },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheTag: (...args: any[]) => mockGetCacheTag(...args),
  getCartId: (...args: any[]) => mockGetCartId(...args),
}))

describe("data/locale-actions", () => {
  let store: Map<string, string>
  let setSpy: ReturnType<
    typeof vi.fn<(name: string, value: string, opts?: any) => void>
  >

  beforeEach(() => {
    store = new Map()
    setSpy = vi.fn<(name: string, value: string, opts?: any) => void>(
      (name, value) => store.set(name, value)
    )

    mockNextCookies.mockResolvedValue({
      get: (name: string) =>
        store.has(name) ? { value: store.get(name) } : undefined,
      set: (name: string, value: string, _opts?: any) => setSpy(name, value),
    })

    mockRevalidateTag.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheTag.mockReset()
    mockGetCartId.mockReset()
    mockCartUpdate.mockReset()
  })

  it("getLocale returns locale cookie value", async () => {
    store.set("_medusa_locale", "en")
    await expect(getLocale()).resolves.toBe("en")
  })

  it("getLocale returns null when cookie missing", async () => {
    await expect(getLocale()).resolves.toBeNull()
  })

  it("setLocaleCookie sets _medusa_locale", async () => {
    await setLocaleCookie("fr")
    expect(setSpy).toHaveBeenCalledWith("_medusa_locale", "fr")
  })

  it("updateLocale updates cookie and revalidates tags (no cart)", async () => {
    mockGetCartId.mockResolvedValue(undefined)
    mockGetCacheTag.mockImplementation(async (tag: string) => `${tag}-x`)

    await expect(updateLocale("en")).resolves.toBe("en")

    expect(setSpy).toHaveBeenCalledWith("_medusa_locale", "en")
    expect(mockCartUpdate).not.toHaveBeenCalled()

    expect(mockRevalidateTag).toHaveBeenCalledWith("products-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("categories-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("collections-x")
  })

  it("updateLocale updates cart and revalidates cart tag when cart exists", async () => {
    mockGetCartId.mockResolvedValue("cart_1")
    mockGetAuthHeaders.mockResolvedValue({ authorization: "Bearer t" })
    mockGetCacheTag.mockImplementation(async (tag: string) => `${tag}-x`)

    await expect(updateLocale("en")).resolves.toBe("en")

    expect(mockCartUpdate).toHaveBeenCalledWith(
      "cart_1",
      { locale: "en" },
      {},
      { authorization: "Bearer t" }
    )
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })
})