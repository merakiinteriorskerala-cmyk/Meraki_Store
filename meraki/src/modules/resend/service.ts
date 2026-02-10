import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type ResendOptions = {
  api_key: string
  from: string
}

class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"
  protected options: ResendOptions
  protected resend: Resend

  constructor(container: any, options: ResendOptions) {
    super()
    this.options = options
    this.resend = new Resend(options.api_key)
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    console.log("Resend service.send called with:", {
      to: notification.to,
      template: notification.template,
    })

    const to = Array.isArray(notification.to)
      ? notification.to
      : [notification.to]

    const template = notification.template || "notification"
    const data = notification.data || {}
    const resetUrl = typeof data.reset_url === "string" ? data.reset_url : ""
    const order =
      typeof data.order === "object" && data.order
        ? (data.order as Record<string, any>)
        : null
    const orderItems = Array.isArray(data.items) ? data.items : []
    const orderUrl = typeof data.order_url === "string" ? data.order_url : ""
    const orderDisplayId = order?.display_id ?? order?.id ?? ""
    const orderCurrency =
      typeof order?.currency_code === "string"
        ? order.currency_code.toUpperCase()
        : ""
    const orderTotal =
      order?.total != null && orderCurrency
        ? `${order.total} ${orderCurrency}`
        : ""
    const orderItemsHtml = orderItems.length
      ? `<ul>${orderItems
          .map(
            (item: any) =>
              `<li>${item.title ?? "Item"} x ${item.quantity ?? 1}</li>`
          )
          .join("")}</ul>`
      : ""
    const orderHtml = `<p>Thank you for your order.</p>${orderDisplayId ? `<p>Order: ${orderDisplayId}</p>` : ""}${orderTotal ? `<p>Total: ${orderTotal}</p>` : ""}${orderItemsHtml}${orderUrl ? `<p><a href="${orderUrl}">View your order</a></p>` : ""}`
    const quoteName = typeof data.name === "string" ? data.name : ""
    const quoteEmail = typeof data.email === "string" ? data.email : ""
    const quotePhone = typeof data.phone === "string" ? data.phone : ""
    const quoteMessage = typeof data.message === "string" ? data.message : ""
    const quoteHtml = `<p>New custom quote request.</p>${quoteName ? `<p>Name: ${quoteName}</p>` : ""}${quoteEmail ? `<p>Email: ${quoteEmail}</p>` : ""}${quotePhone ? `<p>Phone: ${quotePhone}</p>` : ""}${quoteMessage ? `<p>Message: ${quoteMessage}</p>` : ""}`
    const subject =
      notification.content?.subject ||
      (template === "password-reset"
        ? "Reset your password"
        : template === "order-confirmation"
          ? `Order confirmed ${orderDisplayId}`.trim()
          : template === "quote-request"
            ? "New custom quote request"
            : template)

    const html =
      notification.content?.html ||
      (template === "password-reset"
        ? `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p>`
        : template === "order-confirmation"
          ? orderHtml
          : template === "quote-request"
            ? quoteHtml
            : typeof data.html === "string"
              ? data.html
              : typeof data.text === "string"
                ? `<p>${data.text}</p>`
                : "<p></p>")

    const attachments = Array.isArray(data.attachments)
      ? data.attachments
      : undefined

    const from = notification.from?.trim() || this.options.from

    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
        ...(attachments ? { attachments } : {}),
      })

      if (response.error) {
        console.error("Resend email failed:", {
          to,
          from,
          error: response.error,
        })
        throw new Error(response.error.message)
      }

      console.log("Resend email sent successfully:", {
        id: response.data?.id,
        to,
        from,
      })

      return {
        id: response.data?.id || "resend",
      }
    } catch (error) {
      console.error("Resend email failed:", {
        to,
        from,
        error,
      })
      throw error
    }
  }
}

export default ResendNotificationService
