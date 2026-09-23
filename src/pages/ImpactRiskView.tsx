import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Building2,
  Users,
  Wind,
  CloudRain,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { CycloneSystem, CoastalDistrict } from '../types';
import { GISMap } from '../components/GISMap';
import { DistrictDetailModal } from '../components/DistrictDetailModal';

interface ImpactRiskViewProps {
  cyclone: CycloneSystem;
  districts: CoastalDistrict[];
  landfallProbabilities: { region: string; probability: number; trend: string }[];
  onOpenTransparencyModal: () => void;
}

export const ImpactRiskView: React.FC<ImpactRiskViewProps> = ({
  cyclone,
  districts,
  landfallProbabilities,
  onOpenTransparencyModal,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<CoastalDistrict | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} className="text-danger" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                COASTAL IMPACT & GEOSPATIAL RISK INTELLIGENCE
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Translating Meteorological Wind & Surge Scenarios into High-Resolution District Exposure Matrices
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-demo">PROTOTYPE RISK INDEX</span>
            <button onClick={onOpenTransparencyModal} className="gov-btn">
              <HelpCircle size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              <span>How Risk is Calculated</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regional Landfall Probabilities Bar */}
      <div className="panel" style={{ padding: '10px 14px', background: '#F8FAFC' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
          REGIONAL ENSEMBLE LANDFALL PROBABILITY DISTRIBUTION (DEMO ENSEMBLE)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {landfallProbabilities.map((region) => (
            <div
              key={region.region}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '3px',
                padding: '8px 10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0F172A' }}>{region.region}</span>
                <span className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: region.probability > 30 ? '#DC2626' : '#D97706' }}>
                  {region.probability}%
                </span>
              </div>
              <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden', margin: '6px 0 4px 0' }}>
                <div
                  style={{
                    width: `${region.probability}%`,
                    height: '100%',
                    backgroundColor: region.probability > 30 ? '#DC2626' : '#F59E0B',
                  }}
                />
              </div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>{region.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Map with Exposure Layer (Left) + Top Affected Areas Table (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '14px' }}>
        {/* Map Container */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
          <div className="panel-header">
            <span>COASTAL EXPOSURE MAP (DISTRICT HAZARD INTERSECTION)</span>
            <span className="badge badge-danger">CLICK DISTRICT FOR DEEP PROFILE</span>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <GISMap
              cyclone={cyclone}
              districts={districts}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              height="100%"
            />
          </div>
        </div>

        {/* Right Column: Coastal District Vulnerability Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <span>PRIORITY IMPACT DISTRICTS ({districts.length})</span>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>SORTED BY COMPOSITE RISK</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {districts.map((d) => {
                const isCritical = d.compositeRisk === 'CRITICAL';
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    className="panel"
                    style={{
                      padding: '8px 10px',
                      cursor: 'pointer',
                      borderLeft: isCritical ? '4px solid #DC2626' : '3px solid #EA580C',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          {d.name} ({d.state})
                        </span>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>
                          Dist to Eye: <strong className="font-mono">{d.distanceToCenterKm} km</strong> &bull; Earliest Impact: <strong className="font-mono" style={{ color: '#DC2626' }}>{d.timeToImpactHours}h</strong>
                        </div>
                      </div>
                      <span className={`badge ${isCritical ? 'badge-danger' : 'badge-warn'}`}>
                        {d.compositeRisk}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '6px', fontSize: '11px', background: '#F8FAFC', padding: '5px', borderRadius: '2px' }}>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '10px' }}>Peak Wind</span>
                        <div className="font-mono" style={{ fontWeight: 700, color: '#DC2626' }}>{d.maxForecastWindKmh} km/h</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '10px' }}>24h Rain</span>
                        <div className="font-mono" style={{ fontWeight: 700, color: '#2563EB' }}>{d.forecastRainfall24hMm} mm</div>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '10px' }}>Population</span>
                        <div className="font-mono" style={{ fontWeight: 700 }}>{d.populationExposure}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#78350F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Landfall Prob: <strong>{d.landfallProbabilityPercent}%</strong></span>
                      <span style={{ color: '#1D4ED8', fontWeight: 600 }}>Click to Inspect Profile &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prototype Institutional Disclaimer Box */}
          <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px' }}>
            <div style={{ fontSize: '10px', color: '#78350F', lineHeight: 1.4 }}>
              <strong>DECISION-SUPPORT NOTICE: </strong>
              The Prototype Risk Index combines forecast hazards with geographic exposure data. This prototype is intended for analytical decision support and does not replace official evacuation orders issued by State Disaster Management Authorities (SDMAs) or IMD advisories.
            </div>
          </div>
        </div>
      </div>

      {/* District Detail Modal */}
      <DistrictDetailModal
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />
    </div>
  );
};
