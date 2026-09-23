import React, { useState } from 'react';
import { HelpCircle, Cpu, Layers, GitBranch, ShieldCheck, X } from 'lucide-react';

interface AlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: 'intensity' | 'track' | 'ensemble' | 'risk';
}

export const AlgorithmModal: React.FC<AlgorithmModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'intensity',
}) => {
  const [activeTopic, setActiveTopic] = useState<'intensity' | 'track' | 'ensemble' | 'risk'>(
    defaultTopic
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={16} className="text-info" />
            <span className="modal-title">ALGORITHM TRANSPARENCY & METHODOLOGY AUDIT</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#F8FAFC' }}>
          <button
            onClick={() => setActiveTopic('intensity')}
            className="gov-btn"
            style={{
              borderRadius: 0,
              border: 'none',
              borderBottom: activeTopic === 'intensity' ? '2px solid #0E223D' : 'none',
              background: activeTopic === 'intensity' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTopic === 'intensity' ? 700 : 500,
              padding: '8px 14px',
            }}
          >
            Intensity & Structure Estimation
          </button>
          <button
            onClick={() => setActiveTopic('track')}
            className="gov-btn"
            style={{
              borderRadius: 0,
              border: 'none',
              borderBottom: activeTopic === 'track' ? '2px solid #0E223D' : 'none',
              background: activeTopic === 'track' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTopic === 'track' ? 700 : 500,
              padding: '8px 14px',
            }}
          >
            Track & Ensemble Prediction
          </button>
          <button
            onClick={() => setActiveTopic('ensemble')}
            className="gov-btn"
            style={{
              borderRadius: 0,
              border: 'none',
              borderBottom: activeTopic === 'ensemble' ? '2px solid #0E223D' : 'none',
              background: activeTopic === 'ensemble' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTopic === 'ensemble' ? 700 : 500,
              padding: '8px 14px',
            }}
          >
            Rapid Intensification Detection
          </button>
          <button
            onClick={() => setActiveTopic('risk')}
            className="gov-btn"
            style={{
              borderRadius: 0,
              border: 'none',
              borderBottom: activeTopic === 'risk' ? '2px solid #0E223D' : 'none',
              background: activeTopic === 'risk' ? '#FFFFFF' : 'transparent',
              fontWeight: activeTopic === 'risk' ? 700 : 500,
              padding: '8px 14px',
            }}
          >
            Geospatial Prototype Risk Index
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          {activeTopic === 'intensity' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Cpu size={16} className="text-info" />
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                  HOW WAS CYCLONE INTENSITY ESTIMATED?
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
                The intensity estimation engine processes raw thermal infrared satellite radiance through a deep multi-task convolutional architecture calibrated against IMD RSMC Best Track conventions.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#1D4ED8' }}>01.</span>
                  <div>
                    <strong>Satellite Radiance Acquisition:</strong> L1B calibrated brightness temperature arrays are retrieved from INSAT-3D/3DR TIR-1 (10.8 µm) channel at 4 km nadir resolution.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#1D4ED8' }}>02.</span>
                  <div>
                    <strong>Radiometric Calibration & Denoising:</strong> Satellite sensor drift is corrected via look-up tables (LUTs) and spatial bandpass filtering removes sensor noise and cirrus contamination.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#1D4ED8' }}>03.</span>
                  <div>
                    <strong>Vortex Localization & Storm-Centered Crop:</strong> Cyclone Center Estimation localizes the vortex core; a 512×512 storm-centered cylindrical equidistant tensor is extracted.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#1D4ED8' }}>04.</span>
                  <div>
                    <strong>Convolutional Feature Extraction:</strong> An EfficientNet-B0 backbone transforms the 2D temperature topography into a 1280-dimensional latent representation capturing spiral band curvature, symmetry, and eye gradient.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#1D4ED8' }}>05.</span>
                  <div>
                    <strong>Multi-Task Prediction Heads:</strong>
                    <ul style={{ margin: '4px 0 0 16px', fontSize: '12px' }}>
                      <li>Softmax Classification Head: 7-class IMD Category distribution (VSCS: 82%)</li>
                      <li>Wind Speed Regression Head: Continuous maximum sustained 3-min wind (118 km/h)</li>
                      <li>Central Pressure Head: Minimum central pressure regression (965 hPa)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'track' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <GitBranch size={16} className="text-info" />
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                  HOW WAS THE TRACK FORECAST GENERATED?
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Track forecasting combines deep-learning numerical weather prediction (WeatherNext Cyclones backbone) with short-term Kalman filter kinematics and ensemble dispersion modeling.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#EA580C' }}>01.</span>
                  <div>
                    <strong>Observed State Initialization:</strong> Vortex center (14.20°N, 82.80°E), translational vector (NW @ 12 km/h), and intensity state are initialized from INSAT-3D observations.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#EA580C' }}>02.</span>
                  <div>
                    <strong>WeatherNext Cyclones Backbone Execution:</strong> External probabilistic deep NWP engine computes 15-day multi-physics steering flows, assimilating 850 hPa, 500 hPa, and 200 hPa geopotential height fields.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#EA580C' }}>03.</span>
                  <div>
                    <strong>50-Member Perturbation Ensemble:</strong> Initial condition singular vector perturbations propagate atmospheric uncertainties, generating divergent track scenarios across the Bay of Bengal.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                  <span className="font-mono" style={{ fontWeight: 700, color: '#EA580C' }}>04.</span>
                  <div>
                    <strong>Ensemble Mean & 80% Prediction Region:</strong> Density-based spatial clustering calculates the 50th percentile consensus track, while spatial convex hulls at each forecast horizon delineate the 80% prediction cone.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'ensemble' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Layers size={16} className="text-info" />
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                  HOW IS RAPID INTENSIFICATION (RI) DETECTED?
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
                Operational Threshold Definition: An increase in maximum sustained surface wind speed of ≥ 55 km/h (30 knots) within a 24-hour window, or central pressure drop ≥ 18 hPa in 24 hours.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
                <div style={{ background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ENVIRONMENTAL SST</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>30.2°C (+1.4°C anomaly)</div>
                  <div style={{ fontSize: '11px', color: '#52606D' }}>Threshold &gt; 28.5°C heavily favors rapid evaporation and latent heat release.</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '10px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>VERTICAL WIND SHEAR (850-200 hPa)</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>9.8 knots (Low)</div>
                  <div style={{ fontSize: '11px', color: '#52606D' }}>Shear &lt; 15 knots prevents tilt and convective decoupling of the vortex column.</div>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'risk' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <ShieldCheck size={16} className="text-info" />
                <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                  PROTOTYPE GEOSPATIAL RISK INDEX CALCULATION
                </h3>
              </div>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '12px', borderRadius: '3px', marginBottom: '14px' }}>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', marginBottom: '4px' }}>
                  PROTOTYPE RISK INDEX = HAZARD × EXPOSURE × VULNERABILITY
                </div>
                <div style={{ fontSize: '11px', color: '#1E3A8A' }}>
                  * This score represents an analytical decision-support proxy. It does not replace official NDRF or SDMA disaster evacuation declarations.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div><strong>1. Hazard Index (H):</strong> Maximum forecast sustained wind speed + 24h precipitation accumulation + storm surge height potential.</div>
                <div><strong>2. Exposure Index (E):</strong> Census population in low-elevation coastal zones (&lt;5m MSL) + critical lifeline infrastructure (ports, thermal plants, national highways, railways).</div>
                <div><strong>3. Vulnerability Index (V):</strong> Coastal geomorphology, housing roof structural weakness (semi-pucca/kutcha percentages), and historical storm surge ingress depth.</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '10px 16px', background: '#F1F5F9', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="gov-btn gov-btn-primary" onClick={onClose}>
            Close Audit Modal
          </button>
        </div>
      </div>
    </div>
  );
};
