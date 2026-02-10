import { render, screen, fireEvent } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockUseActionState, mockUseToggleState, mockAddCustomerAddress } =
  vi.hoisted(() => ({
    mockUseActionState: vi.fn(),
    mockUseToggleState: vi.fn(),
    mockAddCustomerAddress: vi.fn(),
  }))

vi.mock("react", async () => {
  const actual = await vi.importActual<any>("react")
  return {
    ...actual,
    useActionState: (fn: any, initialState: any) =>
      mockUseActionState(fn, initialState) || [initialState, vi.fn()],
  }
})

vi.mock("@lib/hooks/use-toggle-state", () => ({
  default: (...args: any[]) => mockUseToggleState(...args),
}))

vi.mock("@lib/data/customer", () => ({
  addCustomerAddress: mockAddCustomerAddress,
}))

vi.mock("@medusajs/icons", () => ({
  Plus: () => <span data-testid="plus-icon" />,
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}))

vi.mock("@modules/common/components/input", () => ({
  default: ({ label, name, required, "data-testid": testId }: any) => (
    <label>
      {label}
      <input name={name} required={required} data-testid={testId} />
    </label>
  ),
}))

vi.mock("@modules/checkout/components/country-select", () => ({
  default: ({ name, "data-testid": testId }: any) => (
    <select name={name} data-testid={testId}>
      <option value="us">US</option>
    </select>
  ),
}))

vi.mock("@modules/checkout/components/submit-button", () => ({
  SubmitButton: ({ children, "data-testid": testId }: any) => (
    <button type="submit" data-testid={testId}>
      {children}
    </button>
  ),
}))

vi.mock("@modules/common/components/modal", () => {
  const Modal: any = ({
    isOpen,
    close,
    children,
    "data-testid": testId,
  }: any) => (isOpen ? <div data-testid={testId} onClick={close}>{children}</div> : null)

  Modal.Title = ({ children }: any) => <div data-testid="modal-title">{children}</div>
  Modal.Body = ({ children }: any) => <div data-testid="modal-body">{children}</div>
  Modal.Footer = ({ children }: any) => <div data-testid="modal-footer">{children}</div>

  return { default: Modal }
})

import AddAddress from "../add-address"

describe("AddAddress", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseToggleState.mockReturnValue({
      state: false,
      open: vi.fn(),
      close: vi.fn(),
    })
    mockUseActionState.mockImplementation((_fn: any, initial: any) => [
      initial,
      vi.fn(),
    ])
  })

  it("initializes isDefaultShipping=true when addresses is empty", () => {
    render(<AddAddress region={{ id: "reg_1" } as any} addresses={[]} />)

    expect(mockUseActionState).toHaveBeenCalledWith(
      mockAddCustomerAddress,
      expect.objectContaining({
        isDefaultShipping: true,
        success: false,
        error: null,
      })
    )
  })

  it("clicking New address calls open()", () => {
    const open = vi.fn()
    mockUseToggleState.mockReturnValue({ state: false, open, close: vi.fn() })

    render(<AddAddress region={{ id: "reg_1" } as any} addresses={[]} />)

    fireEvent.click(screen.getByTestId("add-address-button"))
    expect(open).toHaveBeenCalledTimes(1)
  })

  it("renders error when formState.error is set (modal open)", () => {
    mockUseToggleState.mockReturnValue({
      state: true,
      open: vi.fn(),
      close: vi.fn(),
    })
    mockUseActionState.mockReturnValue([
      { isDefaultShipping: false, success: false, error: "Bad request" },
      vi.fn(),
    ])

    render(
      <AddAddress region={{ id: "reg_1" } as any} addresses={[{ id: "a1" } as any]} />
    )

    expect(screen.getByTestId("add-address-modal")).toBeInTheDocument()
    expect(screen.getByTestId("address-error")).toHaveTextContent("Bad request")
  })
})