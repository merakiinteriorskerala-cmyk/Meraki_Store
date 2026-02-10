import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

type PasswordResetEvent = {
  entity_id: string
  token: string
  actor_type: string
}

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEvent>) {
  console.log("Password reset subscriber triggered:", data)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const config = container.resolve("configModule")

  const storefrontUrl =
    config.admin?.storefrontUrl ||
    process.env.STOREFRONT_URL ||
    "http://localhost:8000"

  const backendUrl =
    config.admin?.backendUrl && config.admin?.backendUrl !== "/"
      ? config.admin?.backendUrl
      : "http://localhost:9000"

  const adminPath = config.admin?.path || "/app"

  const urlPrefix =
    data.actor_type === "customer" ? storefrontUrl : `${backendUrl}${adminPath}`

  console.log("Sending password reset notification to:", data.entity_id)
  console.log("Reset URL:", `${urlPrefix}/account/reset-password`)

  await notificationModuleService.createNotifications({
    to: data.entity_id,
    channel: "email",
    template: "password-reset",
    data: {
      reset_url: `${urlPrefix}/account/reset-password?token=${data.token}&email=${encodeURIComponent(
        data.entity_id
      )}`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}