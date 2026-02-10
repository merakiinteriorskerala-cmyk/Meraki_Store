import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  retrieveCart,
  getOrSetCart,
  updateCart,
  addToCart,
  updateLineItem,
  deleteLineItem,
  setShippingMethod,
  initiatePaymentSession,
  applyPromotions,
  submitPromotionForm,
  setAddresses,
  placeOrder,
  authorizePayment,
  waitForPaymentCompletion,
  updateRegion,
  listCartOptions,
} from "../cart"

const {
  mockFetch,
  mockGetAuthHeaders,
  mockGetCacheOptions,
  mockGetCacheTag,
  mockGetCartId,
  mockSetCartId,
  mockRemoveCartId,
  mockRevalidateTag,
  mockGetRegion,
  mockGetLocale,
  mockRedirect,
  mockCartCreate,
  mockCartUpdate,
  mockCartCreateLineItem,
  mockCartUpdateLineItem,
  mockCartDeleteLineItem,
  mockAddShippingMethod,
  mockCartComplete,
  mockInitiatePaymentSession,
} = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheOptions: vi.fn(),
  mockGetCacheTag: vi.fn(),
  mockGetCartId: vi.fn(),
  mockSetCartId: vi.fn(),
  mockRemoveCartId: vi.fn(),
  mockRevalidateTag: vi.fn(),
  mockGetRegion: vi.fn(),
  mockGetLocale: vi.fn(),
  mockRedirect: vi.fn(),
  mockCartCreate: vi.fn(),
  mockCartUpdate: vi.fn(),
  mockCartCreateLineItem: vi.fn(),
  mockCartUpdateLineItem: vi.fn(),
  mockCartDeleteLineItem: vi.fn(),
  mockAddShippingMethod: vi.fn(),
  mockCartComplete: vi.fn(),
  mockInitiatePaymentSession: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    client: { fetch: (...args: any[]) => mockFetch(...args) },
    store: {
      cart: {
        create: (...args: any[]) => mockCartCreate(...args),
        update: (...args: any[]) => mockCartUpdate(...args),
        createLineItem: (...args: any[]) => mockCartCreateLineItem(...args),
        updateLineItem: (...args: any[]) => mockCartUpdateLineItem(...args),
        deleteLineItem: (...args: any[]) => mockCartDeleteLineItem(...args),
        addShippingMethod: (...args: any[]) => mockAddShippingMethod(...args),
        complete: (...args: any[]) => mockCartComplete(...args),
        transferCart: vi.fn(),
      },
      payment: {
        initiatePaymentSession: (...args: any[]) =>
          mockInitiatePaymentSession(...args),
      },
    },
  },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
  getCacheTag: (...args: any[]) => mockGetCacheTag(...args),
  getCartId: (...args: any[]) => mockGetCartId(...args),
  setCartId: (...args: any[]) => mockSetCartId(...args),
  removeCartId: (...args: any[]) => mockRemoveCartId(...args),
}))

vi.mock("../regions", () => ({
  getRegion: (...args: any[]) => mockGetRegion(...args),
}))

vi.mock("@lib/data/locale-actions", () => ({
  getLocale: (...args: any[]) => mockGetLocale(...args),
}))

vi.mock("next/cache", () => ({
  revalidateTag: (...args: any[]) => mockRevalidateTag(...args),
}))

vi.mock("next/navigation", () => ({
  redirect: (...args: any[]) => mockRedirect(...args),
}))

