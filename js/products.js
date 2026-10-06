const PRODUCT_CATALOGUE_URL = "./data/products.json";

let cachedProducts = null;

export async function getProductCatalogue() {
    if (cachedProducts) return cachedProducts;

    try {
        const response = await fetch(PRODUCT_CATALOGUE_URL);
        if (!response.ok) throw new Error(`Unable to load product catalogue (${response.status}).`);

        const data = await response.json();
        cachedProducts = data.products;
        return cachedProducts;
    } catch (error) {
        console.warn("Product catalogue unavailable; using fallback catalogue.", error);
        cachedProducts = [
            { id: "fallback-battery", name: "12V 200Ah Deep Cycle Battery", type: "Battery", price: 520, capacityAh: 200, voltage: 12, brand: "SunCycle", stock: "In stock" },
            { id: "fallback-inverter", name: "5 kVA Hybrid Inverter", type: "Inverter", price: 2400, capacityKva: 5, brand: "GridSmart", stock: "In stock" },
            { id: "fallback-panel", name: "550W High Efficiency Panel", type: "Panel", price: 340, capacityW: 550, brand: "SolarBeam", stock: "In stock" },
        ];
        return cachedProducts;
    }
}

export function getRecommendedProducts(packageKva) {
    const products = [
        { id: "battery-12-200", name: "12V 200Ah Deep Cycle Battery", type: "Battery", price: 520, capacityAh: 200, voltage: 12 },
        { id: "battery-24-200", name: "24V 200Ah Deep Cycle Battery", type: "Battery", price: 980, capacityAh: 200, voltage: 24 },
        { id: "battery-48-100", name: "48V 100Ah Lithium Battery", type: "Battery", price: 1750, capacityAh: 100, voltage: 48 },
        { id: "inverter-1-5", name: "1.5 kVA Pure Sine Inverter", type: "Inverter", price: 680, capacityKva: 1.5 },
        { id: "inverter-5", name: "5 kVA Hybrid Inverter", type: "Inverter", price: 2400, capacityKva: 5 },
        { id: "inverter-10", name: "10 kVA Three-Phase Inverter", type: "Inverter", price: 5600, capacityKva: 10 },
        { id: "panel-400", name: "400W Mono Solar Panel", type: "Panel", price: 260, capacityW: 400 },
        { id: "panel-550", name: "550W High Efficiency Panel", type: "Panel", price: 340, capacityW: 550 },
        { id: "panel-650", name: "650W Bifacial Module", type: "Panel", price: 420, capacityW: 650 },
    ];

    const packageMap = {
        1.5: [products[0], products[3], products[6]],
        3.2: [products[1], products[4], products[7]],
        5: [products[1], products[4], products[7]],
        6.2: [products[2], products[4], products[7]],
        10: [products[2], products[5], products[8]],
        20: [products[2], products[5], products[8]],
    };

    return packageMap[packageKva] ?? packageMap[5];
}
