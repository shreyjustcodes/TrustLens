/**
 * TrustLens — Scoring Engine
 * Weighted deductions, interaction penalties, normalization.
 * Outputs score (0-100), risk level, and confidence level.
 */

import { interactionPenalties, RISK_LEVELS, CONFIDENCE_LEVELS } from './rules.js';

export function calculateScore(signals, preprocessed) {
  let score = 100;
  const deductions = [];

  // ── Per-signal deductions ───────────────────────────
  for (const signal of signals) {
    const severityMultiplier =
      signal.severity === 'high' ? 1.5 :
      signal.severity === 'medium' ? 1.0 : 0.7;

    const matchMultiplier = Math.min(signal.matchCount, 5); // cap at 5
    const deduction = signal.weight * severityMultiplier * (1 + (matchMultiplier - 1) * 0.3);

    deductions.push({
      category: signal.category,
      amount: Math.round(deduction * 10) / 10,
      reason: `${signal.matchCount} match(es) at ${signal.severity} severity`,
    });

    score -= deduction;
  }

  // ── Interaction penalties ───────────────────────────
  const detectedCategories = new Set(signals.map(s => s.category));

  for (const rule of interactionPenalties) {
    const allPresent = rule.signals.every(s => detectedCategories.has(s));
    if (allPresent) {
      deductions.push({
        category: 'Interaction Penalty',
        amount: rule.penalty,
        reason: rule.reason,
      });
      score -= rule.penalty;
    }
  }

  // ── Normalize ───────────────────────────────────────
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── Risk level ──────────────────────────────────────
  let riskLevel;
  if (score >= RISK_LEVELS.LOW.min) {
    riskLevel = 'low';
  } else if (score >= RISK_LEVELS.MODERATE.min) {
    riskLevel = 'moderate';
  } else {
    riskLevel = 'high';
  }

  // ── Confidence estimation ───────────────────────────
  const signalCount = signals.length;
  const wordCount = preprocessed.wordCount;
  const signalDensity = signalCount / Math.max(wordCount, 1) * 100;

  let confidence;
  if (signalCount >= 3 && wordCount >= 50) {
    confidence = CONFIDENCE_LEVELS.HIGH;
  } else if (signalCount >= 2 || wordCount >= 30) {
    confidence = CONFIDENCE_LEVELS.MEDIUM;
  } else {
    confidence = CONFIDENCE_LEVELS.LOW;
  }

  return {
    score,
    riskLevel,
    riskLabel: riskLevel === 'low' ? RISK_LEVELS.LOW.label :
               riskLevel === 'moderate' ? RISK_LEVELS.MODERATE.label :
               RISK_LEVELS.HIGH.label,
    confidence,
    deductions,
    totalDeductions: deductions.reduce((sum, d) => sum + d.amount, 0),
  };
}
