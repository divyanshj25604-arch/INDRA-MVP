import React, { useState } from 'react';
import {
  X,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CycloneSystem, SatelliteObservation, RapidIntensificationFeatures } from '../types';

interface CycloneDetailDrawerProps {
  cyclone: CycloneSystem;
  observation?: SatelliteObservation | null;
  riData?: RapidIntensificationFeatures | null;
  onClose: () => void;
  onOpenRiAnalysis: () => void;
  onOpenMethodology?: () => void;
}

export const CycloneDetailDrawer: React.FC<CycloneDetailDrawerProps> = ({
  cyclone,
  observation: _observation,
  riData,
  onClose,
  onOpenRiAnalysis,
  onOpenMethodology: _onOpenMethodology,
}) => {
  const [activeTab, setActiveTab] = useState<'identification' | 'classification' | 'prediction'>('identification');
  const [showExtendedForecast, setShowExtendedForecast] = useState(false);

  // Short term horizons (up to 72h)
  const operationalHorizons = (cyclone.forecastTrack || []).filter((p) => p.hourOffset <= 72);
  const extendedHorizons = (cyclone.forecastTrack || []).filter((p) => p.hourOffset > 72);

  const isRiHigh = riData ? riData.probRi24h >= 60 : cyclone.trend === 'INTENSIFYING';

  return (
    <div className="cyclone-detail-drawer" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <div className="drawer-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: '2px', fontFamily: 'var(--font-mono)' }}>
              {cyclone.id}
            </span>
            <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {cyclone.basin}
            </span>
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '4px 0 0 0', letterSpacing: '0.02em', color: '#FFFFFF' }}>
            {cyclone.classification}
          </h2>
          <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>
            {cyclone.name}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          title="Close Drawer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Core Vitals Horizontal Strip */}
      <div className="drawer-vitals-strip">
        <div className="vital-cell">
          <div className="vital-cell-label">MAX WIND</div>
          <div className="vital-cell-value" style={{ color: '#DC2626' }}>{cyclone.maxWindKmh} <span style={{ fontSize: '10px', fontWeight: 500 }}>km/h</span></div>
        </div>
        <div className="vital-cell">
          <div className="vital-cell-label">PRESSURE</div>
          <div className="vital-cell-value">{cyclone.centralPressureHpa} <span style={{ fontSize: '10px', fontWeight: 500 }}>hPa</span></div>
        </div>
        <div className="vital-cell">
          <div className="vital-cell-label">POSITION</div>
          <div className="vital-cell-value" style={{ fontSize: '11px' }}>{cyclone.currentLat.toFixed(1)}°N, {cyclone.currentLng.toFixed(1)}°E</div>
        </div>
        <div className="vital-cell">
          <div className="vital-cell-label">MOVEMENT</div>
          <div className="vital-cell-value" style={{ fontSize: '11px' }}>{cyclone.movementDirection} @ {cyclone.movementSpeedKmh} <span style={{ fontSize: '9px' }}>km/h</span></div>
        </div>
      </div>

      {/* Analysis Tabs Navigation */}
      <div className="drawer-tabs-nav">
        <button
          onClick={() => setActiveTab('identification')}
          className={`drawer-tab-btn ${activeTab === 'identification' ? 'active' : ''}`}
        >
          IDENTIFICATION
        </button>
        <button
          onClick={() => setActiveTab('classification')}
          className={`drawer-tab-btn ${activeTab === 'classification' ? 'active' : ''}`}
        >
          CLASSIFICATION
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`drawer-tab-btn ${activeTab === 'prediction' ? 'active' : ''}`}
        >
          PREDICTION
        </button>
      </div>

      {/* Scrollable Drawer Content */}
      <div className="drawer-body">
        {/* =========================================================
            TAB 1: IDENTIFICATION ("Where is it?")
            ========================================================= */}
        {activeTab === 'identification' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>VORTEX DETECTION & OBSERVATION</span>
              <span className="badge badge-demo">MODEL ESTIMATE</span>
            </div>

            {/* Satellite Observation Summary */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '3px', padding: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>SATELLITE</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>INSAT-3D</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>CHANNEL</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Thermal Infrared (TIR-1)</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>OBSERVATION TIME</span>
                  <div className="font-mono" style={{ fontWeight: 600 }}>{cyclone.lastObservedTime}</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>DETECTION CONFIDENCE</span>
                  <div style={{ fontWeight: 700, color: '#16A34A' }}>{cyclone.confidencePercent}%</div>
                </div>
              </div>
            </div>

            {/* Storm-Centered Satellite View (Clean Synthetic SVG) */}
            <div style={{ background: '#07101E', borderRadius: '4px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginBottom: '6px' }}>
                <span>INSAT-3D STORM-CENTERED TIR-1</span>
                <span className="font-mono">4km RES</span>
              </div>
              <svg viewBox="0 0 280 200" style={{ width: '100%', height: '170px', borderRadius: '3px' }}>
                <defs>
                  <radialGradient id="thumbOcean" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0B1A2F" />
                    <stop offset="100%" stopColor="#050C17" />
                  </radialGradient>
                  <radialGradient id="thumbCloud" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
                    <stop offset="18%" stopColor="#EF4444" stopOpacity="0.88" />
                    <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.65" />
                    <stop offset="90%" stopColor="#64748B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0B1727" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="280" height="200" fill="url(#thumbOcean)" />
                <circle cx="140" cy="100" r="75" fill="url(#thumbCloud)" />
                {/* Spiral Arm */}
                <path d="M 140 100 Q 80 90 70 140 T 110 180" fill="none" stroke="#38BDF8" strokeWidth="4" strokeOpacity="0.5" strokeLinecap="round" />
                <path d="M 140 100 Q 200 80 215 120 T 180 170" fill="none" stroke="#F59E0B" strokeWidth="5" strokeOpacity="0.45" strokeLinecap="round" />
                {/* Vortex Center Marker */}
                <circle cx="140" cy="100" r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="140" cy="100" r="3" fill="#DC2626" />
                <text x="140" y="125" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="var(--font-mono)">
                  {cyclone.currentLat.toFixed(2)}°N, {cyclone.currentLng.toFixed(2)}°E
                </text>
              </svg>
            </div>

            {/* Identification Output Card */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 12px', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '11px' }}>
                <ShieldCheck size={14} />
                <span>IDENTIFICATION OUTPUT: CYCLONIC SYSTEM DETECTED</span>
              </div>
              <div style={{ fontSize: '11px', color: '#14532D', marginTop: '4px', lineHeight: 1.45 }}>
                Estimated Center: <strong>{cyclone.currentLat.toFixed(2)}°N, {cyclone.currentLng.toFixed(2)}°E</strong><br />
                Primary Sensor: <strong>INSAT-3D TIR-1 Thermal Infrared</strong><br />
                Pattern Match Confidence: <strong>{cyclone.confidencePercent}%</strong>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: CLASSIFICATION ("What kind is it & how strong?")
            ========================================================= */}
        {activeTab === 'classification' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>STRUCTURAL & INTENSITY ASSESSMENT</span>
              <span className="badge badge-demo">MODEL ESTIMATE</span>
            </div>

            {/* Main Category Box */}
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px', borderRadius: '3px' }}>
              <div style={{ fontSize: '10px', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>
                CLASSIFIED CATEGORY
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#DC2626', marginTop: '2px' }}>
                {cyclone.classification}
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '11px', color: '#7F1D1D' }}>
                <span>Max Wind: <strong>{cyclone.maxWindKmh} km/h</strong></span>
                <span>Pressure: <strong>{cyclone.centralPressureHpa} hPa</strong></span>
              </div>
            </div>

            {/* Qualitative Structure Overview */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', borderRadius: '3px', padding: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                VORTEX STRUCTURAL CHARACTERISTICS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>EYE / CENTER</span>
                  <div style={{ fontWeight: 700, color: cyclone.eyeDetected ? '#16A34A' : '#64748B' }}>
                    {cyclone.eyeDetected ? `Detected (${cyclone.eyeRadiusKm || 24} km)` : 'Not Well Defined'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>CLOUD ORGANIZATION</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{cyclone.structure || 'High'}</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>SPIRAL BANDING</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Strong (Tight Curvature)</div>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontSize: '10px' }}>INTENSITY TREND</span>
                  <div style={{ fontWeight: 700, color: cyclone.trend === 'INTENSIFYING' ? '#DC2626' : '#2563EB' }}>
                    {cyclone.trend}
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Visual Structure Progress Bars */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '3px', padding: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
                MORPHOLOGICAL INTEGRITY METRICS
              </div>

              {/* Eye Structure */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span>Eye Structure Definition</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>82%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: '#2563EB' }} />
                </div>
              </div>

              {/* Cloud Symmetry */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span>Cloud Convective Symmetry</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>86%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '86%', height: '100%', background: '#2563EB' }} />
                </div>
              </div>

              {/* Spiral Banding */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span>Spiral Banding Curvature</span>
                  <span className="font-mono" style={{ fontWeight: 700 }}>91%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '91%', height: '100%', background: '#16A34A' }} />
                </div>
              </div>

              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Overall Classification Confidence:</span>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 800, color: '#16A34A' }}>
                  {cyclone.confidencePercent}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: PREDICTION ("Where is it going & how will it evolve?")
            ========================================================= */}
        {activeTab === 'prediction' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>FORWARD TRAJECTORY & EVOLUTION</span>
              <span className="badge badge-demo">PROTOTYPE FORECAST</span>
            </div>

            {/* Forecast Horizons List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {operationalHorizons.map((pt) => (
                <div
                  key={pt.hourOffset}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: '3px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="font-mono" style={{ fontSize: '11px', fontWeight: 800, color: '#C2410C' }}>
                        +{pt.hourOffset}h
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>({pt.time})</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                      {pt.category}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>
                      {pt.windKmh} km/h
                    </div>
                    <div className="font-mono" style={{ fontSize: '10px', color: '#64748B' }}>
                      {pt.pressureHpa} hPa &bull; {pt.lat.toFixed(1)}°N, {pt.lng.toFixed(1)}°E
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Extended Horizon Accordion Button */}
            {extendedHorizons.length > 0 && (
              <div>
                <button
                  onClick={() => setShowExtendedForecast(!showExtendedForecast)}
                  className="gov-btn"
                  style={{ width: '100%', fontSize: '11px', textAlign: 'center' }}
                >
                  {showExtendedForecast ? '▲ Hide Extended Forecast' : '▼ View Extended Forecast (96h – 120h)'}
                </button>

                {showExtendedForecast && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                    {extendedHorizons.map((pt) => (
                      <div
                        key={pt.hourOffset}
                        style={{
                          background: '#FFFFFF',
                          border: '1px dashed var(--border-color)',
                          borderRadius: '3px',
                          padding: '7px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '11px',
                        }}
                      >
                        <span className="font-mono" style={{ fontWeight: 700, color: '#64748B' }}>+{pt.hourOffset}h</span>
                        <span>{pt.category}</span>
                        <span className="font-mono">{pt.windKmh} km/h</span>
                        <span className="font-mono text-muted">{pt.lat.toFixed(1)}°N, {pt.lng.toFixed(1)}°E</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ fontSize: '10px', color: '#64748B', background: '#F1F5F9', padding: '6px 8px', borderRadius: '2px' }}>
              Trajectory generated from multi-member perturbed scenarios. Uncertainty cone (80% region) is displayed on the main map.
            </div>
          </div>
        )}

        {/* =========================================================
            PROMINENT RAPID INTENSIFICATION CARD (USP)
            ========================================================= */}
        <div className="ri-card-compact">
          <div className="ri-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={15} style={{ color: '#DC2626' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', letterSpacing: '0.04em' }}>
                RAPID INTENSIFICATION
              </span>
            </div>
            <span className={`badge ${isRiHigh ? 'badge-danger' : 'badge-safe'}`}>
              {isRiHigh ? 'HIGH SIGNAL' : 'MODERATE SIGNAL'}
            </span>
          </div>

          <p style={{ fontSize: '11px', color: '#7F1D1D', margin: 0, lineHeight: 1.4 }}>
            {isRiHigh
              ? 'Thermodynamic indicators show elevated strengthening tendencies over the next 12–24h.'
              : 'Environmental factors currently show stable moderate intensification.'}
          </p>

          <div className="ri-indicators-grid">
            <div className="ri-indicator-item">
              <span style={{ color: '#991B1B', fontSize: '9px', fontWeight: 600 }}>WIND CHANGE (6h)</span>
              <div className="font-mono" style={{ fontWeight: 700, color: '#DC2626' }}>
                +{riData?.windChange6hKmh || 18} km/h
              </div>
            </div>
            <div className="ri-indicator-item">
              <span style={{ color: '#991B1B', fontSize: '9px', fontWeight: 600 }}>PRESSURE DROP (12h)</span>
              <div className="font-mono" style={{ fontWeight: 700, color: '#DC2626' }}>
                {riData?.pressureChange12hHpa || -13} hPa
              </div>
            </div>
            <div className="ri-indicator-item">
              <span style={{ color: '#991B1B', fontSize: '9px', fontWeight: 600 }}>SEA SURFACE TEMP</span>
              <div className="font-mono" style={{ fontWeight: 700 }}>
                {riData?.seaSurfaceTemperatureC || 30.2}°C
              </div>
            </div>
            <div className="ri-indicator-item">
              <span style={{ color: '#991B1B', fontSize: '9px', fontWeight: 600 }}>VERTICAL WIND SHEAR</span>
              <div className="font-mono" style={{ fontWeight: 700, color: '#16A34A' }}>
                {riData?.verticalWindShearKnots || 9.8} kt (Low)
              </div>
            </div>
          </div>

          <button
            onClick={onOpenRiAnalysis}
            className="gov-btn gov-btn-primary"
            style={{ width: '100%', marginTop: '2px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <span>VIEW DETAILED RI ANALYSIS</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
