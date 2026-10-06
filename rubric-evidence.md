# Rubric evidence and submission checklist

## 1. Project evidence

### JavaScript and modularity

- The calculation rules are implemented in `js/calculator.js`.
- The browser interface is managed in `js/app.js`.
- API requests are isolated in `js/api.js`.
- Product data is loaded from `data/products.json`.
- Local browser data is managed in `js/storage.js`.

### External APIs

- **OpenCage Geocoding API**: converts place names and addresses into latitude and longitude.
- **Open-Meteo Forecast API**: returns daily short-wave radiation, which is converted into peak-sun-hour and daily-production estimates.
- The project does not use the restricted OpenWeatherMap API from WDD 231.

### JSON data

The catalogue contains nine products across three categories:

- Batteries: 3 products
- Inverters: 3 products
- Panels: 3 products

Each product includes at least the following fields: name, category, brand, price, stock, and recommended application. Battery, inverter, and panel records also add technical attributes such as voltage, capacity, efficiency, warranty, and dimensions.

### CSS and interaction evidence

The interface demonstrates the required advanced CSS features:

- Responsive grid layouts
- Gradient backgrounds and layered shadows
- Card hover transitions
- Animated hero orbit and floating card effects
- CSS transforms on buttons and the hero preview
- Visible keyboard focus styles
- Mobile navigation and layout changes

### Events and browser features

The application handles at least these events:

1. `submit` for location lookup
2. `submit` for appliance calculation
3. `input` for appliance edits
4. `click` for adding or removing appliances
5. `click` for package selection
6. `submit` for quotation requests
7. `submit` for feedback reviews
8. `click` for the mobile menu
9. `click` for demo-location selection

### Local storage

The browser stores and retrieves:

- Review name
- Review rating
- Review message
- Inquiry name
- Inquiry email
- Inquiry phone
- Inquiry project notes
- Selected package
- Estimated quotation
- Inquiry creation date

## 2. Trello board evidence

A Trello board is required for the final submission. Create a public board named **PAVI Projects Solar System Size Calculator** with the following lists:

- **Backlog**
- **To Do**
- **Doing**
- **Testing**
- **Done**

Use these card titles and add a short description plus checkboxes for each card:

### Backlog

- Research OpenCage API authentication and request limits
- Research Open-Meteo solar-radiation response fields
- Design the mobile and desktop wireframes
- Define the product catalogue and pricing assumptions
- Choose browser storage for prototype inquiry records
- Plan accessibility and keyboard-navigation requirements
- Define calculation and error-handling test cases

### To Do

- Create the project folder and shared HTML structure
- Build the responsive header and navigation
- Add the appliance catalogue and load calculator
- Implement battery, inverter, and panel calculations
- Connect OpenCage geocoding
- Connect Open-Meteo solar data
- Build package recommendations
- Create the product catalogue and quotation summary
- Add inquiry validation and review submission
- Add local storage and responsive CSS
- Run final tests and prepare deployment

### Doing

- Verify the completed calculator UI
- Validate API failure handling
- Review final documentation and rubric evidence

### Testing

- Check empty and invalid appliance values
- Check zero and negative usage hours
- Check location lookup and API failure states
- Check battery, inverter, panel, and package calculations
- Check mobile navigation and keyboard focus
- Check review and inquiry storage
- Check build output and deployment preview

### Done

- Project proposal completed
- Calculator implementation completed
- OpenCage and Open-Meteo connected
- Product catalogue loaded from JSON
- Calculator tests implemented
- Responsive CSS completed
- Production build verified

> Add the public Trello board URL to this document before submitting the project.

## 3. Five-minute video evidence

Record a video that is approximately five minutes long and includes:

1. The student's face and full name at the beginning.
2. A spoken introduction identifying the project and course.
3. A screen recording showing the calculator being opened.
4. A demonstration of adding and editing appliances.
5. A demonstration of entering a location and obtaining the solar-resource result.
6. A demonstration of package selection and quotation updates.
7. A demonstration of the product catalogue and component details.
8. A demonstration of submitting a quotation and a review.
9. A closing statement describing the project and the result.
10. A final screen showing the browser URL and project title.

Save the finished video in a common format such as MP4, and provide a public or class-accessible link.

## 4. Submission checklist

- [ ] Update the proposal to use Open-Meteo throughout.
- [ ] Add the completed Trello board URL.
- [ ] Add the five-minute video URL.
- [ ] Confirm that no OpenWeatherMap API calls are used.
- [ ] Run `npm test` and record the result.
- [ ] Run `npm run build` and record the result.
- [ ] Check the local browser behavior for the calculator, forms, and catalogue.
- [ ] Submit the working project and evidence files.
