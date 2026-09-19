import React from 'react';
import { AlertTriangle, MapPin, Sparkles, School, HardHat } from 'lucide-react';
import { TABS } from '../utils/constants';

export default function HeroBanner({ onSelectSchoolTab, onSelectWorkerTab }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 px-4 lg:px-8 py-6">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* 3-Line Problem / Solution / Impact Mandate */}
        <div className="space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Code Kalam 2026 · Problem No. 76 · Demo Ready</span>
          </div>

          <div className="space-y-1.5 text-sm md:text-base leading-relaxed">
            <p className="flex items-start gap-2.5 text-slate-300">
              <span className="font-bold text-rose-400 shrink-0 uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 mt-0.5">
                The Problem
              </span>
              <span>City air quality is reported from a handful of sparse stations, blinding schools and hospitals to hyper-local street-level toxic spikes.</span>
            </p>

            <p className="flex items-start gap-2.5 text-slate-200">
              <span className="font-bold text-cyan-400 shrink-0 uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 mt-0.5">
                The Solution
              </span>
              <span>Low-cost sensors paired with scikit-learn spatial regressors micro-map pollution down to your exact classroom or construction site.</span>
            </p>

            <p className="flex items-start gap-2.5 text-slate-100 font-medium">
              <span className="font-bold text-emerald-400 shrink-0 uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 mt-0.5">
                The Impact
              </span>
              <span>Automated AI reasoning turns raw telemetry into instant, life-saving safety protocols for vulnerable students and outdoor workers.</span>
            </p>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={onSelectSchoolTab}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all hover:scale-[1.02] shadow-sm text-xs font-semibold"
          >
            <School className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-amber-400/80 uppercase font-mono">Simulate</div>
              <div>School Safety Protocol</div>
            </div>
          </button>

          <button
            onClick={onSelectWorkerTab}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 transition-all hover:scale-[1.02] shadow-sm text-xs font-semibold"
          >
            <HardHat className="w-4 h-4 text-orange-400" />
            <div className="text-left">
              <div className="text-[10px] text-orange-400/80 uppercase font-mono">Audit</div>
              <div>Worker Exposure Limits</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
