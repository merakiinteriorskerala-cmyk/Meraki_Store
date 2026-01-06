"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"

type ActiveLinkProps = {
  children?: React.ReactNode
  href: string
  className?: string
  activeClassName?: string
  [x: string]: any
}

const ActiveLink = ({
  children,
  href,
  className,
  activeClassName = "text-ui-fg-base bg-ui-bg-subtle",
  ...props
}: ActiveLinkProps) => {
  const pathname = usePathname()
  const { countryCode } = useParams()

  const normalizedPath = (() => {
    if (!pathname || typeof countryCode !== "string") {
      return "/"
    }

    if (pathname.startsWith(`/${countryCode}`)) {
      const p = pathname.slice(countryCode.length + 1)
      // handle cases like /us and /us/
      if (p === "" || p === "/") return "/"
      // handle cases like /us/services
      return p.startsWith("/") ? p : `/${p}`
    }

    return pathname
  })()

  // Function to check if link is active
  const isActive =
    href === "/"
      ? normalizedPath === "/"
      : normalizedPath === href || normalizedPath.startsWith(`${href}/`)

  return (
    <LocalizedClientLink
      href={href}
      className={clx(className, { [activeClassName]: isActive })}
      {...props}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default ActiveLink