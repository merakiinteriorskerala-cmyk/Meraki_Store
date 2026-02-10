import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { getBaseURL } from "../env"

describe("getBaseURL", () => {
  const original = process.env.NEXT_PUBLIC_BASE_URL

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL
  })

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_URL
    } else {
      process.env.NEXT_PUBLIC_BASE_URL = original
    }
  })

  it("returns default when NEXT_PUBLIC_BASE_URL is not set", () => {
    expect(getBaseURL()).toBe("https://localhost:8000")
  })

  it("returns NEXT_PUBLIC_BASE_URL when set", () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com"
    expect(getBaseURL()).toBe("https://example.com")
  })
})