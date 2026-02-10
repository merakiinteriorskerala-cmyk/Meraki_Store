import { test, expect } from "@playwright/test"

test.describe("Guest User Purchase Flow", () => {
  test.setTimeout(300000)

  test("Guest user can complete purchase without account", async ({ page }) => {
    const countryCode = process.env.E2E_COUNTRY_CODE || "in"
    const guestEmail = `guest-${Date.now()}@example.com`

    // 1. Navigate to Store directly
    await page.goto(`/${countryCode}/store`)
    await expect(page.getByTestId("store-page-title")).toBeVisible()

    // 2. Add Product
    const products = page.getByTestId("product-wrapper")
    await expect(products.first()).toBeVisible()
    await products.first().click()
    
    // Handle Options if present
    const optionGroups = page.getByTestId("product-options")
    const count = await optionGroups.count()
    for(let j=0; j<count; j++) {
        const options = optionGroups.nth(j).getByTestId("option-button")
        if (await options.count() > 0) {
            await options.first().click()
        }
    }
    
    await page.getByTestId("add-product-button").click()
    await page.waitForLoadState("networkidle")

    // 3. Go to Checkout
    await page.goto(`/${countryCode}/cart`)
    const checkoutButton = page.getByTestId("checkout-button")
    await expect(checkoutButton).toBeVisible({ timeout: 10000 })
    await checkoutButton.click()

    // 4. Guest Address Step
    // Guests must enter an email manually
    await expect(page.getByTestId("shipping-address-input")).toBeVisible()
    
    // Check if email input exists (specific to guest flow usually)
    const emailInput = page.getByTestId("shipping-email-input")
    if (await emailInput.isVisible()) {
        await emailInput.fill(guestEmail)
    }

    await page.getByTestId("shipping-first-name-input").fill("Guest")
    await page.getByTestId("shipping-last-name-input").fill("User")
    await page.getByTestId("shipping-address-input").fill("123 Guest St")
    await page.getByTestId("shipping-postal-code-input").fill("110001")
    await page.getByTestId("shipping-city-input").fill("New Delhi")
    await page.getByTestId("shipping-country-select").selectOption({ index: 1 })
    await page.getByTestId("shipping-phone-input").fill("9876543210")
    
    await page.getByTestId("submit-address-button").click()

    // 5. Delivery
    await expect(page).toHaveURL(/step=delivery/)
    const deliveryOption = page.getByTestId("delivery-option-radio").first()
    await deliveryOption.click()
    await page.getByTestId("submit-delivery-option-button").click()

    // 6. Payment
    await expect(page).toHaveURL(/step=payment/)
    
    // Try to select Manual Payment for automation, else fallback to Razorpay instructions
    try {
        const manualOption = page.getByText(/manual/i)
        if (await manualOption.isVisible()) {
            await manualOption.click()
        } else {
             // Fallback to whatever is available
             await page.getByTestId("payment-option-container").first().click()
        }
    } catch (e) {
        console.log("Error selecting payment:", e)
    }
    
    await page.getByTestId("submit-payment-button").click()

    // 7. Review & Submit
    await expect(page).toHaveURL(/step=review/)
    await page.getByTestId("submit-order-button").click()

    // Check if we need manual intervention for Razorpay
    const razorpayFrame = page.locator("iframe.razorpay-checkout-frame")
    try {
        await expect(razorpayFrame).toBeVisible({ timeout: 20000 })
        console.log("Razorpay modal detected. Automating payment...")
        
        const frame = page.frameLocator("iframe.razorpay-checkout-frame")
        
        // 1. Switch to Card Payment Method if not already active
        // Sometimes the 'Card' button is hidden in 'Show more' or named differently.
        // We look for the card input first.
        const cardInput = frame.getByPlaceholder(/Card Number/i)
        
        if (!await cardInput.isVisible()) {
             console.log("Card input not visible, trying to select Card method...")
             // Try clicking "Card" or "Add New Card"
             const cardBtn = frame.getByText(/Card/i).first()
             if (await cardBtn.isVisible()) {
                 await cardBtn.click()
             } else {
                // Fallback: Check if there's a "Cards" section (sometimes in a list)
                const cardsSection = frame.getByRole("button", { name: /Cards/i })
                if (await cardsSection.isVisible()) {
                    await cardsSection.click()
                }
             }
             await page.waitForTimeout(1000)
        }

        // 2. Fill Card Details (Razorpay Test Card)
        // Ensure input is visible before typing
        await expect(cardInput).toBeVisible({ timeout: 5000 })
        await cardInput.fill("5085461039636221")
        
        const expiryInput = frame.getByPlaceholder(/Expiry|MM \/ YY/i)
        await expiryInput.fill("12/28")
        
        const cvvInput = frame.getByPlaceholder(/CVV/i)
        await cvvInput.fill("352")
        
        // 3. Click Pay
        // The Pay button usually contains the amount, e.g., "Pay ₹ 100"
        const payButton = frame.getByRole("button", { name: /Pay/i })
        await payButton.click()

        // 4. Handle 3DS Success (Bank Simulator)
        console.log("Waiting for 3DS Success...")
        await expect(async () => {
            const frames = page.frames()
            let clicked = false
            for (const f of frames) {
                // The bank page title often contains "Razorpay" or "Bank"
                // The button is strictly "Success"
                const successBtn = f.getByRole("button", { name: "Success", exact: true })
                if (await successBtn.isVisible()) {
                    await successBtn.click()
                    clicked = true
                    console.log("Clicked Success button")
                    break
                }
            }
            if (!clicked) throw new Error("Success button not found yet")
        }).toPass({ timeout: 30000, intervals: [1000] })
        
    } catch (e) {
        console.log("Razorpay automation passed or skipped (Manual Payment used?):", e)
    }

    // 8. Confirmation
    await expect(page).toHaveURL(/\/order\/.*\/confirmed/, { timeout: 300000 })
    await expect(page.getByText("Thank you!")).toBeVisible()
  })
})