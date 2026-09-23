import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';
import { CycloneSystem, CoastalDistrict } from '../types';
import { GISMap } from '../components/GISMap';
import { DistrictDetailModal } from '../components/DistrictDetailModal';

interface ImpactRiskViewProps {
  cyclone: CycloneSystem;
  districts: CoastalDistrict[];
  landfallProbabilities?: { region: string; probability: number; trend: string }[];
  onOpenMethodology?: () => void;
}

export const ImpactRiskView: React.FC<ImpactRiskViewProps> = ({
  cyclone,
  districts,
  onOpenMethodology,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<CoastalDistrict | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div className="panel" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} className="text-danger" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.03em', margin: 0 }}>
                POST-LANDFALL IMPACT
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
              Translate cyclone forecasts into regional impact information &bull; Coastal District Exposure & Vulnerability
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-demo">PROTOTYPE RISK INDEX</span>
            {onOpenMethodology && (
              <button onClick={onOpenMethodology} className="gov-btn">
                <HelpCircle size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                <span>How Risk is Formulated</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Full Map (Left) + Priority District Cards (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px', minHeight: '600px' }}>
        {/* Map Container */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="panel-header">
            <span>FORECAST LANDFALL REGION & DISTRICT EXPOSURE</span>
            <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
              SYSTEM: {cyclone.id}
            </span>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <GISMap
              cyclone={cyclone}
              districts={districts}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              height="100%"
              showOverlayHeader={false}
            />
          </div>
        </div>

        {/* Priority District Impact Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header">
              <span>AFFECTED COASTAL DISTRICTS</span>
              <span className="badge badge-neutral">{districts.length} DISTRICTS</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {districts.map((d) => {
                const isCritical = d.compositeRisk === 'CRITICAL';
                const isHigh = d.compositeRisk === 'HIGH';
                const borderAccent = isCritical ? '#DC2626' : isHigh ? '#EA580C' : '#D97706';

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    className="district-impact-card"
                    style={{ borderLeft: `4px solid ${borderAccent}` }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {d.name.toUpperCase()}
                      </span>
                      <span className={`badge ${isCritical ? 'badge-danger' : isHigh ? 'badge-warn' : 'badge-info'}`}>
                        {d.compositeRisk}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '1px' }}>
                      State: {d.state} &bull; Distance to Eye: <strong className="font-mono">{d.distanceToCenterKm} km</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '8px', background: '#F8FAFC', padding: '6px 8px', borderRadius: '3px' }}>
                      <div>
                        <span style={{ fontSize: '9px', color: '#64748B' }}>PEAK WIND</span>
                        <div className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
                          {d.maxForecastWindKmh} km/h
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '9px', color: '#64748B' }}>24H RAINFALL</span>
                        <div className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                          {d.forecastRainfall24hMm} mm
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '9px', color: '#64748B' }}>EST. IMPACT</span>
                        <div className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#B45309' }}>
                          ~{d.timeToImpactHours} h
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                      <span style={{ color: '#64748B' }}>Landfall Prob: <strong className="font-mono">{d.landfallProbabilityPercent}%</strong></span>
                      <span style={{ color: '#1D4ED8', fontWeight: 600 }}>Click for Deep Profile &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Proxy Disclaimer */}
          <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertTriangle size={15} className="text-warn" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '10px', color: '#78350F', lineHeight: 1.45 }}>
                <strong>ANALYTICAL DECISION-SUPPORT PROXY: </strong>
                Prototype Risk Index derived from meteorological wind field and coastal exposure intersection. Does not replace official warnings or evacuation orders issued by State Disaster Management Authorities (SDMAs).
              </div>
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
