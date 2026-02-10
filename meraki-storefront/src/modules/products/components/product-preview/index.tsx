import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block h-full">
      <div
        className="relative h-full flex flex-col bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-sm"
        data-testid="product-wrapper"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 border-b border-neutral-100">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          
          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 shadow-sm border border-neutral-200 hover:bg-neutral-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-1 flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-50 text-neutral-500 border border-neutral-100">
              <span className="w-1 h-1 rounded-full bg-neutral-400"></span>
              MERAKI
            </div>
            <div className="flex items-center gap-x-1 text-sm font-medium text-neutral-900">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          
          <Text
            className="text-sm font-medium text-neutral-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
