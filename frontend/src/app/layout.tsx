import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BriefBase",
  description: "AI-powered note summarizer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  )
}
