import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  inApp: true,
  env: {},
  testSuite: ({ api, getContainer }) => {
    describe("POST /store/payment-collections/:id/payment-sessions", () => {
      it("returns 400 when provider_id is missing", async () => {
        const collectionId = "test-collection-id"
        let status = 0
        let body: any = undefined

        try {
          await api.post(
            `/store/payment-collections/${collectionId}/payment-sessions`,
            {}
          )
        } catch (e: any) {
          status = e.response?.status ?? 0
          body = e.response?.data
        }

        expect(status).toBe(400)
        expect(body).toMatchObject({ message: "provider_id is required" })
      })

      it("returns 400 when provider_id is not a string", async () => {
        const collectionId = "test-collection-id"
        let status = 0
        let body: any = undefined

        try {
          await api.post(
            `/store/payment-collections/${collectionId}/payment-sessions`,
            {
              provider_id: 123,
            }
          )
        } catch (e: any) {
          status = e.response?.status ?? 0
          body = e.response?.data
        }

        expect(status).toBe(400)
        expect(body).toMatchObject({ message: "provider_id is required" })
      })

      it("fails when payment collection does not exist", async () => {
        const collectionId = "non-existent-collection"
        let status = 0

        try {
          await api.post(
            `/store/payment-collections/${collectionId}/payment-sessions`,
            {
              provider_id: "pp_system_default",
            }
          )
        } catch (e: any) {
          status = e.response?.status ?? 0
        }

        expect(status).toBeGreaterThanOrEqual(400)
      })

      it("creates a payment session for a valid payment collection", async () => {
        const container = getContainer()
        const paymentModule = container.resolve(Modules.PAYMENT) as any

        const paymentCollection = await paymentModule.createPaymentCollections({
          amount: 1000,
          currency_code: "eur",
        })

        const response = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          {
            provider_id: "pp_system_default",
          }
        )

        expect(response.status).toBe(200)
        expect(response.data.payment_collection).toBeDefined()
        expect(response.data.payment_collection.id).toBe(paymentCollection.id)
      })
    })
  },
})