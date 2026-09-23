import React from 'react';
import { Database, ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';
import { DataSourceStatus } from '../types';

interface DataSourcesViewProps {
  sources: DataSourceStatus[];
}

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({ sources }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                DATA SOURCES, INGESTION PROVENANCE & LICENSING
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Transparent Provenance Audit for Earth Observation, Historical Best Track Archives, NWP Ensembles, and GIS Vectors
            </div>
          </div>

          <span className="badge badge-info">ALL SOURCES AUDITED</span>
        </div>
      </div>

      {/* Institutional Provenance Notice */}
      <div className="panel" style={{ background: '#FFFBEB', borderColor: '#FDE68A', padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontSize: '11px' }}>
          <AlertTriangle size={15} className="text-warn" style={{ flexShrink: 0 }} />
          <span>
            <strong>DATA INGESTION INTEGRITY NOTICE: </strong>
            To strictly adhere to operational integrity guidelines, all data feeds clearly denote whether they are operational live feeds or deterministic research simulation sandbox feeds. No simulated feeds are disguised as official live feeds.
          </span>
        </div>
      </div>

      {/* Data Source Provenance Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sources.map((src, i) => (
          <div key={i} className="panel">
            <div className="panel-header" style={{ background: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-mono text-muted">DS-0{i + 1}</span>
                <span style={{ fontWeight: 700 }}>{src.name}</span>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>{src.provider}</span>
              </div>
              <span className={`badge ${src.status.includes('OPERATIONAL') ? 'badge-safe' : 'badge-demo'}`}>
                {src.status}
              </span>
            </div>

            <div className="panel-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>PURPOSE & INTEGRATION SPECIFICATION</div>
                  <div style={{ fontSize: '12px', color: '#1E293B', marginTop: '3px', lineHeight: 1.45 }}>
                    {src.purpose}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#475569' }}>
                    <strong>Native Data Format: </strong>
                    <span className="font-mono">{src.dataFormat}</span>
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '3px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Update Frequency / Latency:</span>
                    <strong className="font-mono">{src.latency}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Last Synchronization:</span>
                    <span className="font-mono">{src.lastUpdated}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Access & License:</span>
                    <span style={{ fontWeight: 600, color: '#1E40AF' }}>{src.license}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
