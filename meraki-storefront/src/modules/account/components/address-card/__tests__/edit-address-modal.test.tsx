import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  mockUseActionState,
  mockUseToggleState,
  mockUpdateCustomerAddress,
  mockDeleteCustomerAddress,
} = vi.hoisted(() => ({
  mockUseActionState: vi.fn(),
  mockUseToggleState: vi.fn(),
  mockUpdateCustomerAddress: vi.fn(),
  mockDeleteCustomerAddress: vi.fn(),
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
  updateCustomerAddress: mockUpdateCustomerAddress,
  deleteCustomerAddress: mockDeleteCustomerAddress,
}))

vi.mock("@medusajs/icons", () => ({
  PencilSquare: () => <span data-testid="edit-icon" />,
  Trash: () => <span data-testid="trash-icon" />,
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  clx: (...args: any[]) =>
    args
      .flatMap((a: any) => {
        if (!a) return []
        if (typeof a === "string") return [a]
        if (typeof a === "object")
          return Object.entries(a)
            .filter(([, v]) => Boolean(v))
            .map(([k]) => k)
        return []
      })
      .join(" "),
}))

vi.mock("@modules/common/icons/spinner", () => ({
  default: () => <span data-testid="spinner" />,
}))

vi.mock("@modules/common/components/input", () => ({
  default: ({
    label,
    name,
    required,
    defaultValue,
    "data-testid": testId,
  }: any) => (
    <label>
      {label}
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        data-testid={testId}
      />
    </label>
  ),
}))

vi.mock("@modules/checkout/components/country-select", () => ({
  default: ({
    name,
    defaultValue,
    "data-testid": testId,
  }: any) => (
    <select name={name} defaultValue={defaultValue} data-testid={testId}>
      <option value="us">US</option>
      <option value="in">IN</option>
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
  const Modal: any = ({ isOpen, children, "data-testid": testId }: any) =>
    isOpen ? <div data-testid={testId}>{children}</div> : null

  Modal.Title = ({ children }: any) => <div data-testid="modal-title">{children}</div>
  Modal.Body = ({ children }: any) => <div data-testid="modal-body">{children}</div>
  Modal.Footer = ({ children }: any) => <div data-testid="modal-footer">{children}</div>

  return { default: Modal }
})

import EditAddressModal from "../edit-address-modal"

describe("EditAddressModal", () => {
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
    mockDeleteCustomerAddress.mockResolvedValue(undefined)
  })

  it("renders address fields (including company, address_2, province)", () => {
    const address: any = {
      id: "addr_1",
      first_name: "A",
      last_name: "B",
      company: "Meraki Inc",
      address_1: "Line 1",
      address_2: "Unit 2",
      postal_code: "12345",
      city: "Pune",
      province: "MH",
      country_code: "in",
    }

    render(
      <EditAddressModal
        region={{ id: "reg_1" } as any}
        address={address}
        isActive={true}
      />
    )

    expect(screen.getByTestId("address-name")).toHaveTextContent("A B")
    expect(screen.getByTestId("address-company")).toHaveTextContent("Meraki Inc")
    expect(screen.getByTestId("address-address")).toHaveTextContent("Line 1")
    expect(screen.getByTestId("address-address")).toHaveTextContent(", Unit 2")
    expect(screen.getByTestId("address-postal-city")).toHaveTextContent("12345, Pune")
    expect(screen.getByTestId("address-province-country")).toHaveTextContent("MH, IN")

    expect(mockUseActionState).toHaveBeenCalledWith(
      mockUpdateCustomerAddress,
      expect.objectContaining({ addressId: "addr_1", success: false, error: null })
    )
  })

  it("clicking Edit calls open()", () => {
    const open = vi.fn()
    mockUseToggleState.mockReturnValue({ state: false, open, close: vi.fn() })

    render(
      <EditAddressModal
        region={{ id: "reg_1" } as any}
        address={{ id: "addr_1", first_name: "A", last_name: "B", address_1: "x", postal_code: "1", city: "y", country_code: "us" } as any}
      />
    )

    fireEvent.click(screen.getByTestId("address-edit-button"))
    expect(open).toHaveBeenCalledTimes(1)
  })

  it("clicking Remove calls deleteCustomerAddress and shows spinner while removing", async () => {
    let resolveDelete!: () => void
    const pending = new Promise<void>((r) => {
      resolveDelete = r
    })
    mockDeleteCustomerAddress.mockReturnValue(pending)

    render(
      <EditAddressModal
        region={{ id: "reg_1" } as any}
        address={{ id: "addr_9", first_name: "A", last_name: "B", address_1: "x", postal_code: "1", city: "y", country_code: "us" } as any}
      />
    )

    fireEvent.click(screen.getByTestId("address-delete-button"))

    expect(mockDeleteCustomerAddress).toHaveBeenCalledWith("addr_9")
    expect(screen.getByTestId("spinner")).toBeInTheDocument()

    resolveDelete()

    await waitFor(() => {
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument()
    })
  })
})