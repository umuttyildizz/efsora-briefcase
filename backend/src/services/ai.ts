import Anthropic from "@anthropic-ai/sdk"

interface AiResult {
  summary: string
  tags: string[]
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseAiResponse(text: string): AiResult | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return null

  const parsed = JSON.parse(jsonMatch[0]) as AiResult

  if (typeof parsed.summary !== "string" || !Array.isArray(parsed.tags)) return null
  if (parsed.tags.length < 3 || parsed.tags.length > 5) return null

  return parsed
}

export async function generateSummaryAndTags(content: string): Promise<AiResult | null> {
  const prompt = `Summarize the following text in exactly 2 sentences and provide 3 to 5 short lowercase tags.
Return ONLY a raw JSON object with no markdown, no explanation, no code blocks.
Format: {"summary":"your summary","tags":["tag1","tag2","tag3"]}

Text:
${content}`

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()

    const parsed = parseAiResponse(text)
    if (parsed) return parsed

    const retryMessage = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: text },
        { role: "user", content: "Return ONLY the raw JSON object. No extra text." },
      ],
    })

    const retryText = retryMessage.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()

    return parseAiResponse(retryText)
  } catch (err) {
    console.error("AI error:", err)
    return null
  }
}