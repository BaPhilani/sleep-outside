export const DEFAULT_APPLIANCES = [
    { id: crypto.randomUUID(), name: "LED Light", power: 10, quantity: 6, hours: 5 },
    { id: crypto.randomUUID(), name: "Laptop", power: 60, quantity: 2, hours: 5 },
    { id: crypto.randomUUID(), name: "Television", power: 120, quantity: 1, hours: 4 },
    { id: crypto.randomUUID(), name: "Water Pump", power: 500, quantity: 1, hours: 2 },
    { id: crypto.randomUUID(), name: "Refrigerator", power: 180, quantity: 1, hours: 8 },
];

export const DEFAULT_SOLAR_RESOURCE = {
    latitude: -17.8252,
    longitude: 31.0335,
    locationName: "Harare, Zimbabwe",
    peakSunHours: 5.4,
    monthlyProduction: [5.0, 5.4, 6.1, 6.8, 7.3, 7.1, 7.4, 7.0, 6.4, 5.8, 5.2, 5.1],
};

function toFiniteNumber(value, fallback = 0) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
}

export function calculateDailyEnergy(appliances = []) {
    return (appliances ?? []).reduce((total, appliance) => {
        if (!appliance) return total;
        const power = Math.max(toFiniteNumber(appliance.power, 0), 0);
        const hours = Math.max(toFiniteNumber(appliance.hours, 0), 0);
        const quantity = Math.max(toFiniteNumber(appliance.quantity, 0), 0);
        return total + (power * hours * quantity) / 1000;
    }, 0);
}

export function calculatePeakDemand(appliances = []) {
    return (appliances ?? []).reduce((peak, appliance) => {
        if (!appliance) return peak;
        const power = Math.max(toFiniteNumber(appliance.power, 0), 0);
        const quantity = Math.max(toFiniteNumber(appliance.quantity, 0), 0);
        return Math.max(peak, (power * quantity) / 1000);
    }, 0);
}

export function calculateBatterySize({
    dailyEnergy = 0,
    autonomyDays = 1,
    voltage = 24,
    depthOfDischarge = 0.5,
}) {
    const safeDailyEnergy = Math.max(toFiniteNumber(dailyEnergy, 0), 0) * 1.1;
    const safeAutonomyDays = Math.max(toFiniteNumber(autonomyDays, 1), 0);
    const safeVoltage = Math.max(toFiniteNumber(voltage, 24), 1);
    const safeDepthOfDischarge = Math.max(toFiniteNumber(depthOfDischarge, 0.5), 0.05);
    const usableEnergy = safeDailyEnergy * safeAutonomyDays;
    const capacityAh = usableEnergy > 0 ? (usableEnergy * 1000) / (safeVoltage * safeDepthOfDischarge) : 0;

    return {
        capacityAh: Number(capacityAh.toFixed(1)),
        autonomyDays: safeAutonomyDays,
        voltage: safeVoltage,
        depthOfDischarge: safeDepthOfDischarge,
    };
}

export function calculateInverterSize(peakDemand, safetyFactor = 1.25) {
    const safePeakDemand = Math.max(toFiniteNumber(peakDemand, 0), 0);
    const safeSafetyFactor = Math.max(toFiniteNumber(safetyFactor, 1.25), 0.01);
    const minimumKw = safePeakDemand * safeSafetyFactor;

    return {
        minimumKw: Number(minimumKw.toFixed(2)),
        kva: Number((minimumKw / 0.8).toFixed(2)),
        suggestedKva: nearestPackageCapacity(minimumKw),
    };
}

export function calculatePanelRequirements({
    dailyEnergy = 0,
    peakSunHours = 5.4,
    systemEfficiency = 0.8,
    panelWattage = 400,
}) {
    const safeDailyEnergy = Math.max(toFiniteNumber(dailyEnergy, 0), 0);
    const safePeakSunHours = Math.max(toFiniteNumber(peakSunHours, 5.4), 0.1);
    const safeSystemEfficiency = Math.max(toFiniteNumber(systemEfficiency, 0.8), 0.01);
    const safePanelWattage = Math.max(toFiniteNumber(panelWattage, 400), 1);
    const requiredKw = safeDailyEnergy / safePeakSunHours;
    const arrayKw = requiredKw / safeSystemEfficiency;
    const panelCount = Math.max(0, Math.ceil((arrayKw * 1000) / safePanelWattage));

    return {
        requiredKw: Number(arrayKw.toFixed(2)),
        panelCount,
        estimatedDailyProduction: Number((panelCount * safePanelWattage * safePeakSunHours / 1000).toFixed(1)),
        panelWattage: safePanelWattage,
    };
}

export function nearestPackageCapacity(minimumKw) {
    const candidateKva = [1.5, 3.2, 5, 6.2, 10, 20];
    const safeMinimumKw = Math.max(toFiniteNumber(minimumKw, 0), 0);
    const minimumKva = safeMinimumKw / 0.8;
    return candidateKva.find((value) => value >= minimumKva) ?? candidateKva[candidateKva.length - 1];
}

export function calculateEstimatedCost({ packageKva, panelCount, batteryAh }) {
    const packageCost = {
        1.5: 2400,
        3.2: 4400,
        5: 6200,
        6.2: 7800,
        10: 12500,
        20: 23500,
    };
    const panelCost = panelCount * 260;
    const batteryCost = (batteryAh / 100) * 180;
    const installation = packageCost[packageKva] ?? 0;
    return Number((installation + panelCost + batteryCost).toFixed(0));
}
