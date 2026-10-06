import {
    DEFAULT_APPLIANCES,
    DEFAULT_SOLAR_RESOURCE,
    calculateBatterySize,
    calculateDailyEnergy,
    calculateEstimatedCost,
    calculateInverterSize,
    calculatePanelRequirements,
    calculatePeakDemand,
} from "./calculator.js";
import { fetchLocationCoordinates, fetchSolarResource } from "./api.js";
import { getProductCatalogue, getRecommendedProducts } from "./products.js";
import { readInquiries, readReviews, saveInquiry, saveReview } from "./storage.js";

const state = {
    appliances: DEFAULT_APPLIANCES.map((appliance) => ({ ...appliance })),
    solar: { ...DEFAULT_SOLAR_RESOURCE },
    selectedPackage: 5,
    quotation: 0,
};

const elements = {
    locationForm: document.querySelector("#location-form"),
    applianceForm: document.querySelector("#appliance-form"),
    applianceList: document.querySelector("#appliance-list"),
    dailyEnergy: document.querySelector("#daily-energy"),
    peakDemand: document.querySelector("#peak-demand"),
    sunHours: document.querySelector("#sun-hours"),
    systemRecommendation: document.querySelector("#system-recommendation"),
    batteryResult: document.querySelector("#battery-result"),
    inverterResult: document.querySelector("#inverter-result"),
    panelResult: document.querySelector("#panel-result"),
    costResult: document.querySelector("#cost-result"),
    packageList: document.querySelector("#package-list"),
    productCatalogue: document.querySelector("#product-catalogue"),
    testimonialList: document.querySelector("#testimonial-list"),
    quoteForm: document.querySelector("#quote-form"),
    quoteSummary: document.querySelector("#quote-summary"),
    quoteMessage: document.querySelector("#quote-message"),
    feedbackForm: document.querySelector("#feedback-form"),
    locationInput: document.querySelector("#location-input"),
    locationStatus: document.querySelector("#location-status"),
    locationResult: document.querySelector("#location-result"),
    opencageKey: document.querySelector("#opencage-key"),
    addAppliance: document.querySelector("#add-appliance"),
    resetForm: document.querySelector("#reset-form"),
    menuButton: document.querySelector(".menu-button"),
    mainNav: document.querySelector("#primary-nav"),
    currentYear: document.querySelector("#current-year"),
};

const PACKAGE_DEFINITIONS = [
    { kva: 1.5, title: "1.5 kVA Home Starter", description: "Suitable for basic lighting, communication, and small appliance loads." },
    { kva: 3.2, title: "3.2 kVA Residential", description: "Balanced option for everyday homes with moderate power use." },
    { kva: 5, title: "5 kVA Family System", description: "Comfortable capacity for pumps, refrigeration, and multiple appliances." },
    { kva: 6.2, title: "6.2 kVA Efficient Plus", description: "Good choice for larger homes and light commercial use." },
    { kva: 10, title: "10 kVA Commercial", description: "Designed for businesses with higher daytime and peak loads." },
    { kva: 20, title: "20 kVA Enterprise", description: "Large-load solution for commercial operations and larger facilities." },
];

const defaultTestimonials = [
    { name: "Mpho N.", rating: 5, message: "The calculator helped us compare realistic options before talking to an installer." },
    { name: "Sarah L.", rating: 5, message: "It was simple to understand and gave us a clear starting point for our budget." },
    { name: "Daniel K.", rating: 4, message: "The package suggestions made our planning much easier." },
];

function formatKilowatt(value) {
    return `${Number(value).toFixed(2)} kW`;
}

