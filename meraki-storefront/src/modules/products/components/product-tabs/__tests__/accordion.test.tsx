import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Accordion from "../accordion"

describe("product-tabs/accordion", () => {
  it("renders item title and content when open via defaultValue", () => {
    render(
      <Accordion type="multiple" defaultValue={["a"]}>
        <Accordion.Item title="Tab A" value="a" description="Desc A">
          <div data-testid="content-a">Content A</div>
        </Accordion.Item>
      </Accordion>
    )

    expect(screen.getByText("Tab A")).toBeInTheDocument()
    expect(screen.getByText("Desc A")).toBeInTheDocument()
    expect(screen.getByTestId("content-a")).toBeInTheDocument()
  })
})