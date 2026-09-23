import React, { useState } from 'react';
import {
  Satellite,
  Layers,
  Cpu,
  Eye,
  Radio,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { CycloneSystem, SatelliteObservation, ProcessingPipelineStage } from '../types';

interface SatelliteAnalysisViewProps {
  cyclone: CycloneSystem;
  observation: SatelliteObservation;
  pipelineStages: ProcessingPipelineStage[];
  onOpenTransparencyModal: () => void;
}

export const SatelliteAnalysisView: React.FC<SatelliteAnalysisViewProps> = ({
  cyclone,
  observation,
  pipelineStages,
  onOpenTransparencyModal,
}) => {
  const [selectedSatellite, setSelectedSatellite] = useState<'INSAT-3D' | 'INSAT-3DR'>('INSAT-3D');
  const [selectedChannel, setSelectedChannel] = useState<'TIR-1' | 'WV' | 'ENHANCED_BD'>('TIR-1');
  const [showPipeline, setShowPipeline] = useState(true);

  // Overlay toggles
  const [overlays, setOverlays] = useState({
    center: true,
    detectionBox: true,
    eyeContour: true,
    spiralBands: true,
    cdoRing: true,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Controls Bar */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Satellite size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                SATELLITE COMPUTER VISION ANALYSIS & MORPHOLOGY
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              ISRO / MOSDAC Geostationary Payloads &bull; Automated Vortex Detection & Inner-Core Structural Characterization
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SATELLITE:</span>
              <select
                value={selectedSatellite}
                onChange={(e) => setSelectedSatellite(e.target.value as any)}
                className="gov-select"
              >
                <option value="INSAT-3D">INSAT-3D (82.0°E)</option>
                <option value="INSAT-3DR">INSAT-3DR (74.0°E)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>CHANNEL:</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as any)}
                className="gov-select"
              >
                <option value="TIR-1">Thermal Infrared (10.8 µm)</option>
                <option value="WV">Water Vapor (6.8 µm)</option>
                <option value="ENHANCED_BD">BD-Curve Enhanced IR</option>
              </select>
            </div>

            <div className="font-mono text-muted" style={{ fontSize: '11px', background: '#F1F5F9', padding: '5px 8px', borderRadius: '3px' }}>
              FRAME: 22 SEP 2026 | 14:00 IST
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Viewer (Left) + Structure Metrics (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '14px' }}>
        {/* SATELLITE CANVAS / THERMAL VIEWER */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>SPECTRAL OBSERVATION TENSOR: {selectedSatellite} [{selectedChannel}]</span>
              <span className="badge badge-info">4.0 KM NADIR</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setOverlays({ ...overlays, spiralBands: !overlays.spiralBands })}
                className={`gov-btn gov-btn-sm ${overlays.spiralBands ? 'gov-btn-primary' : ''}`}
              >
                Spiral Bands
              </button>
              <button
                onClick={() => setOverlays({ ...overlays, eyeContour: !overlays.eyeContour })}
                className={`gov-btn gov-btn-sm ${overlays.eyeContour ? 'gov-btn-primary' : ''}`}
              >
                Eye Ring
              </button>
              <button
                onClick={() => setOverlays({ ...overlays, center: !overlays.center })}
                className={`gov-btn gov-btn-sm ${overlays.center ? 'gov-btn-primary' : ''}`}
              >
                Vortex Center
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', minHeight: '480px', background: '#07101E', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* SVG Synthetic High-Resolution Thermal Satellite Representation */}
            <svg
              viewBox="0 0 600 500"
              style={{ width: '100%', height: '100%', maxHeight: '520px' }}
            >
              <defs>
                {/* Background Ocean Temp Gradient */}
                <radialGradient id="oceanBg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0B1A2F" />
                  <stop offset="100%" stopColor="#050C17" />
                </radialGradient>

                {/* Cloud Convective IR Gradient */}
                <radialGradient id="cdoGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.3" /> {/* Warm Eye */}
                  <stop offset="15%" stopColor="#EF4444" stopOpacity="0.9" /> {/* -81°C Eyewall */}
                  <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.7" />
                  <stop offset="85%" stopColor="#64748B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0B1727" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Base Basin Grid */}
              <rect width="600" height="500" fill="url(#oceanBg)" />

              {/* Geographical Grid Lines */}
              <line x1="0" y1="125" x2="600" y2="125" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="250" x2="600" y2="250" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="375" x2="600" y2="375" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="150" y1="0" x2="150" y2="500" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="300" y1="0" x2="300" y2="500" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="450" y1="0" x2="450" y2="500" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              {/* Simulated Coastline (East Coast of India) */}
              <path
                d="M 60 0 Q 110 120 130 200 Q 155 300 210 400 Q 240 460 260 500"
                fill="none"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="1.5"
              />
              <text x="75" y="220" fill="rgba(148, 163, 184, 0.4)" fontSize="10" fontFamily="var(--font-mono)">
                INDIA (ANDHRA/ODISHA COAST)
              </text>

              {/* Storm Cloud Mass / CDO */}
              <circle cx="340" cy="240" r="160" fill="url(#cdoGrad)" />

              {/* Spiral Band 1 */}
              {overlays.spiralBands && (
                <path
                  d="M 340 240 Q 220 220 190 320 T 260 440"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="8"
                  strokeOpacity="0.45"
                  strokeLinecap="round"
                />
              )}

              {/* Spiral Band 2 */}
              {overlays.spiralBands && (
                <path
                  d="M 340 240 Q 450 180 490 260 T 430 380"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="10"
                  strokeOpacity="0.4"
                  strokeLinecap="round"
                />
              )}

              {/* Central Dense Overcast (CDO) Core Ring */}
              {overlays.cdoRing && (
                <circle
                  cx="340"
                  cy="240"
                  r="45"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                />
              )}

              {/* Eye Contour */}
              {overlays.eyeContour && (
                <ellipse
                  cx="340"
                  cy="240"
                  rx="18"
                  ry="16"
                  fill="rgba(255, 255, 255, 0.15)"
                  stroke="#4ADE80"
                  strokeWidth="2"
                />
              )}

              {/* YOLO Detection Bounding Box */}
              {overlays.detectionBox && (
                <g>
                  <rect
                    x="180"
                    y="90"
                    width="320"
                    height="300"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    strokeDasharray="5 3"
                  />
                  <rect x="180" y="74" width="165" height="16" fill="#0284C7" />
                  <text x="184" y="86" fill="#FFFFFF" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
                    YOLOv8-Geo: CYCLONE CORE [0.94]
                  </text>
                </g>
              )}

              {/* Estimated Vortex Center Marker */}
              {overlays.center && (
                <g>
                  <line x1="320" y1="240" x2="360" y2="240" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="340" y1="220" x2="340" y2="260" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="340" cy="240" r="5" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="352" y="235" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                    EST. CENTER: 14.20°N, 82.80°E
                  </text>
                </g>
              )}
            </svg>

            {/* On-screen Thermal Palette Colorbar */}
            <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(15, 23, 42, 0.85)', padding: '6px 10px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 600, marginBottom: '3px' }}>BRIGHTNESS TEMP (°C)</div>
              <div style={{ width: '130px', height: '10px', background: 'linear-gradient(90deg, #DC2626 0%, #F59E0B 35%, #2563EB 70%, #64748B 100%)', borderRadius: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#CBD5E1', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                <span>-85°C</span>
                <span>-60°C</span>
                <span>-35°C</span>
                <span>+10°C</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
            <span>Pixel Field: <strong>512 × 512 Equidistant Vortex Patch</strong></span>
            <span className="font-mono">Sensor Payload: INSAT-3D 6-Channel Imager</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AI CYCLONE STRUCTURE & MORPHOLOGY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Structure Metrics Panel */}
          <div className="panel">
            <div className="panel-header">
              <span>CYCLONE STRUCTURE METRICS</span>
              <span className="badge badge-safe">IMPROVING</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Eye Organization</span>
                  <strong className="font-mono">{observation.eyeOrganizationPercent}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${observation.eyeOrganizationPercent}%`, height: '100%', background: '#16A34A' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Cloud Symmetry</span>
                  <strong className="font-mono">{observation.cloudSymmetryPercent}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${observation.cloudSymmetryPercent}%`, height: '100%', background: '#2563EB' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Spiral Banding Definition</span>
                  <strong className="font-mono">{observation.bandingPercent}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${observation.bandingPercent}%`, height: '100%', background: '#9333EA' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-light)', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#64748B' }}>CDO Density: </span>
                  <strong style={{ color: '#DC2626' }}>{observation.centralDenseOvercast}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Vortex Trend: </span>
                  <strong style={{ color: '#16A34A' }}>{observation.organizationTrend}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analytical Interpretation Callout */}
          <div className="panel" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
            <div className="panel-header" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} />
                <span>AI ANALYTICAL MORPHOLOGY INTERPRETATION</span>
              </div>
              <span className="badge badge-demo">PROTOTYPE</span>
            </div>
            <div className="panel-body">
              <p style={{ fontSize: '11px', color: '#1E3A8A', lineHeight: 1.5 }}>
                "{observation.aiInterpretation}"
              </p>
              <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #BFDBFE', fontSize: '9px', color: '#3B82F6', fontWeight: 600 }}>
                * Automated computer-vision interpretation. Official meteorological advisories remain the sole jurisdiction of IMD RSMC New Delhi.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenTransparencyModal}
            className="gov-btn"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <span>Inspect Processing Math & Equations</span>
          </button>
        </div>
      </div>

      {/* Expandable Image Processing Pipeline */}
      <div className="panel">
        <div
          className="panel-header"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowPipeline(!showPipeline)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={14} className="text-info" />
            <span>END-TO-END IMAGE PROCESSING & COMPUTER VISION PIPELINE (8 STAGES)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-safe">PIPELINE LATENCY: 474 MS TOTAL</span>
            {showPipeline ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {showPipeline && (
          <div className="panel-body" style={{ padding: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {pipelineStages.map((stage) => (
                <div
                  key={stage.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: '3px',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="font-mono" style={{ fontSize: '10px', fontWeight: 700, color: '#1D4ED8' }}>
                        STAGE 0{stage.id}
                      </span>
                      <span className="badge badge-safe" style={{ fontSize: '9px', padding: '1px 4px' }}>
                        {stage.latencyMs} ms
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                      {stage.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '3px' }}>
                      {stage.description}
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-light)', fontSize: '10px' }}>
                    <div className="font-mono" style={{ color: '#0F172A', fontWeight: 600 }}>
                      {stage.modelOrMethod}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