describe("data/cart", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheTag.mockReset()
    mockGetCartId.mockReset()
    mockSetCartId.mockReset()
    mockRemoveCartId.mockReset()
    mockRevalidateTag.mockReset()
    mockGetRegion.mockReset()
    mockGetLocale.mockReset()
    mockRedirect.mockReset()
    mockCartCreate.mockReset()
    mockCartUpdate.mockReset()
    mockCartCreateLineItem.mockReset()
    mockCartUpdateLineItem.mockReset()
    mockCartDeleteLineItem.mockReset()
    mockAddShippingMethod.mockReset()
    mockCartComplete.mockReset()
    mockInitiatePaymentSession.mockReset()

    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
    mockGetCacheTag.mockImplementation(async (tag: string) => `${tag}-x`)
  })

  it("retrieveCart returns null when cookie id missing", async () => {
    mockGetCartId.mockResolvedValue(undefined)
    await expect(retrieveCart()).resolves.toBeNull()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it("retrieveCart returns cart when id present", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockFetch.mockResolvedValue({ cart: { id: "c1" } })
    await expect(retrieveCart()).resolves.toEqual({ id: "c1" })
  })

  it("getOrSetCart creates cart when none exists", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })
    mockGetCartId.mockResolvedValue(undefined)
    mockGetLocale.mockResolvedValue("en")
    mockCartCreate.mockResolvedValue({ cart: { id: "cart_new", region_id: "reg_1" } })

    const cart = await getOrSetCart("us")
    expect(mockSetCartId).toHaveBeenCalledWith("cart_new")
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(cart?.id).toBe("cart_new")
  })

  it("getOrSetCart updates region when mismatched", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_2" })
    mockGetCartId.mockResolvedValue("cart_1")
    mockFetch.mockResolvedValue({ cart: { id: "cart_1", region_id: "reg_1" } })

    await getOrSetCart("us")
    expect(mockCartUpdate).toHaveBeenCalledWith("cart_1", { region_id: "reg_2" }, {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("updateCart throws when no cartId", async () => {
    mockGetCartId.mockResolvedValue(undefined)
    await expect(updateCart({ email: "a@b.com" } as any)).rejects.toThrow(
      "No existing cart found, please create one before updating"
    )
  })

  it("updateCart revalidates carts and fulfillment", async () => {
    mockGetCartId.mockResolvedValue("cart_1")
    mockCartUpdate.mockResolvedValue({ cart: { id: "cart_1" } })
    await expect(updateCart({ email: "a@b.com" } as any)).resolves.toEqual({ id: "cart_1" })
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("fulfillment-x")
  })

  it("addToCart creates line item and revalidates", async () => {
    mockGetRegion.mockResolvedValue({ id: "reg_1" })
    mockGetCartId.mockResolvedValue(undefined)
    mockGetLocale.mockResolvedValue("en")
    mockCartCreate.mockResolvedValue({ cart: { id: "c1", region_id: "reg_1" } })
    mockCartCreateLineItem.mockResolvedValue({})

    await addToCart({ variantId: "v1", quantity: 2, countryCode: "us" })
    expect(mockCartCreateLineItem).toHaveBeenCalledWith("c1", { variant_id: "v1", quantity: 2 }, {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("fulfillment-x")
  })

  it("updateLineItem requires cartId and lineId", async () => {
    await expect(updateLineItem({ lineId: "", quantity: 1 })).rejects.toThrow(
      "Missing lineItem ID when updating line item"
    )
    mockGetCartId.mockResolvedValue(undefined)
    await expect(updateLineItem({ lineId: "li1", quantity: 1 })).rejects.toThrow(
      "Missing cart ID when updating line item"
    )
  })

  it("deleteLineItem deletes and revalidates", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartDeleteLineItem.mockResolvedValue({})
    await deleteLineItem("li1")
    expect(mockCartDeleteLineItem).toHaveBeenCalledWith("c1", "li1", {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("fulfillment-x")
  })

  it("setShippingMethod revalidates cart tag", async () => {
    mockAddShippingMethod.mockResolvedValue({})
    await setShippingMethod({ cartId: "c1", shippingMethodId: "opt_1" })
    expect(mockAddShippingMethod).toHaveBeenCalledWith("c1", { option_id: "opt_1" }, {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("initiatePaymentSession revalidates cart", async () => {
    mockInitiatePaymentSession.mockResolvedValue({ ok: true })
    const resp = await initiatePaymentSession({ id: "c1" } as any, { provider_id: "razorpay" } as any)
    expect(resp).toEqual({ ok: true })
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("applyPromotions updates and revalidates", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartUpdate.mockResolvedValue({})
    await applyPromotions(["WELCOME10"])
    expect(mockCartUpdate).toHaveBeenCalledWith("c1", { promo_codes: ["WELCOME10"] }, {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("fulfillment-x")
  })

  it("submitPromotionForm returns error message on failure", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartUpdate.mockRejectedValue(new Error("bad"))
    const fd = new FormData()
    fd.set("code", "WELCOME10")
    await expect(submitPromotionForm(undefined, fd)).resolves.toBe(
      "Error setting up the request: bad"
    )
  })

  it("setAddresses updates cart and redirects to delivery step", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartUpdate.mockResolvedValue({})
    const fd = new FormData()
    fd.set("shipping_address.first_name", "A")
    fd.set("shipping_address.last_name", "B")
    fd.set("shipping_address.address_1", "123")
    fd.set("shipping_address.company", "")
    fd.set("shipping_address.postal_code", "10000")
    fd.set("shipping_address.city", "X")
    fd.set("shipping_address.country_code", "US")
    fd.set("shipping_address.province", "CA")
    fd.set("shipping_address.phone", "123")
    fd.set("email", "a@b.com")
    fd.set("same_as_billing", "on")

    await setAddresses(undefined, fd)
    expect(mockCartUpdate).toHaveBeenCalled()
    expect(mockRedirect).toHaveBeenCalledWith("/US/checkout?step=delivery")
  })

  it("placeOrder redirects on order and clears cart cookie", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartComplete.mockResolvedValue({
      type: "order",
      order: { id: "o1", shipping_address: { country_code: "IN" } },
    })
    await placeOrder()
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("orders-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("products-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("variants-x")
    expect(mockRemoveCartId).toHaveBeenCalled()
    expect(mockRedirect).toHaveBeenCalledWith("/in/order/o1/confirmed")
  })

  it("placeOrder returns cart when not an order", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCartComplete.mockResolvedValue({ type: "cart", cart: { id: "c1" } })
    await expect(placeOrder()).resolves.toEqual({ id: "c1" })
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("authorizePayment posts verify and revalidates", async () => {
    mockGetAuthHeaders.mockResolvedValue({})
    mockFetch.mockImplementation(async (input: any, init?: any) => {
      if (typeof input === "string" && input.includes("/store/carts/")) {
        return {
          cart: {
            id: "c1",
            payment_collection: { payment_sessions: [{ id: "s1", provider_id: "razorpay" }] },
          },
        }
      }
      return { ok: true }
    })
    const resp = await authorizePayment("c1", "razorpay", { signature: "x" })
    expect(resp).toEqual({ ok: true })
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("waitForPaymentCompletion returns cart when authorized", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockGetAuthHeaders.mockResolvedValue({})
    mockFetch.mockResolvedValue({
      cart: {
        id: "c1",
        payment_collection: { payment_sessions: [{ provider_id: "razorpay", status: "authorized" }] },
      },
    })
    const cart = await waitForPaymentCompletion({ providerId: "razorpay" })
    expect(cart.id).toBe("c1")
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("updateRegion updates cart, revalidates caches, and redirects", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockGetRegion.mockResolvedValue({ id: "reg_1" })
    mockCartUpdate.mockResolvedValue({})
    await updateRegion("us", "/products")
    expect(mockCartUpdate).toHaveBeenCalledWith("c1", { region_id: "reg_1" }, {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("regions-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("products-x")
    expect(mockRedirect).toHaveBeenCalledWith("/us/products")
  })

  it("listCartOptions returns shipping options", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockFetch.mockResolvedValue({
      shipping_options: [{ id: "s1" }, { id: "s2" }],
    })
    const res = await listCartOptions()
    expect(res.shipping_options).toHaveLength(2)
    expect(mockFetch).toHaveBeenCalledWith("/store/shipping-options", expect.objectContaining({
      query: { cart_id: "c1" },
    }))
  })
})