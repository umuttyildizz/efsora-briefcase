import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

export const { useRouter, usePathname, Link } = createNavigation(routing)
