/**
 * TrustLens — Signal Detector
 * Detects credibility risk signals across 6 categories.
 */

import { signalRules, domainRules, SIGNAL_CATEGORIES } from './rules.js';

/**
 * Match simple keyword patterns using word-boundary regex.
 */
function matchKeywordPatterns(text, patterns) {
  const matches = [];
  for (const pattern of patterns) {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const found = text.match(regex);
    if (found) {
      matches.push(...found.map(m => m.toLowerCase()));
    }
  }
  return matches;
}

/**
 * Match regex-based patterns (for flexible multi-word matching).
 */
function matchRegexPatterns(text, regexPatterns) {
  const matches = [];
  if (!regexPatterns) return matches;

  for (const { pattern, label } of regexPatterns) {
    // Reset regex lastIndex for global patterns
    const regex = new RegExp(pattern.source, pattern.flags);
    const found = text.match(regex);
    if (found) {
      matches.push(...found.map(() => label));
    }
  }
  return matches;
}

/**
 * Compute severity from total match count.
 */
function computeSeverity(matchCount) {
  if (matchCount >= 4) return 'high';
  if (matchCount >= 2) return 'medium';
  return 'low';
}

export function detectSignals(preprocessed, context) {
  const signals = [];
  const text = preprocessed.normalized;
  const original = preprocessed.original;

  // ── Keyword + Regex signals (all except Formatting) ──
  for (const [category, rule] of Object.entries(signalRules)) {
    if (category === SIGNAL_CATEGORIES.FORMATTING) continue;

    const keywordMatches = rule.patterns ? matchKeywordPatterns(text, rule.patterns) : [];
    const regexMatches = rule.regexPatterns ? matchRegexPatterns(text, rule.regexPatterns) : [];
    // Also run regex patterns on original text (for case-sensitive matches)
    const regexOriginalMatches = rule.regexPatterns ? matchRegexPatterns(original, rule.regexPatterns) : [];

    // Combine & deduplicate
    const allMatches = [...keywordMatches, ...regexMatches];
    // Add original-text matches that aren't already found
    for (const m of regexOriginalMatches) {
      if (!allMatches.includes(m)) {
        allMatches.push(m);
      }
    }

    if (allMatches.length > 0) {
      const uniqueMatches = [...new Set(allMatches)];
      signals.push({
        category,
        weight: rule.weight,
        matchCount: allMatches.length,
        uniqueMatches,
        explanation: rule.explanation,
        severity: computeSeverity(allMatches.length),
      });
    }
  }

  // ── Formatting signals ──────────────────────────────
  const formattingRule = signalRules[SIGNAL_CATEGORIES.FORMATTING];
  const formatMatches = matchRegexPatterns(original, formattingRule.regexPatterns);

  if (formatMatches.length > 0) {
    const uniqueMatches = [...new Set(formatMatches)];
    signals.push({
      category: SIGNAL_CATEGORIES.FORMATTING,
      weight: formattingRule.weight,
      matchCount: formatMatches.length,
      uniqueMatches,
      explanation: formattingRule.explanation,
      severity: computeSeverity(formatMatches.length),
    });
  }

  // ── URL/source check ────────────────────────────────
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const hasUrls = urlPattern.test(original);
  const hasNoVerifiableSource = !hasUrls && !text.includes('doi:') && !text.includes('isbn');

  if (hasNoVerifiableSource) {
    const existingSourceSignal = signals.find(s => s.category === SIGNAL_CATEGORIES.NO_SOURCE);
    if (existingSourceSignal) {
      existingSourceSignal.weight += 3;
      if (!existingSourceSignal.uniqueMatches.includes('No URLs or references found')) {
        existingSourceSignal.uniqueMatches.push('No URLs or references found');
      }
    } else {
      signals.push({
        category: SIGNAL_CATEGORIES.NO_SOURCE,
        weight: signalRules[SIGNAL_CATEGORIES.NO_SOURCE].weight,
        matchCount: 1,
        uniqueMatches: ['No URLs or verifiable references found'],
        explanation: signalRules[SIGNAL_CATEGORIES.NO_SOURCE].explanation,
        severity: 'medium',
      });
    }
  }

  // ── Domain-specific signals ─────────────────────────
  if (domainRules[context]) {
    const rule = domainRules[context];

    const keywordMatches = rule.patterns ? matchKeywordPatterns(text, rule.patterns) : [];
    const regexMatches = rule.regexPatterns ? matchRegexPatterns(text, rule.regexPatterns) : [];
    const regexOriginalMatches = rule.regexPatterns ? matchRegexPatterns(original, rule.regexPatterns) : [];

    const allMatches = [...keywordMatches, ...regexMatches];
    for (const m of regexOriginalMatches) {
      if (!allMatches.includes(m)) {
        allMatches.push(m);
      }
    }

    if (allMatches.length > 0) {
      const uniqueMatches = [...new Set(allMatches)];
      signals.push({
        category: SIGNAL_CATEGORIES.DOMAIN,
        weight: rule.weight,
        matchCount: allMatches.length,
        uniqueMatches,
        explanation: rule.explanation,
        severity: computeSeverity(allMatches.length),
        domainContext: context,
      });
    }
  }

  return signals;
}
