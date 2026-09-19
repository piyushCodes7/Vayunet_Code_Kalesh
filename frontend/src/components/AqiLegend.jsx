import React from 'react';
import { AQI_LEVELS } from '../utils/aqiUtils';

export default function AqiLegend() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-700 text-xs">
          Air Quality Scale (CPCB):
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {AQI_LEVELS.map((level) => (
          <div key={level.category} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-slate-800 font-medium">{level.category}</span>
            <span className="text-slate-400 text-[11px]">
              ({level.min}{level.max > 500 ? '+' : `-${level.max}`})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

