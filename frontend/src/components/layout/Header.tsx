"use client"

import { useTranslations, useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/Button"

type Locale = "en" | "tr"

export function Header() {
  const t = useTranslations("common")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    localStorage.removeItem("token")
    router.push("/login")
  }

  function handleLocaleChange(newLocale: Locale) {
    localStorage.setItem("preferred-locale", newLocale)
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: 32,
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>
        {t("appName")}
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["en", "tr"] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              style={{
                padding: "4px 10px",
                minWidth: 36,
                borderRadius: 4,
                border: "1px solid #d1d5db",
                background: locale === loc ? "#2563eb" : "#fff",
                color: locale === loc ? "#fff" : "#374151",
                fontWeight: locale === loc ? 700 : 400,
                fontSize: 12,
                cursor: locale === loc ? "default" : "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          {t("logout")}
        </Button>
      </div>
    </header>
  )
}
