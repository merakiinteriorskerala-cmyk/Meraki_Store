import { describe, it, expect, vi, beforeEach } from "vitest"
import medusaError from "../medusa-error"

describe("medusaError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("throws formatted error message when error.response exists", () => {
    const err: any = {
      config: { url: "/path", baseURL: "https://api.example.com" },
      response: {
        status: 400,
        headers: { "x-test": "1" },
        data: { message: "bad request" },
      },
    }

    expect(() => medusaError(err)).toThrow("Bad request.")
  })

  it("throws when error.request exists", () => {
    const err: any = { request: "timeout" }
    expect(() => medusaError(err)).toThrow("No response received: timeout")
  })

  it("throws when setup error occurs", () => {
    const err: any = { message: "boom" }
    expect(() => medusaError(err)).toThrow("Error setting up the request: boom")
  })
})