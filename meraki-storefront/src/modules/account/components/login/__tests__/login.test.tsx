import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"

// Mock dependencies
vi.mock("@lib/data/customer", () => ({
  login: vi.fn(),
}))

vi.mock("@modules/common/components/input", () => ({
  default: ({ name, label, required, "data-testid": testId, type }: any) => (
    <div data-testid="input-wrapper">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        data-testid={testId}
      />
    </div>
  ),
}))

vi.mock("@modules/checkout/components/submit-button", () => ({
  SubmitButton: ({ children, "data-testid": testId }: any) => (
    <button type="submit" data-testid={testId}>
      {children}
    </button>
  ),
}))

vi.mock("@modules/checkout/components/error-message", () => ({
  default: ({ error, "data-testid": testId }: any) => (
    error ? <div data-testid={testId}>{error}</div> : null
  ),
}))

// Mock React
const { mockUseActionState } = vi.hoisted(() => ({
  mockUseActionState: vi.fn(),
}))

vi.mock("react", async () => {
  const actual = await vi.importActual("react")
  return {
    ...actual,
    useActionState: (fn: any, initialState: any) => mockUseActionState(fn, initialState) || [initialState, vi.fn()],
  }
})

import Login from "../index"

describe("Login Component", () => {
  const mockSetCurrentView = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseActionState.mockReturnValue([null, vi.fn()])
  })

  it("renders login form correctly", () => {
    render(<Login setCurrentView={mockSetCurrentView} />)

    expect(screen.getByText("Welcome Back")).toBeInTheDocument()
    expect(screen.getByTestId("email-input")).toBeInTheDocument()
    expect(screen.getByTestId("password-input")).toBeInTheDocument()
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument()
    expect(screen.getByTestId("register-button")).toBeInTheDocument()
  })

  it("switches to register view when Join us is clicked", () => {
    render(<Login setCurrentView={mockSetCurrentView} />)

    fireEvent.click(screen.getByTestId("register-button"))

    expect(mockSetCurrentView).toHaveBeenCalledWith(LOGIN_VIEW.REGISTER)
  })

  it("displays error message when state has error", () => {
    mockUseActionState.mockReturnValue(["Invalid credentials", vi.fn()])

    render(<Login setCurrentView={mockSetCurrentView} />)

    expect(screen.getByTestId("login-error-message")).toHaveTextContent("Invalid credentials")
  })
})