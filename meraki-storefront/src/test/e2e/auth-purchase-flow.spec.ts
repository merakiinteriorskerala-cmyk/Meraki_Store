import { test, expect } from "@playwright/test"

test.describe("Authenticated User Purchase Flow", () => {
  test.setTimeout(300000)

  test("Logged in user can complete full purchase flow", async ({ page }) => {
    const countryCode = process.env.E2E_COUNTRY_CODE || "in"
    // Static email for permanent test account
    const email = "e2e-permanent-user@example.com"
    const password = "Password123!"

    // 1. Go to Account
    await page.goto(`/${countryCode}/account`)
    await page.waitForTimeout(1000)
    
    // Cleanup: If already logged in, logout to ensure we test the login flow
    if (await page.getByTestId("account-nav").isVisible()) {
        await page.getByTestId("account-nav").getByTestId("logout-button").click()
        await expect(page.getByTestId("login-page")).toBeVisible()
        await page.waitForTimeout(1000)
    }

    // 2. Try Login
    await page.getByTestId("email-input").fill(email)
    await page.getByTestId("password-input").fill(password)
    await page.waitForTimeout(1000)
    await page.getByTestId("sign-in-button").click()

    // 3. Check for Login Error (Account doesn't exist)
    // We wait briefly to see if error appears or we redirect
    try {
        // If account-nav appears, login success
        await expect(page.getByTestId("account-nav")).toBeVisible({ timeout: 5000 })
        await page.waitForTimeout(1000)
    } catch {
        // Login failed, assume account needs creation
        // Note: Ideally we check for specific error message, but "Invalid credentials" is common
        // Let's check if we are still on login page with error
        if (await page.getByTestId("login-error-message").isVisible()) {
             await page.waitForTimeout(1000)
             await page.getByTestId("register-button").click()
    
             const registerPage = page.getByTestId("register-page")
             await registerPage.getByTestId("first-name-input").fill("Permanent")
             await registerPage.getByTestId("last-name-input").fill("Tester")
             await registerPage.getByTestId("email-input").fill(email)
             await page.getByTestId("phone-input").fill("1234567890")
             await registerPage.getByTestId("password-input").fill(password)
             await page.waitForTimeout(1000)
             await registerPage.getByTestId("register-button").click()
             
             // Verify registration success
             await expect(page.getByTestId("account-nav")).toBeVisible()
             await page.waitForTimeout(1000)
        } else {
            throw new Error("Login failed but no error message or redirect occurred")
        }
    }

    // 2. Navigate to Store
    await page.goto(`/${countryCode}/store`)
    await expect(page.getByTestId("store-page-title")).toBeVisible()
    await page.waitForTimeout(1000)

    // 3. Find and Add Product
    const products = page.getByTestId("product-wrapper")
    await expect(products.first()).toBeVisible()
    
    let added = false
    // Try up to 8 products
    for(let i=0; i<8; i++) {
        await products.nth(i).click()
        const addToCartBtn = page.getByTestId("add-product-button")
        
        await expect(page.getByTestId("product-container")).toBeVisible()

        // Handle Options
        const optionGroups = page.getByTestId("product-options")
        const count = await optionGroups.count()
        for(let j=0; j<count; j++) {
            const options = optionGroups.nth(j).getByTestId("option-button")
            if (await options.count() > 0) {
                await options.first().click()
            }
        }

        if (await addToCartBtn.isEnabled()) {
            await addToCartBtn.click()
            // Wait for cart button to update or some feedback
            await page.waitForLoadState("networkidle")
            await page.waitForTimeout(1000)
            added = true
            break
        }
        await page.goBack()
        await page.waitForTimeout(500)
    }
    
    expect(added, "Could not find in-stock product").toBeTruthy()

    // 4. Verify Cart
    await page.goto(`/${countryCode}/cart`)
    await expect(page.getByTestId("cart-container")).toBeVisible()
    await page.waitForTimeout(1000)
    
    // 5. Checkout
    await page.getByTestId("checkout-button").click()
    await page.waitForTimeout(1000)
    
    // 6. Address Step
    // Check if we are on address step (we might skip if address is already set, but usually starts here)
    if (page.url().includes("step=address")) {
        await expect(page.getByTestId("shipping-address-input")).toBeVisible()
        
        await page.getByTestId("shipping-first-name-input").fill("Auth")
        await page.getByTestId("shipping-last-name-input").fill("User")
        await page.getByTestId("shipping-address-input").fill("456 Auth St")
        await page.getByTestId("shipping-postal-code-input").fill("90210")
        await page.getByTestId("shipping-city-input").fill("Beverly Hills")
        await page.getByTestId("shipping-country-select").selectOption({ index: 1 })
        await page.getByTestId("shipping-phone-input").fill("9876543210")
        
        await page.waitForTimeout(1000)
        await page.getByTestId("submit-address-button").click()
    }
    
    // 7. Delivery Step
    await expect(page).toHaveURL(/step=delivery/)
    await page.waitForTimeout(1000)
    
    // Select first delivery option
    const deliveryOption = page.getByTestId("delivery-option-radio").first()
    await expect(deliveryOption).toBeVisible()
    await deliveryOption.click()
    
    await page.waitForTimeout(1000)
    await page.getByTestId("submit-delivery-option-button").click()
    
    // 8. Payment Step
    await expect(page).toHaveURL(/step=payment/)
    await page.waitForTimeout(1000)
    
    // Select Payment (Prefer Razorpay)
    try {
        const razorpayOption = page
            .getByTestId("payment-option-container")
            .filter({ hasText: /Razorpay/i })
            .first()
        const manualOption = page
            .getByTestId("payment-option-container")
            .filter({ hasText: /manual/i })
            .first()
        
        if (await razorpayOption.isVisible()) {
            await razorpayOption.click()
        } else if (await manualOption.isVisible()) {
            await manualOption.click()
        } else {
            // Fallback to first available option container
            const firstOption = page.getByTestId("payment-option-container").first()
            if (await firstOption.isVisible()) {
                await firstOption.click()
            } else {
                 // Last resort: radio button
                 await page.getByTestId("radio-button").first().click()
            }
        }
    } catch (e) {
        console.log("Error selecting payment:", e)
    }
    
    await page.waitForTimeout(1000)
    const submitPaymentButton = page.getByTestId("submit-payment-button")
    await submitPaymentButton.waitFor({ state: "visible" })
    await expect(submitPaymentButton).toBeEnabled()
    await submitPaymentButton.click()
    await page.waitForLoadState("networkidle")

    const reachedReview = await page
        .waitForURL(/step=review/, { timeout: 60000 })
        .then(() => true)
        .catch(() => false)

    if (!reachedReview) {
        const paymentError = page.getByTestId("payment-method-error-message")
        if (await paymentError.isVisible()) {
            const message = await paymentError.innerText()
            throw new Error(`Payment step error: ${message}`)
        }
        await submitPaymentButton.click()
        await page.waitForLoadState("networkidle")
        await page.waitForURL(/step=review/, { timeout: 60000 })
    }

    await page.waitForTimeout(1000)
    await page.getByTestId("submit-order-button").click()

    const razorpayFrame = page.locator("iframe.razorpay-checkout-frame")
    try {
        await expect(razorpayFrame).toBeVisible({ timeout: 20000 })
        await razorpayFrame.scrollIntoViewIfNeeded()

        const checkoutFrame = page
            .frames()
            .find((f) => /api\.razorpay\.com\/v1\/checkout\/public/.test(f.url()))

        if (!checkoutFrame) {
            throw new Error("Razorpay checkout frame not found")
        }

        const cardInput = checkoutFrame.getByPlaceholder(/Card Number/i)

        if (!await cardInput.isVisible()) {
            const cardBtn = checkoutFrame.getByText(/Card/i).first()
            if (await cardBtn.isVisible()) {
                await cardBtn.click()
            } else {
                const cardsSection = checkoutFrame.getByRole("button", { name: /Cards/i })
                if (await cardsSection.isVisible()) {
                    await cardsSection.click()
                }
            }
            await page.waitForTimeout(1000)
        }

        await expect(cardInput).toBeVisible({ timeout: 10000 })
        await cardInput.fill("5085461039636221")

        const expiryInput = checkoutFrame.getByPlaceholder(/Expiry|MM \/ YY/i)
        await expiryInput.fill("12/28")

        const cvvInput = checkoutFrame.getByPlaceholder(/CVV/i)
        await cvvInput.fill("352")

        const payButton = checkoutFrame.getByRole("button", { name: /Pay/i })
        await payButton.click()

        await expect(async () => {
            const bankFrame = page
                .frames()
                .find((f) => /razorpay|bank|success/i.test(f.url()))

            if (!bankFrame) throw new Error("Bank frame not available yet")

            const otpInput = bankFrame.locator("input[type='password'], input[name*='otp'], input[placeholder*='OTP'], input[placeholder*='Password']").first()
            if (await otpInput.isVisible()) {
                await otpInput.fill("123456")
            }

            const successBtn = bankFrame.getByRole("button", { name: /Success/i })
            await successBtn.click()
        }).toPass({ timeout: 60000, intervals: [1000] })
    } catch (e) {
        console.log("Razorpay automation passed or skipped (Manual Payment used?):", e)
    }

    // 10. Confirmation
    await expect(page).toHaveURL(/\/order\/.*\/confirmed/, { timeout: 300000 })
    await expect(page.getByText("Thank you!")).toBeVisible()
    await expect(page.getByText("Your order was placed successfully.")).toBeVisible()
  })
})