import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  retrieveCustomer,
  updateCustomer,
  signup,
  login,
  signout,
  transferCart,
  addCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from "../customer"

const {
  mockFetch,
  mockGetAuthHeaders,
  mockGetCacheOptions,
  mockGetCacheTag,
  mockGetCartId,
  mockSetAuthToken,
  mockRemoveAuthToken,
  mockRemoveCartId,
  mockRevalidateTag,
  mockRedirect,
  mockAuthRegister,
  mockAuthLogin,
  mockCustomerCreate,
  mockCustomerUpdate,
  mockCustomerRetrieve,
  mockCreateAddress,
  mockDeleteAddress,
  mockUpdateAddress,
  mockCartTransfer,
  mockAuthLogout,
} = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheOptions: vi.fn(),
  mockGetCacheTag: vi.fn(),
  mockGetCartId: vi.fn(),
  mockSetAuthToken: vi.fn(),
  mockRemoveAuthToken: vi.fn(),
  mockRemoveCartId: vi.fn(),
  mockRevalidateTag: vi.fn(),
  mockRedirect: vi.fn(),
  mockAuthRegister: vi.fn(),
  mockAuthLogin: vi.fn(),
  mockCustomerCreate: vi.fn(),
  mockCustomerUpdate: vi.fn(),
  mockCustomerRetrieve: vi.fn(),
  mockCreateAddress: vi.fn(),
  mockDeleteAddress: vi.fn(),
  mockUpdateAddress: vi.fn(),
  mockCartTransfer: vi.fn(),
  mockAuthLogout: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    client: { fetch: (...args: any[]) => mockFetch(...args) },
    auth: {
      register: (...args: any[]) => mockAuthRegister(...args),
      login: (...args: any[]) => mockAuthLogin(...args),
      logout: (...args: any[]) => mockAuthLogout(...args),
    },
    store: {
      customer: {
        create: (...args: any[]) => mockCustomerCreate(...args),
        update: (...args: any[]) => mockCustomerUpdate(...args),
        retrieve: (...args: any[]) => mockCustomerRetrieve(...args),
        createAddress: (...args: any[]) => mockCreateAddress(...args),
        deleteAddress: (...args: any[]) => mockDeleteAddress(...args),
        updateAddress: (...args: any[]) => mockUpdateAddress(...args),
      },
      cart: {
        transferCart: (...args: any[]) => mockCartTransfer(...args),
      },
    },
  },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
  getCacheTag: (...args: any[]) => mockGetCacheTag(...args),
  getCartId: (...args: any[]) => mockGetCartId(...args),
  setAuthToken: (...args: any[]) => mockSetAuthToken(...args),
  removeAuthToken: (...args: any[]) => mockRemoveAuthToken(...args),
  removeCartId: (...args: any[]) => mockRemoveCartId(...args),
}))

vi.mock("next/cache", () => ({
  revalidateTag: (...args: any[]) => mockRevalidateTag(...args),
}))

vi.mock("next/navigation", () => ({
  redirect: (...args: any[]) => mockRedirect(...args),
}))

