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
} from '../types';

import {
  ACTIVE_CYCLONES,
  SATELLITE_OBSERVATION,
  PROCESSING_PIPELINE,
  INTENSITY_DISTRIBUTION,
  RAPID_INTENSIFICATION_DATA,
  COASTAL_DISTRICTS,
  REGIONAL_LANDFALL_PROBABILITIES,
  HISTORICAL_REPLAY_DATA,
  VALIDATION_METRICS,
  FAILURE_ANALYSIS_CASES,
  DATA_SOURCES,
  SYSTEM_SERVICES,
  OPERATIONAL_ALERTS,
} from '../data/mockCycloneData';

class CifsApiService {
  private isDemoMode: boolean = true;

  public setDemoMode(val: boolean) {
    this.isDemoMode = val;
  }

  public getDemoMode(): boolean {
    return this.isDemoMode;
  }

  public async getActiveCyclones(): Promise<CycloneSystem[]> {
    // Returns deterministic realistic cyclones
    return Promise.resolve([...ACTIVE_CYCLONES]);
  }

  public async getCycloneById(id: string): Promise<CycloneSystem | undefined> {
    const list = await this.getActiveCyclones();
    return list.find((c) => c.id === id) || list[0];
  }

  public async getSatelliteObservation(cycloneId: string): Promise<SatelliteObservation> {
    return Promise.resolve({ ...SATELLITE_OBSERVATION, cycloneId });
  }

  public async getProcessingPipeline(): Promise<ProcessingPipelineStage[]> {
    return Promise.resolve([...PROCESSING_PIPELINE]);
  }

  public async getIntensityDistribution(): Promise<IntensityDistribution[]> {
    return Promise.resolve([...INTENSITY_DISTRIBUTION]);
  }

  public async getRapidIntensificationFeatures(): Promise<RapidIntensificationFeatures> {
    return Promise.resolve({ ...RAPID_INTENSIFICATION_DATA });
  }

  public async getCoastalDistricts(): Promise<CoastalDistrict[]> {
    return Promise.resolve([...COASTAL_DISTRICTS]);
  }

  public async getRegionalLandfallProbabilities() {
    return Promise.resolve([...REGIONAL_LANDFALL_PROBABILITIES]);
  }

  public async getHistoricalReplay() {
    return Promise.resolve({ ...HISTORICAL_REPLAY_DATA });
  }

  public async getValidationMetrics(): Promise<ValidationMetric[]> {
    return Promise.resolve([...VALIDATION_METRICS]);
  }

  public async getFailureAnalysisCases(): Promise<FailureAnalysisCase[]> {
    return Promise.resolve([...FAILURE_ANALYSIS_CASES]);
  }

  public async getDataSources(): Promise<DataSourceStatus[]> {
    return Promise.resolve([...DATA_SOURCES]);
  }

  public async getSystemServices(): Promise<SystemServiceHealth[]> {
    return Promise.resolve([...SYSTEM_SERVICES]);
  }

  public async getOperationalAlerts(): Promise<AlertItem[]> {
    return Promise.resolve([...OPERATIONAL_ALERTS]);
  }
}

export const apiService = new CifsApiService();
