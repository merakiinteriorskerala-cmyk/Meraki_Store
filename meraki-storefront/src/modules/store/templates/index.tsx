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
    <div className="w-full bg-white min-h-screen relative" data-testid="category-container">
      {/* Editorial Header */}
      <div className="relative w-full bg-neutral-50/50 pt-32 pb-24 border-b border-neutral-200 overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <div className="content-container flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-medium text-neutral-600 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-neutral-900"></span>
            MERAKI INTERIOR FACTORY
          </div>
          
          <h1
            className="text-5xl md:text-7xl font-sans font-bold text-neutral-900 tracking-tight mb-6"
            data-testid="store-page-title"
          >
            The Store
          </h1>
          
          <p className="max-w-xl text-lg text-neutral-500 font-light leading-relaxed">
            Discover precision-crafted woodwork designed for modern interiors. 
            Quality that speaks for itself.
          </p>

          <div className="mt-10 group cursor-default">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md border border-amber-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(251,191,36,0.15)] transition-all duration-500 hover:-translate-y-1">
              <div className="p-1.5 bg-amber-100/80 rounded-full group-hover:bg-amber-200 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-700">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.72 .829.799 1.654 1.38 2.274 1.765a11.55 11.55 0 001.04.573l.018.009.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium text-neutral-600">
                Shipping exclusively to <span className="text-amber-700 font-bold">Kerala, India</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[57px] z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 transition-all duration-300">
        <div className="content-container py-3 flex flex-col sm:flex-row justify-between items-center gap-4 h-14">
          <span className="text-sm font-medium text-neutral-900 flex items-center gap-2">
            All Products
            <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-500">
              Catalog
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide hidden sm:block">
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
