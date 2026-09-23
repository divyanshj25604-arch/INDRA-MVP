import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass, RotateCcw } from 'lucide-react';
import { CycloneSystem, CoastalDistrict, CycloneTrackPoint } from '../types';

interface GISMapProps {
  cyclone?: CycloneSystem;
  cyclones?: CycloneSystem[];
  selectedCyclone?: CycloneSystem | null;
  onSelectCyclone?: (cyclone: CycloneSystem) => void;
  districts?: CoastalDistrict[];
  onSelectDistrict?: (district: CoastalDistrict) => void;
  activeLayers?: {
    historicalTrack: boolean;
    forecastTrack: boolean;
    kalmanTrack: boolean;
    uncertaintyCone: boolean;
    ensembleTracks: boolean;
    windRadii: boolean;
    districts: boolean;
  };
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  height?: string;
  showLayerControl?: boolean;
  showOverlayHeader?: boolean;
}

export const GISMap: React.FC<GISMapProps> = ({
  cyclone,
  cyclones = [],
  selectedCyclone,
  onSelectCyclone,
  districts = [],
  onSelectDistrict,
  height = '100%',
  showLayerControl = true,
  showOverlayHeader = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Compute active target cyclone
  const activeCyclone = selectedCyclone || cyclone || (cyclones.length > 0 ? cyclones[0] : null);
  const allSystems = cyclones.length > 0 ? cyclones : (activeCyclone ? [activeCyclone] : []);

  // Layer Visibility State
  const [layers, setLayers] = useState({
    historicalTrack: true,
    forecastTrack: true,
    kalmanTrack: true,
    uncertaintyCone: true,
    ensembleTracks: true,
    windRadii: true,
    districts: true,
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [, setSelectedPointInfo] = useState<CycloneTrackPoint | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Bay of Bengal / India coastal basin
    const map = L.map(mapContainerRef.current, {
      center: [activeCyclone?.currentLat || 15.5, activeCyclone?.currentLng || 84.0],
      zoom: 5.5,
      minZoom: 4,
      maxZoom: 12,
      zoomControl: false,
    });

    // Add crisp OpenStreetMap base layer
    const baseTileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO | IMD/MOSDAC GIS Basin',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );
    baseTileLayer.addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Layers whenever active cyclone or layer toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear dynamic layer groups
    const layerGroupId = '__cifs_dynamic_layers__';
    let dynamicGroup = (map as any)[layerGroupId] as L.LayerGroup;
    if (dynamicGroup) {
      dynamicGroup.clearLayers();
    } else {
      dynamicGroup = L.layerGroup();
      (map as any)[layerGroupId] = dynamicGroup;
      dynamicGroup.addTo(map);
    }

    if (!activeCyclone) return;

    // 1. Wind Radii Circles (if enabled)
    if (layers.windRadii && activeCyclone.windRadii) {
      // Gale wind radius (63 km/h - ~34 kts)
      L.circle([activeCyclone.currentLat, activeCyclone.currentLng], {
        radius: activeCyclone.windRadii.galeWindKm * 1000,
        color: '#F59E0B',
        fillColor: '#FBBF24',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '3, 4',
      })
        .bindTooltip(`Gale Wind Extent (63 km/h): ${activeCyclone.windRadii.galeWindKm} km`, {
          sticky: true,
          className: 'map-tooltip',
        })
        .addTo(dynamicGroup);

      // Storm wind radius (89 km/h - ~48 kts)
      if (activeCyclone.windRadii.stormWindKm > 0) {
        L.circle([activeCyclone.currentLat, activeCyclone.currentLng], {
          radius: activeCyclone.windRadii.stormWindKm * 1000,
          color: '#EA580C',
          fillColor: '#F97316',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '2, 3',
        })
          .bindTooltip(`Storm Wind Extent (89 km/h): ${activeCyclone.windRadii.stormWindKm} km`, {
            sticky: true,
            className: 'map-tooltip',
          })
          .addTo(dynamicGroup);
      }

      // Hurricane wind radius (118 km/h - 64 kts)
      if (activeCyclone.windRadii.hurricaneWindKm > 0) {
        L.circle([activeCyclone.currentLat, activeCyclone.currentLng], {
          radius: activeCyclone.windRadii.hurricaneWindKm * 1000,
          color: '#DC2626',
          fillColor: '#EF4444',
          fillOpacity: 0.16,
          weight: 2,
        })
          .bindTooltip(
            `Hurricane Force Core (≥118 km/h): ${activeCyclone.windRadii.hurricaneWindKm} km radius`,
            { sticky: true, className: 'map-tooltip' }
          )
          .addTo(dynamicGroup);
      }
    }

    // 2. Ensemble Trajectories (if enabled)
    if (layers.ensembleTracks && activeCyclone.ensembleTrajectories?.length) {
      activeCyclone.ensembleTrajectories.forEach((ens) => {
        const latLngs: L.LatLngExpression[] = ens.points.map((p) => [p.lat, p.lng]);
        L.polyline(latLngs, {
          color: '#2563EB',
          weight: 0.8,
          opacity: 0.28,
        }).addTo(dynamicGroup);
      });
    }

    // 3. Forecast Uncertainty Cone (if enabled)
    if (layers.uncertaintyCone && activeCyclone.forecastTrack?.length) {
      const coneLeftPts: [number, number][] = [];
      const coneRightPts: [number, number][] = [];

      activeCyclone.forecastTrack.forEach((pt) => {
        const radiusDeg = (pt.uncertaintyRadiusKm || 40) / 111.0;
        coneLeftPts.push([pt.lat + radiusDeg * 0.7, pt.lng - radiusDeg * 0.7]);
        coneRightPts.push([pt.lat - radiusDeg * 0.7, pt.lng + radiusDeg * 0.7]);
      });

      const conePolygonCoords = [
        [activeCyclone.currentLat, activeCyclone.currentLng],
        ...coneLeftPts,
        ...coneRightPts.reverse(),
      ];

      L.polygon(conePolygonCoords as L.LatLngExpression[], {
        color: '#D97706',
        fillColor: '#F59E0B',
        fillOpacity: 0.14,
        weight: 1.2,
        dashArray: '4, 4',
      })
        .bindTooltip('Ensemble 80% Prediction Region', {
          sticky: true,
          className: 'map-tooltip',
        })
        .addTo(dynamicGroup);
    }

    // 4. Historical Track (solid dark/blue line)
    if (layers.historicalTrack && activeCyclone.historicalTrack?.length) {
      const histCoords: L.LatLngExpression[] = activeCyclone.historicalTrack.map((p) => [
        p.lat,
        p.lng,
      ]);
      L.polyline(histCoords, {
        color: '#1E293B',
        weight: 3.5,
        opacity: 0.9,
      }).addTo(dynamicGroup);

      activeCyclone.historicalTrack.forEach((p) => {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 4,
          fillColor: '#1E293B',
          fillOpacity: 1,
          color: '#FFFFFF',
          weight: 1.5,
        });

        marker.bindPopup(`
          <div style="font-family: var(--font-sans); padding: 8px 10px; min-width: 170px;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase;">Observed Best Track</div>
            <div style="font-size: 12px; font-weight: 700; color: #0F172A; margin: 2px 0;">${p.time}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: #334155;">Pos: ${p.lat.toFixed(2)}°N, ${p.lng.toFixed(2)}°E</div>
            <div style="font-size: 11px; margin-top: 4px;">Wind: <strong>${p.windKmh} km/h</strong> (${p.windKnots} kts)</div>
            <div style="font-size: 11px;">Pressure: <strong>${p.pressureHpa} hPa</strong></div>
            <div style="font-size: 11px; color: #1D4ED8; font-weight: 600; margin-top: 3px;">${p.category}</div>
          </div>
        `);
        marker.on('click', () => setSelectedPointInfo(p));
        marker.addTo(dynamicGroup);
      });
    }

    // 5. Short-term Kalman Smoothed Track (if enabled)
    if (layers.kalmanTrack && activeCyclone.kalmanTrack?.length) {
      const kalmanCoords: L.LatLngExpression[] = activeCyclone.kalmanTrack.map((p) => [
        p.lat,
        p.lng,
      ]);
      L.polyline(kalmanCoords, {
        color: '#0284C7',
        weight: 2.5,
        dashArray: '4, 4',
        opacity: 0.85,
      })
        .bindTooltip('Kalman Filter Smoothed State (0-6h)', {
          sticky: true,
          className: 'map-tooltip',
        })
        .addTo(dynamicGroup);
    }

    // 6. Forecast Mean Track (solid orange line)
    if (layers.forecastTrack && activeCyclone.forecastTrack?.length) {
      const forecastCoords: L.LatLngExpression[] = [
        [activeCyclone.currentLat, activeCyclone.currentLng],
        ...activeCyclone.forecastTrack.map((p) => [p.lat, p.lng] as [number, number]),
      ];

      L.polyline(forecastCoords, {
        color: '#EA580C',
        weight: 3.5,
        opacity: 0.95,
      }).addTo(dynamicGroup);

      activeCyclone.forecastTrack.forEach((p) => {
        const marker = L.circleMarker([p.lat, p.lng], {
          radius: 5,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          color: '#EA580C',
          weight: 2.5,
        });

        marker.bindPopup(`
          <div style="font-family: var(--font-sans); padding: 8px 10px; min-width: 180px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 10px; font-weight: 700; color: #C2410C; text-transform: uppercase;">T+${p.hourOffset}h Forecast</span>
              <span style="font-size: 9px; background: #FEF3C7; color: #92400E; padding: 1px 4px; border-radius: 2px; font-weight: 700;">DEMO</span>
            </div>
            <div style="font-size: 12px; font-weight: 700; color: #0F172A; margin: 2px 0;">${p.time}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: #334155;">Pos: ${p.lat.toFixed(2)}°N, ${p.lng.toFixed(2)}°E</div>
            <div style="font-size: 11px; margin-top: 4px;">Max Wind: <strong>${p.windKmh} km/h</strong> (${p.windKnots} kts)</div>
            <div style="font-size: 11px;">Pressure: <strong>${p.pressureHpa} hPa</strong></div>
            <div style="font-size: 11px; color: #C2410C; font-weight: 600; margin-top: 3px;">${p.category}</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 4px;">Uncertainty Radius: ±${p.uncertaintyRadiusKm} km</div>
          </div>
        `);
        marker.on('click', () => setSelectedPointInfo(p));
        marker.addTo(dynamicGroup);
      });
    }

    // 7. Coastal Districts Exposure Markers (if enabled)
    if (layers.districts && districts.length > 0) {
      districts.forEach((d) => {
        const riskColor =
          d.compositeRisk === 'CRITICAL'
            ? '#DC2626'
            : d.compositeRisk === 'HIGH'
            ? '#EA580C'
            : '#D97706';

        const districtMarker = L.circleMarker([d.lat, d.lng], {
          radius: d.compositeRisk === 'CRITICAL' ? 8 : 6,
          fillColor: riskColor,
          fillOpacity: 0.85,
          color: '#FFFFFF',
          weight: 2,
        });

        districtMarker.bindTooltip(
          `<strong>${d.name}, ${d.state}</strong><br/>Risk: ${d.compositeRisk} | Wind: ${d.maxForecastWindKmh} km/h`,
          { sticky: true, className: 'map-tooltip' }
        );

        districtMarker.on('click', () => {
          if (onSelectDistrict) onSelectDistrict(d);
        });

        districtMarker.addTo(dynamicGroup);
      });
    }

    // 8. Render All Cyclone System Markers
    allSystems.forEach((sys) => {
      const isSelected = activeCyclone && sys.id === activeCyclone.id;
      const severityColor =
        sys.maxWindKmh >= 118
          ? '#DC2626'
          : sys.maxWindKmh >= 89
          ? '#EA580C'
          : sys.maxWindKmh >= 62
          ? '#D97706'
          : '#2563EB';

      if (isSelected) {
        // Concentric pulse marker for the selected system
        const centerIcon = L.divIcon({
          className: 'cyclone-center-marker-container',
          html: `
            <div style="position: relative; width: 38px; height: 38px; transform: translate(-50%, -50%); cursor: pointer;">
              <div style="position: absolute; inset: 0; border-radius: 50%; background: ${severityColor}33; animation: pulse 2s infinite ease-out;"></div>
              <div style="position: absolute; inset: 7px; border-radius: 50%; border: 2.5px solid ${severityColor}; background: #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: ${severityColor};"></div>
              </div>
              <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #0E223D; color: #FFFFFF; font-family: var(--font-mono); font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 2px; white-space: nowrap; border: 1px solid rgba(255,255,255,0.2);">
                ${sys.id}
              </div>
            </div>
          `,
          iconSize: [38, 38],
        });

        const marker = L.marker([sys.currentLat, sys.currentLng], {
          icon: centerIcon,
          zIndexOffset: 1200,
        });

        marker.bindTooltip(
          `<strong>${sys.id}</strong> &bull; ${sys.classification}<br/>Wind: ${sys.maxWindKmh} km/h &bull; Moving ${sys.movementDirection}`,
          { sticky: true, className: 'map-tooltip' }
        );

        marker.on('click', () => {
          if (onSelectCyclone) onSelectCyclone(sys);
        });

        marker.addTo(dynamicGroup);
      } else {
        // Compact marker for unselected systems
        const compactIcon = L.divIcon({
          className: 'cyclone-compact-marker-container',
          html: `
            <div style="position: relative; width: 28px; height: 28px; transform: translate(-50%, -50%); cursor: pointer;">
              <div style="position: absolute; inset: 2px; border-radius: 50%; border: 2px solid #FFFFFF; background: ${severityColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.35);">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
              </div>
              <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: rgba(14,34,61,0.88); color: #F8FAFC; font-family: var(--font-mono); font-size: 8px; font-weight: 700; padding: 1px 4px; border-radius: 2px; white-space: nowrap;">
                ${sys.id}
              </div>
            </div>
          `,
          iconSize: [28, 28],
        });

        const marker = L.marker([sys.currentLat, sys.currentLng], {
          icon: compactIcon,
          zIndexOffset: 800,
        });

        marker.bindTooltip(
          `<strong>${sys.id}</strong>: ${sys.classification}<br/>${sys.maxWindKmh} km/h &bull; Click to select`,
          { sticky: true, className: 'map-tooltip' }
        );

        marker.on('click', () => {
          if (onSelectCyclone) onSelectCyclone(sys);
        });

        marker.addTo(dynamicGroup);
      }
    });
  }, [activeCyclone, allSystems, layers, districts, onSelectDistrict, onSelectCyclone]);

  const handleResetView = () => {
    if (mapInstanceRef.current && activeCyclone) {
      mapInstanceRef.current.setView([activeCyclone.currentLat || 15.5, activeCyclone.currentLng || 84.0], 5.5);
    }
  };

  return (
    <div className="gis-map-container" style={{ position: 'relative', width: '100%', height }}>
      {/* Map DOM Target */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Operational Overlay Header */}
      {showOverlayHeader && activeCyclone && (
        <div className="map-overlay-header">
          <div className="map-title-chip">
            <Compass size={13} className="text-info" />
            <span>NORTH INDIAN OCEAN BASIN &bull; {activeCyclone.basin.toUpperCase()}</span>
          </div>
          <div className="map-coord-chip font-mono">
            ACTIVE SYSTEM: {activeCyclone.id} ({activeCyclone.currentLat.toFixed(2)}°N, {activeCyclone.currentLng.toFixed(2)}°E)
          </div>
        </div>
      )}

      {/* Map Floating Controls */}
      <div className="map-floating-controls">
        <button
          onClick={handleResetView}
          className="map-control-btn"
          title="Reset View to Storm Basin"
        >
          <RotateCcw size={14} />
        </button>

        {showLayerControl && (
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`map-control-btn ${showLayerPanel ? 'active' : ''}`}
            title="Toggle GIS Layers"
          >
            <Layers size={14} />
          </button>
        )}
      </div>

      {/* GIS Layer Selector Drawer */}
      {showLayerPanel && (
        <div className="gis-layer-selector panel">
          <div className="panel-header" style={{ padding: '6px 10px', fontSize: '11px' }}>
            <span>GIS MAP LAYERS</span>
            <button
              onClick={() => setShowLayerPanel(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              &times;
            </button>
          </div>
          <div className="panel-body" style={{ padding: '8px 10px' }}>
            <div className="layer-checkbox-group">
              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.historicalTrack}
                  onChange={(e) => setLayers({ ...layers, historicalTrack: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: '#1E293B' }}></span>
                <span>Observed Best Track (IMD)</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.forecastTrack}
                  onChange={(e) => setLayers({ ...layers, forecastTrack: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: '#EA580C' }}></span>
                <span>Forecast Mean (WeatherNext)</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.kalmanTrack}
                  onChange={(e) => setLayers({ ...layers, kalmanTrack: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: '#0284C7', borderStyle: 'dashed' }}></span>
                <span>Kalman Smoothed (0-6h)</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.uncertaintyCone}
                  onChange={(e) => setLayers({ ...layers, uncertaintyCone: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: 'rgba(245, 158, 11, 0.4)' }}></span>
                <span>80% Prediction Region Cone</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.ensembleTracks}
                  onChange={(e) => setLayers({ ...layers, ensembleTracks: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: '#2563EB' }}></span>
                <span>WeatherNext Ensembles (50 members)</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.windRadii}
                  onChange={(e) => setLayers({ ...layers, windRadii: e.target.checked })}
                />
                <span className="layer-symbol" style={{ backgroundColor: '#EF4444' }}></span>
                <span>Gale & Storm Wind Radii</span>
              </label>

              <label className="layer-item">
                <input
                  type="checkbox"
                  checked={layers.districts}
                  onChange={(e) => setLayers({ ...layers, districts: e.target.checked })}
                />
                <span className="layer-symbol" style={{ borderRadius: '50%', backgroundColor: '#DC2626' }}></span>
                <span>Coastal District Risk Points</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Scientific Map Legend */}
      <div className="map-legend-box panel">
        <div className="legend-header">OPERATIONAL GIS LEGEND</div>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: '#1E293B', height: '3px' }}></span>
            <span>Best Track (Observed)</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: '#EA580C', height: '3px' }}></span>
            <span>Forecast Mean Track</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: '#0284C7', borderTop: '2px dashed #0284C7', height: '0px' }}></span>
            <span>Kalman Smoothed (0-6h)</span>
          </div>
          <div className="legend-item">
            <span className="legend-swatch" style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)', border: '1px solid #D97706' }}></span>
            <span>80% Prediction Cone</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ backgroundColor: '#2563EB', opacity: 0.6, height: '1.5px' }}></span>
            <span>Ensemble Scenarios</span>
          </div>
          <div className="legend-item">
            <span className="legend-circle" style={{ backgroundColor: '#DC2626', width: '8px', height: '8px' }}></span>
            <span>Critical District Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
};
