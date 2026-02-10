import { cookies as nextCookies } from "next/headers"

export const dynamic = "force-dynamic"

const getBackendUrl = () => process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const getPublishableKey = () => process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params

  const cookies = await nextCookies()
  const token = cookies.get("_medusa_jwt")?.value

  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const backendUrl = getBackendUrl()
  const publishableKey = getPublishableKey()

  if (!publishableKey) {
    return Response.json(
      { message: "Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" },
      { status: 500 }
    )
  }

  const upstream = await fetch(`${backendUrl}/store/orders/${id}/invoices`, {
    method: "GET",
    headers: {
      accept: "application/pdf",
      authorization: `Bearer ${token}`,
      "x-publishable-api-key": publishableKey,
    },
    cache: "no-store",
  })

  if (!upstream.ok) {
    const text = await upstream.text()
    return new Response(text || upstream.statusText, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "text/plain",
      },
    })
  }

  const buf = await upstream.arrayBuffer()

  return new Response(buf, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition":
        upstream.headers.get("content-disposition") ??
        `attachment; filename="invoice-${id}.pdf"`,
    },
  })
}