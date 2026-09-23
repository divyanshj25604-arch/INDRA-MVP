import React from 'react';
import { ShieldAlert, Radio, Database, Cpu, Clock, User, AlertTriangle } from 'lucide-react';

interface GlobalHeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  isDemoMode,
  onToggleDemoMode,
}) => {
  return (
    <header className="global-header-container">
      {/* Primary Institutional Bar */}
      <div className="main-header-row">
        <div className="header-left">
          <div className="gov-seal">
            <span className="seal-text">GOVT OF INDIA</span>
            <div className="seal-sub">METEOROLOGICAL RESEARCH & DECISION SUPPORT</div>
          </div>
          <div className="title-block">
            <div className="brand-line">
              <span className="brand-acronym">CIFS</span>
              <span className="brand-divider">|</span>
              <h1 className="brand-fullname">CYCLONE INTELLIGENCE & FORECAST SYSTEM</h1>
            </div>
            <div className="brand-subtitle">
              North Indian Ocean Basin &bull; Tropical Cyclone Pattern Identification, Classification & Ensemble Prediction
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="header-telemetry-group">
            <div className="telemetry-item">
              <span className="telemetry-label">SYSTEM STATE</span>
              <span className="telemetry-val text-safe">
                <span className="pulse-dot"></span> OPERATIONAL
              </span>
            </div>

            <div className="telemetry-divider"></div>

            <div className="telemetry-item">
              <span className="telemetry-label">INSAT-3D/3DR</span>
              <span className="telemetry-val text-info">AVAILABLE</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">IMD BEST TRACK</span>
              <span className="telemetry-val text-info">AVAILABLE</span>
            </div>

            <div className="telemetry-item">
              <span className="telemetry-label">WEATHERNEXT</span>
              <span className="telemetry-val text-warn">AVAILABLE / DEMO</span>
            </div>

            <div className="telemetry-divider"></div>

            <div className="telemetry-item font-mono">
              <span className="telemetry-label">TIMESTAMP (IST)</span>
              <span className="telemetry-val">22 SEP 2026 | 14:30:00</span>
            </div>

            <div className="telemetry-divider"></div>

            <div className="operator-box">
              <User size={13} className="text-secondary" />
              <div className="operator-details">
                <span className="operator-role">METEOROLOGICAL ANALYSIS UNIT</span>
                <span className="operator-station">DUTY SCIENTIST: RSMC-DIV</span>
              </div>
            </div>

            <button
              onClick={onToggleDemoMode}
              className={`demo-toggle-btn ${isDemoMode ? 'active-demo' : ''}`}
              title="Click to toggle simulation parameters"
            >
              <span className="demo-indicator">●</span> DEMO MODE: ON
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Status & Official Disclaimer Strip */}
      <div className="status-strip">
        <div className="status-strip-left">
          <span className="status-strip-title">DATA INGESTION PIPELINE:</span>
          <span className="feed-status"><Radio size={11} className="feed-icon" /> MOSDAC L1B (4km IR): <strong className="font-mono">14:00 IST</strong></span>
          <span className="feed-status"><Database size={11} className="feed-icon" /> IMD RSMC Advisory: <strong className="font-mono">12:00 IST</strong></span>
          <span className="feed-status"><Cpu size={11} className="feed-icon" /> WeatherNext Ens (50-member): <strong className="font-mono">14:05 IST</strong></span>
          <span className="sync-note font-mono">Sync: 14:28:12 IST</span>
        </div>

        <div className="status-strip-right">
          <span className="official-disclaimer">
            <AlertTriangle size={12} className="disclaimer-icon" />
            Decision-support prototype for SIH 2026 (PS 26070). Official warnings remain the responsibility of authorized meteorological agencies.
          </span>
        </div>
      </div>
    </header>
  );
};
