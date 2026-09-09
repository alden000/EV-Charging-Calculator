import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { VehicleSelector } from "./components/VehicleSelector";
import { ChargerInputs } from "./components/ChargerInputs";
import { SocInputs } from "./components/SocInputs";
import { CostInputs } from "./components/CostInputs";
import { ResultsSummary } from "./components/ResultsSummary";
import { ChargingCurveChart } from "./components/ChargingCurveChart";
import { DurationSlider } from "./components/DurationSlider";
import { useVehicleDatabase } from "./data/vehicleUpdater";
import { usePersistentState } from "./hooks/usePersistentState";
import { DEFAULT_SAVED_INPUTS, STORAGE_KEY, type SavedInputs } from "./lib/storage";
import { buildEstimate, sampleAtDuration, sampleAtSoc, simulateChargingTrajectory } from "./lib/chargingModel";
import type { ChargerType } from "./lib/chargingModel";

function App() {
  const { vehicles, dbUpdatedAt, status, refresh } = useVehicleDatabase();
  const [inputs, setInputs] = usePersistentState<SavedInputs>(STORAGE_KEY, DEFAULT_SAVED_INPUTS);
  const [sliderHours, setSliderHours] = useState(0);
  const [sliderTouched, setSliderTouched] = useState(false);

  const vehicle = useMemo(
    () => vehicles.find((v) => v.id === inputs.vehicleId) ?? vehicles[0],
    [vehicles, inputs.vehicleId],
  );

  const update = <K extends keyof SavedInputs>(key: K, value: SavedInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const trajectory = useMemo(
    () =>
      simulateChargingTrajectory(
        {
          vehicle,
          chargerType: inputs.chargerType,
          chargerMaxPowerKW: inputs.chargerMaxPowerKW,
          currentSocPercent: inputs.currentSocPercent,
        },
        100,
      ),
    [vehicle, inputs.chargerType, inputs.chargerMaxPowerKW, inputs.currentSocPercent],
  );

  const canEstimate = inputs.stopSocPercent > inputs.currentSocPercent && inputs.currentSocPercent < 100;
  const maxHours = trajectory[trajectory.length - 1]?.elapsedHours ?? 0;

  const stopEstimate = useMemo(() => {
    const sample = sampleAtSoc(trajectory, inputs.stopSocPercent);
    return buildEstimate(vehicle, sample, inputs.costPerKWh, inputs.parkingEnabled ? inputs.parkingRatePerHour : undefined, new Date());
  }, [trajectory, inputs.stopSocPercent, vehicle, inputs.costPerKWh, inputs.parkingEnabled, inputs.parkingRatePerHour]);

  // Keep the "explore by duration" slider following the main stop-SOC estimate
  // until the user deliberately drags it, or the underlying inputs change.
  useEffect(() => {
    setSliderTouched(false);
  }, [vehicle.id, inputs.chargerType, inputs.chargerMaxPowerKW, inputs.currentSocPercent]);

  useEffect(() => {
    if (!sliderTouched) {
      setSliderHours(Math.min(stopEstimate.sample.elapsedHours, maxHours));
    }
  }, [sliderTouched, stopEstimate.sample.elapsedHours, maxHours]);

  const sliderEstimate = useMemo(() => {
    const sample = sampleAtDuration(trajectory, sliderHours);
    return buildEstimate(vehicle, sample, inputs.costPerKWh, inputs.parkingEnabled ? inputs.parkingRatePerHour : undefined, new Date());
  }, [trajectory, sliderHours, vehicle, inputs.costPerKWh, inputs.parkingEnabled, inputs.parkingRatePerHour]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header dbUpdatedAt={dbUpdatedAt} status={status} onRefresh={refresh} />

      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 sm:px-6">
        <VehicleSelector vehicles={vehicles} vehicle={vehicle} onChange={(id) => update("vehicleId", id)} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ChargerInputs
            chargerType={inputs.chargerType}
            chargerMaxPowerKW={inputs.chargerMaxPowerKW}
            onChargerTypeChange={(type: ChargerType) => update("chargerType", type)}
            onChargerPowerChange={(kw) => update("chargerMaxPowerKW", kw)}
          />
          <CostInputs
            costPerKWh={inputs.costPerKWh}
            currencySymbol={inputs.currencySymbol}
            parkingEnabled={inputs.parkingEnabled}
            parkingRatePerHour={inputs.parkingRatePerHour}
            onCostChange={(v) => update("costPerKWh", v)}
            onCurrencyChange={(v) => update("currencySymbol", v)}
            onParkingEnabledChange={(v) => update("parkingEnabled", v)}
            onParkingRateChange={(v) => update("parkingRatePerHour", v)}
          />
        </div>

        <SocInputs
          currentSoc={inputs.currentSocPercent}
          stopSoc={inputs.stopSocPercent}
          onCurrentSocChange={(v) => update("currentSocPercent", v)}
          onStopSocChange={(v) => update("stopSocPercent", v)}
        />

        {canEstimate ? (
          <>
            <ResultsSummary estimate={stopEstimate} currencySymbol={inputs.currencySymbol} parkingEnabled={inputs.parkingEnabled} />
            <DurationSlider
              hours={sliderHours}
              maxHours={maxHours}
              estimate={sliderEstimate}
              currencySymbol={inputs.currencySymbol}
              onChange={(h) => {
                setSliderTouched(true);
                setSliderHours(h);
              }}
            />
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {inputs.currentSocPercent >= 100
              ? "Battery is already at 100%."
              : "Set a stop SOC higher than the current SOC to see an estimate."}
          </p>
        )}

        <ChargingCurveChart
          vehicle={vehicle}
          chargerType={inputs.chargerType}
          chargerMaxPowerKW={inputs.chargerMaxPowerKW}
          currentSoc={inputs.currentSocPercent}
          stopSoc={inputs.stopSocPercent}
        />

        <p className="pb-6 pt-2 text-center text-xs text-slate-400 dark:text-slate-600">
          Estimates use modeled charging curves and are approximate. Actual charging speed varies with temperature,
          station conditions, and vehicle state.
        </p>
      </main>
    </div>
  );
}

export default App;
