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
    <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 text-slate-900">
      
      {/* Top Header */}
      <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {entity?.entity_type === 'street_corridor'
                ? 'STREET ROAD CORRIDOR'
                : entity?.entity_type === 'street_spot'
                ? 'STREET JUNCTION / SPOT'
                : entity?.type ? entity.type.toUpperCase() : 'LOCATION'}
            </span>
            {entity?.lat && entity?.lng && (
              <span className="text-xs text-slate-500 font-mono">
                {entity.lat.toFixed(4)}°N, {entity.lng.toFixed(4)}°E
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {entity?.name || 'Selected Location'}
          </h2>
          {entity?.street && (
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <span>📍</span>
              <span>{entity.street}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Street-to-Street Road Profile (when inspecting a street or junction) */}
        {(entity?.characteristic || entity?.pedestrianAdvice || entity?.driverAdvice || entity?.traffic || entity?.advice) && (
          <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🛣️</span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                  Street-to-Street Road Guide
                </span>
              </div>
              {entity?.traffic && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900">
                  {entity.traffic}
                </span>
              )}
            </div>

            {entity?.characteristic && (
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                {entity.characteristic}
              </p>
            )}

            <div className="grid grid-cols-1 gap-2 pt-0.5">
              {(entity?.pedestrianAdvice || entity?.advice) && (
                <div className="p-3 rounded-xl bg-white border border-blue-100 flex items-start gap-2.5 shadow-2xs">
                  <span className="text-base leading-none mt-0.5">🚶</span>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Pedestrian / Walking Advice:</div>
                    <div className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                      {entity.pedestrianAdvice || entity.advice}
                    </div>
                  </div>
                </div>
              )}

              {entity?.driverAdvice && (
                <div className="p-3 rounded-xl bg-white border border-blue-100 flex items-start gap-2.5 shadow-2xs">
                  <span className="text-base leading-none mt-0.5">🚗</span>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Driver / Vehicle Advice:</div>
                    <div className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                      {entity.driverAdvice}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 1. AQI Scorecard & CPCB Category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 shadow-sm" style={{ borderLeftColor: aqiDetails.color }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Air Quality Index (AQI)
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${aqiDetails.badgeClass}`}>
              {aqiDetails.category}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-5xl font-black tracking-tight" style={{ color: aqiDetails.color }}>
              {aqi}
            </span>
            <div className="text-xs text-slate-500">
              <div>CPCB Scale</div>
              <div className="text-slate-800 font-semibold">{aqiDetails.description}</div>
            </div>
          </div>

          {/* PM2.5 & PM10 Breakdown */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>PM2.5:</span>
                <span className="text-slate-900 font-bold">{formatConcentration(pm25)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (pm25 / 350) * 100)}%`,
                    backgroundColor: aqiDetails.color
                  }}
                />
              </div>
              <div className="text-[10px] text-rose-600 font-medium">
                {pm25Ratio}x safe limit (60 µg/m³)
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 flex items-center justify-between">
                <span>PM10:</span>
                <span className="text-slate-900 font-bold">{formatConcentration(pm10)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (pm10 / 500) * 100)}%`,
                    backgroundColor: aqiDetails.color
                  }}
                />
              </div>
              <div className="text-[10px] text-amber-600 font-medium">
                {pm10Ratio}x safe limit (100 µg/m³)
              </div>
            </div>
          </div>

          {/* Meteorological telemetry */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              {temp}°C Temperature
            </span>
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              {humidity}% Humidity
            </span>
          </div>
        </div>

        {/* 2. ADVISORY SECTION */}
        <div className="space-y-3">
          
          {/* Section Header & Context Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Safety Advisory
                </span>
              </div>
            </div>

            {/* Context Switcher Pills */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <button
                onClick={() => setContext('school')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  context === 'school'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-3 h-3 text-amber-600" />
                School
              </button>
              <button
                onClick={() => setContext('worker')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  context === 'worker'
                    ? 'bg-white text-orange-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HardHat className="w-3 h-3 text-orange-600" />
                Worker
              </button>
            </div>
          </div>

          {/* Advisory Content Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            {isLoadingAdvisory ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">
                  Loading safety advice for {context}...
                </span>
              </div>
            ) : (
              <>
                {/* Risk Level & Narrative */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Risk Level: <span style={{ color: aqiDetails.color }}>{advisory?.risk_level || 'Moderate'}</span>
                    </span>
                    <button
                      onClick={handleCopyAdvisory}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                      title="Copy Advisory"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    {advisory?.advisory_text ||
                      `Air quality at ${entity?.name || 'this location'} requires caution. Sensitive individuals should reduce prolonged outdoor exposure.`}
                  </p>
                </div>

                {/* Specific Modules */}
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  
                  {/* Recess or Shift */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    {context === 'school' ? (
                      <School className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <HardHat className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900">
                        {context === 'school' ? 'Recess & PE Guidance:' : 'Shift Duration Limit:'}
                      </div>
                      <div className="text-slate-700 text-[11px] mt-0.5">
                        {advisory?.recess_or_shift_guidance || aqiDetails.schoolRecess}
                      </div>
                    </div>
                  </div>

                  {/* Mask Mandate */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900">Mask Recommendation:</div>
                      <div className="text-slate-700 text-[11px] mt-0.5">
                        {advisory?.mask_mandate || 'N95 respirators recommended.'}
                      </div>
                    </div>
                  </div>

                  {/* Clean Air Shelter / Purifier */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <Radio className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-900">
                        {context === 'school' ? 'Air Purifier Setting:' : 'Rest Shelter:'}
                      </div>
                      <div className="text-slate-700 text-[11px] mt-0.5">
                        {advisory?.air_purifier_or_shelter || 'Maintain continuous HEPA filtration.'}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Actionable Protocol Checklist */}
                {advisory?.actionable_protocols && advisory.actionable_protocols.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Safety Checklist:
                    </div>
                    <div className="space-y-1.5">
                      {advisory.actionable_protocols.map((proto, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{proto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Simple Note */}
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            * Based on Indian CPCB standards. For administrative safety and scheduling guidance.
          </p>
        </div>

      </div>

    </div>
  );
}
