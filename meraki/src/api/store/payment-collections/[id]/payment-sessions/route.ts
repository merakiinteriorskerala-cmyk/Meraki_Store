import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse, refetchEntity } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const collectionId = req.params.id
  const body = (req.body ?? {}) as any

  const provider_id = body.provider_id
  const data = body.data

  if (!provider_id || typeof provider_id !== "string") {
    res.status(400).json({ message: "provider_id is required" })
    return
  }

  const extra =
    data && typeof data === "object" && "extra" in data ? (data as any).extra : undefined

  const workflowInput: any = {
    payment_collection_id: collectionId,
    provider_id,
    customer_id: (req as any).auth_context?.actor_id,
    data,
    ...(extra ? { context: { extra } } : {}),
  }

  await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput,
  })

  const payment_collection = await refetchEntity({
    entity: "payment_collection",
    idOrFilter: collectionId,
    scope: req.scope,
    fields: (req as any).queryConfig?.fields,
  })

  res.status(200).json({ payment_collection })
}