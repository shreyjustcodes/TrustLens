import { useRef, useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/60 bg-white/35 backdrop-blur-2xl shadow-glass' : 'bg-transparent'
      }`}
    >
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-summer-orange shadow-[0_0_14px_rgba(255,122,24,0.8)]" />
            TrustLens
          </div>
          <ul className="hidden list-none items-center gap-7 md:flex">
            <li><a className="text-sm font-semibold text-slate-700 transition hover:text-summer-blue" href="#console" onClick={(e) => { e.preventDefault(); scrollTo('console'); }}>Analyze</a></li>
            <li><a className="text-sm font-semibold text-slate-700 transition hover:text-summer-blue" href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a></li>
            <li><a className="text-sm font-semibold text-slate-700 transition hover:text-summer-blue" href="#xray" onClick={(e) => { e.preventDefault(); scrollTo('xray'); }}>Report</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
