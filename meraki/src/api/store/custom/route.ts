import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.sendStatus(200)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as Record<string, unknown>
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const phone = typeof body.phone === "string" ? body.phone.trim() : ""
  const message = typeof body.message === "string" ? body.message.trim() : ""

  if (!name || !email || !message) {
    res.status(400).json({ message: "name, email, and message are required" })
    return
  }

  const notificationModuleService = req.scope.resolve(Modules.NOTIFICATION)
  const to =
    process.env.QUOTE_REQUEST_TO || "merakiinteriorskerala@gmail.com"

  await notificationModuleService.createNotifications({
    to,
    channel: "email",
    template: "quote-request",
    data: {
      name,
      email,
      phone,
      message,
    },
  })

  res.status(200).json({ success: true })
}
