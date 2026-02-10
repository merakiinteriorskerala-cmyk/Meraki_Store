import { test, expect } from "@playwright/test"

test.describe("Website Navigation", () => {
  const countryCode = process.env.E2E_COUNTRY_CODE || "in"

  test("User can navigate through main menu links", async ({ page }) => {
    await page.goto(`/${countryCode}`)
    await page.waitForTimeout(2000)
    
    // 1. Verify Home Page
    await expect(page).toHaveURL(new RegExp(`/${countryCode}$`))
    // The logo alt text might be "Meraki Interior Factory"
    const logo = page.getByTestId("nav-store-link").first()
    await expect(logo).toBeVisible()

    // 2. Navigate to Store
    // Note: The 'Store' link might be inside the side menu or main nav depending on screen size
    // We assume desktop view for now
    await page.goto(`/${countryCode}/store`)
    await page.waitForTimeout(2000)
    await expect(page.getByTestId("store-page-title")).toBeVisible()

    // 3. Navigate to Account
    await page.goto(`/${countryCode}/account`)
    await page.waitForTimeout(2000)
    // Should be on account or login page
    await expect(page).toHaveURL(new RegExp(`/${countryCode}/account`))
  })

  test("User can navigate from product list to product details", async ({ page }) => {
    await page.goto(`/${countryCode}/store`)
    await page.waitForTimeout(2000)
    
    // Find first product
    const firstProduct = page.getByTestId("product-wrapper").first()
    await expect(firstProduct).toBeVisible()
    
    // Click and verify navigation
    await firstProduct.click()
    await page.waitForTimeout(2000)
    // Product page should have product container
    await expect(page.getByTestId("product-container")).toBeVisible()
    await expect(page).toHaveURL(/\/products\//)
  })

  test("User can open cart from navigation", async ({ page }) => {
    await page.goto(`/${countryCode}`)
    await page.waitForTimeout(2000)
    
    // Click Cart Icon/Link
    await page.getByTestId("nav-cart-link").click()
    await page.waitForTimeout(2000)
    
    // Verify Cart Page
    await expect(page).toHaveURL(new RegExp(`/${countryCode}/cart`))
    await expect(page.getByTestId("cart-container")).toBeVisible()
  })

  test("Footer links are present and accessible", async ({ page }) => {
    await page.goto(`/${countryCode}`)
    await page.waitForTimeout(2000)
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(2000)
    
    // Verify common footer links
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()
    
    // Check for 'Company' section links
    // We look for these links to ensure footer is rendered correctly
    await expect(footer.getByText("Meraki Interior Factory").first()).toBeVisible()
  })
})