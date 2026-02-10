import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockDeleteLineItem } = vi.hoisted(() => ({
  mockDeleteLineItem: vi.fn(),
}))

vi.mock("@lib/data/cart", () => ({
  deleteLineItem: (...args: any[]) => mockDeleteLineItem(...args),
}))

vi.mock("@medusajs/icons", () => ({
  Spinner: (props: any) => <span data-testid="spinner-icon" {...props} />,
  Trash: (props: any) => <span data-testid="trash-icon" {...props} />,
}))

vi.mock("@medusajs/ui", () => ({
  clx: (...args: any[]) =>
    args
      .flatMap((a: any) => {
        if (!a) return []
        if (typeof a === "string") return [a]
        if (typeof a === "object") {
          return Object.entries(a)
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k)
        }
        return []
      })
      .join(" "),
}))

import DeleteButton from "../index"

describe("DeleteButton", () => {
  beforeEach(() => {
    mockDeleteLineItem.mockReset()
  })

  it("calls deleteLineItem and shows spinner while deleting", () => {
    mockDeleteLineItem.mockReturnValue(new Promise(() => {}))

    render(<DeleteButton id="line_1">Remove</DeleteButton>)

    fireEvent.click(screen.getByText("Remove"))
    expect(mockDeleteLineItem).toHaveBeenCalledWith("line_1")
    expect(screen.getByTestId("spinner-icon")).toBeInTheDocument()
  })

  it("shows trash icon again when delete fails", async () => {
    mockDeleteLineItem.mockRejectedValue(new Error("fail"))

    render(<DeleteButton id="line_1">Remove</DeleteButton>)

    fireEvent.click(screen.getByText("Remove"))

    await waitFor(() =>
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument()
    )
  })
})