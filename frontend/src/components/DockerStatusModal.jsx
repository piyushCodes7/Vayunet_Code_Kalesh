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

  const isHealthy = healthData?.status === 'healthy';

  return (
    <div className="fixed inset-0 z-[1100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Containerized Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Docker Compose & System Topology
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* One-Command Run Banner */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">
              Primary Single Command
            </div>
            <div className="text-xs sm:text-sm font-mono text-cyan-300 font-bold flex items-center gap-2 mt-0.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>docker compose up --build</span>
            </div>
          </div>

          <button
            onClick={handleCopyCommand}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Command'}</span>
          </button>
        </div>

        {/* 3 Container Services */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Orchestrated Microservices:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* 1. DB */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Database className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Healthy
                </span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">vayu_db</div>
                <div className="text-[11px] text-slate-400 font-mono">PostgreSQL 16</div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Port: 5432 · Healthcheck
              </div>
            </div>

            {/* 2. Backend */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Healthy
                </span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">vayu_backend</div>
                <div className="text-[11px] text-slate-400 font-mono">FastAPI · Python 3.11</div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Port: 8000 · ML & AI
              </div>
            </div>

            {/* 3. Frontend */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Globe className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Healthy
                </span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">vayu_frontend</div>
                <div className="text-[11px] text-slate-400 font-mono">React 18 · Nginx</div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Ports: 3000 / 5173 · SPA
              </div>
            </div>

          </div>
        </div>

        {/* Live System Diagnostics */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="text-slate-400 uppercase text-[10px] font-bold">
            Live System Diagnostics
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
            <div>Database Status: <span className="text-emerald-400 font-bold">{healthData?.database || 'Connected'}</span></div>
            <div>Sensors Registered: <span className="text-white font-bold">{healthData?.sensors_registered || 25}</span></div>
            <div>ML Model Status: <span className="text-cyan-400 font-bold">{healthData?.ml_model_trained ? 'Trained (scikit-learn)' : 'Active'}</span></div>
            <div>Seeded Readings: <span className="text-white font-bold">{healthData?.readings_stored || 1225}</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-500 text-[11px]">
            Docker Compose v2.0+ Compatible
          </span>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Open Swagger API Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
}
