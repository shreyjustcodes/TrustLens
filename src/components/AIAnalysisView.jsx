import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

const SCANNING_STEPS = [
  'Analyzing semantics...',
  'Cross-referencing facts...',
  'Evaluating linguistic patterns...',
  'Running AI inference...',
  'Computing trust score...',
];

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreTheme(score) {
  if (score >= 80) {
    return {
      colorText: 'text-lime-600',
      gradientId: 'url(#scoreGradientLime)',
      accentClass: 'from-lime-400 via-lime-300 to-emerald-400',
      verdictClass: 'text-lime-700',
    };
  }

  if (score >= 50) {
    return {
      colorText: 'text-amber-500',
      gradientId: 'url(#scoreGradientWarm)',
      accentClass: 'from-yellow-300 via-amber-300 to-orange-400',
      verdictClass: 'text-amber-600',
    };
  }

  return {
    colorText: 'text-orange-600',
    gradientId: 'url(#scoreGradientRisk)',
    accentClass: 'from-red-400 via-orange-500 to-amber-400',
    verdictClass: 'text-orange-700',
  };
}

export default function AIAnalysisView({ result, loading, error }) {
  const sectionRef = useRef(null);
  const scoreRef = useRef(null);
  const ringRef = useRef(null);
  const reasoningRef = useRef(null);
  const loadingCardRef = useRef(null);
  const loadingStepRef = useRef(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const scoreTheme = useMemo(() => getScoreTheme(result?.score ?? 0), [result?.score]);

  useEffect(() => {
    if (!result || loading) return;

    const ctx = gsap.context(() => {
      const scoreProxy = { value: 0 };
      if (ringRef.current) {
        ringRef.current.style.strokeDasharray = String(CIRCUMFERENCE);
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);
      }

      gsap.from(scoreRef.current, { y: 40, opacity: 0, duration: 0.75, ease: 'power3.out' });
      gsap.to(scoreProxy, {
        value: result.score,
        duration: 1.7,
        ease: 'power3.out',
        roundProps: 'value',
        delay: 0.2,
        onUpdate: () => {
          const current = scoreProxy.value;
          setAnimatedScore(current);
          if (ringRef.current) {
            const progress = Math.max(0, Math.min(1, current / 100));
            ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
          }
        },
      });

      gsap.from(reasoningRef.current, {
        y: 28,
        opacity: 0,
        duration: 0.6,
        delay: 0.95,
        stagger: 0.1,
        ease: 'power2.out',
      });

      if (sectionRef.current) {
        gsap.from(sectionRef.current.querySelectorAll('.stagger-in'), {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          delay: 1.05,
          ease: 'power2.out',
        });
      }
    }, sectionRef);

    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => ctx.revert();
  }, [result, loading]);

  useEffect(() => {
    if (!loading) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        loadingCardRef.current,
        { scale: 0.98, autoAlpha: 0.7 },
        { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }
      );
      gsap.to(loadingCardRef.current, {
        y: -3,
        repeat: -1,
        yoyo: true,
        duration: 1.1,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    const interval = window.setInterval(() => {
      setScanStepIndex((prev) => (prev + 1) % SCANNING_STEPS.length);
      if (loadingStepRef.current) {
        gsap.fromTo(
          loadingStepRef.current,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }
        );
      }
    }, 650);

    return () => {
      window.clearInterval(interval);
      ctx.revert();
    };
  }, [loading]);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-16" id="ai-results">
        <div className="section-container">
          <div ref={loadingCardRef} className="glass-panel relative mx-auto max-w-3xl overflow-hidden p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-summer-blue/20 via-summer-yellow/20 to-summer-orange/20" />
            <div className="relative">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700">Live AI Pipeline</div>
              <div className="font-display text-3xl font-semibold text-slate-900">Scanning in progress...</div>
              <div ref={loadingStepRef} className="mt-3 text-base font-medium text-summer-blue">
                {SCANNING_STEPS[scanStepIndex]}
              </div>
            </div>
            <div className="relative mx-auto mt-7 max-w-lg space-y-2">
              <div className="h-2 w-full rounded-full bg-white/45" />
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-summer-blue via-summer-yellow to-summer-lime opacity-90" />
              <div className="h-2 w-5/6 rounded-full bg-white/45" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    const isKeyMissing = error.includes('KEY_MISSING');
    return (
      <section ref={sectionRef} className="py-16" id="ai-results">
        <div className="section-container">
          <div className="glass-panel mx-auto max-w-3xl p-10 text-center">
            <div className="mb-3 text-5xl">{isKeyMissing ? '🔑' : '⚠️'}</div>
            <div className="font-display text-3xl font-semibold text-orange-600">
              {isKeyMissing ? 'API Key Required' : 'Analysis Failed'}
            </div>
            <div className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-700">
              {isKeyMissing ? (
                <>
                  Add your Gemini API key to a <code>.env</code> file in the project root:
                  <br /><br />
                  <code>VITE_GEMINI_API_KEY=your_key_here</code>
                  <br />
                  <code>REACT_APP_GEMINI_API_KEY=your_key_here</code>
                  <br />
                  <code>NEXT_PUBLIC_GEMINI_API_KEY=your_key_here</code>
                  <br /><br />
                  Get a free API key from{' '}
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                    Google AI Studio
                  </a>
                </>
              ) : (
                'The AI analysis encountered an error. The rule-based engine is still available as a fallback.'
              )}
            </div>
            {!isKeyMissing && (
              <div className="mt-4 inline-block rounded-xl border border-white/70 bg-white/35 px-3 py-2 text-xs text-slate-500">{error}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!result) return null;

  return (
    <section ref={sectionRef} className="py-16" id="ai-results">
      <div className="section-container">
        <div className="mb-8 text-center">
          <div className="inline-flex rounded-full border border-white/70 bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-summer-blue">
            ◈ AI-Powered Analysis
          </div>
        </div>

        <div ref={scoreRef} className="glass-panel mx-auto max-w-4xl p-8 md:p-10">
          <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Trust Score</div>

          <div className="mt-6 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
            <div className="relative h-[210px] w-[210px]">
              <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="scoreGradientLime" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bef264" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                  <linearGradient id="scoreGradientWarm" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#fb923c" />
                  </linearGradient>
                  <linearGradient id="scoreGradientRisk" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <circle cx="110" cy="110" r={RADIUS} stroke="rgba(255,255,255,0.4)" strokeWidth="16" fill="transparent" />
                <circle
                  ref={ringRef}
                  cx="110"
                  cy="110"
                  r={RADIUS}
                  stroke={scoreTheme.gradientId}
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className={`font-display text-6xl font-extrabold leading-none ${scoreTheme.colorText}`}>
                  {animatedScore}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">out of 100</div>
              </div>
            </div>

            <div className="max-w-md text-center lg:text-left">
              <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">AI Verdict</div>
              <div className={`mt-2 font-display text-4xl font-bold ${scoreTheme.verdictClass}`}>
                {result.verdict}
              </div>
              <div className="mt-3 rounded-2xl border border-white/65 bg-white/35 px-4 py-3 text-sm text-slate-700">
                Confidence: <span className="font-semibold">{result.confidenceScore}%</span>
              </div>
              <div className={`mt-4 inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 ${scoreTheme.accentClass}`}>
                {result.riskLabel}
              </div>
            </div>
          </div>
        </div>

        <div ref={reasoningRef} className="mt-6 space-y-4">
          <div className="glass-card stagger-in p-6">
            <h3 className="font-display text-2xl font-semibold text-slate-900">Reasoning</h3>
            <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/60 bg-white/30 p-4 text-sm leading-7 text-slate-700">
              {result.reasoning || result.summary}
            </div>
          </div>
          {result.summary && (
            <div className="glass-card stagger-in p-5 text-sm text-slate-700">
              <span className="font-semibold text-slate-800">Summary:</span> {result.summary}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
