import React from 'react';
import { Flame, AlertTriangle, Wind, Gauge, Droplets, Compass, Thermometer } from 'lucide-react';
import { CycloneSystem, RapidIntensificationFeatures } from '../types';
import { TimeSeriesChart } from '../components/TimeSeriesChart';

interface RapidIntensificationViewProps {
  cyclone: CycloneSystem;
  riData: RapidIntensificationFeatures;
  onOpenTransparencyModal: () => void;
}

export const RapidIntensificationView: React.FC<RapidIntensificationViewProps> = ({
  cyclone,
  riData,
  onOpenTransparencyModal,
}) => {
  // Build Wind Speed Time Series Data Points
  const windSeriesData = [
    { timeLabel: '-48h', hourOffset: -48, observed: 50, ensembleMin: 48, ensembleMax: 54 },
    { timeLabel: '-36h', hourOffset: -36, observed: 62, ensembleMin: 58, ensembleMax: 65 },
    { timeLabel: '-24h', hourOffset: -24, observed: 85, ensembleMin: 80, ensembleMax: 88 },
    { timeLabel: '-12h', hourOffset: -12, observed: 100, ensembleMin: 95, ensembleMax: 105 },
    { timeLabel: 'T=0 (Now)', hourOffset: 0, observed: 118, forecast: 118, ensembleMin: 112, ensembleMax: 124 },
    { timeLabel: '+6h', hourOffset: 6, forecast: 126, ensembleMin: 118, ensembleMax: 135 },
    { timeLabel: '+12h', hourOffset: 12, forecast: 135, ensembleMin: 124, ensembleMax: 148 },
    { timeLabel: '+24h', hourOffset: 24, forecast: 150, ensembleMin: 132, ensembleMax: 165 },
    { timeLabel: '+48h', hourOffset: 48, forecast: 95, ensembleMin: 80, ensembleMax: 115 },
    { timeLabel: '+72h', hourOffset: 72, forecast: 60, ensembleMin: 45, ensembleMax: 78 },
  ];

  // Build Central Pressure Time Series Data Points
  const pressureSeriesData = [
    { timeLabel: '-48h', hourOffset: -48, observed: 1000, ensembleMin: 998, ensembleMax: 1002 },
    { timeLabel: '-36h', hourOffset: -36, observed: 994, ensembleMin: 992, ensembleMax: 996 },
    { timeLabel: '-24h', hourOffset: -24, observed: 988, ensembleMin: 985, ensembleMax: 991 },
    { timeLabel: '-12h', hourOffset: -12, observed: 978, ensembleMin: 975, ensembleMax: 982 },
    { timeLabel: 'T=0 (Now)', hourOffset: 0, observed: 965, forecast: 965, ensembleMin: 962, ensembleMax: 968 },
    { timeLabel: '+6h', hourOffset: 6, forecast: 958, ensembleMin: 952, ensembleMax: 964 },
    { timeLabel: '+12h', hourOffset: 12, forecast: 952, ensembleMin: 944, ensembleMax: 960 },
    { timeLabel: '+24h', hourOffset: 24, forecast: 944, ensembleMin: 934, ensembleMax: 954 },
    { timeLabel: '+48h', hourOffset: 48, forecast: 980, ensembleMin: 970, ensembleMax: 990 },
    { timeLabel: '+72h', hourOffset: 72, forecast: 994, ensembleMin: 985, ensembleMax: 1002 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} className="text-danger" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                RAPID INTENSIFICATION (RI) OPERATIONAL MONITOR
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Automated Thermodynamic Diagnostic &bull; Environmental Wind Shear & Ocean Heat Content Coupling
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-danger" style={{ fontSize: '12px', padding: '3px 8px' }}>
              CURRENT RI RISK: HIGH
            </span>
            <span className="badge badge-demo">DEMO ANALYSIS</span>
          </div>
        </div>
      </div>

      {/* Operational Definition Alert Box */}
      <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AlertTriangle size={15} className="text-warn" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '11px', color: '#78350F', lineHeight: 1.5 }}>
            <strong>OPERATIONAL RESEARCH DEFINITION: </strong>
            {riData.operationalThresholdDef}
          </div>
        </div>
      </div>

      {/* Environmental Predictors Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div className="panel" style={{ padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>6H WIND SPEED ACCELERATION</div>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
            +{riData.windChange6hKmh} km/h
          </div>
          <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: 600 }}>Accelerating (+10 kts / 6h)</div>
        </div>

        <div className="panel" style={{ padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>12H CENTRAL PRESSURE DROP</div>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
            {riData.pressureChange12hHpa} hPa
          </div>
          <div style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600 }}>Rapid Deepening Ongoing</div>
        </div>

        <div className="panel" style={{ padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>SEA SURFACE TEMPERATURE (SST)</div>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
            {riData.seaSurfaceTemperatureC}°C
          </div>
          <div style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600 }}>Anomaly: +{riData.sstAnomalyC}°C above climatology</div>
        </div>

        <div className="panel" style={{ padding: '10px' }}>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>VERTICAL WIND SHEAR (850-200 hPa)</div>
          <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>
            {riData.verticalWindShearKnots} Knots
          </div>
          <div style={{ fontSize: '10px', color: '#16A34A', fontWeight: 600 }}>Favorable (Low &lt; 12 kts)</div>
        </div>
      </div>

      {/* Two Scientific Time-Series Charts: Wind Speed & Central Pressure */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <TimeSeriesChart
          title="MAXIMUM SUSTAINED WIND SPEED VS. TIME (KM/H)"
          unit="KM/H"
          metricType="wind"
          data={windSeriesData}
          height={210}
        />

        <TimeSeriesChart
          title="CENTRAL SURFACE PRESSURE VS. TIME (HPA)"
          unit="HPA"
          metricType="pressure"
          data={pressureSeriesData}
          height={210}
        />
      </div>

      {/* Analytical Multi-Factor RI Signal Summary */}
      <div className="panel">
        <div className="panel-header">
          <span>COUPLED MULTI-FACTOR RAPID INTENSIFICATION SYNTHESIS</span>
          <span className="badge badge-danger">PROBABILITY 24H: {riData.probRi24h}%</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '11px' }}>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
              <strong>Satellite Convective Organization:</strong>
              <div style={{ color: '#52606D', marginTop: '3px' }}>{riData.cloudOrganization}</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
              <strong>WeatherNext Ensemble Trend:</strong>
              <div style={{ color: '#52606D', marginTop: '3px' }}>{riData.weatherNextTrend}</div>
            </div>
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
              <strong>Inner-Core Structural Confirmation:</strong>
              <div style={{ color: '#52606D', marginTop: '3px' }}>{riData.satelliteStructureTrend}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
