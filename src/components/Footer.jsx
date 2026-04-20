export default function Footer() {
  return (
    <footer className="py-14">
      <div className="section-container">
        <div className="glass-card p-8 text-center">
          <div className="font-display text-2xl font-bold text-slate-900">◈ TrustLens</div>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          An AI-powered credibility assessment system combining explainable rule-based
          analysis with Gemini AI and real-time web verification. Prioritizing transparency,
          contextual awareness, and user understanding.
          </p>
          <ul className="mt-5 flex list-none flex-wrap justify-center gap-6 text-sm font-semibold text-slate-700">
            <li><a className="transition hover:text-summer-blue" href="#hero">Home</a></li>
            <li><a className="transition hover:text-summer-blue" href="#console">Analyze</a></li>
            <li><a className="transition hover:text-summer-blue" href="#how-it-works">How It Works</a></li>
            <li><a className="transition hover:text-summer-blue" href="#xray">Report</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
