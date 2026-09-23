import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  BarChart2,
  TrendingDown,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ValidationMetric, FailureAnalysisCase } from '../types';

interface ModelValidationViewProps {
  metrics: ValidationMetric[];
  failures: FailureAnalysisCase[];
  onOpenArchitectureModal: () => void;
}

export const ModelValidationView: React.FC<ModelValidationViewProps> = ({
  metrics,
  failures,
  onOpenArchitectureModal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} className="text-safe" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                SCIENTIFIC MODEL EVALUATION & BASELINE BENCHMARKING
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Hold-Out Cyclone Cross-Validation &bull; Verification against IMD RSMC Best Track Climatology (1990–2024)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-demo">SIMULATED BENCHMARK DATA</span>
            <button onClick={onOpenArchitectureModal} className="gov-btn">
              View Validation Pipeline Schema
            </button>
          </div>
        </div>
      </div>

      {/* Validation Pipeline Methodology Alert */}
      <div className="panel" style={{ background: '#F8FAFC', padding: '10px 14px', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
          DATA INTEGRITY & EVALUATION PROTOCOL (NO TEMPORAL DATA LEAKAGE)
        </div>
        <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5 }}>
          To prevent temporal frame leakage common in random frame splitting, all validation runs enforce a <strong>strict cyclone-level hold-out split</strong>. Entire historical storm lifecycles (e.g., Cyclone Fani, Cyclone Hudhud, Cyclone Amphan) are sequestered into testing sets before model calibration.
        </p>
      </div>

      {/* Baseline Comparison Table */}
      <div className="panel">
        <div className="panel-header">
          <span>TRACK FORECAST MEAN ABSOLUTE ERROR (MATE) COMPARISON TABLE</span>
          <span className="badge badge-demo">DEMO BENCHMARKS</span>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Model / Architecture</th>
              <th>6h MATE</th>
              <th>12h MATE</th>
              <th>24h MATE</th>
              <th>48h MATE</th>
              <th>72h MATE</th>
              <th>Scientific Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Persistence Baseline (CLIPER-NIO)</strong></td>
              <td className="font-mono">42 km</td>
              <td className="font-mono">89 km</td>
              <td className="font-mono">184 km</td>
              <td className="font-mono">395 km</td>
              <td className="font-mono">640 km</td>
              <td style={{ color: '#64748B', fontSize: '11px' }}>Extrapolation of past 12h vector and climatological drift</td>
            </tr>
            <tr>
              <td><strong>Kinematic Kalman Filter (0-12h Smoother)</strong></td>
              <td className="font-mono text-safe">19 km</td>
              <td className="font-mono">41 km</td>
              <td className="font-mono">98 km</td>
              <td className="font-mono">240 km</td>
              <td className="font-mono">420 km</td>
              <td style={{ color: '#64748B', fontSize: '11px' }}>Continuous velocity state estimation without NWP steering</td>
            </tr>
            <tr>
              <td><strong>WeatherNext Cyclones (Raw External Backbone)</strong></td>
              <td className="font-mono">24 km</td>
              <td className="font-mono">38 km</td>
              <td className="font-mono">68 km</td>
              <td className="font-mono">124 km</td>
              <td className="font-mono">188 km</td>
              <td style={{ color: '#64748B', fontSize: '11px' }}>External multi-physics probabilistic NWP deep learning model</td>
            </tr>
            <tr style={{ backgroundColor: '#EFF6FF' }}>
              <td><strong style={{ color: '#1D4ED8' }}>CIFS Integrated Decision System (Calibrated)</strong></td>
              <td className="font-mono"><strong style={{ color: '#16A34A' }}>18 km</strong></td>
              <td className="font-mono"><strong style={{ color: '#16A34A' }}>32 km</strong></td>
              <td className="font-mono"><strong style={{ color: '#16A34A' }}>59 km</strong></td>
              <td className="font-mono"><strong style={{ color: '#16A34A' }}>108 km</strong></td>
              <td className="font-mono"><strong style={{ color: '#16A34A' }}>164 km</strong></td>
              <td style={{ color: '#1E40AF', fontSize: '11px', fontWeight: 600 }}>Kalman state assimilation + WeatherNext ensemble clustering</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Intensity & Uncertainty Calibration Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div className="panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
            WIND SPEED INTENSITY MAE
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626' }}>
            14.8 km/h
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
            Evaluated at 24-hour lead time across 14 NIO test storms
          </div>
        </div>

        <div className="panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
            CENTRAL PRESSURE MAE
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
            5.1 hPa
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
            Mean Absolute Error against IMD post-event Best Track reports
          </div>
        </div>

        <div className="panel" style={{ padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
            80% REGION EMPIRICAL COVERAGE
          </div>
          <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A' }}>
            83.2%
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
            Well-calibrated uncertainty cone (target: 80% empirical capture)
          </div>
        </div>
      </div>

      {/* Model Failure Analysis (Scientific Honesty Section) */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} className="text-warn" />
            <span>MODEL FAILURE MODE ANALYSIS & SYSTEM BOUNDARIES</span>
          </div>
          <span className="badge badge-warn">SCIENTIFIC TRANSPARENCY</span>
        </div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '11px', color: '#64748B' }}>
            To uphold rigorous meteorological credibility, known edge-case failure modes are catalogued with observed behavioral patterns and planned engineering mitigations:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {failures.map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-color)',
                  borderRadius: '3px',
                  padding: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px', color: '#0F172A' }}>{f.phenomenon}</strong>
                  <span className={`badge ${f.severity === 'HIGH' ? 'badge-danger' : 'badge-warn'}`}>
                    {f.severity} SEVERITY
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  <div><strong style={{ color: '#DC2626' }}>Observed Failure: </strong>{f.observedFailure}</div>
                  <div><strong style={{ color: '#0F172A' }}>Expected Physics: </strong>{f.expectedBehavior}</div>
                  <div><strong style={{ color: '#16A34A' }}>Potential Mitigation: </strong>{f.potentialMitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
