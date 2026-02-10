import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { generateInvoicePdfWorkflow } from "../workflows/generate-invoice-pdf"

type OrderPlacedEvent = {
  id?: string
  order_id?: string
}

export default async function orderConfirmationHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const orderId = data.order_id || data.id

  if (!orderId) {
    console.error("Order confirmation subscriber: missing order id", data)
    return
  }

  console.log("Order confirmation subscriber triggered:", { orderId })

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [order] } = await query.graph(
    {
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "currency_code",
        "total",
        "email",
        "payment_status",
        "items.*",
        "shipping_address.*",
      ],
      filters: {
        id: orderId,
      },
      options: {
        throwIfKeyNotFound: false,
      },
    }
  )

  if (!order?.email) {
    console.warn("Order confirmation subscriber: order or email missing", {
      orderId,
    })
    return
  }

  const paymentStatus = (order as any).payment_status
  if (
    paymentStatus &&
    !["captured", "authorized", "paid"].includes(paymentStatus)
  ) {
    console.log("Order confirmation skipped due to payment status", {
      orderId,
      paymentStatus,
    })
    return
  }

  const { result } = await generateInvoicePdfWorkflow(container).run({
    input: {
      order_id: orderId,
    },
  })

  const pdfBuffer = Buffer.isBuffer(result.pdf_buffer)
    ? result.pdf_buffer
    : Buffer.from(result.pdf_buffer)

  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const config = container.resolve("configModule")

  const storefrontUrl =
    config.admin?.storefrontUrl ||
    process.env.STOREFRONT_URL ||
    "http://localhost:8000"

  const orderUrl = `${storefrontUrl}/order/${order.id}/confirmed`

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-confirmation",
    data: {
      order: {
        id: order.id,
        display_id: order.display_id,
        total: order.total,
        currency_code: order.currency_code,
      },
      items: (order.items ?? []).map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      order_url: orderUrl,
      attachments: [
        {
          filename: `invoice-${order.display_id ?? order.id}.pdf`,
          content: pdfBuffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}