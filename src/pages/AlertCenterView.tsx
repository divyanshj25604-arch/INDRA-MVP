import React, { useState } from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertCenterViewProps {
  alerts: AlertItem[];
  onSelectCyclone?: (cycloneId: string) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  onSelectCyclone,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Map raw severities to HIGH, MEDIUM, INFO
  const normalizedAlerts = alerts.map((a) => {
    let level: 'HIGH' | 'MEDIUM' | 'INFO' = 'INFO';
    if (a.severity === 'CRITICAL' || a.title.toLowerCase().includes('intensification')) {
      level = 'HIGH';
    } else if (a.severity === 'WARNING' || a.severity === 'WATCH') {
      level = 'MEDIUM';
    } else {
      level = 'INFO';
    }
    return { ...a, level };
  });

  const filtered = normalizedAlerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.level === filterSeverity;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} className="text-info" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '0.03em', margin: 0 }}>
                ALERT CENTER
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
              Current analytical signals &bull; Decision-support triggers from satellite vision and ensemble forecasts
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'HIGH', 'MEDIUM', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`gov-btn gov-btn-sm ${filterSeverity === sev ? 'gov-btn-primary' : ''}`}
                style={{ fontWeight: 600 }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytical Signal Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((alert) => {
          const isHigh = alert.level === 'HIGH';
          const isMed = alert.level === 'MEDIUM';
          const badgeClass = isHigh ? 'badge-danger' : isMed ? 'badge-warn' : 'badge-info';
          const borderAccent = isHigh ? '#DC2626' : isMed ? '#EA580C' : '#2563EB';

          return (
            <div
              key={alert.id}
              className="panel"
              style={{
                padding: '12px 16px',
                borderLeft: `4px solid ${borderAccent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${badgeClass}`} style={{ fontWeight: 700 }}>
                    {alert.level}
                  </span>
                  <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
                    {alert.cycloneId}
                  </span>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
                    &bull; {alert.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                  {alert.title}
                </div>

                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
                  {alert.message}
                </div>
              </div>

              {onSelectCyclone && (
                <button
                  onClick={() => onSelectCyclone(alert.cycloneId)}
                  className="gov-btn gov-btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '6px 12px',
                    flexShrink: 0,
                  }}
                >
                  <span>VIEW CYCLONE</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Institutional Footer */}
      <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px', color: '#64748B' }}>
        Analytical decision-support signals. Official warnings remain the responsibility of authorized meteorological agencies.
      </div>
    </div>
  );
};
