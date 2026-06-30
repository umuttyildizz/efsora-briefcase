interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: `1px solid ${error ? "#dc2626" : "#d1d5db"}`,
          fontSize: 14,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 12, color: "#dc2626" }}>{error}</span>
      )}
    </div>
  )
}