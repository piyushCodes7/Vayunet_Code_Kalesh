import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  Database,
  Layers,
  School,
  HardHat,
  Play
} from 'lucide-react';
import { fetchAdvisory } from '../services/api';

export default function AiAutomationExplainer() {
  const [testContext, setTestContext] = useState('school');
  const [testPm25, setTestPm25] = useState(265.4);
  const [testPm10, setTestPm10] = useState(418.0);
  const [testLocation, setTestLocation] = useState('Delhi Public School, R.K. Puram');
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultAdvisory, setResultAdvisory] = useState(null);
  const [executionTimeMs, setExecutionTimeMs] = useState(null);

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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 border-l-4 border-indigo-500 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>How It Works</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          How Raw Sensor Data Becomes Life-Saving Advice
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Instead of confusing people with numbers like "PM2.5: 284 µg/m³", VayuNet turns telemetry into clear, practical instructions in 4 steps.
        </p>
      </div>

      {/* 4-Stage Architectural Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Step 1
            </span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Local Sensors</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              25 low-cost optical sensors collect real-time smoke and weather data across Delhi NCR.
            </p>
          </div>
          <div className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100 font-medium">
            Live Air Telemetry
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Step 2
            </span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Street Prediction</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Machine learning model calculates air pollution at any specific road or school campus.
            </p>
          </div>
          <div className="text-[10px] text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-100 font-medium">
            Street-Level AQI
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Step 3
            </span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Safety Reasoning</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Evaluates toxic pollution levels against official CPCB guidelines and health risks.
            </p>
          </div>
          <div className="text-[10px] text-indigo-800 bg-indigo-50 p-2 rounded-lg border border-indigo-100 font-medium">
            CPCB Health Logic
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Step 4
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Clear Action Rules</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Gives clear instructions: indoor recess, N95 masks, air purifiers, and 45-min shift caps.
            </p>
          </div>
          <div className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100 font-medium">
            Practical Protocols
          </div>
        </div>

      </div>

      {/* Live Interactive Pipeline Tester */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>Test The Advisory Generator</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Enter test pollution readings to see how the system generates immediate health advice.
            </p>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-98 disabled:opacity-60"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>Generate Advice</span>
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-600 font-medium block mb-1">Location Name</label>
            <input
              type="text"
              value={testLocation}
              onChange={(e) => setTestLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">PM2.5 Level (µg/m³)</label>
            <input
              type="number"
              value={testPm25}
              onChange={(e) => setTestPm25(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">PM10 Level (µg/m³)</label>
            <input
              type="number"
              value={testPm10}
              onChange={(e) => setTestPm10(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 font-medium block mb-1">Who Is This For?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTestContext('school')}
                className={`py-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  testContext === 'school'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
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
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200'
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
          <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-700 font-bold">Advice Generated ({executionTimeMs}ms)</span>
              </div>
              <div className="text-slate-500">
                Engine: <span className="text-slate-800 font-semibold">{resultAdvisory.engine_used}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Generated Narrative */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recommended Safety Advice:
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {resultAdvisory.advisory_text}
                </p>
                <div className="pt-1 text-[11px] text-amber-800 font-medium">
                  ⚠️ {resultAdvisory.recess_or_shift_guidance}
                </div>
              </div>

              {/* Structured Checklist */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="text-slate-700 font-bold uppercase text-xs">Action Checklist</div>
                <ul className="space-y-1.5 text-slate-700 text-xs">
                  {resultAdvisory.actionable_protocols?.map((proto, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{proto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

