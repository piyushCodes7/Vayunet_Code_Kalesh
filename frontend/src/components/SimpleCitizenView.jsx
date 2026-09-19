import React from 'react';
import { MapPin, ShieldCheck, Clock, ArrowRight, Wind, AlertCircle } from 'lucide-react';

export default function SimpleCitizenView({ onExploreMap }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-in fade-in duration-300">
      
      {/* Hero Section with Generous White Space */}
      <div className="text-center space-y-6 max-w-3xl mx-auto mb-16 md:mb-24">
        
        {/* Simple Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
          <Wind className="w-3.5 h-3.5" />
          <span>Simple Air Safety For Everyone</span>
        </div>

        {/* H1 Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Know If The Air On Your Street Is Safe To Breathe
        </h1>

        {/* Short Value Sentence */}
        <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Simple street-by-street warnings so you know exactly when it is safe to work outside, send your children to school, or put on a mask.
        </p>

        {/* High-Contrast Call-to-Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreMap}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base sm:text-lg shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
          >
            <span>Check Your Street Now</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* 3 Simple Feature Cards with Icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        
        {/* Card 1: Street-by-Street Air */}
        <div className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Street-By-Street Air
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            See the exact air quality where you live and work, instead of relying on city-wide numbers that miss dirty smoke hotspots.
          </p>
        </div>

        {/* Card 2: Easy Safety Advice */}
        <div className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Easy Safety Advice
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Clear, honest tips on when to wear a mask, when to take water breaks, and when to keep children inside away from toxic smog.
          </p>
        </div>

        {/* Card 3: Safe Shift Timings */}
        <div className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 space-y-4 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Safe Work Timings
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Protect outdoor workers, delivery riders, and street vendors with recommended shift limits and clean-air rest shelters.
          </p>
        </div>

      </div>

      {/* Visual Plain-Language Color Guide for Unskilled Users */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-center">
          What The Colors Mean (Easy Guide)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>GREEN: Safe Air</span>
            </div>
            <p className="text-slate-300 text-[11px]">Good to work and play outdoors freely.</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>YELLOW: Medium Smoke</span>
            </div>
            <p className="text-slate-300 text-[11px]">Wear a mask; take water breaks every hour.</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span>RED: Heavy Toxic Air</span>
            </div>
            <p className="text-slate-300 text-[11px]">Wear N95 mask; keep kids indoors; cap work shifts.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
