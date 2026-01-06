import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="w-full bg-white min-h-screen" data-testid="category-container">
      {/* Editorial Header */}
      <div className="relative w-full bg-[#FAFAFA] pt-32 pb-20 border-b border-neutral-100">
        <div className="content-container flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6 animate-fade-in-up">
            Meraki Interior Factory
          </span>
          <h1
            className="text-6xl md:text-9xl font-serif text-neutral-900 tracking-tighter mb-8 animate-fade-in-up animation-delay-100"
            data-testid="store-page-title"
          >
            The Collection
          </h1>
          <div className="h-px w-24 bg-neutral-300 mb-8" />
          <p className="max-w-lg text-lg text-neutral-500 font-light leading-relaxed animate-fade-in-up animation-delay-200">
            Discover precision-crafted woodwork designed for modern interiors.
            Quality that speaks for itself.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 transition-all duration-300">
        <div className="content-container py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            All Products
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 uppercase tracking-widest hidden sm:block">
              Sort By
            </span>
            <RefinementList sortBy={sort} />
          </div>
        </div>
      </div>

      <div className="content-container py-16">
        <div className="w-full">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
