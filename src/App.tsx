import React, { useState, useEffect } from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { Navigation } from './components/Navigation';
import { AlgorithmModal } from './components/AlgorithmModal';
import { ModelArchitectureModal } from './components/ModelArchitectureModal';
import { LandingModal } from './components/LandingModal';

import { CommandCenterView } from './pages/CommandCenterView';
import { ActiveSystemsView } from './pages/ActiveSystemsView';
import { SatelliteAnalysisView } from './pages/SatelliteAnalysisView';
import { CycloneAnalysisView } from './pages/CycloneAnalysisView';
import { ForecastView } from './pages/ForecastView';
import { EnsembleUncertaintyView } from './pages/EnsembleUncertaintyView';
import { RapidIntensificationView } from './pages/RapidIntensificationView';
import { ImpactRiskView } from './pages/ImpactRiskView';
import { HistoricalReplayView } from './pages/HistoricalReplayView';
import { ModelValidationView } from './pages/ModelValidationView';
import { DataSourcesView } from './pages/DataSourcesView';
import { SystemStatusView } from './pages/SystemStatusView';
import { AlertCenterView } from './pages/AlertCenterView';

import { apiService } from './services/apiService';
import {
  CycloneSystem,
  SatelliteObservation,
  ProcessingPipelineStage,
  IntensityDistribution,
  RapidIntensificationFeatures,
  CoastalDistrict,
  AlertItem,
  ValidationMetric,
  FailureAnalysisCase,
  DataSourceStatus,
  SystemServiceHealth,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isLandingOpen, setIsLandingOpen] = useState<boolean>(false);

  // Loaded domain state
  const [cyclones, setCyclones] = useState<CycloneSystem[]>([]);
  const [selectedCyclone, setSelectedCyclone] = useState<CycloneSystem | null>(null);
  const [observation, setObservation] = useState<SatelliteObservation | null>(null);
  const [pipelineStages, setPipelineStages] = useState<ProcessingPipelineStage[]>([]);
  const [distribution, setDistribution] = useState<IntensityDistribution[]>([]);
  const [riData, setRiData] = useState<RapidIntensificationFeatures | null>(null);
  const [districts, setDistricts] = useState<CoastalDistrict[]>([]);
  const [landfallProbs, setLandfallProbs] = useState<any[]>([]);
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
      const primary = activeList[0];
      setSelectedCyclone(primary);

      const obs = await apiService.getSatelliteObservation(primary.id);
      setObservation(obs);

      const pipeline = await apiService.getProcessingPipeline();
      setPipelineStages(pipeline);

      const dist = await apiService.getIntensityDistribution();
      setDistribution(dist);

      const ri = await apiService.getRapidIntensificationFeatures();
      setRiData(ri);

      const distList = await apiService.getCoastalDistricts();
      setDistricts(distList);

      const probs = await apiService.getRegionalLandfallProbabilities();
      setLandfallProbs(probs);

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

  if (!selectedCyclone || !observation || !riData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-sans)', color: '#64748B' }}>
        <div>INITIALIZING CIFS OPERATIONAL WORKSPACE...</div>
        <div className="font-mono text-muted" style={{ fontSize: '11px', marginTop: '6px' }}>
          Loading MOSDAC Ingestion and WeatherNext Ensemble Buffers...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Global Institutional Header with Telemetry & Status Strip */}
      <GlobalHeader
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsLandingOpen(true)}
      />

      {/* Primary Sub-Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
      />

      {/* Main Tab View Routing */}
      <main className="main-content-area">
        {activeTab === 'command_center' && (
          <CommandCenterView
            cyclones={cyclones}
            selectedCyclone={selectedCyclone}
            onSelectCyclone={setSelectedCyclone}
            districts={districts}
            alerts={alerts}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
            onOpenArchitectureModal={() => setIsArchitectureOpen(true)}
            onSelectDistrict={(d) => {
              setActiveTab('impact_risk');
            }}
          />
        )}

        {activeTab === 'active_systems' && (
          <ActiveSystemsView
            cyclones={cyclones}
            selectedCyclone={selectedCyclone}
            onSelectCyclone={setSelectedCyclone}
            onNavigateToForecast={() => setActiveTab('forecast')}
            onNavigateToSatellite={() => setActiveTab('satellite_analysis')}
          />
        )}

        {activeTab === 'satellite_analysis' && (
          <SatelliteAnalysisView
            cyclone={selectedCyclone}
            observation={observation}
            pipelineStages={pipelineStages}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'cyclone_analysis' && (
          <CycloneAnalysisView
            cyclone={selectedCyclone}
            distribution={distribution}
            onOpenArchitectureModal={() => setIsArchitectureOpen(true)}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastView
            cyclone={selectedCyclone}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'ensemble_uncertainty' && (
          <EnsembleUncertaintyView
            cyclone={selectedCyclone}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'rapid_intensification' && (
          <RapidIntensificationView
            cyclone={selectedCyclone}
            riData={riData}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'impact_risk' && (
          <ImpactRiskView
            cyclone={selectedCyclone}
            districts={districts}
            landfallProbabilities={landfallProbs}
            onOpenTransparencyModal={() => setIsTransparencyOpen(true)}
          />
        )}

        {activeTab === 'historical_replay' && <HistoricalReplayView />}

        {activeTab === 'model_validation' && (
          <ModelValidationView
            metrics={metrics}
            failures={failures}
            onOpenArchitectureModal={() => setIsArchitectureOpen(true)}
          />
        )}

        {activeTab === 'data_sources' && <DataSourcesView sources={sources} />}

        {activeTab === 'system_status' && <SystemStatusView services={services} />}

        {activeTab === 'alerts' && <AlertCenterView alerts={alerts} />}
      </main>

      {/* Global Transparency Explainability Modal */}
      <AlgorithmModal
        isOpen={isTransparencyOpen}
        onClose={() => setIsTransparencyOpen(false)}
      />

      {/* Model Architecture & Specification Modal */}
      <ModelArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Landing / Login Dialog (can be opened or closed) */}
      <LandingModal
        isOpen={isLandingOpen}
        onEnterDemo={() => setIsLandingOpen(false)}
        onSignIn={() => setIsLandingOpen(false)}
      />
    </div>
  );
}

export default App;
