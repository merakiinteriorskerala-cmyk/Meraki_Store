import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockGetLocaleHeader } = vi.hoisted(() => ({
  mockGetLocaleHeader: vi.fn(),
}))

vi.mock("@lib/util/get-locale-header", () => ({
  getLocaleHeader: mockGetLocaleHeader,
}))

vi.mock("@medusajs/js-sdk", () => {
  class Medusa {
    client: { fetch: (input: any, init?: any) => Promise<any> }
    opts: any

    constructor(opts: any) {
      this.opts = opts
      this.client = {
        fetch: async (input: any, init?: any) => ({ input, init, opts }),
      }
    }
  }

  return {
    default: Medusa,
    FetchArgs: {},
    FetchInput: {},
  }
})

describe("lib/config sdk fetch wrapper", () => {
  beforeEach(() => {
    vi.resetModules()
    mockGetLocaleHeader.mockReset()
    process.env.MEDUSA_BACKEND_URL = "http://localhost:9000"
  })

  it("adds x-medusa-locale header when missing", async () => {
    mockGetLocaleHeader.mockResolvedValue({ "x-medusa-locale": "en" })

    const { sdk } = await import("../config")

    const res = await sdk.client.fetch<any>("/test", {
      headers: { "x-other": "1" },
    } as any)

    expect(res.init.headers["x-medusa-locale"]).toBe("en")
    expect(res.init.headers["x-other"]).toBe("1")
  })

  it("does not override x-medusa-locale if already provided", async () => {
    mockGetLocaleHeader.mockResolvedValue({ "x-medusa-locale": "en" })

    const { sdk } = await import("../config")

    const res = await sdk.client.fetch<any>("/test", {
      headers: { "x-medusa-locale": "fr" },
    } as any)

    expect(res.init.headers["x-medusa-locale"]).toBe("fr")
  })

  it("continues without locale header if getLocaleHeader throws", async () => {
    mockGetLocaleHeader.mockRejectedValue(new Error("boom"))

    const { sdk } = await import("../config")

    const res = await sdk.client.fetch<any>("/test", {
      headers: { "x-other": "1" },
    } as any)

    expect(res.init.headers["x-other"]).toBe("1")
    expect(res.init.headers["x-medusa-locale"]).toBeUndefined()
  })
})