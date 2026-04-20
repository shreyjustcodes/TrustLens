/**
 * TrustLens — Context Classifier
 * Rule-based classification into Health / Finance / News / General.
 */

import { contextKeywords, CONTEXT_TYPES } from './rules.js';

export function classifyContext(preprocessed) {
  const text = preprocessed.normalized;
  const scores = {};

  for (const [context, keywords] of Object.entries(contextKeywords)) {
    scores[context] = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        scores[context] += matches.length;
      }
    }
  }

  let bestContext = CONTEXT_TYPES.GENERAL;
  let bestScore = 0;

  for (const [context, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestContext = context;
    }
  }

  // Only classify as specific context if there are at least 2 keyword matches
  if (bestScore < 2) {
    bestContext = CONTEXT_TYPES.GENERAL;
  }

  return {
    context: bestContext,
    contextScores: scores,
    confidence: bestScore >= 5 ? 'high' : bestScore >= 2 ? 'medium' : 'low',
  };
}
