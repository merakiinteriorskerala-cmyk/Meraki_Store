"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { resetPassword } from "@lib/data/customer"

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email") ?? ""

  const [state, formAction] = useActionState(resetPassword, {
    success: false,
    error: null,
  })

  if (!token) {
    return (
      <div
        className="max-w-sm w-full flex flex-col items-center"
        data-testid="reset-password-page"
      >
        <h1 className="text-3xl font-serif text-ui-fg-base mb-2">
          Reset your password
        </h1>
        <p className="text-center text-small-regular text-ui-fg-subtle mb-6">
          The reset link is missing a token. Please request a new link.
        </p>
        <ErrorMessage
          error="Reset token is missing or invalid."
          data-testid="reset-password-error"
        />
        <span className="text-center text-ui-fg-subtle text-small-regular mt-6">
          Back to{" "}
          <LocalizedClientLink
            href="/account"
            className="underline hover:text-ui-fg-base transition-colors"
            data-testid="reset-password-sign-in-link"
          >
            Sign in
          </LocalizedClientLink>
          .
        </span>
      </div>
    )
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="text-3xl font-serif text-ui-fg-base mb-2">
        Set a new password
      </h1>
      <p className="text-center text-small-regular text-ui-fg-subtle mb-8">
        Choose a new password for your account.
      </p>
      <form className="w-full" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="reset-password-input"
          />
          <Input
            label="Confirm password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="reset-password-confirm-input"
          />
        </div>
        <ErrorMessage error={state?.error} data-testid="reset-password-error" />
        {state?.success && !state?.error && (
          <div
            className="pt-2 text-green-700 text-small-regular"
            data-testid="reset-password-success"
          >
            Password reset successfully. You can sign in now.
          </div>
        )}
        <SubmitButton
          data-testid="reset-password-submit"
          className="w-full mt-6"
        >
          Reset password
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-subtle text-small-regular mt-6">
        Back to{" "}
        <LocalizedClientLink
          href="/account"
          className="underline hover:text-ui-fg-base transition-colors"
          data-testid="reset-password-sign-in-link"
        >
          Sign in
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default ResetPassword