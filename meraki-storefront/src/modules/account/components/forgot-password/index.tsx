"use client"

import { useActionState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { requestPasswordReset } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPassword = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState(requestPasswordReset, {
    success: false,
    error: null,
  })

  return (
    <div
      className="max-w-md w-full flex flex-col items-center bg-white/80 backdrop-blur-md border border-neutral-200 rounded-3xl p-10 shadow-sm"
      data-testid="forgot-password-page"
    >
      <h1 className="text-3xl font-bold font-sans text-neutral-900 mb-2">
        Reset your password
      </h1>
      <p className="text-center text-sm text-neutral-600 mb-8">
        Enter the email linked to your account, and we&apos;ll send you a reset
        link.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="forgot-password-email-input"
          />
        </div>
        <ErrorMessage error={state?.error} data-testid="forgot-password-error" />
        {state?.success && !state?.error && (
          <div
            className="pt-2 text-green-700 text-small-regular"
            data-testid="forgot-password-success"
          >
            If an account exists with that email, you&apos;ll receive
            instructions to reset your password.
          </div>
        )}
        <SubmitButton
          data-testid="forgot-password-submit"
          className="w-full mt-6"
        >
          Send reset link
        </SubmitButton>
      </form>
      <span className="text-center text-neutral-500 text-sm mt-6">
        Remembered your password?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline hover:text-neutral-900 font-medium transition-colors"
          data-testid="back-to-sign-in-button"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default ForgotPassword