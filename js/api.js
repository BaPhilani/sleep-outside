const OPEN_CAGE_BASE = "https://api.opencagedata.com/geocode/v1/json";
const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

function buildUrl(base, params) {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    return url;
}

export async function fetchLocationCoordinates(location, apiKey) {
    if (!location.trim()) throw new Error("Enter a place name or address.");
    const key = apiKey || "demo";

    if (!apiKey) {
        return {
            latitude: -25.75,
            longitude: 28.23,
            formatted: "Pretoria, South Africa",
            source: "demo",
        };
    }

    const response = await fetch(buildUrl(OPEN_CAGE_BASE, {
        q: location,
        key,
        language: "en",
        no_annotations: 1,
    }));

    if (!response.ok) throw new Error("OpenCage could not process this location.");
    const data = await response.json();
    if (!data.results?.length) throw new Error("No matching location was found.");

    return {
        latitude: data.results[0].geometry.lat,
        longitude: data.results[0].geometry.lng,
        formatted: data.results[0].formatted,
        source: "opencage",
    };
}

export async function fetchSolarResource(latitude, longitude) {
    const response = await fetch(buildUrl(OPEN_METEO_BASE, {
        latitude,
        longitude,
        daily: "shortwave_radiation_sum",
        timezone: "auto",
        forecast_days: 1,
    }));

    if (!response.ok) throw new Error("Open-Meteo could not provide solar-resource data.");

    const data = await response.json();
    const radiation = Number(data.daily?.shortwave_radiation_sum?.[0]);

    if (!Number.isFinite(radiation) || radiation <= 0) {
        throw new Error("Open-Meteo returned incomplete solar-radiation data.");
    }

    const peakSunHours = Math.max(1, radiation / 1000);

    return {
        peakSunHours,
        dailyRadiation: radiation / 1000,
        source: "open-meteo",
    };
}
