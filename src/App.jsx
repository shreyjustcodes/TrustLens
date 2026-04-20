import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalyticalConsole from './components/AnalyticalConsole';
import XRayView from './components/XRayView';
import AIAnalysisView from './components/AIAnalysisView';
import HowItWorksFlow from './components/HowItWorksFlow';
import Footer from './components/Footer';
import { analyzeText } from './engine/analyzer';
import { analyzeWithGemini } from './engine/geminiService';

export default function App() {
  const [report, setReport] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [mode, setMode] = useState('rules'); // 'rules' | 'ai'

  const handleAnalyze = async (text) => {
    if (mode === 'rules') {
      // Rule-based analysis (synchronous)
      const result = analyzeText(text);
      if (!result.error) {
        setReport(result);
        setAiResult(null);
        setAiError(null);
      }
    } else {
      // AI-powered analysis (async)
      setAiLoading(true);
      setAiError(null);
      setAiResult(null);
      setReport(null);

      try {
        const result = await analyzeWithGemini(text);
        setAiResult(result);
      } catch (err) {
        setAiError(err.message);
      } finally {
        setAiLoading(false);
      }
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <HowItWorksFlow />
        <AnalyticalConsole
          onAnalyze={handleAnalyze}
          mode={mode}
          onModeChange={setMode}
          isAnalyzing={aiLoading}
        />
        {mode === 'rules' && report && <XRayView report={report} />}
        {mode === 'ai' && (
          <AIAnalysisView
            result={aiResult}
            loading={aiLoading}
            error={aiError}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
