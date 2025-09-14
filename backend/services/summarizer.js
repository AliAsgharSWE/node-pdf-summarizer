const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === Your Local Summarizer ===
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

function cleanWords(text) {
  return text
    .replace(/[^a-zA-Z0-9\.\'\-\s]/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function summarizeTextLocal(text, maxSentences = 3) {
  if (!text) return "";

  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[\.\!\?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) return "";
  if (sentences.length <= maxSentences) return sentences.join(" ");

  const freq = {};
  const words = cleanWords(text);
  for (const w of words) {
    if (!STOPWORDS.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  const scores = sentences.map((s) => {
    const ws = cleanWords(s);
    let score = 0;
    for (const w of ws) score += freq[w] || 0;
    return { sentence: s, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores
    .slice(0, maxSentences)
    .sort((a, b) => text.indexOf(a.sentence) - text.indexOf(b.sentence));

  return top.map((t) => t.sentence).join(" ");
}

// === OpenAI Summarizer with Fallback ===
async function summarizeText(text, maxSentences = 3) {
  if (!text) return "";

  // 1. Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const prompt = `Summarize the following text in about ${maxSentences} sentences:\n\n${text}`;
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      return (
        response.choices?.[0]?.message?.content?.trim() ||
        summarizeTextLocal(text, maxSentences)
      );
    } catch (err) {
      console.warn(
        "⚠️ OpenAI summarization failed, falling back:",
        err.message
      );
    }
  } else {
    console.warn("⚠️ No OPENAI_API_KEY found, using local summarizer.");
  }

  // 2. Fallback to local
  return summarizeTextLocal(text, maxSentences);
}

module.exports = { summarizeText };