describe("data/customer", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockGetCacheTag.mockReset()
    mockGetCartId.mockReset()
    mockSetAuthToken.mockReset()
    mockRemoveAuthToken.mockReset()
    mockRemoveCartId.mockReset()
    mockRevalidateTag.mockReset()
    mockRedirect.mockReset()
    mockAuthRegister.mockReset()
    mockAuthLogin.mockReset()
    mockCustomerCreate.mockReset()
    mockCustomerUpdate.mockReset()
    mockCustomerRetrieve.mockReset()
    mockCreateAddress.mockReset()
    mockDeleteAddress.mockReset()
    mockUpdateAddress.mockReset()
    mockCartTransfer.mockReset()
    mockAuthLogout.mockReset()

    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
    mockGetCacheTag.mockImplementation(async (tag: string) => `${tag}-x`)
  })

  it("retrieveCustomer returns null when not authenticated", async () => {
    mockGetAuthHeaders.mockResolvedValue(undefined)
    await expect(retrieveCustomer()).resolves.toBeNull()
  })

  it("retrieveCustomer returns customer when authenticated", async () => {
    mockGetAuthHeaders.mockResolvedValue({})
    mockFetch.mockResolvedValue({ customer: { id: "cust_1" } })
    await expect(retrieveCustomer()).resolves.toEqual({ id: "cust_1" })
  })

  it("updateCustomer returns updated customer and revalidates", async () => {
    mockCustomerUpdate.mockResolvedValue({ customer: { id: "cust_1" } } as any)
    const res = await updateCustomer({ first_name: "A" } as any)
    expect(res.id).toBe("cust_1")
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
  })

  it("transferCart returns error when no cart", async () => {
    mockGetCartId.mockResolvedValue(undefined)
    await expect(transferCart()).resolves.toBe("No cart found")
  })

  it("transferCart verifies token and revalidates", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockCustomerRetrieve.mockResolvedValue({ customer: { id: "cust_1" } } as any)
    mockCartTransfer.mockResolvedValue({})
    await transferCart()
    expect(mockCartTransfer).toHaveBeenCalledWith("c1", {}, {})
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
  })

  it("signup registers, creates customer, logs in, sets tokens, revalidates and transfers cart", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockAuthRegister.mockResolvedValue("t1")
    mockAuthLogin.mockResolvedValue("t2")
    mockCustomerCreate.mockResolvedValue({ customer: { id: "cust_new" } } as any)
    mockCartTransfer.mockResolvedValue({})

    const fd = new FormData()
    fd.set("email", "a@b.com")
    fd.set("password", "secret")
    fd.set("first_name", "A")
    fd.set("last_name", "B")
    fd.set("phone", "123")

    const created = await signup(undefined, fd)
    expect(mockSetAuthToken).toHaveBeenCalledWith("t1")
    expect(mockSetAuthToken).toHaveBeenCalledWith("t2")
    expect(created.id).toBe("cust_new")
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
    expect(mockCartTransfer).toHaveBeenCalled()
  })

  it("login sets token, revalidates, and transfers cart", async () => {
    mockGetCartId.mockResolvedValue("c1")
    mockAuthLogin.mockResolvedValue("t2")
    mockCartTransfer.mockResolvedValue({})
    const fd = new FormData()
    fd.set("email", "a@b.com")
    fd.set("password", "secret")
    await login(undefined, fd)
    expect(mockSetAuthToken).toHaveBeenCalledWith("t2")
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
    expect(mockCartTransfer).toHaveBeenCalled()
  })

  it("signout logs out, clears tokens and cart, revalidates, and redirects", async () => {
    await signout("us")
    expect(mockAuthLogout).toHaveBeenCalled()
    expect(mockRemoveAuthToken).toHaveBeenCalled()
    expect(mockRemoveCartId).toHaveBeenCalled()
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
    expect(mockRevalidateTag).toHaveBeenCalledWith("carts-x")
    expect(mockRedirect).toHaveBeenCalledWith("/us/account")
  })

  it("addCustomerAddress creates address and revalidates", async () => {
    mockCreateAddress.mockResolvedValue({ customer: { id: "cust_1" } } as any)
    const fd = new FormData()
    fd.set("first_name", "A")
    fd.set("last_name", "B")
    fd.set("company", "")
    fd.set("address_1", "123")
    fd.set("address_2", "")
    fd.set("city", "X")
    fd.set("postal_code", "10000")
    fd.set("province", "CA")
    fd.set("country_code", "US")
    fd.set("phone", "123")
    const res = await addCustomerAddress({ isDefaultBilling: true, isDefaultShipping: false }, fd)
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
  })

  it("deleteCustomerAddress deletes and revalidates", async () => {
    mockDeleteAddress.mockResolvedValue({})
    await deleteCustomerAddress("addr_1")
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
  })

  it("updateCustomerAddress requires addressId and updates when provided", async () => {
    const fd = new FormData()
    fd.set("addressId", "addr_1")
    fd.set("first_name", "A")
    fd.set("last_name", "B")
    fd.set("company", "")
    fd.set("address_1", "123")
    fd.set("address_2", "")
    fd.set("city", "X")
    fd.set("postal_code", "10000")
    fd.set("province", "CA")
    fd.set("country_code", "US")

    mockUpdateAddress.mockResolvedValue({})
    const res = await updateCustomerAddress({}, fd)
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith("customers-x")
  })
})