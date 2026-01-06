import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-32 flex flex-col justify-center items-center text-center"
      data-testid="empty-cart-message"
    >
      <div className="bg-neutral-50 p-8 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-300"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      </div>
      <Heading
        level="h1"
        className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-4 tracking-tight"
      >
        Your bag is empty
      </Heading>
      <Text className="text-base text-neutral-500 max-w-md mb-10 leading-relaxed">
        Looks like you haven't added anything to your cart yet. Discover our
        collection of premium crafted goods.
      </Text>
      <LocalizedClientLink href="/store">
        <Button
          className="rounded-full px-8 py-3 h-12 bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-base font-medium"
        >
          Start Shopping
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
