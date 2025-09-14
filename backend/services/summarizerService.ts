import OpenAI from "openai";

// Common stopwords list (extend as needed)
const STOPWORDS = new Set([
  "the",
  "is",
  "in",
  "and",
  "to",
  "of",
  "a",
  "that",
  "it",
  "on",
  "for",
  "as",
  "with",
  "are",
  "this",
  "was",
  "by",
  "an",
  "be",
  "or",
  "from",
  "at",
  "which",
  "but",
  "not",
  "have",
  "has",
  "had",
]);

/**
 * Normalize and tokenize words
 */
function cleanWords(text: string): string[] {
  return text
    .replace(/[^a-zA-Z0-9.\-'\s]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Local frequency-based text summarizer
 */
export function summarizeTextLocal(text: string, maxSentences = 2): string {
  if (!text.trim()) return "";

  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length <= maxSentences) return sentences.join(" ");

  // Build frequency table
  const freq: Record<string, number> = {};
  for (const word of cleanWords(text)) {
    if (!STOPWORDS.has(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  // Score sentences (normalized by length)
  const scored = sentences.map((s) => {
    const words = cleanWords(s).filter((w) => !STOPWORDS.has(w));
    const score =
      words.reduce((acc, w) => acc + (freq[w] || 0), 0) / (words.length || 1);
    return { sentence: s, score };
  });

  // Pick top N sentences in original order
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => text.indexOf(a.sentence) - text.indexOf(b.sentence))
    .map((s) => s.sentence)
    .join(" ");
}

/**
 * Hybrid summarizer: tries OpenAI, falls back to local
 */
export async function summarizeText(
  text: string,
  maxSentences = 3
): Promise<string> {
  if (!text.trim()) return "";

  // Initialize OpenAI client if key available
  const apiKey = process.env.OPENAI_API_KEY;

  console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length);

  if (apiKey) {
    const client = new OpenAI({ apiKey });

    try {
      const prompt = `Summarize the following text in about ${maxSentences} sentences:\n\n${text}`;
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4, // keeps it concise and focused
      });

      const aiSummary = response.choices?.[0]?.message?.content?.trim();
      if (aiSummary) return aiSummary;
    } catch (err) {
      console.warn(
        "⚠️ OpenAI summarization failed, falling back to local:",
        (err as Error).message
      );
    }
  } else {
    console.info("ℹ️ OPENAI_API_KEY not set, using local summarizer.");
  }

  return summarizeTextLocal(text, maxSentences);
}
