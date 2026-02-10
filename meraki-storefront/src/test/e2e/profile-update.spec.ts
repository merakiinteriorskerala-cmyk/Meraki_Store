import { test, expect } from "@playwright/test"

test.describe("Profile and Addresses", () => {
  test("user can update profile and manage addresses", async ({ page }) => {
    test.setTimeout(180000)
    const countryCode = process.env.E2E_COUNTRY_CODE || "in"
    const timestamp = Date.now()
    const email = `profile-user-${timestamp}@example.com`
    const password = "Password123!"
    const pause = (ms = 600) => page.waitForTimeout(ms)

    await page.goto(`/${countryCode}/account`)
    await pause()
    const accountNav = page.getByTestId("account-nav")
    if (await accountNav.isVisible()) {
      await accountNav.getByTestId("logout-button").click()
      await pause()
    }

    await expect(page.getByTestId("login-page")).toBeVisible()
    await pause()

    await page.getByTestId("register-button").click()
    await pause()
    await expect(page.getByTestId("register-page")).toBeVisible()

    const registerPage = page.getByTestId("register-page")
    await registerPage.getByTestId("first-name-input").fill("Profile")
    await registerPage.getByTestId("last-name-input").fill("User")
    await registerPage.getByTestId("email-input").fill(email)
    await registerPage.getByTestId("phone-input").fill("1234567890")
    await registerPage.getByTestId("password-input").fill(password)
    await registerPage.getByTestId("register-button").click()
    await pause(1000)

    await expect(page.getByTestId("account-nav")).toBeVisible({ timeout: 10000 })

    await page.goto(`/${countryCode}/account/profile`)
    await pause()
    await expect(page.getByTestId("profile-page-wrapper")).toBeVisible()

    const nameEditor = page.getByTestId("account-name-editor")
    await nameEditor.getByTestId("edit-button").click()
    await nameEditor.getByTestId("first-name-input").fill("Updated")
    await nameEditor.getByTestId("last-name-input").fill("Profile")
    await nameEditor.getByTestId("save-button").click()
    await pause()
    await expect(nameEditor.getByTestId("success-message")).toBeVisible()

    const emailEditor = page.getByTestId("account-email-editor")
    await emailEditor.getByTestId("edit-button").click()
    await emailEditor
      .getByTestId("email-input")
      .fill(`updated-${timestamp}@example.com`)
    await emailEditor.getByTestId("save-button").click()
    await pause()
    await expect(emailEditor.getByTestId("success-message")).toBeVisible()

    const phoneEditor = page.getByTestId("account-phone-editor")
    await phoneEditor.getByTestId("edit-button").click()
    await phoneEditor.getByTestId("phone-input").fill("9999999999")
    await phoneEditor.getByTestId("save-button").click()
    await pause()
    await expect(phoneEditor.getByTestId("success-message")).toBeVisible()

    await page.goto(`/${countryCode}/account/addresses`)
    await pause()
    await expect(page.getByTestId("addresses-page-wrapper")).toBeVisible()

    const beforeAddCount = await page.getByTestId("address-container").count()

    await page.getByTestId("add-address-button").click()
    const addModal = page.getByTestId("add-address-modal")
    await expect(addModal).toBeVisible()
    await addModal.getByTestId("first-name-input").fill("Address")
    await addModal.getByTestId("last-name-input").fill("Tester")
    await addModal.getByTestId("address-1-input").fill("123 Test Street")
    await addModal.getByTestId("address-2-input").fill("Unit 5")
    await addModal.getByTestId("postal-code-input").fill("110001")
    await addModal.getByTestId("city-input").fill("New Delhi")
    await addModal.getByTestId("state-input").fill("DL")
    await addModal.getByTestId("country-select").selectOption({ index: 1 })
    await addModal.getByTestId("phone-input").fill("9999999999")
    const addSaveButton = addModal.getByTestId("save-button")
    await addSaveButton.scrollIntoViewIfNeeded()
    await expect(addSaveButton).toBeEnabled()
    await addSaveButton.click()
    await expect(addModal).toBeHidden()

    await page.reload({ waitUntil: "networkidle" })
    await expect(page.getByTestId("addresses-page-wrapper")).toBeVisible()
    const afterAddCount = await page.getByTestId("address-container").count()
    expect(afterAddCount).toBeGreaterThan(beforeAddCount)

    const editButtons = page.getByTestId("address-edit-button")
    await editButtons.last().click()

    const editModal = page.getByTestId("edit-address-modal")
    await expect(editModal).toBeVisible()
    await editModal.getByTestId("city-input").fill("Updated City")
    await editModal.getByTestId("save-button").click()
    await pause()
    await expect(editModal).toBeHidden()

    await page.reload({ waitUntil: "networkidle" })
    const updatedPostalCity = page.getByTestId("address-postal-city").last()
    await expect(updatedPostalCity).toContainText("Updated City")

    const beforeDeleteCount = await page.getByTestId("address-container").count()
    const deleteButtons = page.getByTestId("address-delete-button")
    await deleteButtons.last().click()
    await pause()
    await page.waitForLoadState("networkidle")

    await page.reload({ waitUntil: "networkidle" })
    const afterDeleteCount = await page.getByTestId("address-container").count()
    expect(afterDeleteCount).toBeLessThan(beforeDeleteCount)
  })
})