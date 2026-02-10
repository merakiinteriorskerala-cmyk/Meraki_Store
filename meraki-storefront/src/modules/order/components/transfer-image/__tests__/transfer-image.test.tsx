import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import TransferImage from "../index"

describe("TransferImage", () => {
  it("renders an svg with expected dimensions", () => {
    const { container } = render(<TransferImage />)

    const svg = container.querySelector("svg")
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute("width")).toBe("280")
    expect(svg?.getAttribute("height")).toBe("181")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 280 181")
  })
})