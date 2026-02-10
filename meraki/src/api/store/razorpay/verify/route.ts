import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, PaymentSessionStatus } from "@medusajs/framework/utils"
import crypto from "crypto"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    session_id,
  } = req.body as any

  console.log("Razorpay Verify Request Body:", req.body)

  if (
    !razorpay_payment_id ||
    !razorpay_order_id ||
    !razorpay_signature ||
    !session_id
  ) {
    res.status(400).json({ message: "Missing required fields" })
    return
  }

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)

  try {
    const internalSession = await (paymentModuleService as any).paymentSessionService_.retrieve(
      session_id,
      { select: ["id", "data", "provider_id"] }
    )

    const currentSessionData = (internalSession?.data ?? {}) as Record<string, any>
    const patchedSessionData = {
      ...currentSessionData,
      id: currentSessionData?.id ?? razorpay_order_id,
      order_id: currentSessionData?.order_id ?? razorpay_order_id,
      razorpay_payment_id:
        currentSessionData?.razorpay_payment_id ?? razorpay_payment_id,
      payment_id: currentSessionData?.payment_id ?? razorpay_payment_id,
    }

    if (!patchedSessionData.id) {
      throw new Error("Missing Razorpay order id in payment session")
    }

    if (
      currentSessionData?.id !== patchedSessionData.id ||
      currentSessionData?.order_id !== patchedSessionData.order_id ||
      currentSessionData?.razorpay_payment_id !==
        patchedSessionData.razorpay_payment_id ||
      currentSessionData?.payment_id !== patchedSessionData.payment_id
    ) {
      await (paymentModuleService as any).paymentSessionService_.update({
        id: session_id,
        data: patchedSessionData,
      })
    }

    // 1. Manual Signature Verification
    // We must verify the signature here because the provider implementation 
    // might ignore the context or fail to verify it explicitly.
    // We need the secret. Ideally it's in env.
    const secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET
    
    if (secret) {
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex")

      if (generated_signature !== razorpay_signature) {
        throw new Error("Invalid payment signature")
      }
      console.log("Signature verified successfully")
    } else {
      console.warn("RAZORPAY_KEY_SECRET not found, skipping manual signature verification")
    }

    const internalSessionWithPayment = await (paymentModuleService as any).paymentSessionService_.retrieve(
      session_id,
      {
        select: [
          "id",
          "data",
          "provider_id",
          "amount",
          "currency_code",
          "authorized_at",
          "payment_collection_id",
        ],
        relations: ["payment"],
      }
    )

    if (internalSessionWithPayment?.payment && internalSessionWithPayment?.authorized_at) {
      res.status(200).json({ payment: internalSessionWithPayment.payment })
      return
    }

    // 3. Authorize (without relying on PaymentProviderService input shape)
    // Medusa v2 calls provider.authorizePayment({ data, context }), but this provider expects authorizePayment(sessionData, context)
    const provider = await (paymentModuleService as any).paymentProviderService_.retrieveProvider(
      internalSessionWithPayment.provider_id
    )

    const authorizationInput = {
      ...(internalSessionWithPayment.data ?? {}),
      id: razorpay_order_id,
      order_id: razorpay_order_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      payment_id: razorpay_payment_id,
    }

    const providerResult = await provider.authorizePayment({
      data: authorizationInput,
      context: {
        customer: internalSessionWithPayment?.payment?.customer as any,
      },
    } as any)

    const status = providerResult?.status
    const providerData = {
      ...(providerResult?.data ?? internalSessionWithPayment.data ?? {}),
      id: razorpay_order_id,
      order_id: razorpay_order_id,
      razorpay_payment_id,
      razorpay_order_id,
      payment_id: razorpay_payment_id,
    }

    if (
      status !== PaymentSessionStatus.AUTHORIZED &&
      status !== PaymentSessionStatus.CAPTURED
    ) {
      await (paymentModuleService as any).paymentSessionService_.update({
        id: session_id,
        status,
        data: providerData,
      })

      throw new Error(`Session: ${session_id} was not authorized with the provider.`)
    }

    const finalStatus =
      status === PaymentSessionStatus.CAPTURED
        ? PaymentSessionStatus.AUTHORIZED
        : status

    await (paymentModuleService as any).paymentSessionService_.update({
      id: session_id,
      status: finalStatus,
      data: providerData,
      ...(internalSessionWithPayment.authorized_at === null
        ? { authorized_at: new Date() }
        : {}),
    })

    const payment = await (paymentModuleService as any).paymentService_.create({
      amount: internalSessionWithPayment.amount,
      currency_code: internalSessionWithPayment.currency_code,
      payment_session: internalSessionWithPayment.id,
      payment_collection_id: internalSessionWithPayment.payment_collection_id,
      provider_id: internalSessionWithPayment.provider_id,
      data: providerData,
    })

    await (paymentModuleService as any).maybeUpdatePaymentCollection_(
      internalSessionWithPayment.payment_collection_id
    )

    res.status(200).json({ payment })
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error)
    res.status(400).json({ message: error.message })
  }
}