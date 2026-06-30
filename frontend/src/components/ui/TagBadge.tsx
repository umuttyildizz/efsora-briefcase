function formatTag(tag: string): string {
  return tag
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

interface TagBadgeProps {
  tag: string
  active?: boolean
  onClick?: () => void
}

export function TagBadge({ tag, active = false, onClick }: TagBadgeProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "2px 10px",
        borderRadius: 12,
        border: "none",
        fontSize: 12,
        fontWeight: 500,
        cursor: onClick ? "pointer" : "default",
        background: active ? "#2563eb" : "#e5e7eb",
        color: active ? "#fff" : "#374151",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      #{formatTag(tag)}
    </button>
  )
}