/**
 * TrustLens — Main Analyzer
 * Orchestrates: preprocess → classify → detect → score → report
 */

import { preprocessText } from './preprocess.js';
import { classifyContext } from './contextClassifier.js';
import { detectSignals } from './signalDetector.js';
import { calculateScore } from './scorer.js';

export function analyzeText(rawText) {
  // Step 1: Preprocess
  const preprocessed = preprocessText(rawText);

  if (!preprocessed.isValid) {
    return {
      error: true,
      message: `Text must contain at least 20 words. Current count: ${preprocessed.wordCount}`,
      wordCount: preprocessed.wordCount,
    };
  }

  // Step 2: Classify context
  const contextResult = classifyContext(preprocessed);

  // Step 3: Detect signals
  const signals = detectSignals(preprocessed, contextResult.context);

  // Step 4: Calculate score
  const scoreResult = calculateScore(signals, preprocessed);

  // Step 5: Build report
  return {
    error: false,
    score: scoreResult.score,
    riskLevel: scoreResult.riskLevel,
    riskLabel: scoreResult.riskLabel,
    confidence: scoreResult.confidence,
    context: contextResult.context,
    contextConfidence: contextResult.confidence,
    signals,
    deductions: scoreResult.deductions,
    totalDeductions: scoreResult.totalDeductions,
    wordCount: preprocessed.wordCount,
    sentenceCount: preprocessed.sentenceCount,
    timestamp: new Date().toISOString(),
  };
}
