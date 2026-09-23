import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { HISTORICAL_REPLAY_DATA } from '../data/mockCycloneData';

export const HistoricalReplayView: React.FC = () => {
  const replayData = HISTORICAL_REPLAY_DATA;
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const currentStep = replayData.steps[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= replayData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, replayData.steps.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner & Storm Selection */}
      <div className="panel" style={{ padding: '10px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={16} className="text-info" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em' }}>
                HISTORICAL CYCLONE REPLAY & RETROSPECTIVE BENCHMARKING
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Validating AI Vortex Localization and WeatherNext Forecasts against Ground-Truth IMD RSMC Best Track Records
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>BENCHMARK STORM:</span>
            <select className="gov-select font-mono" defaultValue="FANI-2019">
              <option value="FANI-2019">CYCLONE FANI (MAY 2019 - ESCS)</option>
              <option value="HUDHUD-2014">CYCLONE HUDHUD (OCT 2014 - VSCS)</option>
              <option value="AMPHAN-2020">SUPER CYCLONE AMPHAN (MAY 2020 - SuCS)</option>
            </select>
            <span className="badge badge-safe">IMD GROUND TRUTH VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Replay Controls Strip */}
      <div className="panel" style={{ padding: '8px 14px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Playback buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentStepIndex === 0}
            className="gov-btn"
            title="Step Backward"
          >
            <SkipBack size={13} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="gov-btn gov-btn-primary"
            style={{ minWidth: '85px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex((prev) => Math.min(replayData.steps.length - 1, prev + 1));
            }}
            disabled={currentStepIndex === replayData.steps.length - 1}
            className="gov-btn"
            title="Step Forward"
          >
            <SkipForward size={13} />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="gov-btn"
            title="Reset to T=0"
          >
            <span>RESET</span>
          </button>
        </div>

        {/* Step Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px', margin: '0 20px' }}>
          <span className="font-mono text-muted" style={{ fontSize: '10px' }}>T+0h</span>
          <input
            type="range"
            min="0"
            max={replayData.steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            style={{ flex: 1, cursor: 'pointer' }}
          />
          <span className="font-mono text-muted" style={{ fontSize: '10px' }}>T+56h (Landfall)</span>
        </div>

        {/* Current Replay Timestamp */}
        <div className="font-mono" style={{ background: '#0F172A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '3px', fontSize: '11px' }}>
          FRAME TIME: {currentStep.timestamp}
        </div>
      </div>

      {/* Main Dual Comparison Visualizer (Satellite Frame + Forecast Error Chart) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '14px' }}>
        {/* Synthetic Satellite & Track Comparison View */}
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <span>HISTORICAL SATELLITE RADIANCE & DUAL TRACK TRAJECTORY</span>
            <span className="badge badge-info">{currentStep.satelliteFrameName}</span>
          </div>

          <div style={{ position: 'relative', width: '100%', minHeight: '440px', background: '#0B1320', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 600 440" style={{ width: '100%', height: '100%', maxHeight: '460px' }}>
              {/* Gridlines */}
              <line x1="0" y1="110" x2="600" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="220" x2="600" y2="220" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="330" x2="600" y2="330" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="200" y1="0" x2="200" y2="440" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="400" y1="0" x2="400" y2="440" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

              {/* Coastline */}
              <path
                d="M 100 0 Q 140 100 170 180 Q 210 280 260 380 Q 300 420 330 440"
                fill="none"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="1.5"
              />
              <text x="110" y="200" fill="rgba(148, 163, 184, 0.4)" fontSize="10" fontFamily="var(--font-mono)">
                ODISHA / ANDHRA COAST
              </text>
              <circle cx="280" cy="140" r="4" fill="#E2E8F0" />
              <text x="290" y="144" fill="#CBD5E1" fontSize="9" fontWeight="700">Puri (Landfall)</text>

              {/* Historical Track Line (Dark Blue) */}
              <polyline
                points="420,380 390,300 360,230 330,170 300,120 280,140"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                opacity="0.8"
              />

              {/* WeatherNext Model Predicted Track Line (Orange Dashed) */}
              <polyline
                points="420,380 395,295 366,224 335,166 304,116 284,136"
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                strokeDasharray="5 3"
                opacity="0.85"
              />

              {/* Dynamic Step Marker */}
              {(() => {
                const stepPosMap = [
                  { cx: 420, cy: 380 },
                  { cx: 390, cy: 300 },
                  { cx: 360, cy: 230 },
                  { cx: 330, cy: 170 },
                  { cx: 300, cy: 120 },
                  { cx: 280, cy: 140 },
                ];
                const pos = stepPosMap[currentStepIndex] || stepPosMap[0];
                return (
                  <g>
                    {/* Simulated IR Cloud blob at this position */}
                    <circle cx={pos.cx} cy={pos.cy} r="65" fill="#EF4444" fillOpacity="0.25" />
                    <circle cx={pos.cx} cy={pos.cy} r="28" fill="#EF4444" fillOpacity="0.65" />
                    <circle cx={pos.cx} cy={pos.cy} r="8" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
                    <text x={pos.cx + 14} y={pos.cy - 10} fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                      OBS: {currentStep.observedLat}°N, {currentStep.observedLng}°E
                    </text>
                    <text x={pos.cx + 14} y={pos.cy + 4} fill="#FDBA74" fontSize="9" fontFamily="var(--font-mono)">
                      FCST: {currentStep.modelForecastLat}°N, {currentStep.modelForecastLng}°E
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Replay Legend */}
            <div style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(15,23,42,0.85)', padding: '6px 10px', borderRadius: '3px', fontSize: '10px', color: '#E2E8F0', display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#3B82F6' }}></span>
                <span>IMD Best Track (Ground Truth)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '12px', height: '0', borderTop: '2px dashed #F97316' }}></span>
                <span>WeatherNext Forecast Backbone</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid var(--border-color)', fontSize: '11px', color: '#475569' }}>
            <strong>Step Notes: </strong>{currentStep.notes}
          </div>
        </div>

        {/* Right Telemetry & Benchmark Error Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Step Error Metric Card */}
          <div className="panel" style={{ padding: '12px', background: '#FFFFFF' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              TRACK POSITION ERROR AT CURRENT TIMESTEP
            </div>
            <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: currentStep.trackErrorKm < 30 ? '#16A34A' : '#D97706', marginTop: '2px' }}>
              {currentStep.trackErrorKm} km
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Target benchmark error threshold: &lt; 50 km at 24h
            </div>
          </div>

          {/* Current Step Telemetry Details */}
          <div className="panel">
            <div className="panel-header">
              <span>REPLAY FRAME TELEMETRY</span>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>STEP {currentStep.stepIndex + 1}/6</span>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Observed Position:</span>
                <strong className="font-mono">{currentStep.observedLat}°N, {currentStep.observedLng}°E</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Model Forecast:</span>
                <strong className="font-mono">{currentStep.modelForecastLat}°N, {currentStep.modelForecastLng}°E</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Observed Max Wind:</span>
                <strong style={{ color: '#DC2626' }}>{currentStep.observedWindKmh} km/h (ESCS)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Hour Offset:</span>
                <span className="font-mono">T+{currentStep.hourOffset} Hours</span>
              </div>
            </div>
          </div>

          {/* Forecast Error Progression Summary Table */}
          <div className="panel" style={{ flex: 1 }}>
            <div className="panel-header">
              <span>BENCHMARK ERROR SUMMARY</span>
              <span className="font-mono text-muted" style={{ fontSize: '10px' }}>VS IMD BEST TRACK</span>
            </div>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Horizon</th>
                  <th>Observed</th>
                  <th>Predicted</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {replayData.steps.map((st) => (
                  <tr
                    key={st.stepIndex}
                    style={{
                      backgroundColor: st.stepIndex === currentStepIndex ? '#EFF6FF' : 'transparent',
                    }}
                  >
                    <td className="font-mono">T+{st.hourOffset}h</td>
                    <td className="font-mono" style={{ fontSize: '10px' }}>{st.observedLat}°N</td>
                    <td className="font-mono" style={{ fontSize: '10px' }}>{st.modelForecastLat}°N</td>
                    <td className="font-mono">
                      <strong style={{ color: st.trackErrorKm < 25 ? '#16A34A' : '#D97706' }}>
                        {st.trackErrorKm} km
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
