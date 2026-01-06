import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Heading level="h2" className="text-lg font-medium text-neutral-900">
          Already have an account?
        </Heading>
        <Text className="text-sm text-neutral-500">
          Sign in for a faster checkout and better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10 px-6 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-none transition-all shadow-sm font-medium"
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
