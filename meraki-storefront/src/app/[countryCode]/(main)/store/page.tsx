import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const params = await props.params
  const title = "Store | Meraki Woodwork"
  const description = "Explore all of our premium woodwork products."

  return {
    title,
    description,
    alternates: {
      canonical: `${getBaseURL()}/${params.countryCode}/store`,
    },
    openGraph: {
      title,
      description,
      url: `${getBaseURL()}/${params.countryCode}/store`,
    },
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
