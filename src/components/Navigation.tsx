import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Satellite,
  Layers,
  TrendingUp,
  GitBranch,
  Flame,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Database,
  Activity,
  HelpCircle,
} from 'lucide-react';

export interface NavTabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'danger' | 'warn' | 'info' | 'neutral';
}

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenTransparencyModal?: () => void;
}

export const NAV_TABS: NavTabItem[] = [
  {
    id: 'command_center',
    label: 'COMMAND CENTER',
    shortLabel: 'Overview',
    icon: <LayoutDashboard size={14} />,
  },
  {
    id: 'active_systems',
    label: 'ACTIVE SYSTEMS',
    shortLabel: 'Active',
    icon: <Compass size={14} />,
    badge: '2 ACTIVE',
    badgeType: 'danger',
  },
  {
    id: 'satellite_analysis',
    label: 'SATELLITE ANALYSIS',
    shortLabel: 'Satellite',
    icon: <Satellite size={14} />,
    badge: 'INSAT-3D',
    badgeType: 'info',
  },
  {
    id: 'cyclone_analysis',
    label: 'CYCLONE STRUCTURE',
    shortLabel: 'Structure',
    icon: <Layers size={14} />,
  },
  {
    id: 'forecast',
    label: 'WEATHERNEXT FORECAST',
    shortLabel: 'Forecast',
    icon: <TrendingUp size={14} />,
    badge: '15-DAY',
    badgeType: 'neutral',
  },
  {
    id: 'ensemble_uncertainty',
    label: 'ENSEMBLE & UNCERTAINTY',
    shortLabel: 'Ensemble',
    icon: <GitBranch size={14} />,
    badge: '50 MEMBERS',
    badgeType: 'warn',
  },
  {
    id: 'rapid_intensification',
    label: 'RAPID INTENSIFICATION',
    shortLabel: 'RI Monitor',
    icon: <Flame size={14} />,
    badge: 'HIGH SIGNAL',
    badgeType: 'danger',
  },
  {
    id: 'impact_risk',
    label: 'IMPACT & RISK',
    shortLabel: 'District Risk',
    icon: <ShieldAlert size={14} />,
    badge: '6 DISTRICTS',
    badgeType: 'danger',
  },
  {
    id: 'historical_replay',
    label: 'HISTORICAL REPLAY',
    shortLabel: 'Replay',
    icon: <RotateCcw size={14} />,
  },
  {
    id: 'model_validation',
    label: 'MODEL VALIDATION',
    shortLabel: 'Validation',
    icon: <CheckCircle2 size={14} />,
  },
  {
    id: 'data_sources',
    label: 'DATA SOURCES',
    shortLabel: 'Sources',
    icon: <Database size={14} />,
  },
  {
    id: 'system_status',
    label: 'SYSTEM HEALTH & PIPELINE',
    shortLabel: 'Pipeline',
    icon: <Activity size={14} />,
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenTransparencyModal,
}) => {
  return (
    <nav className="subnav-container">
      <div className="nav-tabs-wrapper">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-title">{tab.label}</span>
              {tab.badge && (
                <span className={`tab-badge tab-badge-${tab.badgeType || 'neutral'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="nav-actions">
        {onOpenTransparencyModal && (
          <button
            onClick={onOpenTransparencyModal}
            className="transparency-trigger-btn"
            title="Inspect AI & Forecast Methodology"
          >
            <HelpCircle size={13} />
            <span>HOW WAS THIS CALCULATED?</span>
          </button>
        )}
      </div>
    </nav>
  );
};
