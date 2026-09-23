import React from 'react';
import { ShieldAlert, AlertTriangle, Wind, CloudRain, Clock, MapPin, Building2, X } from 'lucide-react';
import { CoastalDistrict } from '../types';

interface DistrictDetailModalProps {
  district: CoastalDistrict | null;
  onClose: () => void;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  district,
  onClose,
}) => {
  if (!district) return null;

  const riskBadgeClass =
    district.compositeRisk === 'CRITICAL'
      ? 'badge-danger'
      : district.compositeRisk === 'HIGH'
      ? 'badge-warn'
      : 'badge-info';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} className="text-warn" />
            <span className="modal-title">DISTRICT IMPACT PROFILE &bull; {district.name.toUpperCase()} ({district.state.toUpperCase()})</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Overview Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '3px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{district.name} District</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>State: {district.state} &bull; Coordinates: {district.lat.toFixed(2)}°N, {district.lng.toFixed(2)}°E</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>COMPOSITE RISK LEVEL</div>
              <span className={`badge ${riskBadgeClass}`} style={{ fontSize: '12px', padding: '3px 8px' }}>
                {district.compositeRisk}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>CYCLONE DISTANCE</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {district.distanceToCenterKm} km
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Distance to vortex eye</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>PEAK FORECAST WIND</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                {district.maxForecastWindKmh} km/h
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Gusts up to {Math.round(district.maxForecastWindKmh * 1.15)} km/h</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>24H PRECIPITATION</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>
                {district.forecastRainfall24hMm} mm
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Extremely heavy band</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>LANDFALL PROBABILITY</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#D97706', marginTop: '2px' }}>
                {district.landfallProbabilityPercent}%
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Ensemble intersection</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>POPULATION EXPOSURE</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {district.populationExposure}
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Low-elevation coastal zone</div>
            </div>

            <div className="panel" style={{ padding: '8px 10px', background: '#FFFFFF' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>TIME TO EARLIEST IMPACT</div>
              <div className="font-mono" style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626', marginTop: '2px' }}>
                {district.timeToImpactHours} Hours
              </div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>Gale wind onset window</div>
            </div>
          </div>

          {/* Reasons for Risk */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '6px' }}>
              ANALYTICAL REASONS FOR RISK LEVEL
            </div>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '3px', padding: '10px 12px' }}>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#78350F', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {district.reasonsForRisk.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Critical Infrastructure Facilities */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={13} className="text-secondary" />
              <span>CRITICAL INFRASTRUCTURE AT RISK</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {district.keyFacilities.map((fac, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  {fac}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '14px', padding: '8px 10px', background: '#F1F5F9', border: '1px solid var(--border-light)', borderRadius: '3px', fontSize: '10px', color: '#64748B' }}>
            * Disclaimer: Prototype Risk Index derived from WeatherNext ensemble trajectories and GADM/Census geographic layers. Refer to State Disaster Management Authority (SDMA) for official operational evacuation orders.
          </div>
        </div>

        <div style={{ padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="gov-btn gov-btn-primary" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
