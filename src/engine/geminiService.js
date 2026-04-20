import { GoogleGenAI } from '@google/genai';

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
    (typeof process !== 'undefined' ? process?.env?.NEXT_PUBLIC_GEMINI_API_KEY : undefined) ||
    (typeof process !== 'undefined' ? process?.env?.REACT_APP_GEMINI_API_KEY : undefined) ||
    import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    import.meta.env.REACT_APP_GEMINI_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY
  );
}

export async function analyzeWithGemini(text) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey.includes('your_')) throw new Error('GEMINI_API_KEY_MISSING');

  try {
    const nextPublicKey =
      typeof process !== 'undefined' ? process?.env?.NEXT_PUBLIC_GEMINI_API_KEY : undefined;
    const ai = new GoogleGenAI({ apiKey: nextPublicKey || apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${ANALYSIS_PROMPT}\n\nText to evaluate:\n${text}`,
      config: {
        temperature: 0.15,
        responseMimeType: 'application/json',
      },
    });

    const responseText = (result.text || '').trim();
    const parsed = safeParseJson(responseText);
    const normalized = normalizeResult(parsed, responseText);
    return normalized;
  } catch (error) {
    throw new Error(`GEMINI_API_ERROR: ${error.message}`);
  }
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
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
    engine: 'gemini-2.5-flash',
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
