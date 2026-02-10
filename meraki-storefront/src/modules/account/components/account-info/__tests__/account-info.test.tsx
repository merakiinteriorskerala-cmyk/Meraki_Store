import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockUseToggleState, mockUseFormStatus } = vi.hoisted(() => ({
  mockUseToggleState: vi.fn(),
  mockUseFormStatus: vi.fn(),
}))

vi.mock("@lib/hooks/use-toggle-state", () => ({
  default: (...args: any[]) => mockUseToggleState(...args),
}))

vi.mock("react-dom", () => ({
  useFormStatus: () => mockUseFormStatus(),
}))

vi.mock("@headlessui/react", () => {
  const Disclosure: any = ({ children }: any) => <div>{children}</div>
  Disclosure.Panel = ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  )
  return { Disclosure }
})

vi.mock("@medusajs/ui", () => ({
  Badge: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, isLoading, ...props }: any) => (
    <button {...props} data-loading={String(!!isLoading)}>
      {children}
    </button>
  ),
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

import AccountInfo from "../index"

describe("AccountInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseFormStatus.mockReturnValue({ pending: false })
    mockUseToggleState.mockReturnValue({
      state: false,
      close: vi.fn(),
      toggle: vi.fn(),
    })
  })

  it("renders label and current info string", () => {
    render(
      <AccountInfo
        label="Email"
        currentInfo="test@example.com"
        clearState={vi.fn()}
      />
    )

    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByTestId("current-info")).toHaveTextContent(
      "test@example.com"
    )
    const edit = screen.getByTestId("edit-button")
    expect(edit).toHaveTextContent("Edit")
    expect(edit).toHaveAttribute("data-active", "false")
  })

  it("calls clearState and toggles after delay", () => {
    vi.useFakeTimers()
    const clearState = vi.fn()
    const toggle = vi.fn()

    mockUseToggleState.mockReturnValue({
      state: false,
      close: vi.fn(),
      toggle,
    })

    render(
      <AccountInfo label="Name" currentInfo="A" clearState={clearState} />
    )

    fireEvent.click(screen.getByTestId("edit-button"))
    expect(clearState).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(toggle).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it("closes when isSuccess is true", async () => {
    const close = vi.fn()
    mockUseToggleState.mockReturnValue({
      state: false,
      close,
      toggle: vi.fn(),
    })

    render(
      <AccountInfo
        label="Phone"
        currentInfo="123"
        clearState={vi.fn()}
        isSuccess={true}
      />
    )

    await waitFor(() => expect(close).toHaveBeenCalledTimes(1))
  })

  it("shows error message when isError is true", () => {
    render(
      <AccountInfo
        label="Address"
        currentInfo="Main"
        clearState={vi.fn()}
        isError={true}
        errorMessage="Bad request"
      />
    )

    expect(screen.getByTestId("error-message")).toHaveTextContent("Bad request")
  })

  it("shows save button loading when pending and expanded", () => {
    mockUseFormStatus.mockReturnValue({ pending: true })
    mockUseToggleState.mockReturnValue({
      state: true,
      close: vi.fn(),
      toggle: vi.fn(),
    })

    render(
      <AccountInfo label="Name" currentInfo="A" clearState={vi.fn()}>
        <div>Form</div>
      </AccountInfo>
    )

    const save = screen.getByTestId("save-button")
    expect(save).toHaveAttribute("data-loading", "true")
    expect(screen.getByTestId("edit-button")).toHaveTextContent("Cancel")
  })
})