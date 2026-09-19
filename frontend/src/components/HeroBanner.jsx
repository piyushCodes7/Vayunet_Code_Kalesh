import React from 'react';
import { School, HardHat, Sparkles } from 'lucide-react';

export default function HeroBanner({ onSelectSchoolTab, onSelectWorkerTab }) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Simple 3-Line Explanation */}
        <div className="space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Street-Level Air Quality & Health Alerts</span>
          </div>

          <div className="space-y-1.5 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <span className="font-bold text-rose-700 shrink-0 text-xs px-2 py-0.5 rounded bg-rose-50 border border-rose-200 mt-0.5">
                The Problem
              </span>
              <span>City stations are miles apart, so they miss heavy smoke hotspots on individual roads and school campuses.</span>
            </p>

            <p className="flex items-start gap-2">
              <span className="font-bold text-blue-700 shrink-0 text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 mt-0.5">
                The Solution
              </span>
              <span>25 local sensors check air quality street-by-street across Delhi NCR in real time.</span>
            </p>

            <p className="flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0 text-xs px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 mt-0.5">
                The Action
              </span>
              <span>Instant, clear safety rules for school recess and outdoor worker shifts.</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <button
            onClick={onSelectSchoolTab}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all text-xs font-semibold shadow-sm"
          >
            <School className="w-4 h-4 text-amber-600" />
            <div className="text-left">
              <div className="text-[10px] text-amber-700 uppercase font-semibold">View</div>
              <div>School Recess Rules</div>
            </div>
          </button>

          <button
            onClick={onSelectWorkerTab}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 transition-all text-xs font-semibold shadow-sm"
          >
            <HardHat className="w-4 h-4 text-orange-600" />
            <div className="text-left">
              <div className="text-[10px] text-orange-700 uppercase font-semibold">View</div>
              <div>Worker Shift Limits</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

