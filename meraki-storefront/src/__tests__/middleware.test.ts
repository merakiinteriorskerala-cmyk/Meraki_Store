import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/server", () => {
  class NextResponse {
    cookies = { set: vi.fn() as any }
    headers = new Headers()
    status?: number
    body?: any

    constructor(body?: any, init?: { status?: number }) {
      this.body = body
      this.status = init?.status
    }

    static redirect(url: string, status = 307) {
      const res = new NextResponse(undefined, { status })
      res.headers.set("location", url)
      return res
    }

    static next() {
      const res = new NextResponse(undefined, { status: 200 })
      res.headers.set("x-next", "1")
      return res
    }
  }

  return {
    NextResponse,
    NextRequest: class NextRequest {},
  }
})

function makeRequest({
  href,
  origin,
  pathname,
  search = "",
  headers = {},
  cookies = {},
}: {
  href: string
  origin: string
  pathname: string
  search?: string
  headers?: Record<string, string>
  cookies?: Record<string, string | undefined>
}) {
  return {
    nextUrl: { href, origin, pathname, search },
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
    cookies: {
      get: (name: string) => {
        const v = cookies[name]
        return v ? { value: v } : undefined
      },
    },
  } as any
}

describe("middleware", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()

    process.env.MEDUSA_BACKEND_URL = "http://backend"
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = "pk_test"
    process.env.NEXT_PUBLIC_DEFAULT_REGION = "in"

    vi.stubGlobal("crypto", { randomUUID: () => "uuid_1" })
  })

  it("returns NextResponse.next when url already has country code and cache cookie exists", async () => {
    const fetchSpy = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        regions: [{ id: "r1", countries: [{ iso_2: "us" }, { iso_2: "in" }] }],
      }),
    }))
    vi.stubGlobal("fetch", fetchSpy as any)

    const { middleware } = await import("../middleware")

    const req = makeRequest({
      href: "http://localhost/us/store",
      origin: "http://localhost",
      pathname: "/us/store",
      cookies: { _medusa_cache_id: "cache_1" },
    })

    const res = await middleware(req)
    expect(res.headers.get("x-next")).toBe("1")
  })

  it("redirects to same url and sets cache cookie when url has country code but cookie missing", async () => {
    const fetchSpy = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        regions: [{ id: "r1", countries: [{ iso_2: "us" }, { iso_2: "in" }] }],
      }),
    }))
    vi.stubGlobal("fetch", fetchSpy as any)

    const { middleware } = await import("../middleware")

    const req = makeRequest({
      href: "http://localhost/us/store",
      origin: "http://localhost",
      pathname: "/us/store",
    })

    const res: any = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get("location")).toBe("http://localhost/us/store")
    expect(res.cookies.set).toHaveBeenCalledWith("_medusa_cache_id", "uuid_1", {
      maxAge: 60 * 60 * 24,
    })
  })

  it("returns NextResponse.next for static assets", async () => {
    const fetchSpy = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        regions: [{ id: "r1", countries: [{ iso_2: "us" }, { iso_2: "in" }] }],
      }),
    }))
    vi.stubGlobal("fetch", fetchSpy as any)

    const { middleware } = await import("../middleware")

    const req = makeRequest({
      href: "http://localhost/logo.png",
      origin: "http://localhost",
      pathname: "/logo.png",
    })

    const res = await middleware(req)
    expect(res.headers.get("x-next")).toBe("1")
  })

  it("redirects to default region when url has no country code", async () => {
    const fetchSpy = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        regions: [{ id: "r1", countries: [{ iso_2: "us" }, { iso_2: "in" }] }],
      }),
    }))
    vi.stubGlobal("fetch", fetchSpy as any)

    const { middleware } = await import("../middleware")

    const req = makeRequest({
      href: "http://localhost/?q=1",
      origin: "http://localhost",
      pathname: "/",
      search: "?q=1",
    })

    const res: any = await middleware(req)
    expect(res.status).toBe(307)
    expect(res.headers.get("location")).toBe("http://localhost/in?q=1")
  })
})