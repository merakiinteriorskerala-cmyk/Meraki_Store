import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@headlessui/react", () => {
  const Transition: any = ({ show, children }: any) =>
    show ? <div>{children}</div> : null
  Transition.Child = ({ children }: any) => <div>{children}</div>

  const Dialog: any = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  )
  Dialog.Panel = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  )
  Dialog.Title = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  )
  Dialog.Description = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  )

  return { Transition, Dialog }
})

vi.mock("@modules/common/icons/x", () => ({
  default: () => <span data-testid="x-icon" />,
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

import Modal from "../index"

describe("Modal", () => {
  it("renders content when open and closes via title button", () => {
    const close = vi.fn()

    render(
      <Modal isOpen={true} close={close} data-testid="modal">
        <Modal.Title>Title</Modal.Title>
        <Modal.Description>Desc</Modal.Description>
        <Modal.Body>Body</Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>
    )

    expect(screen.getByTestId("modal")).toBeInTheDocument()
    expect(screen.getByText("Title")).toBeInTheDocument()
    expect(screen.getByText("Desc")).toBeInTheDocument()
    expect(screen.getByText("Body")).toBeInTheDocument()
    expect(screen.getByText("Footer")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("close-modal-button"))
    expect(close).toHaveBeenCalledTimes(1)
  })

  it("does not render when closed", () => {
    render(
      <Modal isOpen={false} close={vi.fn()} data-testid="modal">
        <Modal.Title>Title</Modal.Title>
      </Modal>
    )

    expect(screen.queryByTestId("modal")).toBeNull()
  })

  it("applies size class for small", () => {
    render(
      <Modal isOpen={true} close={vi.fn()} size="small" data-testid="modal">
        <Modal.Title>Title</Modal.Title>
      </Modal>
    )

    expect(screen.getByTestId("modal").className).toContain("max-w-md")
  })
})