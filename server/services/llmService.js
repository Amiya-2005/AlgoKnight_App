// Thin, swappable wrapper around whichever LLM provider is configured.
// Everything else in the app talks to `generateAnalysis(payload)` only -


const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are a competitive programming coach analyzing a student's practice data across Codeforces, CodeChef and LeetCode.
You will be given PRE-COMPUTED statistics only - never recompute, re-derive or guess any number yourself; your job is purely diagnosis, explanation and coaching using the numbers you're handed.
Respond with ONLY a single JSON object (no markdown fences, no commentary) that exactly matches this shape:
{
  "summary": "2-3 sentence overview of where the coder stands",
  "strengths": ["string", "..."],
  "weakTopics": [
    {
      "topic": "Graph Traversal",
      "reason": "Human-readable diagnosis of this weakness, referencing the stats",
      "tags": [
        { "tag": "graphs", "weight": 8 },
        { "tag": "dfs and similar", "weight": 6 }
      ]
    }
  ],
  "ratingAnalysis": {
    "codeforces": { "trend": "plateauing", "note": "..." },
    "codechef": { "trend": "improving", "note": "..." },
    "leetcode": { "trend": "improving", "note": "..." }
  },
  "consistencyAnalysis": {
    "note": "...",
    "recommendation": "..."
  },
  "keyPoints": ["actionable string", "..."]
}
Rules:
- Each "topic" is a broader, human-readable label for grouping related tags together (e.g. "Graph Traversal", "Number Theory") so the coder can grasp their weakness at a glance - you choose this wording freely, it does not need to match any tag string.
- Every entry inside a topic's "tags" array MUST be copied verbatim from that platform's "availableTags" list in the input - never invent, translate, merge, or reword a tag. These are the exact tags used to build the coder's practice sheet, so they must letter-for-letter match the data you were given.
- A topic can group multiple related tags (each with its own weight) or just one - pick whatever grouping best conveys the underlying weakness. Every tag you reference must belong to exactly one topic.
- "weight" on each tag must be an integer from 1 (minor) to 10 (critical) reflecting how strongly the coder should prioritize practicing that specific tag.
- If none of the available tags represent a real weakness, return fewer (or zero) weakTopics rather than inventing one.
- List at most 8 weakTopics total, ordered by each topic's highest tag weight descending.
- Reuse the platform's own pre-computed trend label for ratingAnalysis unless the numbers clearly disagree with it.
- Keep "reason"/"note"/"recommendation" fields under 200 characters each.
- Ground every claim in the provided stats; never invent numbers. Insight over restated arithmetic - e.g. "rating plateaued despite steady volume -> likely stuck on the same problem archetypes" is the kind of diagnosis worth giving.`;

function buildUserPrompt(payload) {
    return `Here is the coder's pre-aggregated practice data as JSON:\n${JSON.stringify(payload)}\n\nAnalyze this data and return ONLY the JSON object described in the system instructions.`;
}

async function callGemini(payload) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const body = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserPrompt(payload) }] }],
        generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
            maxOutputTokens: 20000,
        }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned an empty response");
    console.log("Response : ", text);
    return JSON.parse(text);
}

// Register additional providers here behind the same (payload) -> parsed JSON interface.
const PROVIDERS = {
    gemini: callGemini,
};

export async function generateAnalysis(payload) {
    const providerName = process.env.LLM_PROVIDER || "gemini";
    const provider = PROVIDERS[providerName];

    if (!provider) {
        throw new Error(`Unknown LLM_PROVIDER: ${providerName}`);
    }

    return provider(payload);
}

export default { generateAnalysis };
