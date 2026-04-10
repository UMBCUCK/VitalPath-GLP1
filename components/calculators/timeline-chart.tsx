"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface TimelineDataPoint {
  month: number;
  date: string;
  withGlp1: number;
  dietAlone: number;
}

interface TimelineChartProps {
  data: TimelineDataPoint[];
  currentWeight: number;
  goalWeight?: number;
  showComparison?: boolean;
  className?: string;
}

export function TimelineChart({
  data,
  currentWeight,
  goalWeight,
  showComparison = true,
  className = "",
}: TimelineChartProps) {
  const minWeight = Math.min(
    ...data.map((d) => Math.min(d.withGlp1, d.dietAlone)),
    goalWeight ?? Infinity
  );
  const maxWeight = currentWeight + 5;
  const domainMin = Math.floor(minWeight / 5) * 5 - 5;
  const domainMax = Math.ceil(maxWeight / 5) * 5;

  return (
    <motion.div
      className={`rounded-xl border border-navy-100/60 bg-white p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-6 rounded-full bg-gradient-to-r from-teal to-teal-600" />
          With GLP-1
        </span>
        {showComparison && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-6 rounded-full bg-graphite-300" />
            Diet Alone
          </span>
        )}
        {goalWeight && (
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-6 border-t-2 border-dashed border-gold" />
            Goal Weight
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradGlp1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F6F78" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#1F6F78" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradDiet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8896AB" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#8896AB" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#8896AB" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8896AB" }}
            tickLine={false}
            axisLine={false}
            domain={[domainMin, domainMax]}
            unit=" lbs"
            width={55}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #E8EDF4",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number, name: string) => [
              `${Math.round(value)} lbs`,
              name === "withGlp1" ? "With GLP-1" : "Diet Alone",
            ]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          {goalWeight && (
            <ReferenceLine
              y={goalWeight}
              stroke="#D4A853"
              strokeDasharray="6 3"
              strokeWidth={1.5}
              label={{
                value: `Goal: ${goalWeight} lbs`,
                position: "right",
                fontSize: 10,
                fill: "#D4A853",
                fontWeight: 600,
              }}
            />
          )}
          {showComparison && (
            <Area
              type="monotone"
              dataKey="dietAlone"
              stroke="#8896AB"
              strokeWidth={1.5}
              fill="url(#gradDiet)"
              dot={false}
              strokeDasharray="4 4"
            />
          )}
          <Area
            type="monotone"
            dataKey="withGlp1"
            stroke="#1F6F78"
            strokeWidth={2.5}
            fill="url(#gradGlp1)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Re-export the data point type for use in calculators
export type { TimelineDataPoint };
