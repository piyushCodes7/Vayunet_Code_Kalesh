import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import StatCards from './components/StatCards';
import MapView from './components/MapView';
import AqiLegend from './components/AqiLegend';
import DetailSidePanel from './components/DetailSidePanel';
import SchoolSafetyDashboard from './components/SchoolSafetyDashboard';
import OutdoorWorkerDashboard from './components/OutdoorWorkerDashboard';
import AiAutomationExplainer from './components/AiAutomationExplainer';
import SimpleCitizenView from './components/SimpleCitizenView';
import DockerStatusModal from './components/DockerStatusModal';

import { fetchMapData, fetchHealth, predictCoordinates, triggerRealtimeTick } from './services/api';
import { TABS } from './utils/constants';

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.CITIZEN);
  const [mapData, setMapData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [predictedPoint, setPredictedPoint] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isDockerModalOpen, setIsDockerModalOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Load Map & Telemetry Data
  const loadData = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    try {
      const [mapRes, healthRes] = await Promise.all([
        fetchMapData().catch((err) => {
          console.warn('Map data fetch failed, using fallback:', err);
          return null;
        }),
        fetchHealth().catch(() => null),
      ]);

      if (mapRes) {
        setMapData(mapRes);
      }
      if (healthRes) {
        setHealthData(healthRes);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
      if (showRefreshSpinner) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-Time Live Streaming Effect (polls every 10 seconds from Open-Meteo + Sensors)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(async () => {
      try {
        await triggerRealtimeTick();
        const updated = await fetchMapData();
        if (updated) {
          setMapData(updated);
        }
      } catch (err) {
        console.warn('Live telemetry stream tick error:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);


  // Handle Map Click to Predict arbitrary coordinates
  const handleMapClick = async (lat, lng) => {
    setIsPredicting(true);
    try {
      const res = await predictCoordinates(lat, lng);
      const point = {
        name: `Street Coordinate (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E)`,
        type: 'street_coordinate',
        lat: res.lat,
        lng: res.lng,
        predicted_pm25: res.predicted_pm25,
        predicted_pm10: res.predicted_pm10,
        aqi: res.aqi,
        category: res.category,
        color: res.color,
        risk_level: res.risk_level,
        temperature: res.temperature,
        humidity: res.humidity,
        nearest_sensor: res.nearest_sensor,
        nearest_sensor_distance_km: res.nearest_sensor_distance_km,
        timestamp: res.timestamp,
        entity_type: 'custom_prediction',
      };
      setPredictedPoint(point);
      setSelectedEntity(point);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        healthData={healthData}
        onOpenDockerModal={() => setIsDockerModalOpen(true)}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStreaming={() => setIsLiveStreaming((prev) => !prev)}
      />



      {/* Pro Hero Banner & Stat Cards (Visible in Map & Specialized Modes) */}
      {activeTab !== TABS.CITIZEN && (
        <>
          <HeroBanner
            onSelectSchoolTab={() => setActiveTab(TABS.SCHOOL)}
            onSelectWorkerTab={() => setActiveTab(TABS.WORKER)}
          />
          <StatCards
            summary={mapData?.summary}
            schools={mapData?.schools || []}
            workerZones={mapData?.worker_zones || []}
          />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 space-y-4">
        
        {/* Tab 0: SIMPLE CITIZEN VIEW (Clean, minimalist UI for unskilled/everyday people) */}
        {activeTab === TABS.CITIZEN && (
          <SimpleCitizenView onExploreMap={() => setActiveTab(TABS.OVERVIEW)} />
        )}


        {/* Tab 1: OVERVIEW & MAP */}
        {activeTab === TABS.OVERVIEW && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-4">
            <AqiLegend />
            <MapView
              sensors={mapData?.sensors || []}
              schools={mapData?.schools || []}
              workerZones={mapData?.worker_zones || []}
              hospitals={mapData?.hospitals || []}
              selectedEntity={selectedEntity}
              predictedPoint={predictedPoint}
              onSelectEntity={(ent) => setSelectedEntity(ent)}
              onPredictClick={handleMapClick}
              isPredicting={isPredicting}
            />
          </div>
        )}

        {/* Tab 2: SCHOOL SAFETY MODE */}
        {activeTab === TABS.SCHOOL && (
          <SchoolSafetyDashboard
            schools={mapData?.schools || []}
            onSelectSchool={(school) => setSelectedEntity(school)}
          />
        )}

        {/* Tab 3: OUTDOOR WORKER MODE */}
        {activeTab === TABS.WORKER && (
          <OutdoorWorkerDashboard
            workerZones={mapData?.worker_zones || []}
            onSelectWorkerZone={(zone) => setSelectedEntity(zone)}
          />
        )}

        {/* Tab 4: AI PIPELINE EXPLAINER */}
        {activeTab === TABS.EXPLAINER && <AiAutomationExplainer />}

      </main>

      {/* Slide-out Detail Side Panel */}
      {selectedEntity && (
        <DetailSidePanel
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          defaultContext={activeTab === TABS.WORKER ? 'worker' : 'school'}
        />
      )}

      {/* Docker Architecture & Deployment Modal */}
      <DockerStatusModal
        isOpen={isDockerModalOpen}
        onClose={() => setIsDockerModalOpen(false)}
        healthData={healthData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-6 text-center text-xs text-slate-500 font-mono">

        <p>
          VayuNet Air Quality Micro-Mapping · Code Kalam 2026 Envelope No. 76 · Indian CPCB NAQI Standards
        </p>
      </footer>
    </div>
  );
}
