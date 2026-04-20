import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const architectureData = [
  {
    icon: '◎',
    title: 'Context Classification',
    desc: 'Automatically identifies the domain of your content — Health, Finance, News, or General — using rule-based keyword frequency analysis. Context determines which specialized rule sets are applied.',
    features: [
      'Domain-specific keyword dictionaries',
      'Frequency-based scoring threshold',
      'Confidence-weighted classification',
    ],
  },
  {
    icon: '◈',
    title: 'Signal Detection',
    desc: 'Scans text across six credibility risk categories using pattern matching and linguistic heuristics. Each detected signal includes the trigger phrase, severity level, and a human-readable explanation.',
    features: [
      'Emotional language patterns',
      'Urgency & absolutism cues',
      'Source verification & formatting analysis',
    ],
  },
  {
    icon: '◆',
    title: 'Weighted Scoring',
    desc: 'Starting from a baseline of 100, the engine applies severity-weighted deductions for each detected signal and computes interaction penalties when multiple risk categories co-occur.',
    features: [
      'Severity-based weight multipliers',
      'Signal interaction penalties',
      'Normalized 0–100 output scale',
    ],
  },
  {
    icon: '🔍',
    iconClass: 'arch-card__icon--cyan',
    title: 'AI Verification',
    desc: 'Powered by Google Gemini with real-time Google Search grounding. The AI searches live news articles and authoritative sources to verify each claim, providing source citations and factual accuracy assessment.',
    features: [
      'Gemini 2.0 Flash AI analysis',
      'Real-time web search grounding',
      'Claim-by-claim verification',
    ],
  },
];

const scoreBands = [
  { range: '70 – 100', label: 'Low Risk', color: 'var(--risk-low)' },
  { range: '40 – 69', label: 'Moderate Risk', color: 'var(--risk-moderate)' },
  { range: '0 – 39', label: 'High Risk', color: 'var(--risk-high)' },
];

export default function ArchitectureMatrix() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const bandsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      const cards = gridRef.current?.querySelectorAll('.arch-card');
      if (cards?.length) {
        gsap.from(cards, {
          y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        });
      }

      if (bandsRef.current) {
        gsap.from(bandsRef.current, {
          y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: bandsRef.current,
            start: 'top 85%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="architecture section" id="architecture">
      <div className="container">
        <div ref={headerRef} className="architecture__header">
          <div className="architecture__label">System Architecture</div>
          <h2 className="architecture__title">How TrustLens Works</h2>
          <p className="architecture__subtitle">
            A transparent, four-stage pipeline that transforms raw text into
            an explainable credibility assessment — now with AI-powered real-time verification.
          </p>
        </div>

        <div ref={gridRef} className="architecture__grid">
          {architectureData.map((item, i) => (
            <div key={i} className="arch-card glass-card">
              <div className={`arch-card__icon ${item.iconClass || ''}`}>{item.icon}</div>
              <h3 className="arch-card__title">{item.title}</h3>
              <p className="arch-card__desc">{item.desc}</p>
              <ul className="arch-card__features">
                {item.features.map((feat, j) => (
                  <li key={j}>{feat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Score Bands ──────────────────────────── */}
        <div ref={bandsRef} className="score-bands" id="scoring">
          <h3 className="score-bands__title">Score Interpretation</h3>
          <div className="score-bands__grid">
            {scoreBands.map((band, i) => (
              <div key={i} className="score-band">
                <div className="score-band__range" style={{ color: band.color }}>
                  {band.range}
                </div>
                <div className="score-band__label" style={{ color: band.color }}>
                  {band.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
