import React from 'react';
import { Activity, Flame, School, HardHat } from 'lucide-react';
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
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between border-l-4 shadow-sm" style={{ borderLeftColor: avgDetails.color }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City Average</span>
          <Activity className="w-4 h-4 text-slate-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: avgDetails.color }}>
            {avgAqi}
          </span>
          <span className="text-xs text-slate-400 font-medium">AQI</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-slate-100 text-slate-800">
            {avgDetails.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Average across 25 local sensors
        </p>
      </div>

      {/* Peak Hotspot */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between border-l-4 shadow-sm" style={{ borderLeftColor: maxDetails.color }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Most Polluted Area</span>
          <Flame className="w-4 h-4 text-rose-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: maxDetails.color }}>
            {maxAqi}
          </span>
          <span className="text-xs text-slate-400 font-medium">AQI</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-rose-50 text-rose-700 border border-rose-200">
            {maxDetails.category}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium truncate mt-2">
          📍 {summary?.peak_location || 'Anand Vihar'}
        </p>
      </div>

      {/* Monitored Schools */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between border-l-4 border-amber-500 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Schools Checked</span>
          <School className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-600">
            {schools.length || 10}
          </span>
          <span className="text-xs text-slate-400 font-medium">campuses</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-amber-50 text-amber-800 border border-amber-200">
            {severeSchools} in Red Zone
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Outdoor recess restrictions active
        </p>
      </div>

      {/* Outdoor Worker Hubs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between border-l-4 border-orange-500 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Worker Hubs</span>
          <HardHat className="w-4 h-4 text-orange-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-orange-600">
            {workerZones.length || 6}
          </span>
          <span className="text-xs text-slate-400 font-medium">zones</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-auto bg-orange-50 text-orange-800 border border-orange-200">
            {highRiskWorkers} High Smog
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          N95 mask & 45-min shift limits
        </p>
      </div>

    </div>
  );
}

