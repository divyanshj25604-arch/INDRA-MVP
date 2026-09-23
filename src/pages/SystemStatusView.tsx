import React from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Server,
  Database,
  Radio,
  Layers,
  ShieldCheck,
  TrendingUp,
  GitBranch,
} from 'lucide-react';
import { SystemServiceHealth } from '../types';

interface SystemStatusViewProps {
  services: SystemServiceHealth[];
}

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({ services }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} className="text-safe" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                SYSTEM HEALTH MONITORING & END-TO-END PIPELINE ARCHITECTURE
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Microservice Health Telemetry &bull; Core 4 Pillars &bull; 9-Phase Operational Architecture Flow
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-safe">ALL 6 SUBSYSTEMS HEALTHY</span>
            <span className="font-mono text-muted" style={{ fontSize: '11px' }}>HEARTBEAT: 14:28:22 IST</span>
          </div>
        </div>
      </div>

      {/* WHY CIFS? 4 PILLARS SECTION */}
      <div className="panel">
        <div className="panel-header" style={{ background: '#F8FAFC' }}>
          <span>THE FOUR ARCHITECTURAL PILLARS OF CIFS</span>
          <span className="badge badge-info">PRODUCT CORE</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#1D4ED8' }}>01</span>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>OBSERVE</strong>
              </div>
              <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.45 }}>
                Automated computer vision extracts vortex cores, eye features, and intensity states directly from raw INSAT-3D/3DR thermal infrared imagery.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#EA580C' }}>02</span>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>FORECAST</strong>
              </div>
              <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.45 }}>
                WeatherNext Cyclones probabilistic deep NWP backbone computes up to 15-day forward ensemble trajectories with multi-physics perturbations.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#D97706' }}>03</span>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>QUANTIFY UNCERTAINTY</strong>
              </div>
              <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.45 }}>
                Instead of hiding uncertainty behind a single line, the platform projects 80% prediction regions, ensemble spread, and cross-model consensus.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626' }}>04</span>
                <strong style={{ fontSize: '12px', color: '#0F172A' }}>TRANSLATE TO IMPACT</strong>
              </div>
              <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.45 }}>
                Meteorological variables are intersected with coastal district demographics and infrastructure to generate actionable decision support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* END-TO-END PIPELINE DIAGRAM */}
      <div className="panel">
        <div className="panel-header">
          <span>END-TO-END SYSTEM PIPELINE ARCHITECTURE (DATA &bull; INTELLIGENCE &bull; DECISION)</span>
        </div>
        <div className="panel-body" style={{ background: '#0B1727', padding: '16px', borderRadius: '0 0 3px 3px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#CBD5E1',
              lineHeight: 1.6,
              overflowX: 'auto',
              whiteSpace: 'pre',
              textAlign: 'center',
            }}
          >
{`                    ┌─────────────────────────┐
                    │      INSAT / MOSDAC     │  (Geostationary L1B IR & WV)
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │   PREPROCESSING & LUT   │  (Radiometric Normalization & Denoising)
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │  DEEP VISION BACKBONE   │  (EfficientNet-B0 + YOLOv8-Geo Detector)
                    └────────────┬────────────┘
                                 ↓
               ┌─────────────────┴─────────────────┐
               ↓                                   ↓
       CYCLONE STATE TENSOR                STRUCTURE & EYE REGRESSION
       (Center, Wind, Pressure)            (Symmetry, Banding, CDO Density)
               │                                   │
               └─────────────────┬─────────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │   WEATHERNEXT CYCLONES  │  (External Probabilistic Backbone)
                    │     FORECAST ENGINE     │
                    └────────────┬────────────┘
                                 ↓
                     50-MEMBER ENSEMBLE SCENARIOS
                                 ↓
          ┌──────────────────────┼──────────────────────┐
          ↓                      ↓                      ↓
      TRACK CONE            INTENSITY TREND          WIND RADII
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │   UNCERTAINTY ENGINE    │  (Dispersion, Spread & Consensus Index)
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ RAPID INTENSIFICATION   │  (Shear, SST Anomaly, Thermodynamic Signal)
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ GEOSPATIAL RISK ENGINE  │  (Hazard × Exposure × Vulnerability)
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ OPERATIONAL GIS & AUDIT │  (Command Center, Alerts, Transparency)
                    └─────────────────────────┘`}
          </div>
        </div>
      </div>

      {/* MICROSERVICES HEALTH MONITORING TABLE */}
      <div className="panel">
        <div className="panel-header">
          <span>MICROSERVICES OPERATIONAL TELEMETRY</span>
          <span className="font-mono text-muted" style={{ fontSize: '10px' }}>PROD-CLUSTER-IN-WEST</span>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Subsystem Component</th>
              <th>Status</th>
              <th>Latency (ms)</th>
              <th>Last Heartbeat</th>
              <th>Error Rate</th>
              <th>Model / Engine Version</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc, i) => (
              <tr key={i}>
                <td><strong>{svc.service}</strong></td>
                <td style={{ color: '#52606D' }}>{svc.subsystem}</td>
                <td><span className="badge badge-safe">{svc.status}</span></td>
                <td className="font-mono">{svc.latencyMs} ms</td>
                <td className="font-mono">{svc.lastHeartbeat}</td>
                <td className="font-mono">{svc.errorRatePercent.toFixed(2)}%</td>
                <td className="font-mono" style={{ color: '#1E40AF', fontSize: '11px' }}>{svc.modelVersion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
