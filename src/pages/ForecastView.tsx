import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  Clock,
  Layers,
  Compass,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { CycloneSystem } from '../types';
import { GISMap } from '../components/GISMap';

interface ForecastViewProps {
  cyclone: CycloneSystem;
  onOpenTransparencyModal: () => void;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  cyclone,
  onOpenTransparencyModal,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number>(24);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                WEATHERNEXT CYCLONES &bull; 15-DAY PROBABILISTIC FORECAST ENGINE
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              External Probabilistic Forecasting Backbone Generating Track, Intensity, and Steering Wind Scenarios
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-demo">SIMULATED FORECAST</span>
            <span className="font-mono text-muted" style={{ fontSize: '11px', background: '#F1F5F9', padding: '5px 8px', borderRadius: '3px' }}>
              INITIALIZATION: 22 SEP 2026 | 14:00 IST
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Forecast GIS Map (Left) + Horizon Summaries (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>
        {/* Forecast Map Container */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
          <div className="panel-header">
            <span>SYNOPTIC TRACK & PREDICTION CONE (WEATHERNEXT 50-MEMBER CONSENSUS)</span>
            <span className="font-mono" style={{ fontSize: '10px', color: '#64748B' }}>
              HORIZON: UP TO 15 DAYS
            </span>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <GISMap cyclone={cyclone} height="100%" />
          </div>
        </div>

        {/* Right Summary Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* External Backbone Architecture Callout */}
          <div className="panel" style={{ background: '#F8FAFC', border: '1px solid var(--border-color)' }}>
            <div className="panel-header" style={{ background: '#F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={13} className="text-info" />
                <span>FORECAST ENGINE SPECIFICATION</span>
              </div>
              <span className="badge badge-safe">CONNECTED / DEMO</span>
            </div>
            <div className="panel-body" style={{ fontSize: '11px', color: '#334155' }}>
              <p>
                <strong>WeatherNext Cyclones</strong> is the external probabilistic numerical weather prediction backbone. The CIFS platform assimilates its multi-physics perturbed trajectories to compute geospatial risk envelopes and district-level impact probabilities.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                <div>Backbone: <strong>WeatherNext-2026</strong></div>
                <div>Horizon: <strong>Up to 15 Days</strong></div>
                <div>Ensembles: <strong>50 Perturbations</strong></div>
                <div>Status: <strong className="text-safe">Active Stream</strong></div>
              </div>
            </div>
          </div>

          {/* Forecast Horizons Accordion / Table */}
          <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <span>FORECAST SUMMARY HORIZONS</span>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>6H TO 120H</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {cyclone.forecastTrack.map((pt) => {
                const isSelected = selectedHorizon === pt.hourOffset;
                return (
                  <div
                    key={pt.hourOffset}
                    onClick={() => setSelectedHorizon(pt.hourOffset)}
                    className="panel"
                    style={{
                      padding: '8px 10px',
                      cursor: 'pointer',
                      borderLeft: isSelected ? '3px solid #EA580C' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? '#FFF7ED' : '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono" style={{ fontWeight: 700, fontSize: '12px', color: isSelected ? '#C2410C' : '#0F172A' }}>
                        T+{pt.hourOffset} HOUR FORECAST
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '9px' }}>
                        {pt.time}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '6px', fontSize: '11px' }}>
                      <div>
                        <span style={{ color: '#64748B' }}>Position: </span>
                        <strong className="font-mono">{pt.lat.toFixed(2)}°N, {pt.lng.toFixed(2)}°E</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Wind: </span>
                        <strong style={{ color: '#DC2626' }}>{pt.windKmh} km/h</strong> ({pt.windKnots} kts)
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Pressure: </span>
                        <strong className="font-mono">{pt.pressureHpa} hPa</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Uncertainty: </span>
                        <strong className="font-mono">±{pt.uncertaintyRadiusKm} km</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '4px', fontSize: '10px', color: '#EA580C', fontWeight: 600 }}>
                      Category: {pt.category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
