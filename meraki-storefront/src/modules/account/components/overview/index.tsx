import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-sans text-neutral-900 mb-2">
              <span data-testid="welcome-message" data-value={customer?.first_name}>
                Hello, {customer?.first_name}
              </span>
            </h2>
            <p className="text-neutral-600">
              Signed in as:{" "}
              <span
                className="font-medium text-neutral-900"
                data-testid="customer-email"
                data-value={customer?.email}
              >
                {customer?.email}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-y-12">
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-8 pb-8 border-b border-neutral-200">
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-y-2">
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Profile Completion</h3>
              <div className="flex items-baseline gap-x-2">
                <span
                  className="text-4xl font-bold text-neutral-900"
                  data-testid="customer-profile-completion"
                  data-value={getProfileCompletion(customer)}
                >
                  {getProfileCompletion(customer)}%
                </span>
                <span className="text-sm text-neutral-500">
                  Completed
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 mt-2">
                <div 
                  className="bg-neutral-900 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${getProfileCompletion(customer)}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-y-2">
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">Saved Addresses</h3>
              <div className="flex items-baseline gap-x-2">
                <span
                  className="text-4xl font-bold text-neutral-900"
                  data-testid="addresses-count"
                  data-value={customer?.addresses?.length || 0}
                >
                  {customer?.addresses?.length || 0}
                </span>
                <span className="text-sm text-neutral-500">
                  Addresses
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-sans text-neutral-900">Recent orders</h3>
              <LocalizedClientLink href="/account/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                View all orders
              </LocalizedClientLink>
            </div>
            <ul
              className="flex flex-col gap-y-4"
              data-testid="orders-wrapper"
            >
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => {
                  return (
                    <li
                      key={order.id}
                      data-testid="order-wrapper"
                      data-value={order.id}
                    >
                      <LocalizedClientLink
                        href={`/account/orders/details/${order.id}`}
                      >
                        <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 flex justify-between items-center group">
                          <div className="grid grid-cols-3 gap-x-8 flex-1">
                            <div className="flex flex-col gap-y-1">
                              <span className="text-xs font-medium text-neutral-500 uppercase">Date placed</span>
                              <span className="text-sm text-neutral-900 font-medium" data-testid="order-created-date">
                                {new Date(order.created_at).toDateString()}
                              </span>
                            </div>
                            <div className="flex flex-col gap-y-1">
                              <span className="text-xs font-medium text-neutral-500 uppercase">Order number</span>
                              <span
                                className="text-sm text-neutral-900 font-medium"
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                            </div>
                            <div className="flex flex-col gap-y-1">
                              <span className="text-xs font-medium text-neutral-500 uppercase">Total amount</span>
                              <span className="text-sm text-neutral-900 font-medium" data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                            <ChevronDown className="-rotate-90 text-neutral-500 group-hover:text-neutral-900" />
                          </div>
                        </div>
                      </LocalizedClientLink>
                    </li>
                  )
                })
              ) : (
                <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-8 text-center" data-testid="no-orders-message">
                  <p className="text-neutral-500">No recent orders found.</p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
