import React, { useState, useEffect } from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { CyclonesView } from './pages/CyclonesView';
import { ImpactRiskView } from './pages/ImpactRiskView';
import { AlertCenterView } from './pages/AlertCenterView';
import { MethodologyModal } from './components/MethodologyModal';
import { RapidIntensificationModal } from './components/RapidIntensificationModal';
import { LandingModal } from './components/LandingModal';

import { apiService } from './services/apiService';
import {
  CycloneSystem,
  SatelliteObservation,
  RapidIntensificationFeatures,
  CoastalDistrict,
  AlertItem,
  ValidationMetric,
  FailureAnalysisCase,
  DataSourceStatus,
  SystemServiceHealth,
} from './types';

export function App() {
  // Primary product navigation: 'cyclones' (default) | 'post_landfall' | 'alerts'
  const [activeTab, setActiveTab] = useState<string>('cyclones');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Modals state
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [isRiModalOpen, setIsRiModalOpen] = useState<boolean>(false);
  const [isLandingOpen, setIsLandingOpen] = useState<boolean>(false);

  // Domain state
  const [cyclones, setCyclones] = useState<CycloneSystem[]>([]);
  const [selectedCyclone, setSelectedCyclone] = useState<CycloneSystem | null>(null);
  const [observation, setObservation] = useState<SatelliteObservation | null>(null);
  const [riData, setRiData] = useState<RapidIntensificationFeatures | null>(null);
  const [districts, setDistricts] = useState<CoastalDistrict[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [metrics, setMetrics] = useState<ValidationMetric[]>([]);
  const [failures, setFailures] = useState<FailureAnalysisCase[]>([]);
  const [sources, setSources] = useState<DataSourceStatus[]>([]);
  const [services, setServices] = useState<SystemServiceHealth[]>([]);

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      const activeList = await apiService.getActiveCyclones();
      setCyclones(activeList);
      const primary = activeList[0] || null;
      setSelectedCyclone(primary);

      if (primary) {
        const obs = await apiService.getSatelliteObservation(primary.id);
        setObservation(obs);
      }

      const ri = await apiService.getRapidIntensificationFeatures();
      setRiData(ri);

      const distList = await apiService.getCoastalDistricts();
      setDistricts(distList);

      const alertList = await apiService.getOperationalAlerts();
      setAlerts(alertList);

      const valMetrics = await apiService.getValidationMetrics();
      setMetrics(valMetrics);

      const failureCases = await apiService.getFailureAnalysisCases();
      setFailures(failureCases);

      const srcList = await apiService.getDataSources();
      setSources(srcList);

      const svcList = await apiService.getSystemServices();
      setServices(svcList);
    }

    loadData();
  }, []);

  // Update observation when cyclone selection changes
  const handleSelectCyclone = async (sys: CycloneSystem) => {
    setSelectedCyclone(sys);
    const obs = await apiService.getSatelliteObservation(sys.id);
    setObservation(obs);
  };

  // Cross-navigation from Alerts to Cyclones
  const handleNavigateFromAlert = (cycloneId: string) => {
    const target = cyclones.find((c) => c.id === cycloneId);
    if (target) {
      handleSelectCyclone(target);
    }
    setActiveTab('cyclones');
  };

  if (!selectedCyclone || !riData) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#64748B' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
          INITIALIZING CIFS DECISION SUPPORT WORKSPACE...
        </div>
        <div className="font-mono text-muted" style={{ fontSize: '11px', marginTop: '6px' }}>
          Loading INSAT Observations &bull; North Indian Ocean Basin Data
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Institutional Global Header with 3 Core Tabs & Demo Mode */}
      <GlobalHeader
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsLandingOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Experience Routing */}
      <main className="main-content-area" style={{ padding: activeTab === 'cyclones' ? 0 : '14px 16px' }}>
        {/* 1. CYCLONES (Primary Map-First Experience) */}
        {activeTab === 'cyclones' && (
          <CyclonesView
            cyclones={cyclones}
            selectedCyclone={selectedCyclone}
            onSelectCyclone={handleSelectCyclone}
            observation={observation}
            riData={riData}
            districts={districts}
            onOpenRiModal={() => setIsRiModalOpen(true)}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {/* 2. POST-LANDFALL (Impact & District Risk) */}
        {activeTab === 'post_landfall' && (
          <ImpactRiskView
            cyclone={selectedCyclone}
            districts={districts}
            onOpenMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {/* 3. ALERTS (Analytical Signals) */}
        {activeTab === 'alerts' && (
          <AlertCenterView
            alerts={alerts}
            onSelectCyclone={handleNavigateFromAlert}
          />
        )}
      </main>

      {/* Methodology & Technical Depth Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        sources={sources}
        metrics={metrics}
        failures={failures}
        services={services}
      />

      {/* Rapid Intensification Deep-Dive Modal */}
      <RapidIntensificationModal
        isOpen={isRiModalOpen}
        onClose={() => setIsRiModalOpen(false)}
        cyclone={selectedCyclone}
        riData={riData}
      />

      {/* Demo Mode / Simulation Dialog */}
      <LandingModal
        isOpen={isLandingOpen}
        onEnterDemo={() => setIsLandingOpen(false)}
        onSignIn={() => setIsLandingOpen(false)}
      />
    </div>
  );
}

export default App;
