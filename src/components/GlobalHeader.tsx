import React from 'react';
import { Compass, ShieldAlert, Bell, HelpCircle, AlertTriangle } from 'lucide-react';

interface GlobalHeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenMethodology: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentTab,
  onSelectTab,
  isDemoMode,
  onToggleDemoMode,
  onOpenMethodology,
}) => {
  return (
    <header className="global-header-container">
      {/* Primary Brand & Navigation Bar */}
      <div className="main-header-row" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Brand */}
        <div className="header-left">
          <div className="gov-seal">
            <span className="seal-text">DECISION SUPPORT</span>
            <div className="seal-sub">SIH 2026 &bull; PS 26070</div>
          </div>
          <div className="title-block">
            <div className="brand-line">
              <span className="brand-acronym">CIFS</span>
              <span className="brand-divider">|</span>
              <h1 className="brand-fullname">CYCLONE INTELLIGENCE & FORECAST SYSTEM</h1>
            </div>
            <div className="brand-subtitle">
              North Indian Ocean Basin &bull; Multi-Source Tropical Cyclone Identification, Classification & Prediction
            </div>
          </div>
        </div>

        {/* Center: Primary Product Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => onSelectTab('cyclones')}
            className={`nav-tab-btn ${currentTab === 'cyclones' ? 'active' : ''}`}
            style={{ borderRadius: '3px', borderBottom: 'none', padding: '6px 14px' }}
          >
            <Compass size={14} />
            <span>CYCLONES</span>
          </button>

          <button
            onClick={() => onSelectTab('post_landfall')}
            className={`nav-tab-btn ${currentTab === 'post_landfall' ? 'active' : ''}`}
            style={{ borderRadius: '3px', borderBottom: 'none', padding: '6px 14px' }}
          >
            <ShieldAlert size={14} />
            <span>POST-LANDFALL</span>
          </button>

          <button
            onClick={() => onSelectTab('alerts')}
            className={`nav-tab-btn ${currentTab === 'alerts' ? 'active' : ''}`}
            style={{ borderRadius: '3px', borderBottom: 'none', padding: '6px 14px' }}
          >
            <Bell size={14} />
            <span>ALERTS</span>
          </button>
        </div>

        {/* Right: Demo Mode & Methodology */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="font-mono" style={{ fontSize: '10px', color: '#94A3B8' }}>
            22 SEP 2026 | 14:00 IST
          </div>

          <button
            onClick={onToggleDemoMode}
            className={`demo-toggle-btn ${isDemoMode ? 'active-demo' : ''}`}
            title="Click to view simulation parameters"
          >
            <span className="demo-indicator">●</span> DEMO MODE
          </button>

          <button
            onClick={onOpenMethodology}
            className="transparency-trigger-btn"
            title="Inspect Data Sources, AI Models & Validation"
          >
            <HelpCircle size={13} />
            <span>Methodology</span>
          </button>
        </div>
      </div>

      {/* Subtle Persistent Disclaimer Strip */}
      <div className="status-strip" style={{ padding: '3px 16px', background: '#070F1A', borderBottom: '1px solid #1A2636' }}>
        <div className="status-strip-left" style={{ fontSize: '10px', color: '#94A3B8' }}>
          <span>BASIN TELEMETRY:</span>
          <span style={{ color: '#E2E8F0' }}>2 Available Systems (BOB-2601, ARB-2602)</span>
          <span style={{ color: '#64748B' }}>&bull;</span>
          <span>Sensors: INSAT-3D TIR-1 (4km) &bull; WeatherNext Ensemble (50-member)</span>
        </div>

        <div className="status-strip-right">
          <span className="official-disclaimer" style={{ fontSize: '10px' }}>
            <AlertTriangle size={11} className="disclaimer-icon" />
            Decision-support prototype. Official warnings remain the responsibility of authorized meteorological agencies.
          </span>
        </div>
      </div>
    </header>
  );
};
