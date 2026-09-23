import React from 'react';
import { Compass, ShieldAlert, Bell, HelpCircle } from 'lucide-react';

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
  onOpenMethodology?: () => void;
}

export const NAV_TABS: NavTabItem[] = [
  {
    id: 'cyclones',
    label: 'CYCLONES',
    shortLabel: 'Cyclones',
    icon: <Compass size={14} />,
    badge: '2 ACTIVE',
    badgeType: 'danger',
  },
  {
    id: 'post_landfall',
    label: 'POST-LANDFALL',
    shortLabel: 'Impact',
    icon: <ShieldAlert size={14} />,
    badge: '6 DISTRICTS',
    badgeType: 'warn',
  },
  {
    id: 'alerts',
    label: 'ALERTS',
    shortLabel: 'Alerts',
    icon: <Bell size={14} />,
    badge: 'SIGNALS',
    badgeType: 'info',
  },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenMethodology,
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
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="transparency-trigger-btn"
            title="Inspect AI & Forecast Methodology"
          >
            <HelpCircle size={13} />
            <span>METHODOLOGY</span>
          </button>
        )}
      </div>
    </nav>
  );
};
