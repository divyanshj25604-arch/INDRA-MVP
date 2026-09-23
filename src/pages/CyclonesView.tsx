import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import {
  CycloneSystem,
  CoastalDistrict,
  SatelliteObservation,
  RapidIntensificationFeatures,
} from '../types';
import { GISMap } from '../components/GISMap';
import { CycloneDetailDrawer } from '../components/CycloneDetailDrawer';

interface CyclonesViewProps {
  cyclones: CycloneSystem[];
  selectedCyclone: CycloneSystem | null;
  onSelectCyclone: (cyclone: CycloneSystem) => void;
  observation?: SatelliteObservation | null;
  riData?: RapidIntensificationFeatures | null;
  districts?: CoastalDistrict[];
  onSelectDistrict?: (district: CoastalDistrict) => void;
  onOpenRiModal: () => void;
  onOpenMethodology: () => void;
}

export const CyclonesView: React.FC<CyclonesViewProps> = ({
  cyclones,
  selectedCyclone,
  onSelectCyclone,
  observation,
  riData,
  districts = [],
  onSelectDistrict,
  onOpenRiModal,
  onOpenMethodology,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const active = selectedCyclone || (cyclones.length > 0 ? cyclones[0] : null);

  const handleSelectCyclone = (sys: CycloneSystem) => {
    onSelectCyclone(sys);
    setIsDrawerOpen(true);
  };

  return (
    <div className="cyclones-view-container">
      {/* Full-bleed Map */}
      <div className="cyclones-map-wrapper">
        <GISMap
          cyclones={cyclones}
          selectedCyclone={active}
          onSelectCyclone={handleSelectCyclone}
          districts={districts}
          onSelectDistrict={onSelectDistrict}
          height="100%"
          showOverlayHeader={false}
          showLayerControl={true}
        />
      </div>

      {/* Floating Left Panel: Active Cyclones */}
      <div className="floating-cyclones-panel">
        <div className="floating-panel-header">
          <div className="floating-panel-title">
            <Compass size={14} className="text-info" />
            <span>ACTIVE CYCLONES</span>
          </div>
          <span className="badge badge-danger">
            {cyclones.length} ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cyclones.map((sys) => {
            const isSelected = active && sys.id === active.id;
            const isSevere = sys.maxWindKmh >= 118;
            return (
              <div
                key={sys.id}
                onClick={() => handleSelectCyclone(sys)}
                className={`cyclone-card-item ${isSelected ? 'selected' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isSevere ? '#DC2626' : '#EA580C',
                        display: 'inline-block',
                      }}
                    />
                    <strong style={{ fontSize: '12px', color: '#F8FAFC' }}>
                      {sys.id}
                    </strong>
                  </div>
                  <span
                    className={`badge ${isSevere ? 'badge-danger' : 'badge-warn'}`}
                    style={{ fontSize: '9px', padding: '1px 5px' }}
                  >
                    {sys.maxWindKmh} km/h
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '3px', fontWeight: 600 }}>
                  {sys.classification}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                  <span>Moving {sys.movementDirection} @ {sys.movementSpeedKmh} km/h</span>
                  <span className="font-mono">{sys.currentLat.toFixed(1)}°N, {sys.currentLng.toFixed(1)}°E</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Basin Chip */}
      <div className="floating-map-toolbar">
        <span className="map-toolbar-label">BASIN:</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#F8FAFC' }}>
          NORTH INDIAN OCEAN
        </span>
        <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: '10px', color: '#94A3B8' }}>
          Bay of Bengal &bull; Arabian Sea
        </span>
      </div>

      {/* Right Drawer: Selected Cyclone Detail Drawer */}
      {isDrawerOpen && active && (
        <CycloneDetailDrawer
          cyclone={active}
          observation={observation}
          riData={riData}
          onClose={() => setIsDrawerOpen(false)}
          onOpenRiAnalysis={onOpenRiModal}
          onOpenMethodology={onOpenMethodology}
        />
      )}
    </div>
  );
};
