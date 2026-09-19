import React from 'react';
import { Wind, ShieldAlert, HardHat, School, Cpu, Activity, RefreshCw, Layers } from 'lucide-react';

import { TABS } from '../utils/constants';

export default function Navbar({ activeTab, setActiveTab, onRefresh, isRefreshing, healthData, onOpenDockerModal, isLiveStreaming, onToggleLiveStreaming }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Live Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab(TABS.OVERVIEW)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  VAYU-NET
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Micro-Map
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Delhi NCR · 25 Sensors · 48h Telemetry</span>
              </p>
            </div>
          </div>

          {/* Refresh Button on Mobile */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="md:hidden p-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab(TABS.CITIZEN)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === TABS.CITIZEN
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Easy View
          </button>

          <button
            onClick={() => setActiveTab(TABS.OVERVIEW)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === TABS.OVERVIEW
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Micro-Map
          </button>


          <button
            onClick={() => setActiveTab(TABS.SCHOOL)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === TABS.SCHOOL
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            School Safety Mode
          </button>

          <button
            onClick={() => setActiveTab(TABS.WORKER)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === TABS.WORKER
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Outdoor Worker Mode
          </button>

          <button
            onClick={() => setActiveTab(TABS.EXPLAINER)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === TABS.EXPLAINER
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI Pipeline
          </button>
        </nav>

        {/* CPCB Standard, Live Stream & Docker Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Live Real-Time Stream Toggle */}
          <button
            onClick={onToggleLiveStreaming}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              isLiveStreaming
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Live Real-Time Data Streaming from Open-Meteo"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isLiveStreaming ? 'LIVE 10s' : 'PAUSED'}</span>
          </button>

          <button
            onClick={onOpenDockerModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-semibold border border-cyan-700/50 transition-all shadow-sm active:scale-95"
            title="View Docker & Architecture Topology"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Docker</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>CPCB Verified</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-all shadow-sm active:scale-95 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync</span>
          </button>
        </div>



      </div>
    </header>
  );
}
