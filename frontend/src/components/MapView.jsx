import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DELHI_CENTER, DEFAULT_ZOOM, MAP_TILES } from '../utils/constants';
import { getAqiDetails } from '../utils/aqiUtils';
import { School, HardHat, Cross, MapPin, Layers, Radio, Sparkles } from 'lucide-react';

// Custom Marker Creators
function createCustomSensorIcon(aqi, color) {
  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ring-pulse 2.2s infinite;"></div>
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <span style="font-size: 10px; font-weight: 800; font-family: monospace; color: ${color};">${aqi}</span>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function createLocationIcon(type, aqi, color) {
  let iconSvg = '';
  if (type === 'school') {
    iconSvg = '🏫';
  } else if (type === 'worker_zone') {
    iconSvg = '👷';
  } else if (type === 'hospital') {
    iconSvg = '🏥';
  } else {
    iconSvg = '📍';
  }

  return L.divIcon({
    className: 'custom-loc-icon',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.4; filter: blur(2px);"></div>
        <div style="width: 28px; height: 28px; border-radius: 8px; background: #090d16; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.6); font-size: 14px;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function createPredictPinIcon() {
  return L.divIcon({
    className: 'custom-predict-icon',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #06b6d4; opacity: 0.5; animation: ring-pulse 1.8s infinite;"></div>
        <div style="width: 30px; height: 30px; border-radius: 50%; background: #0891b2; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(6,182,212,0.6); color: white;">
          ⚡
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

// Map Click Listener Component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({
  sensors = [],
  schools = [],
  workerZones = [],
  hospitals = [],
  selectedEntity = null,
  predictedPoint = null,
  onSelectEntity,
  onPredictClick,
  isPredicting = false,
}) {
  const [showSensors, setShowSensors] = useState(true);
  const [showSchools, setShowSchools] = useState(true);
  const [showWorkerZones, setShowWorkerZones] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      
      {/* Map Layer Controls (Top Right Floating) */}
      <div className="absolute top-4 right-4 z-[400] glass-panel rounded-xl p-2.5 flex flex-col gap-2 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 pb-1.5 border-b border-slate-700/60 font-mono">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>LAYER CONTROLS</span>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSensors}
            onChange={(e) => setShowSensors(e.target.checked)}
            className="rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-800"
          />
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sensors ({sensors.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSchools}
            onChange={(e) => setShowSchools(e.target.checked)}
            className="rounded border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 bg-slate-800"
          />
          <School className="w-3.5 h-3.5 text-amber-400" />
          <span>Schools ({schools.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showWorkerZones}
            onChange={(e) => setShowWorkerZones(e.target.checked)}
            className="rounded border-slate-700 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-slate-800"
          />
          <HardHat className="w-3.5 h-3.5 text-orange-400" />
          <span>Worker Zones ({workerZones.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showHospitals}
            onChange={(e) => setShowHospitals(e.target.checked)}
            className="rounded border-slate-700 text-red-500 focus:ring-0 focus:ring-offset-0 bg-slate-800"
          />
          <Cross className="w-3.5 h-3.5 text-red-400" />
          <span>Hospitals ({hospitals.length})</span>
        </label>
      </div>

      {/* Floating Instructions Banner (Top Left) */}
      <div className="absolute top-4 left-14 z-[400] glass-panel rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5 pointer-events-auto">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <div className="text-xs">
          <span className="font-semibold text-white">Click any location</span>
          <span className="text-slate-400"> or </span>
          <span className="text-cyan-300 font-semibold underline decoration-cyan-400/50">click anywhere on map</span>
          <span className="text-slate-400"> for street-level ML micro-prediction</span>
        </div>
      </div>

      {/* Loading Indicator for ML Prediction */}
      {isPredicting && (
        <div className="absolute inset-0 z-[500] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
          <div className="glass-panel px-5 py-3.5 rounded-2xl flex items-center gap-3 border border-cyan-500/40 shadow-2xl">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <div className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Interpolating Coordinates...
              </div>
              <div className="text-[11px] text-cyan-300 font-mono">
                Executing scikit-learn Spatial Model
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actual Leaflet Map */}
      <MapContainer
        center={DELHI_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url={MAP_TILES.dark.url}
          attribution={MAP_TILES.dark.attribution}
        />

        <MapClickHandler onMapClick={onPredictClick} />

        {/* 1. SENSORS */}
        {showSensors &&
          sensors.map((sensor) => {
            const aqi = sensor.aqi || 220;
            const aqiDetails = getAqiDetails(aqi);
            const icon = createCustomSensorIcon(aqi, aqiDetails.color);

            return (
              <Marker
                key={`sensor-${sensor.id}`}
                position={[sensor.lat, sensor.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectEntity({ ...sensor, entity_type: 'sensor' }),
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <div className="font-bold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1 mb-1">
                      <span>{sensor.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Sensor</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-400">CPCB AQI:</span>
                      <span className="font-extrabold font-mono" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px] text-slate-300">
                      <span>PM2.5: {sensor.latest_reading?.pm25 || '--'} µg/m³</span>
                      <span>PM10: {sensor.latest_reading?.pm10 || '--'} µg/m³</span>
                    </div>
                    <button
                      onClick={() => onSelectEntity({ ...sensor, entity_type: 'sensor' })}
                      className="w-full mt-2 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors"
                    >
                      View Telemetry & Advisory
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 2. SCHOOLS */}
        {showSchools &&
          schools.map((school) => {
            const aqi = school.latest_prediction?.aqi || 230;
            const aqiDetails = getAqiDetails(aqi);
            const icon = createLocationIcon('school', aqi, aqiDetails.color);

            return (
              <Marker
                key={`school-${school.id}`}
                position={[school.lat, school.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectEntity({ ...school, entity_type: 'school' }),
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <div className="font-bold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1 mb-1">
                      <span>{school.name}</span>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">🏫 School</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-400">Micro-AQI:</span>
                      <span className="font-extrabold font-mono" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-300/90 my-1 font-medium">
                      ⚠️ Recess: {aqiDetails.schoolRecess}
                    </p>
                    <button
                      onClick={() => onSelectEntity({ ...school, entity_type: 'school' })}
                      className="w-full mt-2 py-1 px-2 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] transition-colors"
                    >
                      Open School Safety Advisory
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 3. WORKER ZONES */}
        {showWorkerZones &&
          workerZones.map((zone) => {
            const aqi = zone.latest_prediction?.aqi || 280;
            const aqiDetails = getAqiDetails(aqi);
            const icon = createLocationIcon('worker_zone', aqi, aqiDetails.color);

            return (
              <Marker
                key={`worker-${zone.id}`}
                position={[zone.lat, zone.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectEntity({ ...zone, entity_type: 'worker_zone' }),
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <div className="font-bold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1 mb-1">
                      <span>{zone.name}</span>
                      <span className="text-[10px] font-mono text-orange-400 uppercase">👷 Worker Hub</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-400">Micro-AQI:</span>
                      <span className="font-extrabold font-mono" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <p className="text-[11px] text-orange-300/90 my-1 font-medium">
                      ⏱️ Max Exposure: {aqiDetails.workerExposure}
                    </p>
                    <button
                      onClick={() => onSelectEntity({ ...zone, entity_type: 'worker_zone' })}
                      className="w-full mt-2 py-1 px-2 rounded bg-orange-600 hover:bg-orange-500 text-white font-medium text-[11px] transition-colors"
                    >
                      Audit Labor Protocol
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 4. HOSPITALS */}
        {showHospitals &&
          hospitals.map((hosp) => {
            const aqi = hosp.latest_prediction?.aqi || 210;
            const aqiDetails = getAqiDetails(aqi);
            const icon = createLocationIcon('hospital', aqi, aqiDetails.color);

            return (
              <Marker
                key={`hosp-${hosp.id}`}
                position={[hosp.lat, hosp.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectEntity({ ...hosp, entity_type: 'hospital' }),
                }}
              >
                <Popup>
                  <div className="text-xs font-sans">
                    <div className="font-bold text-slate-100 flex items-center justify-between gap-2 border-b border-slate-700/80 pb-1 mb-1">
                      <span>{hosp.name}</span>
                      <span className="text-[10px] font-mono text-red-400 uppercase">🏥 Hospital</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-400">Micro-AQI:</span>
                      <span className="font-extrabold font-mono" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectEntity({ ...hosp, entity_type: 'hospital' })}
                      className="w-full mt-2 py-1 px-2 rounded bg-red-600 hover:bg-red-500 text-white font-medium text-[11px] transition-colors"
                    >
                      View Hospital Air Quality
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 5. CUSTOM PREDICTED POINT PIN */}
        {predictedPoint && (
          <Marker
            position={[predictedPoint.lat, predictedPoint.lng]}
            icon={createPredictPinIcon()}
          >
            <Popup>
              <div className="text-xs font-sans">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5 border-b border-slate-700/80 pb-1 mb-1">
                  <span>⚡ ML Street Micro-Prediction</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mb-1">
                  {predictedPoint.lat.toFixed(4)}°N, {predictedPoint.lng.toFixed(4)}°E
                </div>
                <div className="flex items-center justify-between gap-2 my-1">
                  <span className="text-slate-300">Predicted AQI:</span>
                  <span className="font-extrabold font-mono" style={{ color: predictedPoint.color }}>
                    {predictedPoint.aqi} ({predictedPoint.category})
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 my-1">
                  PM2.5: {predictedPoint.predicted_pm25} µg/m³ · PM10: {predictedPoint.predicted_pm10} µg/m³
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Interpolated from: {predictedPoint.nearest_sensor} ({predictedPoint.nearest_sensor_distance_km} km)
                </div>
              </div>
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
}
