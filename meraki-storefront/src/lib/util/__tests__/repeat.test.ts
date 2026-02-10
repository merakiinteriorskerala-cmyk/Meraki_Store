import { describe, it, expect } from "vitest"
import repeat from "../repeat"

describe("repeat", () => {
  it("creates an array [0..times-1]", () => {
    expect(repeat(3)).toEqual([0, 1, 2])
  })

  it("returns [] for 0", () => {
    expect(repeat(0)).toEqual([])
  })
})