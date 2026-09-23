import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Wind,
  Gauge,
  Eye,
  Activity,
  Layers,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { CycloneSystem, CoastalDistrict, CycloneIntensityCategory, AlertItem } from '../types';
import { GISMap } from '../components/GISMap';

interface CommandCenterViewProps {
  cyclones: CycloneSystem[];
  selectedCyclone: CycloneSystem;
  onSelectCyclone: (cyclone: CycloneSystem) => void;
  districts: CoastalDistrict[];
  alerts: AlertItem[];
  onOpenTransparencyModal: () => void;
  onOpenArchitectureModal: () => void;
  onSelectDistrict: (district: CoastalDistrict) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  cyclones,
  selectedCyclone,
  onSelectCyclone,
  districts,
  alerts,
  onOpenTransparencyModal,
  onOpenArchitectureModal,
  onSelectDistrict,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredCyclones = cyclones.filter((c) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'DEPRESSION')
      return c.classification.includes('Depression');
    if (filterCategory === 'CYCLONIC')
      return c.classification === 'Cyclonic Storm';
    if (filterCategory === 'SEVERE')
      return c.classification.includes('Severe');
    return true;
  });

  return (
    <div className="command-center-container">
      {/* 3-Column Operational Command Center Grid */}
      <div className="command-center-grid">
        {/* LEFT COLUMN: ACTIVE TROPICAL SYSTEMS */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} className="text-info" />
              <span>ACTIVE TROPICAL SYSTEMS</span>
            </div>
            <span className="badge badge-danger">{cyclones.length} ACTIVE</span>
          </div>

          {/* Filter Chips */}
          <div style={{ padding: '8px 10px', background: '#F8FAFC', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {['ALL', 'DEPRESSION', 'CYCLONIC', 'SEVERE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`gov-btn gov-btn-sm ${filterCategory === cat ? 'gov-btn-primary' : ''}`}
                style={{ fontSize: '10px', padding: '2px 6px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* System List Cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredCyclones.map((cyclone) => {
              const isSelected = cyclone.id === selectedCyclone.id;
              const isVSCS = cyclone.classification.includes('Very Severe');

              return (
                <div
                  key={cyclone.id}
                  onClick={() => onSelectCyclone(cyclone)}
                  className="panel"
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderColor: isSelected ? '#1D4ED8' : 'var(--border-color)',
                    backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
                    borderLeftWidth: isSelected ? '4px' : '1px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div className="font-mono" style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                        {cyclone.id} &bull; {cyclone.basin}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                        {cyclone.name}
                      </div>
                    </div>
                    <span className={`badge ${isVSCS ? 'badge-danger' : 'badge-warn'}`}>
                      {cyclone.classification}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', fontSize: '11px' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Position: </span>
                      <strong className="font-mono">{cyclone.currentLat.toFixed(2)}°N, {cyclone.currentLng.toFixed(2)}°E</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Movement: </span>
                      <strong>{cyclone.movementDirection} @ {cyclone.movementSpeedKmh} km/h</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Max Wind: </span>
                      <strong style={{ color: '#DC2626' }}>{cyclone.maxWindKmh} km/h</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Pressure: </span>
                      <strong>{cyclone.centralPressureHpa} hPa</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-light)', fontSize: '10px' }}>
                    <span style={{ color: cyclone.trend === 'INTENSIFYING' ? '#DC2626' : '#64748B', fontWeight: 600 }}>
                      TREND: ↑ {cyclone.trend}
                    </span>
                    <span className="font-mono" style={{ color: '#1E40AF', fontWeight: 600 }}>
                      AI CONF: {cyclone.confidencePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Basin Status Footer */}
          <div style={{ padding: '8px 10px', background: '#F1F5F9', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: '#64748B' }}>
            <span>Active Basin Watch: <strong>Bay of Bengal (Monsoon Transition)</strong></span>
          </div>
        </div>

        {/* CENTER COLUMN: LARGE GEOSPATIAL MAP & TIMELINE */}
        <div className="map-column">
          <div className="map-wrapper">
            <GISMap
              cyclone={selectedCyclone}
              districts={districts}
              onSelectDistrict={onSelectDistrict}
            />
          </div>

          {/* Forecast Timeline Strip */}
          <div className="panel" style={{ padding: '6px 12px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                <Clock size={12} className="text-info" />
                <span>OPERATIONAL ANALYSIS & FORECAST TIMELINE</span>
              </div>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
                CURRENT CYCLE: 14:00 IST INITIALIZATION
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', fontSize: '10px' }}>
              <div style={{ background: '#F8FAFC', padding: '4px 6px', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div className="font-mono" style={{ color: '#64748B' }}>12:00 IST</div>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>MOSDAC TIR1 Ingestion</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '4px 6px', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div className="font-mono" style={{ color: '#64748B' }}>13:00 IST</div>
                <div style={{ fontWeight: 600, color: '#0F172A' }}>Center Localization</div>
              </div>
              <div style={{ background: '#EFF6FF', padding: '4px 6px', border: '1px solid #BFDBFE', borderRadius: '2px' }}>
                <div className="font-mono" style={{ color: '#1D4ED8', fontWeight: 700 }}>14:00 IST (T=0)</div>
                <div style={{ fontWeight: 700, color: '#1E40AF' }}>State Classified: VSCS</div>
              </div>
              <div style={{ background: '#FFFBEB', padding: '4px 6px', border: '1px solid #FDE68A', borderRadius: '2px' }}>
                <div className="font-mono" style={{ color: '#B45309' }}>14:05 IST</div>
                <div style={{ fontWeight: 600, color: '#92400E' }}>WeatherNext 50-Ens</div>
              </div>
              <div style={{ background: '#FEF2F2', padding: '4px 6px', border: '1px solid #FECACA', borderRadius: '2px' }}>
                <div className="font-mono" style={{ color: '#DC2626' }}>14:10 IST</div>
                <div style={{ fontWeight: 600, color: '#991B1B' }}>Coastal Risk Updated</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CURRENT SYSTEM INTELLIGENCE */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} className="text-danger" />
              <span>CURRENT SYSTEM INTELLIGENCE</span>
            </div>
            <span className="badge badge-demo">SIMULATION</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* System Title Card */}
            <div>
              <div className="font-mono" style={{ fontSize: '11px', color: '#64748B' }}>
                SYSTEM ID: {selectedCyclone.id}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                {selectedCyclone.name}
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge badge-danger" style={{ fontSize: '11px', padding: '3px 7px' }}>
                  {selectedCyclone.classification}
                </span>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="panel" style={{ padding: '8px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>MAX SUSTAINED WIND</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                  {selectedCyclone.maxWindKmh} km/h
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{selectedCyclone.maxWindKnots} Knots (3-min)</div>
              </div>

              <div className="panel" style={{ padding: '8px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CENTRAL PRESSURE</div>
                <div className="font-mono" style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {selectedCyclone.centralPressureHpa} hPa
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Est. Pressure Deficit: -36 hPa</div>
              </div>

              <div className="panel" style={{ padding: '8px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CURRENT POSITION</div>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {selectedCyclone.currentLat.toFixed(2)}°N
                </div>
                <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {selectedCyclone.currentLng.toFixed(2)}°E
                </div>
              </div>

              <div className="panel" style={{ padding: '8px', background: '#F8FAFC' }}>
                <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>TRANSLATION MOVEMENT</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {selectedCyclone.movementDirection}
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Speed: {selectedCyclone.movementSpeedKmh} km/h</div>
              </div>
            </div>

            {/* AI Classification & Structure Confidence */}
            <div className="panel" style={{ padding: '10px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>AI CLASSIFICATION CONFIDENCE</span>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>
                  {selectedCyclone.confidencePercent}%
                </span>
              </div>

              {/* Horizontal Confidence Bar */}
              <div style={{ width: '100%', height: '7px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${selectedCyclone.confidencePercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px', fontSize: '11px' }}>
                <div>
                  <span style={{ color: '#64748B' }}>Eye Feature: </span>
                  <strong style={{ color: selectedCyclone.eyeDetected ? '#16A34A' : '#64748B' }}>
                    {selectedCyclone.eyeDetected ? `DETECTED (${selectedCyclone.eyeRadiusKm} km)` : 'OBSCURED'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Structure: </span>
                  <strong>{selectedCyclone.structure}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Trend: </span>
                  <strong style={{ color: '#DC2626' }}>↑ {selectedCyclone.trend}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Observation: </span>
                  <span className="font-mono">{selectedCyclone.lastObservedTime}</span>
                </div>
              </div>
            </div>

            {/* Method / Model Audit Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                onClick={onOpenTransparencyModal}
                className="gov-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <HelpCircle size={13} className="text-info" />
                <span>How was intensity calculated?</span>
              </button>

              <button
                onClick={onOpenArchitectureModal}
                className="gov-btn"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Layers size={13} className="text-secondary" />
                <span>View Multi-Task Model Card</span>
              </button>
            </div>

            {/* Priority Operational Alert Card */}
            <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
                <AlertTriangle size={13} />
                <span>ACTIVE ANALYTICAL SIGNAL</span>
              </div>
              <p style={{ fontSize: '11px', color: '#92400E', lineHeight: 1.4 }}>
                Rapid intensification environment detected over West-Central Bay of Bengal. Low shear (9.8 kts) and 30.2°C SST favor further strengthening prior to landfall.
              </p>
              <div style={{ fontSize: '9px', color: '#B45309', marginTop: '6px', fontWeight: 600 }}>
                SOURCE: Satellite Vision Head &bull; Prototype analytical alert
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: '#F8FAFC', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: '#64748B' }}>
            <span>Forecast Horizon: <strong>WeatherNext 15-Day Ensemble</strong></span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: FORECAST SUMMARY TABLE & ACTIVE ALERTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '12px', marginTop: '12px' }}>
        {/* Forecast Summary Table (6h, 12h, 24h, 48h, 72h, 120h) */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>FORECAST SUMMARY (WEATHERNEXT CYCLONES ENSEMBLE MEAN)</span>
            </div>
            <span className="badge badge-demo">SIMULATED FORECAST</span>
          </div>
          <div style={{ padding: '0', overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Horizon</th>
                  <th>Valid Time</th>
                  <th>Position</th>
                  <th>Wind (km/h)</th>
                  <th>Knots</th>
                  <th>Pressure</th>
                  <th>Classification</th>
                  <th>Uncertainty</th>
                </tr>
              </thead>
              <tbody>
                {selectedCyclone.forecastTrack.map((pt) => (
                  <tr key={pt.hourOffset}>
                    <td><strong className="font-mono">T+{pt.hourOffset}h</strong></td>
                    <td className="font-mono">{pt.time}</td>
                    <td className="font-mono">{pt.lat.toFixed(2)}°N, {pt.lng.toFixed(2)}°E</td>
                    <td><strong style={{ color: pt.windKmh >= 118 ? '#DC2626' : '#D97706' }}>{pt.windKmh} km/h</strong></td>
                    <td className="font-mono">{pt.windKnots} kts</td>
                    <td className="font-mono">{pt.pressureHpa} hPa</td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '10px' }}>{pt.category}</span></td>
                    <td className="font-mono" style={{ color: '#64748B' }}>±{pt.uncertaintyRadiusKm} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Analytical Alerts Log */}
        <div className="panel">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={13} className="text-warn" />
              <span>ACTIVE ANALYTICAL ALERTS ({alerts.length})</span>
            </div>
            <span style={{ fontSize: '10px', color: '#64748B' }}>NOT OFFICIAL WARNINGS</span>
          </div>
          <div style={{ padding: '8px', maxHeight: '185px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '6px 8px',
                  background: alert.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                  border: `1px solid ${alert.severity === 'CRITICAL' ? '#FECACA' : '#FDE68A'}`,
                  borderRadius: '3px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    className={`badge ${alert.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warn'}`}
                    style={{ fontSize: '9px', padding: '1px 4px' }}
                  >
                    {alert.severity}
                  </span>
                  <span className="font-mono text-muted" style={{ fontSize: '9px' }}>
                    {alert.timestamp}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '10px', color: '#52606D', marginTop: '2px' }}>
                  {alert.message.slice(0, 110)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
