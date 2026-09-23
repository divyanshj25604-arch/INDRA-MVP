import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Bell, Filter, CheckCircle2 } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertCenterViewProps {
  alerts: AlertItem[];
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({ alerts }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} className="text-warn" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                OPERATIONAL ANALYTICAL ALERTS & AUDIT LOG
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Real-time threshold triggers dispatched by Satellite Vision, WeatherNext Ensembles, and GIS Exposure Intersectors
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`gov-btn gov-btn-sm ${filterSeverity === sev ? 'gov-btn-primary' : ''}`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent Institutional Disclaimer Warning */}
      <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontSize: '11px' }}>
          <AlertTriangle size={15} className="text-warn" style={{ flexShrink: 0 }} />
          <span>
            <strong>MANDATORY OPERATIONAL PROTOCOL: </strong>
            All alerts generated on this platform are <em>prototype analytical indicators</em> intended for decision-support synthesis. They do not constitute official public advisories or government evacuation directives. Official warnings remain the sole responsibility of authorized meteorological authorities (IMD).
          </span>
        </div>
      </div>

      {/* Operational Alert History Log Table */}
      <div className="panel">
        <div className="panel-header">
          <span>DISPATCHED ANALYTICAL ALERT LOG ({filtered.length})</span>
          <span className="font-mono text-muted" style={{ fontSize: '10px' }}>LIVE DISPATCH FEED</span>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Alert ID</th>
              <th>Timestamp</th>
              <th>System</th>
              <th>Severity</th>
              <th>Alert Title & Description</th>
              <th>Analytical Source</th>
              <th>Audit Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alert) => {
              const badgeClass =
                alert.severity === 'CRITICAL'
                  ? 'badge-danger'
                  : alert.severity === 'WARNING'
                  ? 'badge-warn'
                  : alert.severity === 'WATCH'
                  ? 'badge-info'
                  : 'badge-neutral';

              return (
                <tr key={alert.id}>
                  <td className="font-mono"><strong>{alert.id}</strong></td>
                  <td className="font-mono" style={{ fontSize: '11px' }}>{alert.timestamp}</td>
                  <td className="font-mono">{alert.cycloneId}</td>
                  <td>
                    <span className={`badge ${badgeClass}`}>{alert.severity}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#52606D' }}>
                      {alert.message}
                    </div>
                    <div style={{ fontSize: '9px', color: '#B45309', marginTop: '3px' }}>
                      {alert.confidenceNote}
                    </div>
                  </td>
                  <td style={{ fontSize: '11px', color: '#334155' }}>
                    <strong>{alert.source}</strong>
                  </td>
                  <td>
                    <span className="badge badge-safe">
                      {alert.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
