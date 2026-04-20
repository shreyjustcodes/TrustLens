/**
 * TrustLens — Rule Definitions
 * Keyword lists, weights, and explanation templates for all contexts.
 */

export const SIGNAL_CATEGORIES = {
  EMOTIONAL: 'Emotional Language',
  URGENCY: 'Urgency Cues',
  ABSOLUTES: 'Absolute Statements',
  NO_SOURCE: 'Lack of Source',
  FORMATTING: 'Excessive Formatting',
  DOMAIN: 'Domain-Specific Risks',
};

export const RISK_LEVELS = {
  LOW: { label: 'Low Risk', min: 70, max: 100 },
  MODERATE: { label: 'Moderate Risk', min: 40, max: 69 },
  HIGH: { label: 'High Risk', min: 0, max: 39 },
};

export const CONFIDENCE_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const CONTEXT_TYPES = {
  HEALTH: 'Health',
  FINANCE: 'Finance',
  NEWS: 'News',
  GENERAL: 'General',
};

/* ── Context keyword dictionaries ──────────────────── */

export const contextKeywords = {
  [CONTEXT_TYPES.HEALTH]: [
    'cure', 'cures', 'cured', 'treatment', 'symptom', 'symptoms', 'disease',
    'doctor', 'doctors', 'medication', 'vaccine', 'cancer', 'diabetes', 'health',
    'medical', 'clinical', 'hospital', 'patient', 'diagnosis', 'therapy',
    'drug', 'supplement', 'immune', 'virus', 'infection', 'pharmaceutical',
    'dosage', 'side effect', 'wellness', 'detox', 'antioxidant', 'holistic',
    'natural remedy', 'healing', 'medicine', 'prescription', 'surgeon',
    'lemon water', 'essential oil', 'homeopathic', 'herbal',
  ],
  [CONTEXT_TYPES.FINANCE]: [
    'invest', 'investing', 'investment', 'stock', 'stocks', 'crypto',
    'bitcoin', 'market', 'profit', 'profits', 'revenue', 'trading', 'trade',
    'portfolio', 'dividend', 'interest rate', 'mortgage', 'loan', 'bank',
    'forex', 'hedge', 'mutual fund', 'returns', 'capital', 'wealth',
    'financial', 'economy', 'inflation', 'recession', 'bull market',
    'bear market', 'earnings', 'yield', 'asset', 'equity',
  ],
  [CONTEXT_TYPES.NEWS]: [
    'breaking', 'report', 'reported', 'source', 'sources', 'according to',
    'officials', 'government', 'president', 'election', 'policy', 'legislation',
    'congress', 'senate', 'court', 'investigation', 'scandal', 'journalist',
    'media', 'press', 'statement', 'announcement', 'breaking news',
    'correspondent', 'editorial', 'headline',
  ],
};

/* ── Signal detection rules ────────────────────────── */

