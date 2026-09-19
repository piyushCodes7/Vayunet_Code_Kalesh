import React, { useState } from 'react';
import {
  HardHat,
  Clock,
  ShieldCheck,
  Radio,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getAqiDetails } from '../utils/aqiUtils';

export default function OutdoorWorkerDashboard({ workerZones = [], onSelectWorkerZone }) {
  const [selectedTrade, setSelectedTrade] = useState('all');

  const TRADES = [
    { id: 'all', label: 'All Sectors' },
    { id: 'construction', label: 'Construction & Demolition' },
    { id: 'delivery', label: 'Delivery Fleets' },
    { id: 'traffic', label: 'Traffic Wardens & Police' },
    { id: 'sanitation', label: 'Sanitation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 border-l-4 border-orange-500 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold">
            <HardHat className="w-3.5 h-3.5 text-orange-600" />
            <span>Outdoor Worker Safety</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Shift Limits & Safety Precautions
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Real-time air checks for construction sites, delivery corridors, and road junctions. Clear advice on shift duration, hydration breaks, and N95 masks.
          </p>
        </div>

        {/* Quick Labor Protocols */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-center w-full sm:w-auto">
            <div className="text-2xl font-extrabold text-orange-800">45 MINS</div>
            <div className="text-[11px] text-orange-700 font-medium">Max Shift Duration</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center w-full sm:w-auto">
            <div className="text-2xl font-extrabold text-blue-800">N95 Mask</div>
            <div className="text-[11px] text-blue-700 font-medium">Recommended PPE</div>
          </div>
        </div>
      </div>

      {/* Trade Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TRADES.map((trade) => (
          <button
            key={trade.id}
            onClick={() => setSelectedTrade(trade.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTrade === trade.id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            {trade.label}
          </button>
        ))}
      </div>

      {/* Worker Zones Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workerZones.map((zone) => {
          const aqi = zone.latest_prediction?.aqi || 280;
          const details = getAqiDetails(aqi);

          const isSevere = aqi >= 401;
          const isVeryPoor = aqi >= 301 && aqi < 401;

          return (
            <div
              key={zone.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-all shadow-sm group"
              style={{ borderLeftColor: details.color }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      📍 {zone.lat.toFixed(3)}°N, {zone.lng.toFixed(3)}°E
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">
                    {zone.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold tracking-tight" style={{ color: details.color }}>
                    {aqi}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${details.badgeClass}`}>
                    {details.category}
                  </span>
                </div>
              </div>

              {/* Exposure Mandates */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                
                {/* Max Shift */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span>Max Continuous Shift</span>
                  </div>
                  <div className="font-bold text-slate-900">
                    {isSevere ? '20 Mins Limit' : isVeryPoor ? '30 Mins Limit' : '45 Mins Limit'}
                  </div>
                </div>

                {/* PPE Mandate */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Mask Advice</span>
                  </div>
                  <div className="font-bold text-blue-700">
                    {isSevere ? 'N95 Mandatory' : 'N95 Required'}
                  </div>
                </div>

                {/* Clean Air Pod */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600" />
                    <span>Clean-Air Rest Spot</span>
                  </div>
                  <div className="text-slate-700 font-medium">
                    Within 150m of Site
                  </div>
                </div>

                {/* Hydration / Water Misting */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Dust Suppression
                  </div>
                  <div className="text-slate-700 font-medium">
                    {isSevere ? 'Water Sprinklers Active' : 'Water Misting Active'}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectWorkerZone({ ...zone, entity_type: 'worker_zone' })}
                className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>View Full Worker Safety Advice</span>
                <ChevronRight className="w-3.5 h-3.5 text-orange-600" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

