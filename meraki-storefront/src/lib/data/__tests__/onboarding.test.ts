import { describe, it, expect, vi, beforeEach } from "vitest"
import { resetOnboardingState } from "../onboarding"

const { mockNextCookies, mockRedirect } = vi.hoisted(() => ({
  mockNextCookies: vi.fn(),
  mockRedirect: vi.fn(),
}))

vi.mock("next/headers", () => ({
  cookies: mockNextCookies,
}))

vi.mock("next/navigation", () => ({
  redirect: (...args: any[]) => mockRedirect(...args),
}))

describe("data/onboarding", () => {
  beforeEach(() => {
    mockRedirect.mockReset()
    mockNextCookies.mockReset()
    const set = vi.fn()
    mockNextCookies.mockResolvedValue({ set })
  })

  it("clears onboarding cookie and redirects to admin order page", async () => {
    const cookiesObj = await mockNextCookies.mock.results[0]?.value
    await resetOnboardingState("order_1")

    const resolvedCookies = await mockNextCookies.mock.results[0]?.value
    const cookies = await resolvedCookies
    expect(cookies.set).toHaveBeenCalledWith("_medusa_onboarding", "false", { maxAge: -1 })
    expect(mockRedirect).toHaveBeenCalledWith("http://localhost:7001/a/orders/order_1")
  })
})