import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const { mockUseState } = vi.hoisted(() => ({
  mockUseState: vi.fn(),
}))

vi.mock("react", async () => {
  const actual = await vi.importActual<any>("react")
  return {
    ...actual,
    useState: (init: any) => mockUseState(init),
  }
})

vi.mock("@modules/account/components/login", () => ({
  default: () => <div data-testid="login-form" />,
}))

vi.mock("@modules/account/components/register", () => ({
  default: () => <div data-testid="register-form" />,
}))

import LoginTemplate from "../login-template"

describe("LoginTemplate", () => {
  beforeEach(() => {
    mockUseState.mockReset()
  })

  it("shows Login by default", () => {
    mockUseState.mockReturnValue(["sign-in", vi.fn()])

    render(<LoginTemplate />)

    expect(screen.getByTestId("login-form")).toBeInTheDocument()
    expect(screen.queryByTestId("register-form")).toBeNull()
  })

  it("shows Register when view is register", () => {
    mockUseState.mockReturnValue(["register", vi.fn()])

    render(<LoginTemplate />)

    expect(screen.getByTestId("register-form")).toBeInTheDocument()
    expect(screen.queryByTestId("login-form")).toBeNull()
  })
})