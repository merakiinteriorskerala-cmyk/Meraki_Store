"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ForgotPassword from "@modules/account/components/forgot-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)

  const content =
    currentView === LOGIN_VIEW.SIGN_IN ? (
      <Login setCurrentView={setCurrentView} />
    ) : currentView === LOGIN_VIEW.REGISTER ? (
      <Register setCurrentView={setCurrentView} />
    ) : (
      <ForgotPassword setCurrentView={setCurrentView} />
    )

  return (
    <div className="w-full flex justify-start px-8 py-8">{content}</div>
  )
}

export default LoginTemplate
