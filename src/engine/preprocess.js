/**
 * TrustLens — Text Preprocessor
 * Tokenization, normalization, sentence splitting, word count validation.
 */

export function preprocessText(rawText) {
  const text = rawText.trim();
  const normalized = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return {
    original: text,
    normalized,
    words,
    wordCount: words.length,
    sentences,
    sentenceCount: sentences.length,
    isValid: words.length >= 20,
  };
}
