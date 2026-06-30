"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

export function LocaleSync() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const preferred = localStorage.getItem("preferred-locale")
    if (
      preferred &&
      preferred !== locale &&
      (routing.locales as readonly string[]).includes(preferred)
    ) {
      router.replace(pathname, { locale: preferred as "en" | "tr" })
    }
  }, [locale, pathname, router])

  return null
}
