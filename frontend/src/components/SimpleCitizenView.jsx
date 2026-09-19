import React from 'react';
import { MapPin, ShieldCheck, Clock, ArrowRight, Wind } from 'lucide-react';

export default function SimpleCitizenView({ onExploreMap }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto mb-12 md:mb-16">
        
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <Wind className="w-3.5 h-3.5 text-emerald-600" />
          <span>Air Safety Made Simple</span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Is The Air On Your Street Safe To Breathe?
        </h1>

        {/* Short Value Sentence */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          City apps only give one number for the entire city. VayuNet checks air quality street by street so you know when to wear a mask or keep children indoors.
        </p>

        {/* Call-to-Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onExploreMap}
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2.5 active:scale-98"
          >
            <span>Check Street Map</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* 3 Simple Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Street-by-Street Air
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            See the exact air quality where you live and work, instead of relying on city-wide numbers that miss dirty smoke hotspots.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Clear Health Advice
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Simple, honest tips on when to wear a mask, when to take water breaks, and when to keep children inside away from toxic smog.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Worker & School Alerts
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Helps schools decide on outdoor recess and guides outdoor workers on shift limits and rest breaks.
          </p>
        </div>

      </div>

      {/* Visual Color Guide */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 max-w-3xl mx-auto shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
          What The Colors Mean (Quick Guide)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>GREEN: Safe Air</span>
            </div>
            <p className="text-slate-600 text-[11px]">Good to work and play outdoors freely.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>YELLOW: Medium Smoke</span>
            </div>
            <p className="text-slate-600 text-[11px]">Wear a mask if sensitive; drink water often.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>RED: Heavy Smog</span>
            </div>
            <p className="text-slate-600 text-[11px]">Wear N95 mask; keep kids indoors; limit outdoor work.</p>
          </div>

        </div>
      </div>

    </div>
  );
}

