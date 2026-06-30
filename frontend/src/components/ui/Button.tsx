interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  loading?: boolean
}

export function Button({ variant = "primary", loading = false, children, disabled, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    fontWeight: 500,
    fontSize: 14,
    opacity: disabled || loading ? 0.6 : 1,
    transition: "opacity 0.2s",
    minWidth: 120,
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#2563eb", color: "#fff" },
    secondary: { background: "#e5e7eb", color: "#111827" },
    danger: { background: "#dc2626", color: "#fff" },
  }

  return (
    <button style={{ ...base, ...variants[variant], ...style }} disabled={disabled || loading} {...props}>
      {loading ? "Loading..." : children}
    </button>
  )
}
