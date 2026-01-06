"use client"

import { Popover, Transition } from "@headlessui/react"
import { ChevronDownMini } from "@medusajs/icons"
import { clx, Text } from "@medusajs/ui"
import { Fragment } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  const currentLabel = sortOptions.find((o) => o.value === sortBy)?.label || "Sort by"

  return (
    <Popover className="relative z-10">
      {({ open, close }) => (
        <>
          <Popover.Button
            data-testid={dataTestId}
            className={clx(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none",
              open
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
            )}
          >
            <span className="text-sm font-medium">{currentLabel}</span>
            <ChevronDownMini
              className={clx(
                "transition-transform duration-200",
                open ? "rotate-180" : ""
              )}
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden p-1">
              <div className="flex flex-col">
                <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 mb-1">
                  Sort By
                </div>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleChange(option.value as SortOptions)
                      close()
                    }}
                    className={clx(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      sortBy === option.value
                        ? "bg-neutral-100 text-neutral-900 font-medium"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default SortProducts
