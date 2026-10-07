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

export function calculateDailyEnergy(appliances) {
    return appliances.reduce((total, appliance) => {
        const power = Number(appliance.power) || 0;
        const hours = Number(appliance.hours) || 0;
        const quantity = Number(appliance.quantity) || 0;
        return total + (power * hours * quantity) / 1000;
    }, 0);
}

export function calculatePeakDemand(appliances) {
    return appliances.reduce((peak, appliance) => {
        const power = Number(appliance.power) || 0;
        const quantity = Number(appliance.quantity) || 0;
        return Math.max(peak, (power * quantity) / 1000);
    }, 0);
}

export function calculateBatterySize({
    dailyEnergy,
    autonomyDays = 1,
    voltage = 24,
    depthOfDischarge = 0.5,
}) {
    const safeDailyEnergy = Math.max(dailyEnergy, 0) * 1.1;
    const usableEnergy = safeDailyEnergy * autonomyDays;
    const capacityAh = (usableEnergy * 1000) / (voltage * depthOfDischarge);

    return {
        capacityAh: Number(capacityAh.toFixed(1)),
        autonomyDays,
        voltage,
        depthOfDischarge,
    };
}

export function calculateInverterSize(peakDemand, safetyFactor = 1.25) {
    const minimumKw = Math.max(peakDemand, 0) * safetyFactor;
    return {
        minimumKw: Number(minimumKw.toFixed(2)),
        kva: Number((minimumKw / 0.8).toFixed(2)),
        suggestedKva: nearestPackageCapacity(minimumKw),
    };
}

export function calculatePanelRequirements({
    dailyEnergy,
    peakSunHours = 5.4,
    systemEfficiency = 0.8,
    panelWattage = 400,
}) {
    const requiredKw = Math.max(dailyEnergy, 0) / Math.max(peakSunHours, 0.1);
    const arrayKw = requiredKw / systemEfficiency;
    const panelCount = Math.ceil((arrayKw * 1000) / panelWattage);

    return {
        requiredKw: Number(arrayKw.toFixed(2)),
        panelCount,
        estimatedDailyProduction: Number((panelCount * panelWattage * peakSunHours / 1000).toFixed(1)),
        panelWattage,
    };
}

export function nearestPackageCapacity(minimumKw) {
    const candidateKva = [1.5, 3.2, 5, 6.2, 10, 20];
    const minimumKva = minimumKw / 0.8;
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
