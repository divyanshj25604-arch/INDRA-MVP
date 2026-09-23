import React, { useState } from 'react';
import { GitBranch, Layers, Sliders, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';
import { CycloneSystem } from '../types';
import { GISMap } from '../components/GISMap';

interface EnsembleUncertaintyViewProps {
  cyclone: CycloneSystem;
  onOpenTransparencyModal: () => void;
}

export const EnsembleUncertaintyView: React.FC<EnsembleUncertaintyViewProps> = ({
  cyclone,
  onOpenTransparencyModal,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<string>('48h');
  const [percentile, setPercentile] = useState<number>(80);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner & Control Ribbon */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                ENSEMBLE SPREAD, UNCERTAINTY REGIONS & MODEL CONSENSUS
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              WeatherNext Probabilistic Ensemble Dispersion (50 Perturbed Scenarios) &bull; Cross-Model Consensus Index
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>HORIZON:</span>
              {['24h', '48h', '72h', '5d', '10d'].map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`gov-btn gov-btn-sm ${selectedHorizon === h ? 'gov-btn-primary' : ''}`}
                >
                  {h}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PREDICTION REGION:</span>
              {[50, 70, 80, 90].map((p) => (
                <button
                  key={p}
                  onClick={() => setPercentile(p)}
                  className={`gov-btn gov-btn-sm ${percentile === p ? 'gov-btn-primary' : ''}`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ensemble GIS Visualizer (Left) + Statistical Dispersion Panels (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>
        {/* Map Container */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
          <div className="panel-header">
            <span>50-MEMBER ENSEMBLE TRAJECTORIES & {percentile}% UNCERTAINTY REGION</span>
            <span className="badge badge-demo">SIMULATED ENSEMBLE</span>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <GISMap cyclone={cyclone} height="100%" />
          </div>
        </div>

        {/* Right Statistical & Dispersion Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Dispersion Summary */}
          <div className="panel">
            <div className="panel-header">
              <span>FORECAST DISPERSION DYNAMICS</span>
              <span className="badge badge-safe">QUANTIFIED</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>24-Hour Dispersion:</span>
                <span className="badge badge-safe">LOW (± 42 KM)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>48-Hour Dispersion:</span>
                <span className="badge badge-warn">MODERATE (± 85 KM)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '6px 10px', borderRadius: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: '11px' }}>72-Hour Dispersion:</span>
                <span className="badge badge-danger">HIGH (± 164 KM)</span>
              </div>
            </div>
          </div>

          {/* Model Consensus & Disagreement */}
          <div className="panel">
            <div className="panel-header">
              <span>MODEL CONSENSUS & DISAGREEMENT</span>
              <span className="badge badge-info">SIMULATED COMPARISON</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>Steering Flow Consensus</span>
                  <strong className="font-mono text-safe">HIGH (78%)</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: '#16A34A' }} />
                </div>
              </div>

              {/* Multi-Model Predicted Positions at 24h */}
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}>
                  24H PREDICTED LANDFALL CORRIDOR COMPARISON
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ background: '#F8FAFC', padding: '4px 6px', border: '1px solid var(--border-light)' }}>
                    <strong>WeatherNext Ensemble Mean:</strong> 16.50°N, 81.30°E (Near Kalingapatnam)
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '4px 6px', border: '1px solid var(--border-light)' }}>
                    <strong>Kalman Kinematic Projection:</strong> 16.32°N, 81.45°E (Offset: 24 km)
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '4px 6px', border: '1px solid var(--border-light)' }}>
                    <strong>Historical Trajectory Analog:</strong> 16.70°N, 81.20°E (Offset: 31 km)
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '8px', borderRadius: '3px', fontSize: '10px', color: '#78350F' }}>
                * Scientific Terminology Reminder: The shaded polygon represents an <strong>Ensemble-derived {percentile}% prediction region</strong>, not a statistical confidence interval.
              </div>
            </div>
          </div>

          <button onClick={onOpenTransparencyModal} className="gov-btn" style={{ width: '100%' }}>
            Inspect Dispersion Mathematics
          </button>
        </div>
      </div>
    </div>
  );
};
