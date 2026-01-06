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
        className="relative h-full bg-white rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] ring-1 ring-neutral-100 group-hover:ring-neutral-200"
        data-testid="product-wrapper"
      >
        {/* Image Section */}
        <div className="relative aspect-[1/1] overflow-hidden bg-neutral-50">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 !rounded-none !shadow-none !border-none !p-0"
          />
          
          {/* Floating Action Button */}
          <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg hover:bg-neutral-900 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Meraki
            </Text>
            <div className="flex items-center gap-x-1 text-sm font-semibold text-neutral-900">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
          
          <Text
            className="text-base font-medium text-neutral-800 leading-snug line-clamp-2 group-hover:text-neutral-500 transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
