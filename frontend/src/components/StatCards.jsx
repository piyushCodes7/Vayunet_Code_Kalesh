import React from 'react';
import { Activity, Flame, School, HardHat, AlertCircle } from 'lucide-react';
import { getAqiDetails } from '../utils/aqiUtils';

export default function StatCards({ summary, schools = [], workerZones = [] }) {
  const avgAqi = summary?.avg_aqi || 240;
  const avgDetails = getAqiDetails(avgAqi);
  const maxAqi = summary?.max_aqi || 385;
  const maxDetails = getAqiDetails(maxAqi);

  const severeSchools = schools.filter(s => (s.latest_prediction?.aqi || 0) >= 301).length;
  const highRiskWorkers = workerZones.filter(w => (w.latest_prediction?.aqi || 0) >= 301).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-8 py-4 max-w-7xl mx-auto">
      
      {/* City Average AQI */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between border-l-4" style={{ borderLeftColor: avgDetails.color }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City-Wide Average</span>
          <Activity className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: avgDetails.color }}>
            {avgAqi}
          </span>
          <span className="text-xs font-mono text-slate-400">AQI</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto ${avgDetails.badgeClass}`}>
            {avgDetails.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <span>Based on 25 low-cost micro-sensors</span>
        </p>
      </div>

      {/* Peak Hotspot */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between border-l-4" style={{ borderLeftColor: maxDetails.color }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peak Toxic Hotspot</span>
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
        </div>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: maxDetails.color }}>
            {maxAqi}
          </span>
          <span className="text-xs font-mono text-slate-400">AQI</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto ${maxDetails.badgeClass}`}>
            {maxDetails.category}
          </span>
        </div>
        <p className="text-[11px] text-rose-300 font-medium truncate mt-2">
          📍 {summary?.peak_location || 'Anand Vihar CPCB/DPCC'}
        </p>
      </div>

      {/* Monitored Schools */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between border-l-4 border-amber-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Schools</span>
          <School className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold tracking-tight text-amber-400">
            {schools.length || 10}
          </span>
          <span className="text-xs font-mono text-slate-400">campuses</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {severeSchools} in Severe Zone
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Outdoor recess restrictions active
        </p>
      </div>

      {/* Outdoor Worker Hubs */}
      <div className="glass-card rounded-2xl p-4 flex flex-col justify-between border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outdoor Labor Hubs</span>
          <HardHat className="w-4 h-4 text-orange-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold tracking-tight text-orange-400">
            {workerZones.length || 6}
          </span>
          <span className="text-xs font-mono text-slate-400">work zones</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-orange-500/20 text-orange-300 border border-orange-500/30">
            {highRiskWorkers} Critical Alert
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          N95 mandate & 45-min shift caps
        </p>
      </div>

    </div>
  );
}
