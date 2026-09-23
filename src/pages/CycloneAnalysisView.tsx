import React from 'react';
import { Layers, Cpu, Award, BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';
import { CycloneSystem, IntensityDistribution } from '../types';

interface CycloneAnalysisViewProps {
  cyclone: CycloneSystem;
  distribution: IntensityDistribution[];
  onOpenArchitectureModal: () => void;
  onOpenTransparencyModal: () => void;
}

export const CycloneAnalysisView: React.FC<CycloneAnalysisViewProps> = ({
  cyclone,
  distribution,
  onOpenArchitectureModal,
  onOpenTransparencyModal,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                CYCLONE INTENSITY & STRUCTURAL CLASSIFICATION MODEL
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Deep Convolutional Neural Network Trained on 35-Year MOSDAC/IMD Historical Radiance Archive
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onOpenArchitectureModal} className="gov-btn gov-btn-primary">
              <Cpu size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              <span>Model Architecture Specifications</span>
            </button>
            <button onClick={onOpenTransparencyModal} className="gov-btn">
              <HelpCircle size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              <span>How Intensity was Computed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Classification & Probability Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Current State Card */}
        <div className="panel">
          <div className="panel-header">
            <span>OPERATIONAL CLASSIFICATION INFERENCE</span>
            <span className="badge badge-demo">SIMULATION INFERENCE</span>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px', borderRadius: '3px' }}>
              <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>PREDICTED IMD INTENSITY CATEGORY</div>
              <div style={{ fontSize: '19px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
                {cyclone.classification.toUpperCase()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span className="badge badge-safe">CONFIDENCE: {cyclone.confidencePercent}%</span>
                <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                  LATENT COSINE DISTANCE: 0.124
                </span>
              </div>
            </div>

            {/* Regression Predictions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="panel" style={{ padding: '10px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>ESTIMATED MAX SUSTAINED WIND</div>
                <div className="font-mono" style={{ fontSize: '17px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                  {cyclone.maxWindKmh} km/h
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{cyclone.maxWindKnots} Knots (3-minute average)</div>
              </div>

              <div className="panel" style={{ padding: '10px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>ESTIMATED CENTRAL PRESSURE</div>
                <div className="font-mono" style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {cyclone.centralPressureHpa} hPa
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Pressure Anomaly: -36 hPa</div>
              </div>
            </div>

            {/* Structure Summary */}
            <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                VORTEX MORPHOLOGICAL EMBEDDING FEATURES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                <div>Eye Organization: <strong>82% (Pinhole Definition)</strong></div>
                <div>Cloud Wall Symmetry: <strong>86% (High)</strong></div>
                <div>Outer Spiral Bands: <strong>91% Curvature (1.15 revs)</strong></div>
                <div>Core Convective Depth: <strong>-81°C Thermal Minimum</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Softmax Probability Distribution Bar Chart */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={14} className="text-info" />
              <span>IMD CATEGORY PROBABILITY DISTRIBUTION (SOFTMAX HEAD)</span>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '10px' }}>Σ P = 100%</span>
          </div>

          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '11px', color: '#64748B' }}>
              Full posterior probability across all 7 operational IMD cyclone intensity classes output by the multi-task vision classifier head:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              {distribution.map((item) => {
                const isSelected = item.category === cyclone.classification;
                return (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#DC2626' : '#334155' }}>
                        {item.category} {isSelected && '(Predicted)'}
                      </span>
                      <span className="font-mono" style={{ fontWeight: 700, color: isSelected ? '#DC2626' : '#64748B' }}>
                        {item.probability}%
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.probability}%`,
                          height: '100%',
                          backgroundColor: isSelected
                            ? '#DC2626'
                            : item.probability > 10
                            ? '#F59E0B'
                            : '#94A3B8',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '12px', padding: '8px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '3px', fontSize: '11px', color: '#1E3A8A' }}>
              <strong>Uncertainty Dispersion Note:</strong> An 11% probability for Severe Cyclonic Storm reflects satellite scan-angle parallax attenuation at 82.8°E longitude.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
