"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { login } from "@/lib/api/auth"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { LocaleSync } from "@/components/auth/LocaleSync"

export default function LoginPage() {
  const router = useRouter()
  const t = useTranslations("auth.login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(email, password)
      localStorage.setItem("token", data.token)
      router.push("/")
    } catch (err) {
      if (err instanceof Error && err.message === "invalid credentials") {
        setError(t("invalidCredentials"))
      } else {
        setError(err instanceof Error ? err.message : t("submit"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LocaleSync />
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 32,
          width: "100%",
          maxWidth: 400,
          border: "1px solid #e5e7eb",
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "#111827" }}>
          {t("title")}
        </h1>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#6b7280" }}>
          {t("subtitle")}
        </p>

        {error && (
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#dc2626" }}>{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label={t("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label={t("password")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading}>
            {t("submit")}
          </Button>
        </form>

        <p style={{ margin: "16px 0 0", fontSize: 14, color: "#6b7280", textAlign: "center" }}>
          {t("noAccount")}{" "}
          <Link href="/register" style={{ color: "#2563eb" }}>
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </div>
  )
}
