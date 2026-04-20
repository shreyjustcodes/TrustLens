import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnalyticalConsole({ onAnalyze, mode, onModeChange, isAnalyzing, aiEngine, onAiEngineChange }) {
  const [text, setText] = useState('');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const terminalRef = useRef(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isValid = wordCount >= 20;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(terminalRef.current, {
        y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAnalyze = async () => {
    if (!isValid || isAnalyzing) return;
    onAnalyze(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAnalyze();
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20" id="console">
      <div className="section-container">
        <div ref={headerRef} className="mb-8 text-center md:mb-12">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-summer-blue">Analytical Console</div>
          <h2 className="font-display text-4xl font-bold text-slate-900 md:text-5xl">Paste. Analyze. Understand.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-700">
            Enter any text content — news articles, social media posts, health claims,
            financial advice — and receive a transparent credibility assessment.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <button
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              mode === 'rules'
                ? 'border-summer-orange bg-summer-orange/20 text-slate-900'
                : 'border-white/60 bg-white/40 text-slate-600'
            }`}
            onClick={() => onModeChange('rules')}
          >
            ◈ Rule-Based Engine
          </button>
          <button
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
              mode === 'ai'
                ? 'border-summer-blue bg-summer-blue/20 text-slate-900'
                : 'border-white/60 bg-white/40 text-slate-600'
            }`}
            onClick={() => onModeChange('ai')}
          >
            ◆ AI-Powered (Gemini)
            <span className="ml-2 rounded-full bg-summer-yellow/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-800">Live</span>
          </button>
        </div>

        <div ref={terminalRef} className="glass-panel mx-auto max-w-4xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/50 bg-white/25 px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-lime-400" />
            <span className="ml-2 text-xs text-slate-600">
              {mode === 'ai'
                ? `trustlens://${aiEngine === 'kimi' ? 'kimi-nim-scanner' : 'gemini-ai-scanner'} • real-time verification`
                : 'trustlens://credibility-scanner'}
            </span>
          </div>

          {mode === 'ai' && (
            <div className="flex items-center justify-end border-b border-white/30 bg-white/10 px-4 py-2">
              <span className="mr-3 text-xs font-medium text-slate-500 uppercase tracking-wide">AI Engine:</span>
              <div className="flex rounded-lg border border-white/40 bg-white/30 p-1">
                <button
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    aiEngine === 'gemini' ? 'bg-white text-summer-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => onAiEngineChange('gemini')}
                >
                  Gemini 2.5 Flash
                </button>
                <button
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                    aiEngine === 'kimi' ? 'bg-white text-summer-orange shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => onAiEngineChange('kimi')}
                >
                  Kimi-k2.5 (NIM)
                </button>
              </div>
            </div>
          )}

          <textarea
            className="min-h-[220px] w-full resize-y bg-transparent px-5 py-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-500"
            placeholder={mode === 'ai'
              ? `Paste your text here for AI-powered credibility analysis...\n\n${aiEngine === 'kimi' ? 'Kimi AI' : 'Gemini AI'} will:\n• Analyze manipulation patterns\n• Search real-time news to verify claims\n• Cross-reference with authoritative sources\n• Provide claim-by-claim verification`
              : "Paste your text here for credibility analysis...\n\nExamples of content to analyze:\n• News articles or social media posts\n• Health or medical claims\n• Financial advice or investment tips\n• Any suspicious online content"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            id="analysis-input"
          />

          <div className="flex items-center justify-between border-t border-white/50 bg-white/25 px-5 py-3">
            <div className={`text-xs font-semibold ${isValid ? 'text-lime-700' : wordCount > 0 ? 'text-orange-700' : 'text-slate-500'}`}>
              <span>{wordCount}</span>
              <span>/</span>
              <span>20 words minimum</span>
              {isValid && <span> ✓</span>}
            </div>

            <span className="text-xs text-slate-500">
              Ctrl + Enter to analyze
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="rounded-2xl border border-white/70 bg-gradient-to-r from-summer-blue to-summer-lime px-7 py-3 font-semibold text-slate-900 shadow-glass transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            onClick={handleAnalyze}
            disabled={!isValid || isAnalyzing}
            id="analyze-button"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>◈ {mode === 'ai' ? 'Analyze with AI' : 'Analyze Text'}</>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
