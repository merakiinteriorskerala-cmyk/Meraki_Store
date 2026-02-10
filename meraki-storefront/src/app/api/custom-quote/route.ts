export const dynamic = "force-dynamic"

const getBackendUrl = () =>
  process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const getPublishableKey = () => process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export async function POST(req: Request) {
  const body = await req.json()
  const backendUrl = getBackendUrl()
  const publishableKey = getPublishableKey()

  if (!publishableKey) {
    return Response.json(
      { message: "Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" },
      { status: 500 }
    )
  }

  const upstream = await fetch(`${backendUrl}/store/custom`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-publishable-api-key": publishableKey,
    },
    body: JSON.stringify(body),
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

  const json = await upstream.json()
  return Response.json(json)
}