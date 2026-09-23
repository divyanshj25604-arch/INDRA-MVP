import React from 'react';

interface TimeSeriesDataPoint {
  timeLabel: string;
  hourOffset: number;
  observed?: number;
  forecast?: number;
  ensembleMin?: number;
  ensembleMax?: number;
  kalman?: number;
}

interface TimeSeriesChartProps {
  title: string;
  unit: string;
  data: TimeSeriesDataPoint[];
  metricType: 'wind' | 'pressure';
  height?: number;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  unit,
  data,
  metricType,
  height = 180,
}) => {
  if (!data || data.length === 0) return null;

  const width = 580;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Determine Y-axis min/max
  const allValues: number[] = [];
  data.forEach((d) => {
    if (d.observed !== undefined) allValues.push(d.observed);
    if (d.forecast !== undefined) allValues.push(d.forecast);
    if (d.ensembleMin !== undefined) allValues.push(d.ensembleMin);
    if (d.ensembleMax !== undefined) allValues.push(d.ensembleMax);
    if (d.kalman !== undefined) allValues.push(d.kalman);
  });

  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = (rawMax - rawMin) * 0.15 || 10;
  const yMin = Math.floor(rawMin - yPadding);
  const yMax = Math.ceil(rawMax + yPadding);

  // Scaling helpers
  const getX = (index: number) => padding.left + (index / (data.length - 1)) * plotWidth;
  const getY = (val: number) =>
    padding.top + plotHeight - ((val - yMin) / (yMax - yMin)) * plotHeight;

  // Build Ensemble Shaded Area Path (between min and max)
  const ensemblePoints = data.map((d, i) => ({
    x: getX(i),
    minY: getY(d.ensembleMin ?? (d.forecast ?? d.observed ?? yMin)),
    maxY: getY(d.ensembleMax ?? (d.forecast ?? d.observed ?? yMax)),
  }));

  const areaPath =
    ensemblePoints.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.minY}`,
      ''
    ) +
    ensemblePoints
      .slice()
      .reverse()
      .reduce((acc, pt) => `${acc} L ${pt.x},${pt.maxY}`, '') +
    ' Z';

  // Build Observed Line (up to hourOffset <= 0)
  const observedPts = data
    .filter((d) => d.observed !== undefined)
    .map((d) => {
      const idx = data.findIndex((item) => item.timeLabel === d.timeLabel);
      return { x: getX(idx), y: getY(d.observed!) };
    });

  const observedPath = observedPts.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`,
    ''
  );

  // Build Forecast Line (from hourOffset >= 0)
  const forecastPts = data
    .filter((d) => d.forecast !== undefined || (d.hourOffset === 0 && d.observed !== undefined))
    .map((d) => {
      const idx = data.findIndex((item) => item.timeLabel === d.timeLabel);
      const val = d.forecast !== undefined ? d.forecast : d.observed!;
      return { x: getX(idx), y: getY(val) };
    });

  const forecastPath = forecastPts.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`,
    ''
  );

  // Y-Ticks
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => {
    const val = yMin + (i / (yTicksCount - 1)) * (yMax - yMin);
    return Math.round(val);
  });

  return (
    <div className="time-series-card panel">
      <div className="panel-header" style={{ padding: '6px 12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700 }}>{title}</span>
        <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
          UNIT: {unit}
        </span>
      </div>

      <div style={{ padding: '8px 10px 4px 10px' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* Y Gridlines and Labels */}
          {yTicks.map((tickVal) => {
            const y = getY(tickVal);
            return (
              <g key={tickVal}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748B"
                  fontFamily="var(--font-mono)"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Zero Hour Marker Line */}
          {(() => {
            const zeroIdx = data.findIndex((d) => d.hourOffset === 0);
            if (zeroIdx >= 0) {
              const x = getX(zeroIdx);
              return (
                <g>
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={x + 3}
                    y={padding.top + 8}
                    fontSize="8"
                    fill="#475569"
                    fontWeight="700"
                  >
                    NOW (T=0)
                  </text>
                </g>
              );
            }
            return null;
          })()}

          {/* Shaded Ensemble Spread */}
          <path
            d={areaPath}
            fill={metricType === 'wind' ? '#93C5FD' : '#FED7AA'}
            fillOpacity="0.32"
          />

          {/* Observed Line (Solid) */}
          {observedPath && (
            <path
              d={observedPath}
              fill="none"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Forecast Line (Dashed) */}
          {forecastPath && (
            <path
              d={forecastPath}
              fill="none"
              stroke={metricType === 'wind' ? '#2563EB' : '#EA580C'}
              strokeWidth="2.5"
              strokeDasharray="5 4"
            />
          )}

          {/* Points */}
          {data.map((d, i) => {
            const isObserved = d.observed !== undefined;
            const val = isObserved ? d.observed! : d.forecast!;
            const cx = getX(i);
            const cy = getY(val);
            const isCurrent = d.hourOffset === 0;

            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCurrent ? 5 : 3.5}
                  fill={isCurrent ? '#DC2626' : isObserved ? '#0F172A' : '#FFFFFF'}
                  stroke={isObserved ? '#FFFFFF' : metricType === 'wind' ? '#2563EB' : '#EA580C'}
                  strokeWidth={isCurrent ? 2 : 1.5}
                />
                {/* X-axis labels */}
                <text
                  x={cx}
                  y={height - padding.bottom + 14}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="#475569"
                  fontFamily="var(--font-mono)"
                >
                  {d.timeLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Chart Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            paddingTop: '4px',
            fontSize: '10px',
            color: '#475569',
          }}
        >
          <div style={{ display: 'flex', alignContent: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '2px', backgroundColor: '#0F172A', alignSelf: 'center' }}></span>
            <span>Observed (Best Track)</span>
          </div>
          <div style={{ display: 'flex', alignContent: 'center', gap: '4px' }}>
            <span
              style={{
                width: '12px',
                height: '0px',
                borderTop: `2px dashed ${metricType === 'wind' ? '#2563EB' : '#EA580C'}`,
                alignSelf: 'center',
              }}
            ></span>
            <span>WeatherNext Mean Forecast</span>
          </div>
          <div style={{ display: 'flex', alignContent: 'center', gap: '4px' }}>
            <span
              style={{
                width: '10px',
                height: '8px',
                backgroundColor: metricType === 'wind' ? '#BFDBFE' : '#FED7AA',
                alignSelf: 'center',
              }}
            ></span>
            <span>Ensemble Spread (80% Region)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
