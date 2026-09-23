import React, { useState } from 'react';
import { Compass, Wind, Gauge, Navigation, Eye, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CycloneSystem } from '../types';

interface ActiveSystemsViewProps {
  cyclones: CycloneSystem[];
  selectedCyclone: CycloneSystem;
  onSelectCyclone: (c: CycloneSystem) => void;
  onNavigateToForecast: () => void;
  onNavigateToSatellite: () => void;
}

export const ActiveSystemsView: React.FC<ActiveSystemsViewProps> = ({
  cyclones,
  selectedCyclone,
  onSelectCyclone,
  onNavigateToForecast,
  onNavigateToSatellite,
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = cyclones.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'BOB') return c.basin === 'Bay of Bengal';
    if (filter === 'ARB') return c.basin === 'Arabian Sea';
    if (filter === 'SEVERE') return c.classification.includes('Severe');
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Title & Filter Bar */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                ACTIVE TROPICAL SYSTEMS &bull; NORTH INDIAN OCEAN BASIN
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Real-time monitoring covering Bay of Bengal, Arabian Sea, and equatorial Indian Ocean (RSMC New Delhi AOR)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'BOB', 'ARB', 'SEVERE'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`gov-btn ${filter === f ? 'gov-btn-primary' : ''}`}
                style={{ fontSize: '11px' }}
              >
                {f === 'BOB' ? 'Bay of Bengal' : f === 'ARB' ? 'Arabian Sea' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
        {filtered.map((storm) => {
          const isSelected = storm.id === selectedCyclone.id;
          const isVSCS = storm.classification.includes('Very Severe');

          return (
            <div
              key={storm.id}
              className="panel"
              style={{
                borderLeft: isSelected ? '4px solid #1D4ED8' : '1px solid var(--border-color)',
                backgroundColor: isSelected ? '#FAFBFD' : '#FFFFFF',
              }}
            >
              <div className="panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono text-muted">{storm.id}</span>
                  <span>{storm.name}</span>
                </div>
                <span className={`badge ${isVSCS ? 'badge-danger' : 'badge-warn'}`}>
                  {storm.classification}
                </span>
              </div>

              <div className="panel-body">
                {/* Basin and Coordinates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{storm.basin}</span>
                    <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '8px' }}>
                      Last Observed: <strong className="font-mono">{storm.lastObservedTime}</strong>
                    </span>
                  </div>
                  <div className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', background: '#F1F5F9', padding: '2px 6px', borderRadius: '2px' }}>
                    {storm.currentLat.toFixed(2)}°N, {storm.currentLng.toFixed(2)}°E
                  </div>
                </div>

                {/* Key Telemetry Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ background: '#F8FAFC', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>MAX SUSTAINED WIND</div>
                    <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                      {storm.maxWindKmh} km/h
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{storm.maxWindKnots} kts (3-min)</div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CENTRAL PRESSURE</div>
                    <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                      {storm.centralPressureHpa} hPa
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Observed Deficit</div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>MOVEMENT DIRECTION</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                      {storm.movementDirection}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>@ {storm.movementSpeedKmh} km/h</div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '8px', border: '1px solid var(--border-light)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>INTENSITY TREND</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: storm.trend === 'INTENSIFYING' ? '#DC2626' : '#D97706', marginTop: '3px' }}>
                      ↑ {storm.trend}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>AI Conf: {storm.confidencePercent}%</div>
                  </div>
                </div>

                {/* Wind Radii Details */}
                <div style={{ background: '#F1F5F9', padding: '8px 10px', borderRadius: '3px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                    EXTENT OF DAMAGING WINDS (RADII FROM VORTEX CENTER)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '11px' }}>
                    <div>Gale Force (≥63 km/h): <strong className="font-mono">{storm.windRadii.galeWindKm} km</strong></div>
                    <div>Storm Force (≥89 km/h): <strong className="font-mono">{storm.windRadii.stormWindKm} km</strong></div>
                    <div>Hurricane Force (≥118 km/h): <strong className="font-mono">{storm.windRadii.hurricaneWindKm} km</strong></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      onSelectCyclone(storm);
                      onNavigateToSatellite();
                    }}
                    className="gov-btn"
                  >
                    View Satellite Analysis
                  </button>
                  <button
                    onClick={() => {
                      onSelectCyclone(storm);
                      onNavigateToForecast();
                    }}
                    className="gov-btn gov-btn-primary"
                  >
                    <span>Inspect WeatherNext Forecast</span>
                    <ArrowRight size={13} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Meteorological Summary Table */}
      <div className="panel">
        <div className="panel-header">
          <span>BASIN METEOROLOGICAL COMPARISON MATRIX</span>
          <span className="font-mono" style={{ fontSize: '10px', color: '#64748B' }}>SOURCE: IMD ADVISORY &bull; WEATHERNEXT 2026</span>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>System ID</th>
              <th>System Name</th>
              <th>Basin</th>
              <th>Classification</th>
              <th>Lat / Lng</th>
              <th>Max Wind</th>
              <th>Central Pressure</th>
              <th>Motion Vector</th>
              <th>Trend</th>
              <th>Eye Feature</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cyclones.map((c) => (
              <tr key={c.id}>
                <td className="font-mono"><strong>{c.id}</strong></td>
                <td><strong>{c.name}</strong></td>
                <td>{c.basin}</td>
                <td><span className={`badge ${c.classification.includes('Very Severe') ? 'badge-danger' : 'badge-warn'}`}>{c.classification}</span></td>
                <td className="font-mono">{c.currentLat.toFixed(2)}°N, {c.currentLng.toFixed(2)}°E</td>
                <td className="font-mono"><strong style={{ color: '#DC2626' }}>{c.maxWindKmh} km/h</strong></td>
                <td className="font-mono">{c.centralPressureHpa} hPa</td>
                <td>{c.movementDirection} @ {c.movementSpeedKmh} km/h</td>
                <td style={{ color: '#DC2626', fontWeight: 600 }}>↑ {c.trend}</td>
                <td>{c.eyeDetected ? <span className="text-safe" style={{ fontWeight: 600 }}>YES ({c.eyeRadiusKm} km)</span> : 'OBSCURED'}</td>
                <td>
                  <button
                    onClick={() => onSelectCyclone(c)}
                    className="gov-btn gov-btn-sm"
                  >
                    Select Active
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
