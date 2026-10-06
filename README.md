# PAVI Projects Solar System Size Calculator

PAVI Projects Solar System Size Calculator is a responsive solar-system sizing web application built with HTML, CSS, and vanilla JavaScript. It helps users estimate their electrical load, solar generation, battery storage, inverter capacity, and suitable package recommendation.

## Features

- Appliance load calculator with editable item quantities.
- OpenCage location lookup and PVGIS solar-resource integration.
- Battery, inverter, panel, and cost calculations.
- Solar package recommendations from 1.5 kVA through 20 kVA.
- Product catalogue with nine JSON-backed components and detailed specifications.
- Customer quotation form and testimonial feedback.
- Browser-side local storage for prototype inquiries and reviews.
- Mobile and desktop responsive design with CSS animation.

## Run the project

From this project directory, run:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in the terminal.

## Calculator assumptions

- Daily energy is calculated as `power × hours × quantity`.
- Peak demand is the largest appliance demand at a single moment.
- Battery capacity uses a 50% depth-of-discharge assumption and a 10% efficiency loss.
- A practical inverter safety factor of 1.25 is applied to peak demand.
- Panel sizing uses the selected peak-sun-hours value and a 0.8 system efficiency factor.
- Product prices are sample estimates and should be updated before commercial use.

## API configuration

The prototype requires a free OpenCage API key for geocoding. Add the key to the location form before searching a custom address.

Open-Meteo solar data is requested when available. If the request fails or the network is unavailable, the application uses a conservative default solar-resource profile so the calculator remains usable.

## Project structure

```text
.
├── index.html
├── styles.css
├── proposal.md
├── data/
│   └── products.json
├── js/
│   ├── api.js
│   ├── calculator.js
│   ├── products.js
│   ├── storage.js
│   └── app.js
└── tests/
    └── calculator.test.js
```

## Testing

Run:

```bash
npm test
```

The test suite verifies the calculation formulas and package-selection logic without relying on live APIs.

## Rubric evidence

- JavaScript: calculation logic is separated into exported functions and the UI is managed in `app.js`.
- External APIs: OpenCage provides geocoding and Open-Meteo provides solar-radiation data.
- JSON: the product catalogue is loaded from `data/products.json` with nine products and more than eight attributes per component.
- CSS: responsive grid layouts, gradients, shadows, transforms, hover states, and keyframe animation are included.
- Events: submit, input, click, reset, selection, menu toggle, and navigation events are handled.
- Local storage: reviews and inquiries are stored and retrieved locally.
- Trello and video: see `rubric-evidence.md` for the submission checklist and a Trello card template.
