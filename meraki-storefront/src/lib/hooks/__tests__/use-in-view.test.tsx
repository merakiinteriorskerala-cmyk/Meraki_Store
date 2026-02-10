import React, { useRef } from "react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { useIntersection } from "../use-in-view"

type IOCallback = IntersectionObserverCallback

let lastObserver: {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  callback: IOCallback
  options?: IntersectionObserverInit
} | null = null

let intersectionObserverMock: ReturnType<typeof vi.fn> | null = null

beforeEach(() => {
  lastObserver = null

  intersectionObserverMock = vi.fn(function (this: any, cb: IOCallback, options?: IntersectionObserverInit) {
    this.observe = vi.fn()
    this.unobserve = vi.fn()

    lastObserver = {
      observe: this.observe,
      unobserve: this.unobserve,
      callback: cb,
      options,
    }
  })

  ;(globalThis as any).IntersectionObserver = intersectionObserverMock as any
})

afterEach(() => {
  vi.restoreAllMocks()
})

function TestComponent({ rootMargin }: { rootMargin: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const visible = useIntersection(ref, rootMargin)
  return (
    <div>
      <div data-testid="target" ref={ref} />
      <div data-testid="visible">{String(visible)}</div>
    </div>
  )
}

describe("useIntersection", () => {
  it("does nothing when element.current is null", () => {
    function NullRefComponent() {
      const ref = { current: null } as any
      const visible = useIntersection(ref, "10px")
      return <div data-testid="visible">{String(visible)}</div>
    }

    render(<NullRefComponent />)
    expect(screen.getByTestId("visible")).toHaveTextContent("false")
    expect(intersectionObserverMock).not.toHaveBeenCalled()
  })

  it("creates an observer with rootMargin and updates when intersecting", () => {
    render(<TestComponent rootMargin="123px" />)

    expect(intersectionObserverMock).toHaveBeenCalledTimes(1)
    expect(lastObserver?.options).toEqual({ rootMargin: "123px" })
    expect(lastObserver?.observe).toHaveBeenCalledTimes(1)

    act(() => {
      lastObserver!.callback([{ isIntersecting: true }] as any, {} as any)
    })
    expect(screen.getByTestId("visible")).toHaveTextContent("true")

    act(() => {
      lastObserver!.callback([{ isIntersecting: false }] as any, {} as any)
    })
    expect(screen.getByTestId("visible")).toHaveTextContent("false")
  })

  it("cleans up by unobserving the element", () => {
    const { unmount } = render(<TestComponent rootMargin="0px" />)
    expect(lastObserver?.unobserve).not.toHaveBeenCalled()

    unmount()
    expect(lastObserver?.unobserve).toHaveBeenCalledTimes(1)
  })
})