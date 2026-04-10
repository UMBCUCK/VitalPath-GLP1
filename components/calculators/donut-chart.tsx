"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutDataItem {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDataItem[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export function DonutChart({
  data,
  size = 220,
  centerLabel,
  centerValue,
  className = "",
}: DonutChartProps) {
  const innerR = size * 0.27;
  const outerR = size * 0.42;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerR}
              outerRadius={outerR}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay */}
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue && (
              <span className="text-2xl font-bold text-navy">{centerValue}</span>
            )}
            {centerLabel && (
              <span className="text-xs text-graphite-400">{centerLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-graphite-500">
              {entry.name}: <strong className="text-navy">{entry.value}g</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
