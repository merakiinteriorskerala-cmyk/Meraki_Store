import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  retrieveOrder,
  listOrders,
  createTransferRequest,
  acceptTransferRequest,
  declineTransferRequest,
} from "../orders"

const {
  mockFetch,
  mockGetAuthHeaders,
  mockGetCacheOptions,
  mockRequestTransfer,
  mockAcceptTransfer,
  mockDeclineTransfer,
} = vi.hoisted(() => ({
  mockFetch: vi.fn(),
  mockGetAuthHeaders: vi.fn(),
  mockGetCacheOptions: vi.fn(),
  mockRequestTransfer: vi.fn(),
  mockAcceptTransfer: vi.fn(),
  mockDeclineTransfer: vi.fn(),
}))

vi.mock("@lib/config", () => ({
  sdk: {
    client: { fetch: (...args: any[]) => mockFetch(...args) },
    store: {
      order: {
        requestTransfer: (...args: any[]) => mockRequestTransfer(...args),
        acceptTransfer: (...args: any[]) => mockAcceptTransfer(...args),
        declineTransfer: (...args: any[]) => mockDeclineTransfer(...args),
      },
    },
  },
}))

vi.mock("../cookies", () => ({
  getAuthHeaders: (...args: any[]) => mockGetAuthHeaders(...args),
  getCacheOptions: (...args: any[]) => mockGetCacheOptions(...args),
}))

vi.mock("@lib/util/medusa-error", () => ({
  default: (err: any) => {
    throw err
  },
}))

describe("data/orders", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockGetAuthHeaders.mockReset()
    mockGetCacheOptions.mockReset()
    mockRequestTransfer.mockReset()
    mockAcceptTransfer.mockReset()
    mockDeclineTransfer.mockReset()

    mockGetAuthHeaders.mockResolvedValue({})
    mockGetCacheOptions.mockResolvedValue({})
  })

  it("retrieveOrder returns order", async () => {
    mockFetch.mockResolvedValue({ order: { id: "o1" } })
    await expect(retrieveOrder("o1")).resolves.toEqual({ id: "o1" })
  })

  it("listOrders returns orders", async () => {
    mockFetch.mockResolvedValue({ orders: [{ id: "o1" }] })
    await expect(listOrders(10, 0)).resolves.toEqual([{ id: "o1" }])
  })

  it("createTransferRequest returns error when order_id missing", async () => {
    const fd = new FormData()
    const res = await createTransferRequest(
      { success: false, error: null, order: null },
      fd
    )
    expect(res.success).toBe(false)
    expect(res.error).toBe("Order ID is required")
  })

  it("createTransferRequest success", async () => {
    const fd = new FormData()
    fd.set("order_id", "o1")

    mockRequestTransfer.mockResolvedValue({ order: { id: "o1" } })

    const res = await createTransferRequest(
      { success: false, error: null, order: null },
      fd
    )

    expect(res).toEqual({ success: true, error: null, order: { id: "o1" } })
  })

  it("acceptTransferRequest returns success", async () => {
    mockAcceptTransfer.mockResolvedValue({ order: { id: "o1" } })
    await expect(acceptTransferRequest("o1", "t")).resolves.toEqual({
      success: true,
      error: null,
      order: { id: "o1" },
    })
  })

  it("declineTransferRequest returns failure on error", async () => {
    mockDeclineTransfer.mockRejectedValue(new Error("bad token"))
    await expect(declineTransferRequest("o1", "t")).resolves.toEqual({
      success: false,
      error: "bad token",
      order: null,
    })
  })
})