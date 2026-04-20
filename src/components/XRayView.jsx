import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function XRayView({ report }) {
  const sectionRef = useRef(null);
  const verdictRef = useRef(null);
  const signalsRef = useRef(null);

  useEffect(() => {
    if (!report) return;

    const ctx = gsap.context(() => {
      // Animate the verdict
      gsap.from(verdictRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animate score counter
      const scoreEl = verdictRef.current?.querySelector('.xray__score');
      if (scoreEl) {
        gsap.from({ val: 0 }, {
          val: report.score,
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.3,
          onUpdate: function () {
            scoreEl.textContent = Math.round(this.targets()[0].val);
          },
        });
      }

      // Animate signal cards staggered
      const cards = signalsRef.current?.querySelectorAll('.signal-card');
      if (cards?.length) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.5,
        });
      }
    }, sectionRef);

    // Scroll into view
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => ctx.revert();
  }, [report]);

  if (!report || report.error) return null;

  const riskClass = report.riskLevel;
  const riskColor =
    riskClass === 'low' ? 'text-lime-600' : riskClass === 'moderate' ? 'text-orange-500' : 'text-red-500';

  return (
    <section ref={sectionRef} className="py-16" id="xray">
      <div className="section-container">
        <div ref={verdictRef} className="glass-panel p-8 text-center md:p-12">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Credibility Score</div>
          <div className={`mt-4 font-display text-7xl font-extrabold leading-none md:text-8xl ${riskColor}`}>
            {report.score}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 text-left md:grid-cols-4">
            <div className="glass-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Risk Level</span>
              <span className={`mt-2 block text-sm font-semibold ${riskColor}`}>
                {report.riskLabel}
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Confidence</span>
              <span className="mt-2 block text-sm font-semibold text-summer-blue">
                {report.confidence}
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Context</span>
              <span className="mt-2 block text-sm font-semibold text-slate-700">
                {report.context}
              </span>
            </div>

            <div className="glass-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-500">Words Analyzed</span>
              <span className="mt-2 block text-sm font-semibold text-slate-700">
                {report.wordCount}
              </span>
            </div>
          </div>
        </div>

        {report.signals.length > 0 && (
          <div className="mt-10">
            <div className="mb-6">
              <h3 className="font-display text-3xl font-bold text-slate-900">Signal Autopsy</h3>
              <p className="mt-2 text-sm text-slate-700">
                {report.signals.length} credibility signal{report.signals.length !== 1 ? 's' : ''} detected.
                Each signal below contributed to the final score deduction.
              </p>
            </div>

            <div ref={signalsRef} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {report.signals.map((signal, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-summer-blue">{signal.category}</span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                      style={{
                        color: signal.severity === 'high' ? '#ef4444' : signal.severity === 'medium' ? '#f97316' : '#65a30d',
                        backgroundColor: signal.severity === 'high' ? 'rgba(239,68,68,0.12)' : signal.severity === 'medium' ? 'rgba(249,115,22,0.12)' : 'rgba(132,204,22,0.12)',
                      }}
                    >
                      {signal.severity}
                    </span>
                  </div>

                  <div className="font-display text-lg font-semibold text-slate-900">
                    {signal.matchCount} trigger{signal.matchCount !== 1 ? 's' : ''} found
                  </div>

                  <p className="mt-2 text-sm text-slate-700">{signal.explanation}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {signal.uniqueMatches.slice(0, 6).map((match, j) => (
                      <span key={j} className="rounded-xl border border-white/60 bg-white/40 px-2.5 py-1 text-xs text-slate-700">{match}</span>
                    ))}
                    {signal.uniqueMatches.length > 6 && (
                      <span className="rounded-xl border border-white/60 bg-white/40 px-2.5 py-1 text-xs text-slate-700">+{signal.uniqueMatches.length - 6} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.signals.length === 0 && (
          <div className="glass-panel mt-10 p-10 text-center text-slate-700">
            <div className="mb-3 text-4xl">✓</div>
            <h3 className="font-display text-3xl font-bold text-slate-900">No Credibility Signals Detected</h3>
            <p>The analyzed text does not contain any recognizable credibility risk patterns.</p>
          </div>
        )}
      </div>
    </section>
  );
}
