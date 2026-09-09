import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChargerType } from "../lib/chargingModel";
import { simulateChargingTrajectory } from "../lib/chargingModel";
import type { EvVehicle } from "../data/types";
import { Card } from "./Card";

export function ChargingCurveChart({
  vehicle,
  chargerType,
  chargerMaxPowerKW,
  currentSoc,
  stopSoc,
}: {
  vehicle: EvVehicle;
  chargerType: ChargerType;
  chargerMaxPowerKW: number;
  currentSoc: number;
  stopSoc: number;
}) {
  const chartData = useMemo(() => {
    const trajectory = simulateChargingTrajectory(
      { vehicle, chargerType, chargerMaxPowerKW, currentSocPercent: 0 },
      100,
      1,
    );
    return trajectory.map((s) => ({ soc: Math.round(s.soc), kw: Math.round(s.powerToBatteryKW * 10) / 10 }));
  }, [vehicle, chargerType, chargerMaxPowerKW]);

  return (
    <Card title="Charge power (kW) vs. battery level">
      <div className="h-56 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
            <XAxis
              dataKey="soc"
              tickFormatter={(v: number) => `${v}%`}
              stroke="currentColor"
              className="text-slate-500 dark:text-slate-400"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}`}
              stroke="currentColor"
              className="text-slate-500 dark:text-slate-400"
              fontSize={12}
              width={44}
            />
            <Tooltip
              formatter={(value) => [`${value} kW`, "Charge power"]}
              labelFormatter={(label) => `${label}% SOC`}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <ReferenceLine x={currentSoc} stroke="#0284c7" strokeWidth={2} strokeDasharray="4 3" label={{ value: "Now", position: "top", fontSize: 11, fill: "#0284c7" }} />
            <ReferenceLine x={stopSoc} stroke="#059669" strokeWidth={2} strokeDasharray="4 3" label={{ value: "Stop", position: "top", fontSize: 11, fill: "#059669" }} />
            <Area type="monotone" dataKey="kw" stroke="#10b981" strokeWidth={2} fill="url(#powerFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
