import React, { useState } from 'react';
import {
  School,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getAqiDetails } from '../utils/aqiUtils';

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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 border-l-4 border-amber-500 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <School className="w-3.5 h-3.5 text-amber-600" />
            <span>School Safety Guide</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Air Quality & Recess Rules
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Real-time air quality checks for 10 Delhi NCR campuses. Clear rules on outdoor sports, morning assemblies, and mask wearing.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-2xl font-extrabold text-slate-900">{totalSchools}</div>
            <div className="text-[11px] text-slate-500 font-medium">Campuses</div>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
            <div className="text-2xl font-extrabold text-rose-700">{severeCount}</div>
            <div className="text-[11px] text-rose-600 font-medium">Red Zone</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
            <div className="text-2xl font-extrabold text-amber-700">{recessCancelledCount}</div>
            <div className="text-[11px] text-amber-600 font-medium">Recess Indoors</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {['all', 'Severe', 'Very Poor', 'Poor', 'Moderate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Schools' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchools.map((school) => {
          const aqi = school.latest_prediction?.aqi || 220;
          const details = getAqiDetails(aqi);

          const isSevere = aqi >= 401;
          const isVeryPoor = aqi >= 301 && aqi < 401;
          const isPoor = aqi >= 201 && aqi < 301;

          return (
            <div
              key={school.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 flex flex-col justify-between space-y-4 hover:shadow-md transition-all shadow-sm group"
              style={{ borderLeftColor: details.color }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      📍 {school.lat.toFixed(3)}°N, {school.lng.toFixed(3)}°E
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">
                    {school.name}
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

              {/* Activity Decision Matrix */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                
                {/* Recess Status */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Outdoor Recess
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isSevere || isVeryPoor || isPoor ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className={isSevere || isVeryPoor || isPoor ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {isSevere || isVeryPoor || isPoor ? 'Indoors Only' : 'Allowed Outside'}
                    </span>
                  </div>
                </div>

                {/* Sports & PE */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Sports & Athletics
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    {isSevere || isVeryPoor ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    ) : isPoor ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className={isSevere || isVeryPoor ? 'text-rose-700 font-semibold' : isPoor ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {isSevere || isVeryPoor ? 'Prohibited' : isPoor ? 'Light Drills Only' : 'Allowed'}
                    </span>
                  </div>
                </div>

                {/* Morning Assembly */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Morning Assembly
                  </div>
                  <div className="text-slate-800 font-medium truncate">
                    {isSevere ? 'Inside Classrooms' : isVeryPoor || isPoor ? 'Auditorium' : 'Outdoor OK'}
                  </div>
                </div>

                {/* Mask Protocol */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">
                    Masks
                  </div>
                  <div className="text-slate-800 font-medium truncate">
                    {isSevere || isVeryPoor ? 'Mandatory N95' : isPoor ? 'Recommended N95' : 'Optional'}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSchool({ ...school, entity_type: 'school' })}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>View Full School Advisory</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

