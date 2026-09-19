import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  School,
  HardHat,
  CheckCircle2,
  Code2,
  Terminal,
  Play
} from 'lucide-react';
import { fetchAdvisory } from '../services/api';
import { getAqiDetails } from '../utils/aqiUtils';

export default function AiAutomationExplainer() {
  const [testContext, setTestContext] = useState('school');
  const [testPm25, setTestPm25] = useState(265.4);
  const [testPm10, setTestPm10] = useState(418.0);
  const [testLocation, setTestLocation] = useState('Delhi Public School, R.K. Puram');
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultAdvisory, setResultAdvisory] = useState(null);
  const [executionTimeMs, setExecutionTimeMs] = useState(null);

  const aqiDetails = getAqiDetails(360); // sample for UI

  const handleExecute = async () => {
    setIsExecuting(true);
    const start = performance.now();
    try {
      const res = await fetchAdvisory({
        location_name: testLocation,
        pm25: Number(testPm25),
        pm10: Number(testPm10),
        aqi: Math.round((testPm25 / 250) * 400),
        category: 'Very Poor',
        context: testContext
      });
      const end = performance.now();
      setResultAdvisory(res);
      setExecutionTimeMs(Math.round(end - start));
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 border-l-8 border-indigo-500 space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hackathon Automation Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          AI Automated Advisory Pipeline: Telemetry to Protocol
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          The non-negotiable hackathon requirement: A transparent, end-to-end automated pipeline that ingests raw telemetry,
          interpolates street-level coordinates via scikit-learn, and synthesizes contextual, life-saving safety directives using GenAI.
        </p>
      </div>

      {/* 4-Stage Architectural Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        
        {/* Step 1 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Stage 01
            </span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Telemetry Ingestion</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              25 low-cost optical particulate monitors stream PM2.5, PM10, temperature & humidity over 48 hours.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Raw JSON Telemetry
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              Stage 02
            </span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Spatial ML Model</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              scikit-learn HistGradientBoostingRegressor models diurnal inversion peaks and interpolates unmonitored coordinates.
            </p>
          </div>
          <div className="text-[10px] font-mono text-cyan-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Micro-AQI & Breakpoints
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
              Stage 03
            </span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Contextual LLM Reasoning</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              OpenAI client (gpt-4o-mini) or CPCB Automated Expert System evaluates toxic thresholds and stakeholder vulnerabilities.
            </p>
          </div>
          <div className="text-[10px] font-mono text-indigo-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Structured Health Logic
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-amber-300">
              Stage 04
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Actionable Safety Directive</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Targeted directives dispatched: Recess bans, N95 respirators, HEPA air purifiers, and 45-min shift caps.
            </p>
          </div>
          <div className="text-[10px] font-mono text-amber-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Operational Protocols
          </div>
        </div>

      </div>

      {/* Live Interactive Pipeline Tester */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Live AI Automation Inspector</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate raw pollution telemetry and trigger the automated step to observe real-time AI reasoning.
            </p>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-60"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>Execute AI Pipeline</span>
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-medium block mb-1">Target Location</label>
            <input
              type="text"
              value={testLocation}
              onChange={(e) => setTestLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Raw PM2.5 (µg/m³)</label>
            <input
              type="number"
              value={testPm25}
              onChange={(e) => setTestPm25(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Raw PM10 (µg/m³)</label>
            <input
              type="number"
              value={testPm10}
              onChange={(e) => setTestPm10(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1">Stakeholder Context</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTestContext('school')}
                className={`py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  testContext === 'school'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                School
              </button>
              <button
                type="button"
                onClick={() => setTestContext('worker')}
                className={`py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  testContext === 'worker'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                Worker
              </button>
            </div>
          </div>
        </div>

        {/* Live Output Card */}
        {resultAdvisory && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold">PIPELINE EXECUTION COMPLETE</span>
              </div>
              <div className="text-slate-400">
                Latency: <span className="text-white font-bold">{executionTimeMs}ms</span> · Engine: <span className="text-cyan-300 font-bold">{resultAdvisory.engine_used}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Generated Narrative */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Synthesized AI Advisory:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {resultAdvisory.advisory_text}
                </p>
                <div className="pt-2 text-[11px] text-amber-300/90 font-medium">
                  ⚠️ {resultAdvisory.recess_or_shift_guidance}
                </div>
              </div>

              {/* Raw Structured JSON Response */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                <div className="text-slate-500 uppercase text-[10px] font-bold">Raw JSON Output</div>
                <pre>{JSON.stringify(resultAdvisory, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
