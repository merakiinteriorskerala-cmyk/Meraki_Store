import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INVOICE_MODULE } from "../../../../../modules/invoice-generator"
import InvoiceGeneratorService from "../../../../../modules/invoice-generator/service"
import { InvoiceStatus } from "../../../../../modules/invoice-generator/models/invoice"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  console.log("Invoice Route Hit")
  console.log("Auth Context:", JSON.stringify(req.auth_context, null, 2))
  console.log("Session:", req.session)
  
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    console.log("No customer ID found in auth context")
    res.status(401).json({ message: "Unauthorized - No Customer ID" })
    return
  }

  const orderId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [order] } = await query.graph(
    {
      entity: "order",
      fields: [
        "id",
        "display_id",
        "created_at",
        "currency_code",
        "email",
        "subtotal",
        "tax_total",
        "discount_total",
        "total",
        "billing_address.*",
        "shipping_address.*",
        "shipping_methods.total",
        "items.*",
        "customer_id",
      ],
      filters: {
        id: orderId,
        customer_id: customerId,
      },
    },
    { throwIfKeyNotFound: false }
  )

  if (!order) {
    res.status(404).json({ message: "Order not found" })
    return
  }

  const invoiceService: InvoiceGeneratorService = req.scope.resolve(INVOICE_MODULE)

  const [existingLatest] = await invoiceService.listInvoices({
    order_id: orderId,
    status: InvoiceStatus.LATEST,
  })

  const invoice =
    existingLatest ??
    (await invoiceService.createInvoices({
      order_id: orderId,
      status: InvoiceStatus.LATEST,
      pdfContent: {},
    }))

  const pdfBuffer = await invoiceService.generatePdf({
    invoice_id: invoice.id,
    order: order as any,
    items: (order.items ?? []) as any,
  })

  const fileName = `invoice-${order.display_id ?? order.id}.pdf`
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${fileName}"`,
  })
  res.end(pdfBuffer)
}