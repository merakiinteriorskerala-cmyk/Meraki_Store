import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import Back from "../back"
import Bancontact from "../bancontact"
import ChevronDown from "../chevron-down"
import Eye from "../eye"
import EyeOff from "../eye-off"
import FastDelivery from "../fast-delivery"
import Ideal from "../ideal"
import MapPin from "../map-pin"
import Medusa from "../medusa"
import NextJs from "../nextjs"
import Package from "../package"
import PayPal from "../paypal"
import PlaceholderImage from "../placeholder-image"
import Refresh from "../refresh"
import Spinner from "../spinner"
import Trash from "../trash"
import User from "../user"
import X from "../x"

describe("common/icons", () => {
  it("renders all icon components", () => {
    const icons = [
      <Back key="Back" />,
      <Bancontact key="Bancontact" />,
      <ChevronDown key="ChevronDown" />,
      <Eye key="Eye" />,
      <EyeOff key="EyeOff" />,
      <FastDelivery key="FastDelivery" />,
      <Ideal key="Ideal" />,
      <MapPin key="MapPin" />,
      <Medusa key="Medusa" />,
      <NextJs key="NextJs" />,
      <Package key="Package" />,
      <PayPal key="PayPal" />,
      <PlaceholderImage key="PlaceholderImage" />,
      <Refresh key="Refresh" />,
      <Spinner key="Spinner" />,
      <Trash key="Trash" />,
      <User key="User" />,
      <X key="X" />,
    ]

    const { container } = render(<div>{icons}</div>)
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0)
    expect(container.querySelector("#paypalIcon")).toBeTruthy()
  })

  it("respects size/color props for IconProps-based icons", () => {
    const { container } = render(<Eye size={32} color="red" data-testid="eye" />)
    const svg = container.querySelector("svg")
    const path = container.querySelector("path")

    expect(svg?.getAttribute("width")).toBe("32")
    expect(svg?.getAttribute("height")).toBe("32")
    expect(path?.getAttribute("stroke")).toBe("red")
  })
})