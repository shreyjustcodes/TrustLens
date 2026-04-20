import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const flowNodes = [
  {
    title: 'Text Input',
    description: 'User submits an article, news snippet, or document.',
    color: 'from-summer-orange to-summer-yellow',
  },
  {
    title: 'Rule-Based Engine',
    description: 'Fast scan for sensationalist keywords, structural red flags, and fake-news patterns.',
    color: 'from-summer-yellow to-summer-lime',
  },
  {
    title: 'Gemini AI Analysis',
    description: 'Deep semantic processing, cross-referencing, and logic evaluation with Gemini.',
    color: 'from-summer-blue to-cyan-300',
  },
  {
    title: 'Trust Verdict',
    description: 'Final authenticity score with confidence and detailed reasoning breakdown.',
    color: 'from-summer-lime to-summer-blue',
  },
];

export default function HowItWorksFlow() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!lineRef.current || nodeRefs.current.length === 0) return;

      gsap.set(nodeRefs.current, { autoAlpha: 0, scale: 0.92, y: 26 });
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 45%',
          scrub: 0.35,
        },
      });

      timeline.to(lineRef.current, { scaleY: 1, duration: 1.2, ease: 'none' });
      nodeRefs.current.forEach((node, i) => {
        timeline.to(
          node,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.33,
            ease: 'back.out(1.7)',
          },
          0.15 + i * 0.24
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="py-16 md:py-24">
      <div className="section-container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-summer-blue">How It Works</div>
          <h2 className="font-display text-4xl font-bold text-slate-900 md:text-5xl">Dual-Layer Misinformation Detection Flow</h2>
          <p className="mt-4 text-slate-700">
            A clean, transparent pipeline combining deterministic rules and AI reasoning.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-6 top-8 h-[calc(100%-2rem)] w-1 overflow-hidden rounded-full bg-white/45 md:left-1/2 md:-translate-x-1/2">
            <div
              ref={lineRef}
              className="h-full w-full rounded-full bg-gradient-to-b from-summer-orange via-summer-yellow to-summer-blue"
            />
          </div>

          <div className="space-y-8">
            {flowNodes.map((node, index) => (
              <article
                key={node.title}
                ref={(el) => (nodeRefs.current[index] = el)}
                className={`glass-card relative ml-16 p-5 md:ml-0 md:w-[calc(50%-2rem)] md:p-6 ${
                  index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                }`}
              >
                <span className={`mb-2 inline-block rounded-full bg-gradient-to-r ${node.color} px-3 py-1 text-xs font-semibold text-slate-900`}>
                  Step {index + 1}
                </span>
                <h3 className="font-display text-2xl font-semibold text-slate-900">{node.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">{node.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