export const signalRules = {
  [SIGNAL_CATEGORIES.EMOTIONAL]: {
    weight: 8,
    patterns: [
      'shocking', 'unbelievable', 'outrageous', 'terrifying', 'devastating',
      'incredible', 'mind-blowing', 'jaw-dropping', 'horrifying', 'appalling',
      'disgusting', 'heartbreaking', 'alarming', 'nightmare', 'catastrophe',
      'disaster', 'crisis', 'tragedy', 'explosive', 'bombshell',
      'earth-shattering', 'life-changing', 'miraculous', 'revolutionary',
      'game-changer', 'insane', 'crazy', 'nuts', 'amazing', 'scary',
      'frightening', 'stunning', 'astonishing', 'sensational',
    ],
    // Regex patterns for phrases that need flexible matching
    regexPatterns: [
      { pattern: /you won'?t believe/gi, label: "you won't believe" },
      { pattern: /will blow your mind/gi, label: 'will blow your mind' },
      { pattern: /will shock you/gi, label: 'will shock you' },
      { pattern: /don'?t want you to (?:know|find out|see|hear)/gi, label: "don't want you to know" },
      { pattern: /what (?:they|the government|doctors|big pharma) (?:don'?t|do not) want/gi, label: 'what they don\'t want' },
      { pattern: /before (?:it'?s|it gets?) (?:too late|deleted|removed|taken down|censored)/gi, label: 'before it gets deleted' },
      { pattern: /share (?:this |it )?(?:with )?(?:everyone|everybody|your friends|the world)/gi, label: 'share with everyone' },
      { pattern: /(?:everybody|everyone) (?:needs? to|should|must) (?:know|see|hear|read)/gi, label: 'everyone needs to know' },
    ],
    explanation: 'Emotionally charged language can manipulate reader perception and bypass critical thinking. Credible sources typically use measured, factual language.',
  },
  [SIGNAL_CATEGORIES.URGENCY]: {
    weight: 10,
    patterns: [
      'act now', 'hurry', 'urgent', 'last chance', 'right now',
      'immediately', 'must read', 'must watch', 'expires soon',
      'wake up', 'open your eyes',
    ],
    regexPatterns: [
      { pattern: /share (?:this )?(?:immediately|now|before)/gi, label: 'share immediately' },
      { pattern: /before it'?s too late/gi, label: "before it's too late" },
      { pattern: /limited time/gi, label: 'limited time' },
      { pattern: /don'?t wait/gi, label: "don't wait" },
      { pattern: /breaking news/gi, label: 'breaking news' },
      { pattern: /time is running out/gi, label: 'time is running out' },
      { pattern: /spread the word/gi, label: 'spread the word' },
      { pattern: /this changes everything/gi, label: 'this changes everything' },
      { pattern: /do it (?:now|today)/gi, label: 'do it today' },
      { pattern: /won'?t be (?:available|around|here) (?:for )?(?:long|forever|much longer)/gi, label: "won't be available forever" },
      { pattern: /before (?:it |they )?(?:gets? |is |are )?(?:deleted|removed|taken down|banned|censored)/gi, label: 'before it gets deleted' },
    ],
    explanation: 'Urgency cues pressure readers into action without allowing time for critical evaluation. Legitimate information rarely requires immediate, unreflective action.',
  },
  [SIGNAL_CATEGORIES.ABSOLUTES]: {
    weight: 6,
    patterns: [
      'always', 'never', 'guaranteed', 'proven', 'proves', 'definitely',
      'absolutely', 'completely', 'totally', 'every single', 'without exception',
      'undeniable', 'irrefutable', 'certainly', 'nothing else',
      'the only', 'the best', 'the worst',
    ],
    regexPatterns: [
      { pattern: /100\s*%/gi, label: '100%' },
      { pattern: /zero doubt/gi, label: 'zero doubt' },
      { pattern: /no one (?:can|will|could|should)/gi, label: 'no one can' },
      { pattern: /every(?:one|body) knows/gi, label: 'everyone knows' },
      { pattern: /every (?:\w+ )?(?:doctor|scientist|expert|person|one|body) knows/gi, label: 'every doctor knows' },
      { pattern: /it'?s a fact/gi, label: "it's a fact" },
      { pattern: /(?:works?|effective) (?:\d+%|guaranteed)/gi, label: 'works guaranteed' },
    ],
    explanation: 'Absolute statements leave no room for nuance. Credible information typically acknowledges uncertainty, exceptions, and complexity.',
  },
  [SIGNAL_CATEGORIES.NO_SOURCE]: {
    weight: 12,
    patterns: [
      'they say', 'it is known', 'many believe', 'insiders reveal',
      'leaked documents', 'anonymous sources',
    ],
    regexPatterns: [
      { pattern: /experts?\s+(?:say|claim|confirm|agree|believe)/gi, label: 'experts say' },
      { pattern: /stud(?:y|ies)\s+(?:show|prove|confirm|reveal|suggest|find|found)/gi, label: 'studies show' },
      { pattern: /research\s+(?:proves?|shows?|confirms?|suggests?|indicates?)/gi, label: 'research proves' },
      { pattern: /scientists?\s+(?:say|confirm|prove|have confirmed|discovered|agree)/gi, label: 'scientists confirm' },
      { pattern: /doctors?\s+(?:say|confirm|agree|recommend|know|admit)/gi, label: 'doctors say' },
      { pattern: /people are saying/gi, label: 'people are saying' },
      { pattern: /sources?\s+(?:say|confirm|reveal|indicate)/gi, label: 'sources say' },
      { pattern: /according to (?:experts?|sources?|reports?|studies)/gi, label: 'according to experts' },
      { pattern: /a new study/gi, label: 'a new study' },
      { pattern: /some people (?:say|think|believe)/gi, label: 'some people say' },
      { pattern: /(?:it )?has been reported/gi, label: 'it has been reported' },
    ],
    explanation: 'Vague attribution without specific, verifiable sources is a major credibility red flag. Trustworthy content cites named experts, published studies, or official records.',
  },
  [SIGNAL_CATEGORIES.FORMATTING]: {
    weight: 5,
    regexPatterns: [
      { pattern: /[A-Z]{4,}/g, label: 'ALL CAPS text' },
      { pattern: /!{2,}/g, label: 'Multiple exclamation marks' },
      { pattern: /\?{2,}/g, label: 'Multiple question marks' },
      { pattern: /\.{4,}/g, label: 'Excessive ellipsis' },
      { pattern: /[!?]{3,}/g, label: 'Mixed punctuation spam' },
      { pattern: /🚨|⚠️|❗|‼️|🔥|💥|⛔|🛑/g, label: 'Alert emojis' },
    ],
    explanation: 'Excessive formatting (ALL CAPS, repeated punctuation) is a hallmark of sensationalist or low-credibility content. Professional writing uses standard formatting conventions.',
  },
};

/* ── Domain-specific extra rules ───────────────────── */

export const domainRules = {
  [CONTEXT_TYPES.HEALTH]: {
    weight: 15,
    patterns: [
      'big pharma', 'secret remedy', 'detoxify',
    ],
    regexPatterns: [
      { pattern: /miracle\s+cure/gi, label: 'miracle cure' },
      { pattern: /natural\s+cure/gi, label: 'natural cure' },
      { pattern: /this\s+one\s+trick/gi, label: 'this one trick' },
      { pattern: /doctors?\s+(?:hate|don'?t want)/gi, label: 'doctors hate' },
      { pattern: /fda\s+approved/gi, label: 'fda approved' },
      { pattern: /clinically\s+proven/gi, label: 'clinically proven' },
      { pattern: /no\s+side\s+effects?/gi, label: 'no side effects' },
      { pattern: /boost\s+(?:your\s+)?immun/gi, label: 'boost your immune' },
      { pattern: /cures?\s+(?:cancer|diabetes|covid|disease|illness|all)/gi, label: 'cure cancer' },
      { pattern: /drinking\s+\w+\s+(?:water|juice|tea)\s+(?:cures?|heals?|treat|prevents?)/gi, label: 'drinking X cures' },
      { pattern: /reverse?\s+(?:aging|disease|cancer|diabetes)/gi, label: 'reverse aging' },
      { pattern: /(?:don'?t|do not) want you to (?:know|find out|see|hear)/gi, label: "they don't want you to know" },
      { pattern: /(?:every|all) (?:doctor|scientist|expert)s?\s+knows?/gi, label: 'every doctor knows' },
    ],
    explanation: 'Health claims without references to peer-reviewed studies, clinical trials, or recognized health authorities present significant credibility risks. Unsupported medical advice can be dangerous.',
  },
  [CONTEXT_TYPES.FINANCE]: {
    weight: 14,
    patterns: [
      'financial freedom', 'passive income',
    ],
    regexPatterns: [
      { pattern: /get\s+rich\s+quick/gi, label: 'get rich quick' },
      { pattern: /guaranteed\s+returns?/gi, label: 'guaranteed returns' },
      { pattern: /risk[\s-]*free\s+invest/gi, label: 'risk-free investment' },
      { pattern: /double\s+your\s+money/gi, label: 'double your money' },
      { pattern: /secret\s+(?:trading|investment)\s+strate/gi, label: 'secret trading strategy' },
      { pattern: /insider\s+(?:information|tips?|knowledge)/gi, label: 'insider information' },
      { pattern: /millionaire\s+overnight/gi, label: 'millionaire overnight' },
      { pattern: /this\s+stock\s+will\s+(?:explode|skyrocket|moon)/gi, label: 'this stock will explode' },
      { pattern: /buy\s+before/gi, label: 'buy before' },
    ],
    explanation: 'Financial claims promising extraordinary returns with no risk are classic indicators of misleading or fraudulent content. Legitimate financial advice acknowledges risk and uncertainty.',
  },
  [CONTEXT_TYPES.NEWS]: {
    weight: 10,
    patterns: [
      'censored', 'suppressed', 'deep state', 'false flag',
      'controlled opposition',
    ],
    regexPatterns: [
      { pattern: /mainstream\s+media\s+won'?t\s+tell/gi, label: "mainstream media won't tell you" },
      { pattern: /cover[\s-]*up/gi, label: 'cover-up' },
      { pattern: /conspiracy/gi, label: 'conspiracy' },
      { pattern: /the\s+truth\s+about/gi, label: 'the truth about' },
      { pattern: /what\s+they\s+(?:hide|are hiding|don'?t tell)/gi, label: 'what they hide' },
    ],
    explanation: 'Conspiratorial framing and claims of media suppression, without verifiable evidence, undermine credibility. Reliable news sources provide transparent sourcing and editorial accountability.',
  },
};

/* ── Interaction penalty rules ─────────────────────── */

export const interactionPenalties = [
  {
    signals: [SIGNAL_CATEGORIES.URGENCY, SIGNAL_CATEGORIES.NO_SOURCE],
    penalty: 8,
    reason: 'Urgency combined with vague sourcing is a strong manipulation pattern.',
  },
  {
    signals: [SIGNAL_CATEGORIES.EMOTIONAL, SIGNAL_CATEGORIES.ABSOLUTES],
    penalty: 6,
    reason: 'Emotional language reinforced by absolute claims amplifies manipulation risk.',
  },
  {
    signals: [SIGNAL_CATEGORIES.URGENCY, SIGNAL_CATEGORIES.EMOTIONAL, SIGNAL_CATEGORIES.NO_SOURCE],
    penalty: 10,
    reason: 'Triple combination of urgency, emotion, and no sources is a critical credibility failure.',
  },
  {
    signals: [SIGNAL_CATEGORIES.DOMAIN, SIGNAL_CATEGORIES.NO_SOURCE],
    penalty: 8,
    reason: 'Domain-specific risk claims without verifiable sources are particularly dangerous.',
  },
  {
    signals: [SIGNAL_CATEGORIES.DOMAIN, SIGNAL_CATEGORIES.ABSOLUTES],
    penalty: 6,
    reason: 'Domain-specific claims using absolute language suggest unreliable content.',
  },
];
