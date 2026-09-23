import React from 'react';
import { Cpu, X, GitCommit, Layers, CheckCircle2, Box } from 'lucide-react';

interface ModelArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelArchitectureModal: React.FC<ModelArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} className="text-info" />
            <span className="modal-title">MULTI-TASK VISION ARCHITECTURE & MODEL CARD SPECIFICATION</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
          {/* Multi-Task Vision Architecture Flowchart */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '8px' }}>
              DEEP MULTI-TASK VISION ENCODER PIPELINE
            </div>

            <div
              style={{
                background: '#0B1727',
                color: '#E2E8F0',
                padding: '16px',
                borderRadius: '4px',
                border: '1px solid #1E293B',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#93C5FD' }}>
                INPUT: [Batch, 3, 512, 512] &bull; Calibrated INSAT-3D/3DR TIR-1 & Water Vapor Composite
              </div>
              <div style={{ textAlign: 'center', margin: '4px 0', color: '#64748B' }}>↓</div>
              <div style={{ background: '#112238', padding: '6px 10px', borderRadius: '3px', border: '1px solid #1E3A8A' }}>
                <strong style={{ color: '#60A5FA' }}>BACKBONE: EfficientNet-B0 Convolutional Feature Extractor</strong>
                <div style={{ color: '#94A3B8', fontSize: '10px' }}>MBConv Blocks with Squeeze-and-Excitation &bull; Depthwise Separable Convolutions &bull; Pretrained on GeoSats-NIO</div>
              </div>
              <div style={{ textAlign: 'center', margin: '4px 0', color: '#64748B' }}>↓</div>
              <div style={{ background: '#172554', padding: '4px 10px', borderRadius: '3px', border: '1px solid #1D4ED8', color: '#BFDBFE' }}>
                LATENT EMBEDDING: Dense Vector [1, 1280] (Normalized Spectral Topology Representation)
              </div>
              <div style={{ textAlign: 'center', margin: '4px 0', color: '#64748B' }}>
                ├── ─────────────────────────┼───────────────────────── ──┤
              </div>

              {/* Multi-Task Heads Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
                <div style={{ background: '#0F172A', padding: '8px', border: '1px solid #334155', borderRadius: '3px' }}>
                  <div style={{ color: '#FBBF24', fontWeight: 700, fontSize: '10px' }}>HEAD 1: CLASSIFIER</div>
                  <div style={{ color: '#CBD5E1', fontSize: '10px', marginTop: '2px' }}>7-Class IMD Intensity Softmax</div>
                  <div style={{ color: '#4ADE80', fontSize: '10px', marginTop: '4px' }}>VSCS: 82%</div>
                </div>

                <div style={{ background: '#0F172A', padding: '8px', border: '1px solid #334155', borderRadius: '3px' }}>
                  <div style={{ color: '#F87171', fontWeight: 700, fontSize: '10px' }}>HEAD 2: WIND REGRESSION</div>
                  <div style={{ color: '#CBD5E1', fontSize: '10px', marginTop: '2px' }}>Continuous Max Wind Speed Head</div>
                  <div style={{ color: '#4ADE80', fontSize: '10px', marginTop: '4px' }}>118 km/h (± 6 km/h)</div>
                </div>

                <div style={{ background: '#0F172A', padding: '8px', border: '1px solid #334155', borderRadius: '3px' }}>
                  <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '10px' }}>HEAD 3: PRESSURE REGRESSION</div>
                  <div style={{ color: '#CBD5E1', fontSize: '10px', marginTop: '2px' }}>Central Surface Pressure Head</div>
                  <div style={{ color: '#4ADE80', fontSize: '10px', marginTop: '4px' }}>965 hPa (± 2.5 hPa)</div>
                </div>

                <div style={{ background: '#0F172A', padding: '8px', border: '1px solid #334155', borderRadius: '3px' }}>
                  <div style={{ color: '#A78BFA', fontWeight: 700, fontSize: '10px' }}>HEAD 4: EYE / CORE LOCALIZER</div>
                  <div style={{ color: '#CBD5E1', fontSize: '10px', marginTop: '2px' }}>Sub-pixel Vortex Core Offset</div>
                  <div style={{ color: '#4ADE80', fontSize: '10px', marginTop: '4px' }}>14.20°N, 82.80°E (± 12 km)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Model Card */}
          <div className="panel" style={{ marginBottom: '12px' }}>
            <div className="panel-header" style={{ fontSize: '11px', background: '#F1F5F9' }}>
              <span>OPERATIONAL MODEL CARD &bull; CYCLONE INTENSITY CLASSIFIER</span>
              <span className="badge badge-demo">PROTOTYPE SPECIFICATION</span>
            </div>
            <div className="panel-body">
              <table className="gov-table">
                <tbody>
                  <tr>
                    <td style={{ width: '25%', fontWeight: 600 }}>Model Name & ID</td>
                    <td className="font-mono">CIFS-Vision-Intensity-v1.4</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Architecture</td>
                    <td>EfficientNet-B0 with multi-task regression and softmax heads</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Input Modality</td>
                    <td>INSAT-3D/3DR 10.8µm Thermal IR & 6.8µm Water Vapor storm-centered patch</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Training Dataset</td>
                    <td>1990–2024 Historical North Indian Ocean Cyclones (IMD Best Track + MOSDAC Archive)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Evaluation Protocol</td>
                    <td>Cyclone-level hold-out cross-validation (strict prevention of temporal frame leakage)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Target Output</td>
                    <td>7-tier IMD cyclone classification, maximum sustained 3-minute wind, central pressure</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>Operational Status</td>
                    <td><span className="badge badge-safe">VALIDATED ON DEMO RETROSPECTIVE RUNS</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* External Backbone Positioning */}
          <div className="panel" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <div style={{ padding: '10px 12px', fontSize: '11px', color: '#78350F' }}>
              <strong>IMPORTANT ARCHITECTURAL POSITIONING NOTE:</strong>
              <p style={{ marginTop: '4px' }}>
                WeatherNext Cyclones is utilized strictly as an <strong>external probabilistic numerical weather prediction backbone</strong>. The CIFS platform contributes the real-time satellite computer vision intelligence, spatial uncertainty quantification, Kalman-state kinematic smoothing, and geospatial population/infrastructure risk layer around it.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="gov-btn gov-btn-primary" onClick={onClose}>
            Close Model Card
          </button>
        </div>
      </div>
    </div>
  );
};
