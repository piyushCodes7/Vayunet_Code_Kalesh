import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DELHI_CENTER, DEFAULT_ZOOM, MAP_TILES } from '../utils/constants';
import { getAqiDetails } from '../utils/aqiUtils';
import { School, HardHat, Cross, Layers, Radio, Sparkles } from 'lucide-react';

// Custom Marker Creators
function createCustomSensorIcon(aqi, color) {
  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${color}; opacity: 0.25; animation: ring-pulse 2.2s infinite;"></div>
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #ffffff; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
          <span style="font-size: 10px; font-weight: 800; font-family: sans-serif; color: ${color};">${aqi}</span>
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
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 8px; background: ${color}; opacity: 0.25;"></div>
        <div style="width: 28px; height: 28px; border-radius: 8px; background: #ffffff; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-size: 14px;">
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
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #0284c7; opacity: 0.3; animation: ring-pulse 1.8s infinite;"></div>
        <div style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(2,132,199,0.4); color: white; font-size: 13px;">
          📍
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
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
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      
      {/* Map Layer Controls (Top Right Floating) */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl p-3 flex flex-col gap-2 shadow-md">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pb-1.5 border-b border-slate-100">
          <Layers className="w-3.5 h-3.5 text-slate-600" />
          <span>Map Layers</span>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSensors}
            onChange={(e) => setShowSensors(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-0"
          />
          <Radio className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sensors ({sensors.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showSchools}
            onChange={(e) => setShowSchools(e.target.checked)}
            className="rounded border-slate-300 text-amber-600 focus:ring-0"
          />
          <School className="w-3.5 h-3.5 text-amber-600" />
          <span>Schools ({schools.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showWorkerZones}
            onChange={(e) => setShowWorkerZones(e.target.checked)}
            className="rounded border-slate-300 text-orange-600 focus:ring-0"
          />
          <HardHat className="w-3.5 h-3.5 text-orange-600" />
          <span>Worker Zones ({workerZones.length})</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showHospitals}
            onChange={(e) => setShowHospitals(e.target.checked)}
            className="rounded border-slate-300 text-rose-600 focus:ring-0"
          />
          <Cross className="w-3.5 h-3.5 text-rose-600" />
          <span>Hospitals ({hospitals.length})</span>
        </label>
      </div>

      {/* Floating Instructions Banner (Top Left) */}
      <div className="absolute top-4 left-14 z-[400] bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 pointer-events-auto">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <div className="text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Click any marker</span>
          <span> or </span>
          <span className="font-semibold text-blue-600">click anywhere on map</span>
          <span> to check street air quality</span>
        </div>
      </div>

      {/* Loading Indicator */}
      {isPredicting && (
        <div className="absolute inset-0 z-[500] bg-white/75 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-slate-200 shadow-xl">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs font-semibold text-slate-800">
              Checking street air quality...
            </div>
          </div>
        </div>
      )}

      {/* Actual Leaflet Map with OpenStreetMap */}
      <MapContainer
        center={DELHI_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          url={MAP_TILES.osm.url}
          attribution={MAP_TILES.osm.attribution}
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
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1">
                      <span>{sensor.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Sensor</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-500">AQI:</span>
                      <span className="font-extrabold text-sm" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px] text-slate-600 my-1">
                      <span>PM2.5: {sensor.latest_reading?.pm25 || '--'} µg/m³</span>
                      <span>PM10: {sensor.latest_reading?.pm10 || '--'} µg/m³</span>
                    </div>
                    <button
                      onClick={() => onSelectEntity({ ...sensor, entity_type: 'sensor' })}
                      className="w-full mt-2 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-sm"
                    >
                      View Details & Advice
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
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1">
                      <span>{school.name}</span>
                      <span className="text-[10px] text-amber-700 font-semibold">🏫 School</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-500">Air Quality:</span>
                      <span className="font-extrabold" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 my-1 font-medium">
                      ⚠️ Recess: {aqiDetails.schoolRecess}
                    </p>
                    <button
                      onClick={() => onSelectEntity({ ...school, entity_type: 'school' })}
                      className="w-full mt-2 py-1 px-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-colors shadow-sm"
                    >
                      View School Safety Plan
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
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1">
                      <span>{zone.name}</span>
                      <span className="text-[10px] text-orange-700 font-semibold">👷 Worker Hub</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-500">Air Quality:</span>
                      <span className="font-extrabold" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <p className="text-[11px] text-orange-800 my-1 font-medium">
                      ⏱️ Max Shift: {aqiDetails.workerExposure}
                    </p>
                    <button
                      onClick={() => onSelectEntity({ ...zone, entity_type: 'worker_zone' })}
                      className="w-full mt-2 py-1 px-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-[11px] transition-colors shadow-sm"
                    >
                      View Worker Safety Rules
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
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1">
                      <span>{hosp.name}</span>
                      <span className="text-[10px] text-rose-700 font-semibold">🏥 Hospital</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 my-1">
                      <span className="text-slate-500">Air Quality:</span>
                      <span className="font-extrabold" style={{ color: aqiDetails.color }}>
                        {aqi} ({aqiDetails.category})
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectEntity({ ...hosp, entity_type: 'hospital' })}
                      className="w-full mt-2 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors shadow-sm"
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
              <div className="text-xs">
                <div className="font-bold text-blue-800 flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1">
                  <span>📍 Selected Street Point</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-1">
                  {predictedPoint.lat.toFixed(4)}°N, {predictedPoint.lng.toFixed(4)}°E
                </div>
                <div className="flex items-center justify-between gap-2 my-1">
                  <span className="text-slate-600">Air Quality:</span>
                  <span className="font-extrabold text-sm" style={{ color: predictedPoint.color }}>
                    {predictedPoint.aqi} ({predictedPoint.category})
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 my-1">
                  PM2.5: {predictedPoint.predicted_pm25} µg/m³ · PM10: {predictedPoint.predicted_pm10} µg/m³
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Nearest station: {predictedPoint.nearest_sensor} ({predictedPoint.nearest_sensor_distance_km} km)
                </div>
              </div>
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
}

