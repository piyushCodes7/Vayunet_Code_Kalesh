import React from 'react';
import { Wind, ShieldAlert, HardHat, School, Cpu, Activity, RefreshCw, Layers } from 'lucide-react';

import { TABS } from '../utils/constants';

export default function Navbar({ activeTab, setActiveTab, onRefresh, isRefreshing, healthData, onOpenDockerModal, isLiveStreaming, onToggleLiveStreaming }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Live Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab(TABS.CITIZEN)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md text-white">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  VayuNet
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Air Quality
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Delhi NCR · 25 Local Sensors</span>
              </p>
            </div>
          </div>

          {/* Refresh Button on Mobile */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab(TABS.CITIZEN)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === TABS.CITIZEN
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            Home
          </button>

          <button
            onClick={() => setActiveTab(TABS.OVERVIEW)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === TABS.OVERVIEW
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            City Map
          </button>

          <button
            onClick={() => setActiveTab(TABS.SCHOOL)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === TABS.SCHOOL
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <School className="w-3.5 h-3.5 text-amber-600" />
            Schools
          </button>

          <button
            onClick={() => setActiveTab(TABS.WORKER)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === TABS.WORKER
                ? 'bg-white text-orange-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-orange-600" />
            Workers
          </button>

          <button
            onClick={() => setActiveTab(TABS.EXPLAINER)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === TABS.EXPLAINER
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            How It Works
          </button>
        </nav>

        {/* CPCB Standard, Live Stream & Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Live Stream Toggle */}
          <button
            onClick={onToggleLiveStreaming}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Auto-refreshing every 10s"
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            <span>{isLiveStreaming ? 'Live' : 'Paused'}</span>
          </button>

          <button
            onClick={onOpenDockerModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
            title="View System Status"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Status</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : 'text-slate-600'}`} />
            <span>Sync</span>
          </button>
        </div>

      </div>
    </header>
  );
}
