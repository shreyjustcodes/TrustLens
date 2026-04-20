import OpenAI from 'openai';

const ANALYSIS_PROMPT = `You are TrustLens AI and you evaluate misinformation risk in text.

Return ONLY a strict JSON object (no markdown, no extra text):
{
  "score": number, // integer 0-100
  "verdict": "Real" | "Fake",
  "reasoning": "brief but clear explanation"
}

Scoring rule:
- 80-100 means highly credible and likely real
- 50-79 means mixed or uncertain credibility
- 0-49 means likely fake or misleading

Choose verdict as "Real" if score >= 60, otherwise "Fake".`;

function getApiKey() {
  return (
    (typeof process !== 'undefined' ? process?.env?.NEXT_PUBLIC_NIM_API_KEY : undefined) ||
    import.meta.env.NEXT_PUBLIC_NIM_API_KEY ||
    import.meta.env.VITE_NIM_API_KEY
  );
}

export async function analyzeWithKimi(text) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.includes('your_')) throw new Error('NIM_API_KEY_MISSING');

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      model: 'moonshotai/kimi-k2.5',
      messages: [
        {
          role: 'system',
          content: ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: `Text to evaluate:\n${text}`,
        },
      ],
      temperature: 0.15,
      max_tokens: 512,
      stream: false,
    });

    const responseText = response.choices?.[0]?.message?.content || '';
    const parsed = safeParseJson(responseText);
    const normalized = normalizeResult(parsed, responseText);
    return normalized;
  } catch (error) {
    throw new Error(`KIMI_API_ERROR: ${error?.message || error}`);
  }
}

function safeParseJson(raw) {
  try {
    let cleanText = raw.trim();
    if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
    if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
    if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
    return JSON.parse(cleanText.trim());
  } catch {
    return {
      score: 55,
      verdict: 'Fake',
      reasoning: raw,
    };
  }
}

function normalizeResult(data, fallbackReasoning) {
  const score = Math.max(0, Math.min(100, Math.round(data.score ?? 55)));
  const verdict = data.verdict === 'Real' || data.verdict === 'Fake' ? data.verdict : score >= 60 ? 'Real' : 'Fake';
  const riskLevel = getRiskLevel(score);

  return {
    verdict,
    confidenceScore: score,
    reasoning: data.reasoning || fallbackReasoning || '',
    score,
    riskLevel,
    riskLabel: getRiskLabel(riskLevel),
    summary: data.reasoning || fallbackReasoning || '',
    signals: [],
    claims: [],
    sources: [],
    grounded: false,
    engine: 'kimi-k2.5',
    timestamp: new Date().toISOString(),
  };
}

function getRiskLevel(score) {
  if (score >= 80) return 'low';
  if (score >= 50) return 'moderate';
  return 'high';
}

function getRiskLabel(level) {
  const labels = { low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk' };
  return labels[level] || 'Unknown';
}
