import { describe, it, expect } from "vitest"
import { getPercentageDiff } from "../get-percentage-diff"

describe("getPercentageDiff", () => {
  it("returns percentage decrease as a rounded string", () => {
    expect(getPercentageDiff(100, 80)).toBe("20")
  })

  it("returns negative percentage when calculated is higher than original", () => {
    expect(getPercentageDiff(100, 120)).toBe("-20")
  })

  it("rounds using toFixed() rules", () => {
    expect(getPercentageDiff(3, 2)).toBe("33")
  })
})