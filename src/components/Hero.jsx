import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import TrustScene from './TrustScene';

export default function Hero() {
  const sectionRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(tagRef.current, { y: 30, opacity: 0, duration: 0.8 }, 0.2)
        .from(titleRef.current, { y: 60, opacity: 0, duration: 1 }, 0.4)
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, 0.8)
        .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.7 }, 1.1)
        .from(hintRef.current, { opacity: 0, duration: 0.6 }, 1.5);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToConsole = () => {
    document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative pb-20 pt-36 md:pt-40" id="hero">
      <div className="section-container relative z-10">
        <div ref={tagRef} className="mb-6 inline-flex rounded-full border border-white/70 bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-summer-blue backdrop-blur-xl">
          AI-Powered Credibility Engine
        </div>

        <h1 ref={titleRef} className="max-w-4xl font-display text-5xl font-extrabold leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
          See Through<br />
          the <span className="text-gradient">Noise.</span>
        </h1>

        <p ref={subtitleRef} className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl">
          Analyze credibility with AI-powered real-time verification.
          Gemini searches live news and web sources to validate claims —
          backed by transparent, explainable rule-based logic.
        </p>

        <div ref={ctaRef} className="mt-10 flex items-center gap-4">
          <button
            className="rounded-2xl border border-white/60 bg-gradient-to-r from-summer-orange via-summer-yellow to-summer-lime px-7 py-3 text-base font-semibold text-slate-900 shadow-glass transition hover:-translate-y-0.5"
            onClick={scrollToConsole}
          >
            Start Analysis ↓
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-[-4%] top-0 hidden h-full w-1/2 opacity-60 lg:block">
        <TrustScene />
      </div>

      <div ref={hintRef} className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span>Scroll to explore</span>
        <span className="text-base">↓</span>
      </div>
    </section>
  );
}
