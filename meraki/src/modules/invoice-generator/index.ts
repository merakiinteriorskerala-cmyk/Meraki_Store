import InvoiceGeneratorService from "./service"
import { Module } from "@medusajs/framework/utils"
import createDefaultConfigLoader from "./loaders/create-default-config"

export const INVOICE_MODULE = "invoice_generator"

export default Module(INVOICE_MODULE, {
  service: InvoiceGeneratorService,
  loaders: [createDefaultConfigLoader],
})