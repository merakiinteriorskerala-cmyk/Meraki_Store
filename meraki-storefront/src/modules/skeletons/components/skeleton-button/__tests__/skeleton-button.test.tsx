import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import SkeletonButton from "../index"

describe("SkeletonButton", () => {
  it("renders skeleton button", () => {
    const { container } = render(<SkeletonButton />)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain("bg-gray-100")
  })
})