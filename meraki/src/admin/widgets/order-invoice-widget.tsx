import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useMemo, useState } from "react"

type OrderData = {
  id?: string
  display_id?: number
}

type Props = {
  data: OrderData
}

const OrderInvoiceWidget = ({ data }: Props) => {
  const [downloading, setDownloading] = useState(false)

  const orderId = data?.id ?? ""

  const href = useMemo(() => {
    return orderId ? `/admin/orders/${orderId}/invoices` : ""
  }, [orderId])

  const onDownload = () => {
    if (!href) {
      return
    }

    setDownloading(true)
    window.open(href, "_blank", "noopener,noreferrer")
    setTimeout(() => setDownloading(false), 500)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Invoice</Heading>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <Button
          variant="secondary"
          size="small"
          onClick={onDownload}
          isLoading={downloading}
          disabled={!orderId}
        >
          Download invoice
        </Button>
        {!orderId && (
          <Text size="small" className="text-ui-fg-subtle">
            Order ID missing.
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
})

export default OrderInvoiceWidget