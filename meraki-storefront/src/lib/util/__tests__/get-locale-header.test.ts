import { describe, it, expect, vi } from "vitest"
import { getLocaleHeader } from "../get-locale-header"

vi.mock("@lib/data/locale-actions", () => ({
  getLocale: vi.fn(async () => "en"),
}))

describe("getLocaleHeader", () => {
  it("returns x-medusa-locale header", async () => {
    await expect(getLocaleHeader()).resolves.toEqual({ "x-medusa-locale": "en" })
  })
})