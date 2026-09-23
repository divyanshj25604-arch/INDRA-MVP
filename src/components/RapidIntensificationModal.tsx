import React from 'react';
import { Flame, X } from 'lucide-react';
import { CycloneSystem, RapidIntensificationFeatures } from '../types';
import { TimeSeriesChart } from './TimeSeriesChart';

interface RapidIntensificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cyclone: CycloneSystem;
  riData: RapidIntensificationFeatures;
}

export const RapidIntensificationModal: React.FC<RapidIntensificationModalProps> = ({
  isOpen,
  onClose,
  cyclone,
  riData,
}) => {
  if (!isOpen) return null;

  // Build Wind Speed Time Series Data Points
  const windSeriesData = [
    { timeLabel: '-48h', hourOffset: -48, observed: 50, ensembleMin: 48, ensembleMax: 54 },
    { timeLabel: '-36h', hourOffset: -36, observed: 62, ensembleMin: 58, ensembleMax: 65 },
    { timeLabel: '-24h', hourOffset: -24, observed: 85, ensembleMin: 80, ensembleMax: 88 },
    { timeLabel: '-12h', hourOffset: -12, observed: 100, ensembleMin: 95, ensembleMax: 105 },
    { timeLabel: 'Now', hourOffset: 0, observed: cyclone.maxWindKmh, forecast: cyclone.maxWindKmh, ensembleMin: 112, ensembleMax: 124 },
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
    { timeLabel: 'Now', hourOffset: 0, observed: cyclone.centralPressureHpa, forecast: cyclone.centralPressureHpa, ensembleMin: 962, ensembleMax: 968 },
    { timeLabel: '+6h', hourOffset: 6, forecast: 958, ensembleMin: 952, ensembleMax: 964 },
    { timeLabel: '+12h', hourOffset: 12, forecast: 952, ensembleMin: 944, ensembleMax: 960 },
    { timeLabel: '+24h', hourOffset: 24, forecast: 944, ensembleMin: 934, ensembleMax: 954 },
    { timeLabel: '+48h', hourOffset: 48, forecast: 980, ensembleMin: 970, ensembleMax: 990 },
    { timeLabel: '+72h', hourOffset: 72, forecast: 994, ensembleMin: 985, ensembleMax: 1002 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '880px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ background: '#0F1E33' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} style={{ color: '#EF4444' }} />
            <div>
              <span className="modal-title">RAPID INTENSIFICATION (RI) DIAGNOSTIC &bull; {cyclone.id}</span>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                Thermodynamic environmental coupling and rate-of-deepening analysis
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Signal Status Banner */}
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '10px 14px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-danger">CURRENT SIGNAL: HIGH</span>
                <span className="badge badge-demo">DEMO ESTIMATE</span>
              </div>
              <div style={{ fontSize: '11px', color: '#7F1D1D', marginTop: '4px' }}>
                Standard operational threshold criterion: Wind increase &ge; 30 knots (~55 km/h) in 24 hours.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#991B1B' }}>DEMO ESTIMATE:</span>
              <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626' }}>
                {riData.probRi24h}%
              </div>
            </div>
          </div>

          {/* Environmental Predictors Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div className="panel" style={{ padding: '8px 10px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>WIND TREND (6h)</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                +{riData.windChange6hKmh} km/h
              </div>
              <div style={{ fontSize: '10px', color: '#16A34A' }}>Accelerating</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>PRESSURE DROP (12h)</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                {riData.pressureChange12hHpa} hPa
              </div>
              <div style={{ fontSize: '10px', color: '#DC2626' }}>Rapid Deepening</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>SEA SURFACE TEMP</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {riData.seaSurfaceTemperatureC}°C
              </div>
              <div style={{ fontSize: '10px', color: '#DC2626' }}>Anomaly: +{riData.sstAnomalyC}°C</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>VERTICAL WIND SHEAR</div>
              <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>
                {riData.verticalWindShearKnots} kt
              </div>
              <div style={{ fontSize: '10px', color: '#16A34A' }}>Favorable (&lt;12 kt)</div>
            </div>
          </div>

          {/* Time Series Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <TimeSeriesChart
              title="MAXIMUM SUSTAINED WIND SPEED (KM/H)"
              unit="KM/H"
              metricType="wind"
              data={windSeriesData}
              height={180}
            />
            <TimeSeriesChart
              title="CENTRAL SURFACE PRESSURE (HPA)"
              unit="HPA"
              metricType="pressure"
              data={pressureSeriesData}
              height={180}
            />
          </div>

          {/* Analytical Factors Synthesis */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '3px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              SUPPORTING PHYSICAL SIGNALS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', color: '#475569' }}>
              <div>
                <strong style={{ color: '#0F172A' }}>Satellite Organization:</strong><br />
                {riData.cloudOrganization || 'Compact Central Dense Overcast with emerging core'}
              </div>
              <div>
                <strong style={{ color: '#0F172A' }}>Forecast Intensity Trend:</strong><br />
                {riData.weatherNextTrend || 'Ensemble trajectories indicate forward strengthening'}
              </div>
              <div>
                <strong style={{ color: '#0F172A' }}>Inner-Core Structure:</strong><br />
                {riData.satelliteStructureTrend || 'Symmetric convection surrounding warm vortex core'}
              </div>
            </div>
          </div>

          {/* Institutional Disclaimer */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '8px 12px', borderRadius: '3px', fontSize: '10px', color: '#92400E', lineHeight: 1.4 }}>
            <strong>DISCLAIMER: </strong>
            Prototype analytical signal for decision-support synthesis. Not an official warning. Official tropical cyclone warnings and advisories remain the sole responsibility of authorized meteorological agencies (IMD).
          </div>
        </div>
      </div>
    </div>
  );
};
