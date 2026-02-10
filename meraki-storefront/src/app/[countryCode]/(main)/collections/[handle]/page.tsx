import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return {
    title: `${collection.title} | Meraki Woodwork`,
    description: `${collection.title} collection - Premium woodwork and manufacturing solutions.`,
    alternates: {
      canonical: `${getBaseURL()}/${params.countryCode}/collections/${params.handle}`,
    },
    openGraph: {
      title: `${collection.title} | Meraki Woodwork`,
      description: `${collection.title} collection - Premium woodwork and manufacturing solutions.`,
      url: `${getBaseURL()}/${params.countryCode}/collections/${params.handle}`,
    },
  }
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: collection.title,
        description: `${collection.title} collection`,
        url: `${getBaseURL()}/${params.countryCode}/collections/${params.handle}`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: collection.products?.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${getBaseURL()}/${params.countryCode}/products/${product.handle}`,
            name: product.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${getBaseURL()}/${params.countryCode}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Store",
            item: `${getBaseURL()}/${params.countryCode}/store`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: collection.title,
            item: `${getBaseURL()}/${params.countryCode}/collections/${params.handle}`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
