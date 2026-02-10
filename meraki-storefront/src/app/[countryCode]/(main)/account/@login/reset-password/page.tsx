import { Metadata } from "next"

import ResetPassword from "@modules/account/components/reset-password"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your account password.",
}

export default function ResetPasswordPage() {
  return <ResetPassword />
}