import test from "node:test";
import assert from "node:assert/strict";

import {
    calculateBatterySize,
    calculateDailyEnergy,
    calculateInverterSize,
    calculatePanelRequirements,
    nearestPackageCapacity,
    DEFAULT_SOLAR_RESOURCE,
} from "../js/calculator.js";
import { fetchLocationCoordinates } from "../js/api.js";

test("calculates daily energy from appliance demand", () => {
    const appliances = [
        { power: 100, quantity: 2, hours: 5 },
        { power: 200, quantity: 1, hours: 3 },
    ];

    assert.equal(calculateDailyEnergy(appliances), 1.6);
});

test("sizes the battery bank using autonomy and depth of discharge", () => {
    const result = calculateBatterySize({ dailyEnergy: 4, autonomyDays: 2, voltage: 24, depthOfDischarge: 0.5 });

    assert.equal(result.capacityAh, 733.3);
    assert.equal(result.voltage, 24);
});

test("sizes inverter capacity with safety factor", () => {
    const result = calculateInverterSize(2.4, 1.25);

    assert.equal(result.minimumKw, 3.00);
    assert.equal(result.suggestedKva, 5);
});

test("calculates required panel quantity and production", () => {
    const result = calculatePanelRequirements({ dailyEnergy: 8, peakSunHours: 5, systemEfficiency: 0.8, panelWattage: 400 });

    assert.equal(result.requiredKw, 2);
    assert.equal(result.panelCount, 5);
    assert.equal(result.estimatedDailyProduction, 10.0);
});

test("selects the next available package capacity", () => {
    assert.equal(nearestPackageCapacity(1.2), 1.5);
    assert.equal(nearestPackageCapacity(8), 10);
    assert.equal(nearestPackageCapacity(30), 20);
});

test("uses Harare, Zimbabwe as the default demo location", () => {
    assert.equal(DEFAULT_SOLAR_RESOURCE.locationName, "Harare, Zimbabwe");
    assert.equal(DEFAULT_SOLAR_RESOURCE.latitude, -17.8252);
    assert.equal(DEFAULT_SOLAR_RESOURCE.longitude, 31.0335);
});

test("requires an API key for custom location searches", async () => {
    await assert.rejects(
        fetchLocationCoordinates("Bulawayo"),
        /OpenCage API key/,
    );
});

test("restricts OpenCage location searches to Zimbabwe", async () => {
    const originalFetch = globalThis.fetch;
    let requestedUrl;

    globalThis.fetch = async (url) => {
        requestedUrl = new URL(url);
        return {
            ok: true,
            json: async () => ({
                results: [{
                    geometry: { lat: -20.15, lng: 28.58 },
                    formatted: "Bulawayo, Zimbabwe",
                }],
            }),
        };
    };

    try {
        const result = await fetchLocationCoordinates("Bulawayo", "test-key");
        assert.equal(requestedUrl.searchParams.get("countrycode"), "zw");
        assert.equal(result.formatted, "Bulawayo, Zimbabwe");
    } finally {
        globalThis.fetch = originalFetch;
    }
});
