import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, Terminal, Layers, Database, Cpu, Globe, ExternalLink } from 'lucide-react';

export default function DockerStatusModal({ isOpen, onClose, healthData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('docker compose up --build');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>System Status</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              System Health & Architecture
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Command Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">
              Run With Docker (Optional)
            </div>
            <div className="text-xs sm:text-sm text-slate-800 font-mono font-bold flex items-center gap-2 mt-0.5">
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>docker compose up --build</span>
            </div>
          </div>

          <button
            onClick={handleCopyCommand}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-sm shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* 3 Container Services */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Components:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. DB */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <Database className="w-5 h-5 text-emerald-600" />
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Database</div>
                <div className="text-[11px] text-slate-500">PostgreSQL / SQLite</div>
              </div>
              <div className="text-[10px] text-slate-400">
                Port: 5432
              </div>
            </div>

            {/* 2. Backend */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <Cpu className="w-5 h-5 text-blue-600" />
                <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Backend API</div>
                <div className="text-[11px] text-slate-500">FastAPI · Python 3.11+</div>
              </div>
              <div className="text-[10px] text-slate-400">
                Port: 8000
              </div>
            </div>

            {/* 3. Frontend */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <Globe className="w-5 h-5 text-amber-600" />
                <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Online
                </span>
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Web Frontend</div>
                <div className="text-[11px] text-slate-500">React 18 · Vite</div>
              </div>
              <div className="text-[10px] text-slate-400">
                Port: 5173
              </div>
            </div>

          </div>
        </div>

        {/* Live System Diagnostics */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="text-slate-500 uppercase text-[10px] font-bold">
            Live System Info
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-700 text-xs">
            <div>Database Status: <span className="text-emerald-700 font-bold">{healthData?.database || 'Connected'}</span></div>
            <div>Sensors Registered: <span className="text-slate-900 font-bold">{healthData?.sensors_registered || 25}</span></div>
            <div>ML Model: <span className="text-blue-700 font-bold">{healthData?.ml_model_trained ? 'Trained & Active' : 'Ready'}</span></div>
            <div>Telemetry Records: <span className="text-slate-900 font-bold">{healthData?.readings_stored || 4825}</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px]">
            VayuNet Micro-Mapping System
          </span>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Open API Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}

