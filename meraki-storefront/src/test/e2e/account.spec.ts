import { test, expect } from "@playwright/test"

test.describe("Account Flow", () => {
  test("user can register and login", async ({ page }) => {
    test.setTimeout(60000)
    const countryCode = process.env.E2E_COUNTRY_CODE || "in" // Default to IN
    const timestamp = Date.now()
    const email = `test-user-${timestamp}@example.com`
    const password = "Password123!"

    // 1. Go to Account (Login Page)
    await page.goto(`/${countryCode}/account`)
    
    // Check if already logged in (cleanup from previous runs)
    const accountNav = page.getByTestId("account-nav")
    if (await accountNav.isVisible()) {
        await accountNav.getByTestId("logout-button").click()
    }
    
    await expect(page.getByTestId("login-page")).toBeVisible()

    // 2. Navigate to Register
    await page.getByTestId("register-button").click()
    await expect(page.getByTestId("register-page")).toBeVisible()

    // 3. Fill Registration Form
    await page.getByTestId("first-name-input").fill("Test")
    await page.getByTestId("last-name-input").fill("User")
    
    // Email input might be ambiguous if not scoped, so scoping to register-page
    const registerPage = page.getByTestId("register-page")
    await registerPage.getByTestId("email-input").fill(email)
    
    await page.getByTestId("phone-input").fill("1234567890")
    await registerPage.getByTestId("password-input").fill(password)

    // 4. Submit Registration
    // Button is also inside register page usually
    await registerPage.getByTestId("register-button").click()

    // 5. Verify Login (Account Overview)
    await expect(page.getByTestId("account-nav")).toBeVisible({ timeout: 10000 })
    
    // 6. Logout
    // Target desktop nav explicitly or first visible
    await page.getByTestId("account-nav").getByTestId("logout-button").click()
    await expect(page.getByTestId("login-page")).toBeVisible()

    // 7. Login
    const loginPage = page.getByTestId("login-page")
    await loginPage.getByTestId("email-input").fill(email)
    await loginPage.getByTestId("password-input").fill(password)
    await loginPage.getByTestId("sign-in-button").click()

    // 8. Verify Login Again
    await expect(page.getByTestId("account-nav")).toBeVisible()
  })
})