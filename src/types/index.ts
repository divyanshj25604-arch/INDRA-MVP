export type CycloneIntensityCategory =
  | 'Depression'
  | 'Deep Depression'
  | 'Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Very Severe Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Super Cyclonic Storm';

export type BasinType = 'Bay of Bengal' | 'Arabian Sea' | 'North Indian Ocean';

export interface CycloneTrackPoint {
  time: string;
  hourOffset: number; // e.g. -24, -12, 0, 6, 12, 24, 48, 72, 120
  lat: number;
  lng: number;
  windKmh: number;
  windKnots: number;
  pressureHpa: number;
  category: CycloneIntensityCategory;
  type: 'historical' | 'observed' | 'forecast' | 'kalman_smoothed';
  uncertaintyRadiusKm?: number; // Cone radius
}

export interface EnsembleTrajectory {
  memberId: number;
  model: 'WeatherNext-ENS' | 'WeatherNext-PERT';
  points: {
    hour: number;
    lat: number;
    lng: number;
    windKmh: number;
  }[];
}

export interface CycloneSystem {
  id: string;
  name: string;
  basin: BasinType;
  classification: CycloneIntensityCategory;
  currentLat: number;
  currentLng: number;
  maxWindKmh: number;
  maxWindKnots: number;
  centralPressureHpa: number;
  movementDirection: string;
  movementSpeedKmh: number;
  trend: 'INTENSIFYING' | 'STEADY' | 'WEAKENING' | 'RAPID INTENSIFICATION';
  confidencePercent: number;
  eyeDetected: boolean;
  eyeRadiusKm?: number;
  structure: 'HIGHLY ORGANIZED' | 'MODERATELY ORGANIZED' | 'DISORGANIZED' | 'PINHOLE EYE';
  lastObservedTime: string;
  forecastInitTime: string;
  historicalTrack: CycloneTrackPoint[];
  forecastTrack: CycloneTrackPoint[];
  kalmanTrack?: CycloneTrackPoint[];
  ensembleTrajectories: EnsembleTrajectory[];
  windRadii: {
    galeWindKm: number; // 63 km/h
    stormWindKm: number; // 89 km/h
    hurricaneWindKm: number; // 119 km/h
  };
}

export interface SatelliteObservation {
  cycloneId: string;
  timestamp: string;
  satellite: 'INSAT-3D' | 'INSAT-3DR';
  channel: 'Infrared (TIR-1)' | 'Water Vapor (WV)' | 'Visible (VIS)' | 'Enhanced IR (BD)';
  centerLat: number;
  centerLng: number;
  confidence: number;
  eyeOrganizationPercent: number;
  cloudSymmetryPercent: number;
  bandingPercent: number;
  centralDenseOvercast: 'HIGH' | 'MODERATE' | 'LOW';
  organizationTrend: 'IMPROVING' | 'STABLE' | 'DEGRADED';
  aiInterpretation: string;
  rawResolution: string;
  sectorBounds: [number, number, number, number]; // [south, west, north, east]
}

export interface ProcessingPipelineStage {
  id: number;
  name: string;
  description: string;
  modelOrMethod: string;
  latencyMs: number;
  status: 'COMPLETE' | 'PROCESSING' | 'STANDBY';
  outputArtifact: string;
  inputShape: string;
}

export interface IntensityDistribution {
  category: CycloneIntensityCategory;
  probability: number;
}

export interface RapidIntensificationFeatures {
  currentRisk: 'HIGH' | 'MODERATE' | 'LOW';
  operationalThresholdDef: string;
  windChange6hKmh: number;
  pressureChange12hHpa: number;
  cloudOrganization: string;
  seaSurfaceTemperatureC: number;
  sstAnomalyC: number;
  verticalWindShearKnots: number;
  weatherNextTrend: string;
  satelliteStructureTrend: string;
  riSignal: 'HIGH' | 'ELEVATED' | 'NOMINAL';
  probRi24h: number;
}

export interface CoastalDistrict {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  distanceToCenterKm: number;
  maxForecastWindKmh: number;
  forecastRainfall24hMm: number;
  landfallProbabilityPercent: number;
  populationExposure: string;
  infrastructureLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  vulnerabilityScore: number; // 1 - 10
  hazardScore: number; // 1 - 10
  compositeRisk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  timeToImpactHours: number;
  keyFacilities: string[];
  reasonsForRisk: string[];
}

export interface AlertItem {
  id: string;
  timestamp: string;
  cycloneId: string;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH' | 'INFO';
  title: string;
  message: string;
  source: 'Ensemble Analysis' | 'Satellite Vision Head' | 'WeatherNext Engine' | 'GIS Exposure Engine';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  confidenceNote: string;
}

export interface ValidationMetric {
  horizonHours: number;
  matePersistenceKm: number;
  mateKalmanKm: number;
  mateWeatherNextKm: number;
  mateCifsCalibratedKm: number;
  windMaeKmh: number;
  pressureMaeHpa: number;
  coverage80Pct: number;
}

export interface FailureAnalysisCase {
  phenomenon: string;
  severity: 'HIGH' | 'MEDIUM';
  observedFailure: string;
  expectedBehavior: string;
  potentialMitigation: string;
}

export interface DataSourceStatus {
  name: string;
  provider: string;
  purpose: string;
  status: 'OPERATIONAL' | 'AVAILABLE (DEMO)' | 'SIMULATION DATA' | 'STANDBY';
  latency: string;
  lastUpdated: string;
  license: string;
  dataFormat: string;
}

export interface SystemServiceHealth {
  service: string;
  subsystem: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'STANDBY';
  latencyMs: number;
  lastHeartbeat: string;
  errorRatePercent: number;
  modelVersion: string;
}