function formatKilowattHour(value) {
    return `${Number(value).toFixed(2)} kWh`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

function updatePackageSelection(value) {
    state.selectedPackage = value;
    const packageInfo = PACKAGE_DEFINITIONS.find((item) => item.kva === value);
    if (packageInfo) elements.quoteSummary.textContent = `Estimated package: ${packageInfo.title}`;
    renderPackageCards();
    updateQuoteCost();
}

function renderAppliances() {
    elements.applianceList.innerHTML = state.appliances.map((appliance, index) => `
    <div class="appliance-item">
      <div>
        <label for="name-${index}">Appliance</label>
        <input id="name-${index}" name="name-${index}" value="${escapeHtml(appliance.name)}" data-index="${index}" data-field="name" />
      </div>
      <div>
        <label for="power-${index}">Power (W)</label>
        <input id="power-${index}" type="number" min="0" step="1" value="${appliance.power}" data-index="${index}" data-field="power" />
      </div>
      <div>
        <label for="quantity-${index}">Qty</label>
        <input id="quantity-${index}" type="number" min="1" step="1" value="${appliance.quantity}" data-index="${index}" data-field="quantity" />
      </div>
      <div>
        <label for="hours-${index}">Hours</label>
        <input id="hours-${index}" type="number" min="0" step="0.5" value="${appliance.hours}" data-index="${index}" data-field="hours" />
      </div>
      <button class="remove" type="button" data-index="${index}" aria-label="Remove ${escapeHtml(appliance.name)}">×</button>
    </div>
  `).join("");
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function addAppliance() {
    state.appliances.push({
        id: crypto.randomUUID(),
        name: `Appliance ${state.appliances.length + 1}`,
        power: 100,
        quantity: 1,
        hours: 1,
    });
    renderAppliances();
    calculateLoad();
}

function removeAppliance(index) {
    state.appliances.splice(index, 1);
    renderAppliances();
    calculateLoad();
}

function calculateLoad() {
    const dailyEnergy = calculateDailyEnergy(state.appliances);
    const peakDemand = calculatePeakDemand(state.appliances);
    const battery = calculateBatterySize({ dailyEnergy, autonomyDays: 2, voltage: 24 });
    const inverter = calculateInverterSize(peakDemand);
    const panels = calculatePanelRequirements({
        dailyEnergy,
        peakSunHours: state.solar.peakSunHours,
        panelWattage: 400,
    });
    const packageInfo = PACKAGE_DEFINITIONS.find((item) => item.kva === state.selectedPackage) ?? PACKAGE_DEFINITIONS[2];

    elements.dailyEnergy.textContent = formatKilowattHour(dailyEnergy);
    elements.peakDemand.textContent = formatKilowatt(peakDemand);
    elements.sunHours.textContent = `${state.solar.peakSunHours} h`;
    elements.systemRecommendation.textContent = packageInfo.title;

    elements.batteryResult.innerHTML = `
    <strong>${battery.capacityAh.toLocaleString()} Ah</strong><br>
    <span>${battery.voltage} V bank · ${battery.autonomyDays} day autonomy</span>
  `;
    elements.inverterResult.innerHTML = `
    <strong>${inverter.suggestedKva} kVA</strong><br>
    <span>Minimum ${inverter.minimumKw} kW at 1.25 safety factor</span>
  `;
    elements.panelResult.innerHTML = `
    <strong>${panels.panelCount} panels</strong><br>
    <span>${panels.requiredKw} kW array · ${panels.estimatedDailyProduction} kWh/day</span>
  `;

    state.quotation = calculateEstimatedCost({
        packageKva: packageInfo.kva,
        panelCount: panels.panelCount,
        batteryAh: battery.capacityAh,
    });
    updateQuoteCost();
    renderPackageCards();
}

function updateQuoteCost() {
    const packageInfo = PACKAGE_DEFINITIONS.find((item) => item.kva === state.selectedPackage) ?? PACKAGE_DEFINITIONS[2];
    const formattedCost = formatCurrency(state.quotation);
    elements.costResult.innerHTML = `<strong>${formattedCost}</strong><br><span>${packageInfo.title}</span>`;
    elements.quoteSummary.textContent = `Estimated package: ${packageInfo.title} · ${formattedCost}`;
}

function renderPackageCards() {
    elements.packageList.innerHTML = PACKAGE_DEFINITIONS.map((packageInfo) => {
        const selected = packageInfo.kva === state.selectedPackage ? "selected" : "";
        return `
      <article class="package-card ${selected}" data-package="${packageInfo.kva}">
        <p class="eyebrow">Recommended package</p>
        <h3>${packageInfo.title}</h3>
        <span class="price">${packageInfo.kva} kVA</span>
        <p>${packageInfo.description}</p>
        <ul>
          <li>Inverter-ready system</li>
          <li>Battery storage included</li>
          <li>Preliminary quotation</li>
        </ul>
        <button class="button button-primary" type="button" data-package="${packageInfo.kva}">Select</button>
      </article>
    `;
    }).join("");
}

async function renderCatalogue() {
    try {
        const products = await getProductCatalogue();
        elements.productCatalogue.innerHTML = products.map((product) => `
    <article class="catalogue-card">
      <p class="eyebrow">${product.type}</p>
      <h3>${product.name}</h3>
            <p class="specs">${product.capacityAh ? `${product.capacityAh} Ah` : `${product.capacityKva ?? product.capacityW} kW / W`} · ${product.voltage ? `${product.voltage} V` : product.efficiencyPercent ? `${product.efficiencyPercent}% efficiency` : "System rated"}</p>
            <p class="product-meta">${product.brand ?? "PAVI Projects selected"} · ${product.stock ?? "Available"}</p>
      <span class="product-price">${formatCurrency(product.price)}</span>
    </article>
  `).join("");
    } catch (error) {
        elements.productCatalogue.innerHTML = `<p class="form-note">${escapeHtml(error.message)}</p>`;
    }
}

function renderTestimonials() {
    const testimonials = readReviews();
    const items = testimonials.length ? testimonials : defaultTestimonials;
    elements.testimonialList.innerHTML = items.map((review) => `
    <article class="testimonial-card">
      <p class="stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</p>
      <p>“${escapeHtml(review.message)}”</p>
      <strong>${escapeHtml(review.name)}</strong>
    </article>
  `).join("");
}

function handleApplianceInput(event) {
    const field = event.target.dataset.field;
    if (!field) return;
    const index = Number(event.target.dataset.index);
    const value = field === "name" ? event.target.value : Number(event.target.value);
    state.appliances[index][field] = value;
    if (field !== "name") calculateLoad();
}

function handleLocationSubmit(event) {
    event.preventDefault();
    const location = elements.locationInput.value.trim();
    elements.locationStatus.textContent = "Loading";
    elements.locationStatus.style.background = "rgba(255, 176, 0, 0.12)";
    elements.locationStatus.style.color = "#8a5a00";

    fetchLocationCoordinates(location, elements.opencageKey.value.trim())
        .then(({ latitude, longitude, formatted }) => {
            state.solar.latitude = latitude;
            state.solar.longitude = longitude;
            state.solar.locationName = formatted;
            elements.locationResult.textContent = `Selected: ${formatted}`;
            return fetchSolarResource(latitude, longitude);
        })
        .then((resource) => {
            state.solar.peakSunHours = resource.peakSunHours;
            state.solar.dailyRadiation = resource.dailyRadiation;
            elements.locationStatus.textContent = "Updated";
            elements.locationStatus.style.background = "rgba(31, 122, 91, 0.12)";
            elements.locationStatus.style.color = "#1f7a5b";
            elements.locationResult.textContent = `${state.solar.locationName} · ${resource.peakSunHours} peak sun hours`;
            calculateLoad();
        })
        .catch((error) => {
            elements.locationStatus.textContent = "Error";
            elements.locationStatus.style.background = "rgba(180, 35, 24, 0.12)";
            elements.locationStatus.style.color = "#b42318";
            elements.locationResult.textContent = error.message;
        });
}

function handleQuoteSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const inquiry = Object.fromEntries(form.entries());
    inquiry.package = PACKAGE_DEFINITIONS.find((item) => item.kva === state.selectedPackage)?.title ?? "Selected package";
    inquiry.estimatedCost = state.quotation;
    inquiry.createdAt = new Date().toISOString();

    saveInquiry(inquiry);
    const inquiryCount = readInquiries().length;
    elements.quoteMessage.textContent = `Your quotation request has been saved. ${inquiryCount} inquiry record${inquiryCount === 1 ? "" : "s"} are stored locally.`;
    elements.quoteMessage.className = "form-message success";
    elements.quoteForm.reset();
}

function handleFeedbackSubmit(event) {
    event.preventDefault();
    const name = document.querySelector("#review-name").value.trim();
    const rating = Number(document.querySelector("#review-rating").value);
    const message = document.querySelector("#review-message").value.trim();

    if (!name || !message) {
        return;
    }

    saveReview({ name, rating, message });
    renderTestimonials();
    elements.feedbackForm.reset();
}

function useDemoLocation() {
    const location = DEFAULT_SOLAR_RESOURCE.locationName;
    elements.locationInput.value = location;
    state.solar = { ...DEFAULT_SOLAR_RESOURCE };
    elements.locationResult.textContent = `Selected: ${location} · ${state.solar.peakSunHours} peak sun hours`;
    elements.locationStatus.textContent = "Demo";
    elements.locationStatus.style.background = "rgba(0, 91, 150, 0.12)";
    elements.locationStatus.style.color = "#005b96";
    calculateLoad();
}

function initializeEvents() {
    elements.locationForm.addEventListener("submit", handleLocationSubmit);
    elements.applianceForm.addEventListener("submit", (event) => {
        event.preventDefault();
        calculateLoad();
    });
    elements.applianceList.addEventListener("input", handleApplianceInput);
    elements.applianceList.addEventListener("click", (event) => {
        if (event.target.matches(".remove")) removeAppliance(Number(event.target.dataset.index));
    });
    elements.addAppliance.addEventListener("click", addAppliance);
    elements.resetForm.addEventListener("click", () => {
        state.appliances = DEFAULT_APPLIANCES.map((appliance) => ({ ...appliance }));
        renderAppliances();
        calculateLoad();
    });
    elements.packageList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-package]");
        if (!button) return;
        updatePackageSelection(Number(button.dataset.package));
    });
    elements.quoteForm.addEventListener("submit", handleQuoteSubmit);
    elements.feedbackForm.addEventListener("submit", handleFeedbackSubmit);
    elements.menuButton.addEventListener("click", () => {
        const isOpen = elements.mainNav.classList.toggle("open");
        elements.menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    elements.mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
        elements.mainNav.classList.remove("open");
        elements.menuButton.setAttribute("aria-expanded", "false");
    }));
    document.querySelector("#use-demo-location").addEventListener("click", useDemoLocation);
    elements.currentYear.textContent = new Date().getFullYear();
}

initializeEvents();
renderAppliances();
renderPackageCards();
renderCatalogue();
renderTestimonials();
calculateLoad();
