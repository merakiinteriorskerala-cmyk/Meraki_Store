import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockAcceptTransferRequest, mockDeclineTransferRequest } = vi.hoisted(
  () => ({
    mockAcceptTransferRequest: vi.fn(),
    mockDeclineTransferRequest: vi.fn(),
  })
)

vi.mock("@lib/data/orders", () => ({
  acceptTransferRequest: (...args: any[]) =>
    mockAcceptTransferRequest(...args),
  declineTransferRequest: (...args: any[]) =>
    mockDeclineTransferRequest(...args),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}))

import TransferActions from "../index"

describe("TransferActions", () => {
  beforeEach(() => {
    mockAcceptTransferRequest.mockReset()
    mockDeclineTransferRequest.mockReset()
  })

  it("accepts transfer and shows success message", async () => {
    mockAcceptTransferRequest.mockResolvedValue({ success: true })

    render(<TransferActions id="order_1" token="tok_1" />)

    fireEvent.click(screen.getByText("Accept transfer"))

    await waitFor(() => {
      expect(
        screen.getByText("Order transferred successfully!")
      ).toBeInTheDocument()
    })

    expect(mockAcceptTransferRequest).toHaveBeenCalledWith("order_1", "tok_1")
  })

  it("decline shows error message when request fails", async () => {
    mockDeclineTransferRequest.mockResolvedValue({
      success: false,
      error: "Not allowed",
    })

    render(<TransferActions id="order_2" token="tok_2" />)

    fireEvent.click(screen.getByText("Decline transfer"))

    await waitFor(() => {
      expect(screen.getByText("Not allowed")).toBeInTheDocument()
    })

    expect(mockDeclineTransferRequest).toHaveBeenCalledWith("order_2", "tok_2")
  })
})