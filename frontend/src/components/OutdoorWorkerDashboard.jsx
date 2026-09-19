import React, { useState } from 'react';
import {
  HardHat,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Radio,
  Truck,
  Building,
  UserCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getAqiDetails, formatConcentration } from '../utils/aqiUtils';

export default function OutdoorWorkerDashboard({ workerZones = [], onSelectWorkerZone }) {
  const [selectedTrade, setSelectedTrade] = useState('all');

  const TRADES = [
    { id: 'all', label: 'All Labor Sectors' },
    { id: 'construction', label: 'Construction & Demolition' },
    { id: 'delivery', label: 'Gig Delivery Fleets' },
    { id: 'traffic', label: 'Traffic Wardens & Police' },
    { id: 'sanitation', label: 'Municipal Sanitation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 border-l-8 border-orange-500 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-xs font-mono font-bold uppercase">
            <HardHat className="w-3.5 h-3.5" />
            <span>Occupational Smog Risk Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Outdoor Labor Safety & Exposure Shift Limits
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Street-level toxic particulate monitoring for high-exposure work hubs: freight corridors, transit terminals, and construction corridors.
            Automated enforcement of continuous shift caps and clean-air rest intervals.
          </p>
        </div>

        {/* Quick Labor Protocols */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-orange-500/30 text-center w-full sm:w-auto">
            <div className="text-2xl font-black text-orange-400 font-mono">45 MINS</div>
            <div className="text-[11px] text-slate-400 font-mono">Max Continuous Shift</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/30 text-center w-full sm:w-auto">
            <div className="text-2xl font-black text-cyan-400 font-mono">N95 / FFP2</div>
            <div className="text-[11px] text-slate-400 font-mono">Mandatory PPE</div>
          </div>
        </div>
      </div>

      {/* Trade Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TRADES.map((trade) => (
          <button
            key={trade.id}
            onClick={() => setSelectedTrade(trade.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedTrade === trade.id
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
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
          const pm25 = zone.latest_prediction?.pm25 || 190.0;
          const pm10 = zone.latest_prediction?.pm10 || 340.0;

          const isSevere = aqi >= 401;
          const isVeryPoor = aqi >= 301 && aqi < 401;

          return (
            <div
              key={zone.id}
              className="glass-card rounded-2xl p-5 border-l-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
              style={{ borderLeftColor: details.color }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      📍 {zone.lat.toFixed(3)}°N, {zone.lng.toFixed(3)}°E
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-0.5 group-hover:text-orange-300 transition-colors">
                    {zone.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black font-mono tracking-tight" style={{ color: details.color }}>
                    {aqi}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${details.badgeClass}`}>
                    {details.category}
                  </span>
                </div>
              </div>

              {/* Exposure Mandates */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                
                {/* Max Shift */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>Max Stint Duration</span>
                  </div>
                  <div className="font-bold text-white">
                    {isSevere ? '20 Mins (Essential Only)' : isVeryPoor ? '30 Mins Stint' : '45 Mins Stint'}
                  </div>
                </div>

                {/* PPE Mandate */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>Respirator Mandate</span>
                  </div>
                  <div className="font-bold text-cyan-300">
                    {isSevere ? 'N95 / FFP3 Mandatory' : 'N95 Respirator Required'}
                  </div>
                </div>

                {/* Clean Air Pod */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-400" />
                    <span>Clean-Air Shelter</span>
                  </div>
                  <div className="text-slate-300 font-medium">
                    &lt; 150m from Work Site
                  </div>
                </div>

                {/* Hydration / Water Misting */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                    Dust Suppression
                  </div>
                  <div className="text-slate-300 font-medium">
                    {isSevere ? 'Halt Dry Work / Mist Active' : 'Anti-Smog Guns Active'}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectWorkerZone({ ...zone, entity_type: 'worker_zone' })}
                className="w-full py-2 px-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>View Full AI Occupational Health Advisory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
