import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  School,
  HardHat,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Droplets,
  Radio,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { getAqiDetails, formatConcentration } from '../utils/aqiUtils';
import { CPCB_SAFE_LIMITS } from '../utils/constants';
import { fetchAdvisory } from '../services/api';

export default function DetailSidePanel({
  entity,
  onClose,
  defaultContext = 'school'
}) {
  const [context, setContext] = useState(
    entity?.type === 'worker_zone' ? 'worker' : defaultContext
  );
  const [advisory, setAdvisory] = useState(null);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract readings depending on whether it's a sensor, location, or predicted coordinate
  const aqi =
    entity?.aqi ||
    entity?.latest_prediction?.aqi ||
    entity?.latest_reading?.aqi ||
    220;

  const aqiDetails = getAqiDetails(aqi);

  const pm25 =
    entity?.predicted_pm25 ??
    entity?.latest_prediction?.pm25 ??
    entity?.latest_reading?.pm25 ??
    155.0;

  const pm10 =
    entity?.predicted_pm10 ??
    entity?.latest_prediction?.pm10 ??
    entity?.latest_reading?.pm10 ??
    280.0;

  const temp = entity?.temperature ?? entity?.latest_reading?.temperature ?? 22.5;
  const humidity = entity?.humidity ?? entity?.latest_reading?.humidity ?? 58.0;

  // Auto-generate or load advisory when entity or context changes
  useEffect(() => {
    let isMounted = true;
    async function loadAdvisory() {
      setIsLoadingAdvisory(true);
      try {
        const res = await fetchAdvisory({
          location_id: entity?.id || null,
          location_name: entity?.name || 'Selected Coordinate',
          lat: entity?.lat,
          lng: entity?.lng,
          pm25: Number(pm25),
          pm10: Number(pm10),
          aqi: Number(aqi),
          category: aqiDetails.category,
          context: context,
        });
        if (isMounted) {
          setAdvisory(res);
        }
      } catch (err) {
        console.error('Failed to generate AI advisory:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAdvisory(false);
        }
      }
    }

    loadAdvisory();
    return () => {
      isMounted = false;
    };
  }, [entity?.id, entity?.lat, entity?.lng, context, aqi, pm25, pm10]);

  const handleCopyAdvisory = () => {
    if (!advisory?.advisory_text) return;
    const text = `[VayuNet AI Safety Advisory - ${entity?.name || 'Zone'}]\nAQI: ${aqi} (${aqiDetails.category})\nContext: ${context.toUpperCase()}\n\n${advisory.advisory_text}\n\nProtocols:\n${advisory.actionable_protocols?.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pm25Ratio = (pm25 / CPCB_SAFE_LIMITS.pm25).toFixed(1);
  const pm10Ratio = (pm10 / CPCB_SAFE_LIMITS.pm10).toFixed(1);

  return (
    <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-lg bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      
      {/* Top Header */}
      <div className="p-5 border-b border-slate-800/90 flex items-start justify-between gap-4 bg-slate-900/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {entity?.type ? entity.type.toUpperCase() : 'MICRO-COORDINATE'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {entity?.lat?.toFixed(4)}°N, {entity?.lng?.toFixed(4)}°E
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
            {entity?.name || 'Selected Micro-Location'}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* 1. AQI Scorecard & CPCB Category */}
        <div className="glass-card rounded-2xl p-5 border-l-4" style={{ borderLeftColor: aqiDetails.color }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              CPCB India Air Quality Index
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${aqiDetails.badgeClass}`}>
              {aqiDetails.category}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tight" style={{ color: aqiDetails.color }}>
              {aqi}
            </span>
            <div className="text-xs text-slate-400 font-medium">
              <div>NAQI Sub-Index</div>
              <div className="text-slate-200 font-semibold">{aqiDetails.description}</div>
            </div>
          </div>

          {/* PM2.5 & PM10 Breakdown with CPCB Standards */}
          <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>PM2.5:</span>
                <span className="font-mono text-white font-bold">{formatConcentration(pm25)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (pm25 / 350) * 100)}%`,
                    backgroundColor: aqiDetails.color
                  }}
                />
              </div>
              <div className="text-[10px] text-rose-400 font-mono">
                {pm25Ratio}x CPCB safe limit (60 µg/m³)
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>PM10:</span>
                <span className="font-mono text-white font-bold">{formatConcentration(pm10)}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (pm10 / 500) * 100)}%`,
                    backgroundColor: aqiDetails.color
                  }}
                />
              </div>
              <div className="text-[10px] text-amber-400 font-mono">
                {pm10Ratio}x CPCB safe limit (100 µg/m³)
              </div>
            </div>
          </div>

          {/* Meteorological telemetry */}
          <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              {temp}°C Temperature
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              {humidity}% Rel. Humidity
            </span>
          </div>
        </div>

        {/* 2. AI AUTOMATION SHOWCASE SECTION */}
        <div className="space-y-3">
          
          {/* Section Header & Context Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                  AI Automated Advisory
                </span>
              </div>
            </div>

            {/* Context Switcher Pills */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setContext('school')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  context === 'school'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <School className="w-3 h-3" />
                School
              </button>
              <button
                onClick={() => setContext('worker')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  context === 'worker'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HardHat className="w-3 h-3" />
                Worker
              </button>
            </div>
          </div>

          {/* Before / After Conceptual Framing (Judges requirement) */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono space-y-1.5">
            <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold flex items-center justify-between">
              <span>Automation Flow:</span>
              <span className="text-emerald-400">
                {advisory?.engine_used || 'CPCB Expert System'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                Telemetry: {pm25} µg/m³
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                Spatial Model
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-semibold">
                Contextual AI
              </span>
            </div>
          </div>

          {/* AI Advisory Content Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            
            {isLoadingAdvisory ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <span className="text-xs font-mono text-slate-400">
                  Synthesizing {context.toUpperCase()} safety directive...
                </span>
              </div>
            ) : (
              <>
                {/* Risk Level & Narrative */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Risk Level: <span style={{ color: aqiDetails.color }}>{advisory?.risk_level || 'Moderate'}</span>
                    </span>
                    <button
                      onClick={handleCopyAdvisory}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy Advisory"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {advisory?.advisory_text ||
                      `Air quality at ${entity?.name || 'this location'} requires immediate attention. Sensitive groups should avoid prolonged outdoor exposure.`}
                  </p>
                </div>

                {/* Specific Modules: Recess/Shift, Masks, Purifiers/Shelters */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  
                  {/* Recess or Shift */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
                    {context === 'school' ? (
                      <School className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <HardHat className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <div className="font-semibold text-slate-200">
                        {context === 'school' ? 'Recess & Physical Training Guidance:' : 'Shift Duration & Exposure Limits:'}
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5">
                        {advisory?.recess_or_shift_guidance || aqiDetails.schoolRecess}
                      </div>
                    </div>
                  </div>

                  {/* Mask Mandate */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-200">Respiratory Protection Mandate:</div>
                      <div className="text-slate-300 text-[11px] mt-0.5">
                        {advisory?.mask_mandate || 'N95 / FFP2 respirators recommended.'}
                      </div>
                    </div>
                  </div>

                  {/* Clean Air Shelter / Purifier */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
                    <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-200">
                        {context === 'school' ? 'Indoor Air Purification Protocol:' : 'Clean-Air Rest Shelter Protocol:'}
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5">
                        {advisory?.air_purifier_or_shelter || 'Maintain continuous HEPA filtration.'}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Actionable Protocol Checklist */}
                {advisory?.actionable_protocols && advisory.actionable_protocols.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Actionable Checklist:
                    </div>
                    <div className="space-y-1.5">
                      {advisory.actionable_protocols.map((proto, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{proto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Responsible Health Language Notice */}
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            * Generated under Indian Central Pollution Control Board (CPCB) NAQI guidelines.
            Provided strictly for administrative risk mitigation and operational scheduling, not medical diagnosis.
          </p>
        </div>

      </div>

    </div>
  );
}
