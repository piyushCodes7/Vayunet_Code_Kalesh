import React, { useState } from 'react';
import {
  School,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Search,
  Filter,
  Sparkles,
  Printer,
  ChevronRight
} from 'lucide-react';
import { getAqiDetails, formatConcentration } from '../utils/aqiUtils';

export default function SchoolSafetyDashboard({ schools = [], onSelectSchool }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredSchools = schools.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());
    const aqi = school.latest_prediction?.aqi || 220;
    const details = getAqiDetails(aqi);

    if (filterCategory === 'all') return matchesSearch;
    return matchesSearch && details.category.toLowerCase() === filterCategory.toLowerCase();
  });

  // Calculate statistics
  const totalSchools = schools.length;
  const severeCount = schools.filter(s => (s.latest_prediction?.aqi || 0) >= 301).length;
  const recessCancelledCount = schools.filter(s => (s.latest_prediction?.aqi || 0) >= 201).length;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 border-l-8 border-amber-500 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold uppercase">
            <School className="w-3.5 h-3.5" />
            <span>School Air Quality Risk Command</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Campus Safety & Outdoor Recess Protocols
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time hyper-local micro-predictions for 10 prominent school campuses in Delhi NCR.
            Advisories automatically recommend outdoor recess bans, morning assembly relocation, and classroom HEPA filtration speeds.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl font-black text-white">{totalSchools}</div>
            <div className="text-[11px] text-slate-400 font-mono">Monitored</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-rose-900/50 text-center">
            <div className="text-2xl font-black text-rose-400">{severeCount}</div>
            <div className="text-[11px] text-rose-300 font-mono">Severe Zone</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-900/50 text-center">
            <div className="text-2xl font-black text-amber-400">{recessCancelledCount}</div>
            <div className="text-[11px] text-amber-300 font-mono">Recess Bans</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['all', 'Severe', 'Very Poor', 'Poor', 'Moderate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Campuses' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchools.map((school) => {
          const aqi = school.latest_prediction?.aqi || 220;
          const details = getAqiDetails(aqi);
          const pm25 = school.latest_prediction?.pm25 || 140.0;
          const pm10 = school.latest_prediction?.pm10 || 260.0;

          const isSevere = aqi >= 401;
          const isVeryPoor = aqi >= 301 && aqi < 401;
          const isPoor = aqi >= 201 && aqi < 301;

          return (
            <div
              key={school.id}
              className="glass-card rounded-2xl p-5 border-l-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
              style={{ borderLeftColor: details.color }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      📍 {school.lat.toFixed(3)}°N, {school.lng.toFixed(3)}°E
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-0.5 group-hover:text-amber-300 transition-colors">
                    {school.name}
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

              {/* Activity Decision Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                
                {/* Recess Status */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                    Outdoor Recess
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isSevere || isVeryPoor || isPoor ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span className={isSevere || isVeryPoor || isPoor ? 'text-rose-300' : 'text-emerald-300'}>
                      {isSevere || isVeryPoor || isPoor ? 'Suspended / Indoors' : 'Permitted'}
                    </span>
                  </div>
                </div>

                {/* Sports & PE */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                    Sports & Athletics
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isSevere || isVeryPoor ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : isPoor ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span className={isSevere || isVeryPoor ? 'text-rose-300' : isPoor ? 'text-amber-300' : 'text-emerald-300'}>
                      {isSevere || isVeryPoor ? 'Strictly Prohibited' : isPoor ? 'Light Drills Only' : 'Permitted'}
                    </span>
                  </div>
                </div>

                {/* Morning Assembly */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                    Morning Assembly
                  </div>
                  <div className="text-slate-300 font-medium truncate">
                    {isSevere ? 'Campus Closure' : isVeryPoor || isPoor ? 'Classroom PA' : 'Auditorium'}
                  </div>
                </div>

                {/* Mask Protocol */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">
                    Transit Masks
                  </div>
                  <div className="text-slate-300 font-medium truncate">
                    {isSevere || isVeryPoor ? 'Mandatory N95' : isPoor ? 'Recommended N95' : 'Optional'}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSchool({ ...school, entity_type: 'school' })}
                className="w-full py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>View Full AI Advisory & Operational Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
