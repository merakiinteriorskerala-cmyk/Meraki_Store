"use client"

import { authorizePayment, placeOrder, waitForPaymentCompletion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay"
import { CurrencyCode } from "react-razorpay/dist/constants/currency"

export const RazorpayPaymentButton = ({
  session,
  notReady,
  cart,
  "data-testid": dataTestId,
}: {
  session: HttpTypes.StorePaymentSession
  notReady: boolean
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { Razorpay, isLoading } = useRazorpay()

  const orderId = useMemo(() => {
    const data = session?.data as any
    const direct = (data?.id ?? data?.order_id ?? data?.orderId ?? "") as string

    if (direct) {
      return direct
    }

    try {
      return (sessionStorage.getItem(`rzp_order_id_${cart.id}`) ?? "") as string
    } catch {
      return ""
    }
  }, [session?.data, cart.id])

  const currency = useMemo(() => {
    const code = (cart.currency_code || "INR").toUpperCase()
    return code as CurrencyCode
  }, [cart.currency_code])

  useEffect(() => {
    setErrorMessage(null)
  }, [orderId])

  const handlePayment = useCallback(async () => {
    setSubmitting(true)
    setErrorMessage(null)
    console.log("handlePayment")

    // Resolve the Razorpay constructor safely
    const RazorpayConstructor = (Razorpay || (window as any).Razorpay) as any

    if (!RazorpayConstructor || isLoading) {
      setSubmitting(false)
      setErrorMessage("Razorpay SDK not loaded")
      return
    }

    if (typeof RazorpayConstructor !== 'function') {
      console.error("Razorpay is not a constructor:", RazorpayConstructor)
      setSubmitting(false)
      setErrorMessage("Payment gateway failed to initialize. Please refresh.")
      return
    }

    if (!orderId) {
      setSubmitting(false)
      setErrorMessage("Missing Razorpay order id. Click 'Continue to review' again and retry.")
      return
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? ""

    if (!key) {
      setSubmitting(false)
      setErrorMessage("Missing NEXT_PUBLIC_RAZORPAY_KEY")
      return
    }

    const options: RazorpayOrderOptions = {
      key,
      order_id: orderId,
      amount: (session.amount ?? cart.total ?? 0) as number,
      currency,
      name: process.env.NEXT_PUBLIC_SHOP_NAME ?? "Store",
      description: process.env.NEXT_PUBLIC_SHOP_DESCRIPTION ?? `Order ${orderId}`,
      prefill: {
        name:
          `${cart.billing_address?.first_name ?? ""} ${cart.billing_address?.last_name ?? ""}`.trim() ||
          undefined,
        email: cart.email ?? undefined,
        contact:
          cart.billing_address?.phone ??
          cart.shipping_address?.phone ??
          undefined,
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false)
          setErrorMessage("Payment cancelled")
        },
      },
      handler: async (response: any) => {
        console.log("handler", response)

        try {
          await authorizePayment(cart.id, session.provider_id, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })

          await waitForPaymentCompletion({
            cartId: cart.id,
            providerId: session.provider_id,
          })

          await placeOrder(cart.id)
        } catch (err: any) {
          console.error("Error in payment handler:", err)
          setErrorMessage(err?.message ?? "An error occurred.")
          setSubmitting(false)
        }
      },
    }

    console.log("options: ", options)
    
    try {
        const rz = new RazorpayConstructor(options)
        rz.on("payment.failed", (response: any) => {
          setSubmitting(false)
          setErrorMessage(
            response?.error?.description ||
              response?.error?.reason ||
              "Payment failed"
          )
        })

        rz.open()
    } catch (error) {
        console.error("Error initializing Razorpay:", error)
        setSubmitting(false)
        setErrorMessage("Failed to open payment gateway")
    }
  }, [Razorpay, isLoading, cart, orderId, session.amount, session.provider_id, currency])

  return (
    <>
      <Button
        disabled={submitting || notReady || !orderId || isLoading}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        {submitting ? <Spinner /> : "Pay with Razorpay"}
      </Button>

      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">{errorMessage}</div>
      )}
    </>
  )
}