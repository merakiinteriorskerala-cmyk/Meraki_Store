import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModalProvider, useModal } from "../modal-context"

function Consumer() {
  const { close } = useModal()
  return (
    <button type="button" onClick={close}>
      Close
    </button>
  )
}

describe("modal-context", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {})
  })

  it("throws if useModal is used without ModalProvider", () => {
    expect(() => render(<Consumer />)).toThrow(
      "useModal must be used within a ModalProvider"
    )
  })

  it("provides close() via ModalProvider", async () => {
    const user = userEvent.setup()
    const close = vi.fn()

    const { getByRole } = render(
      <ModalProvider close={close}>
        <Consumer />
      </ModalProvider>
    )

    await user.click(getByRole("button", { name: "Close" }))
    expect(close).toHaveBeenCalledTimes(1)
  })
})