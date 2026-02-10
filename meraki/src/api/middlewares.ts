import { defineMiddlewares, validateAndTransformBody, authenticate, MedusaRequest, MedusaResponse, MedusaNextFunction } from "@medusajs/framework/http"
import { PostInvoiceConfigSchema } from "./admin/invoice-config/route"

const logMiddleware = (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
  console.log("Invoice Middleware Hit:", req.url)
  console.log("Req Headers Auth:", req.headers['authorization'])
  console.log("Req Cookie:", req.headers['cookie'])
  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/invoice-config",
      method: ["POST"],
      middlewares: [validateAndTransformBody(PostInvoiceConfigSchema)],
    },
    {
      matcher: "/store/orders/:id/invoices",
      middlewares: [logMiddleware, authenticate("customer", ["session", "bearer"])],
    },
  ],
})