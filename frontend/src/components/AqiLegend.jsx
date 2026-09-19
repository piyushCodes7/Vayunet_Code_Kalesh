import React from 'react';
import { AQI_LEVELS } from '../utils/aqiUtils';

export default function AqiLegend() {
  return (
    <div className="glass-panel rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider font-mono">
          CPCB India NAQI Scale:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {AQI_LEVELS.map((level) => (
          <div key={level.category} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-slate-300 font-medium">{level.category}</span>
            <span className="text-slate-500 font-mono text-[10px]">
              ({level.min}{level.max > 500 ? '+' : `-${level.max}`})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
