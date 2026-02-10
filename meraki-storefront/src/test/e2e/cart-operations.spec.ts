import { test, expect } from "@playwright/test"

test.describe("Cart Operations", () => {
  test.setTimeout(300000)

  test("User can add, update quantity, remove, and see empty cart state", async ({
    page,
  }) => {
    const countryCode = process.env.E2E_COUNTRY_CODE || "in"
    const cacheBust = Date.now()

    await page.setExtraHTTPHeaders({ "Cache-Control": "no-cache" })
    await page.goto(`/${countryCode}/cart?cacheBust=${cacheBust}`, {
      waitUntil: "networkidle",
    })
    await expect(page.getByTestId("cart-container")).toBeVisible()

    let existingItems = await page.getByTestId("product-delete-button").count()
    while (existingItems > 0) {
      await page.getByTestId("product-delete-button").first().locator("button").click()
      await page.waitForLoadState("networkidle")
      await page.waitForTimeout(500)
      existingItems = await page.getByTestId("product-delete-button").count()
    }

    await page.goto(`/${countryCode}/store?cacheBust=${cacheBust}`, {
      waitUntil: "networkidle",
    })
    await expect(page.getByTestId("store-page-title")).toBeVisible()

    const products = page.getByTestId("product-wrapper")
    await expect(products.first()).toBeVisible()

    const productCount = await products.count()
    for (let i = 0; i < productCount; i++) {
      await products.nth(i).click()
      await expect(page.getByTestId("product-container")).toBeVisible()

      const optionGroups = page.getByTestId("product-options")
      const count = await optionGroups.count()
      for (let j = 0; j < count; j++) {
        const options = optionGroups.nth(j).getByTestId("option-button")
        if ((await options.count()) > 0) {
          await options.first().click()
        }
      }

      const addToCartBtn = page.getByTestId("add-product-button")
      if (await addToCartBtn.isEnabled()) {
        await addToCartBtn.click()
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(1000)
      }

      await page.goBack()
      await page.waitForLoadState("networkidle")
      await page.waitForTimeout(500)
      await expect(products.first()).toBeVisible()
    }

    await page.goto(`/${countryCode}/cart?cacheBust=${cacheBust}`, {
      waitUntil: "networkidle",
    })
    await expect(page.getByTestId("cart-container")).toBeVisible()

    const qtySelects = page.getByTestId("product-select-button")
    const qtyCount = await qtySelects.count()
    for (let i = 0; i < qtyCount; i++) {
      const qtySelect = page.getByTestId("product-select-button").nth(i)
      await qtySelect.scrollIntoViewIfNeeded()
      await expect(qtySelect).toBeVisible()

      const optionCount = await qtySelect.locator("option").count()
      if (optionCount > 1) {
        const targetIndex = optionCount - 1
        const targetValue = await qtySelect
          .locator("option")
          .nth(targetIndex)
          .getAttribute("value")

        await qtySelect.selectOption({ index: targetIndex })
        if (targetValue) {
          await expect(qtySelect).toHaveValue(targetValue)
        }
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(500)
      }
    }

    let deleteCount = await page.getByTestId("product-delete-button").count()
    while (deleteCount > 0) {
      await page.getByTestId("product-delete-button").first().locator("button").click()
      await page.waitForLoadState("networkidle")
      await page.waitForTimeout(500)
      deleteCount = await page.getByTestId("product-delete-button").count()
    }

    await expect(page.getByTestId("empty-cart-message")).toBeVisible()
  })
})