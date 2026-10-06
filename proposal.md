# Solar System Size Calculator Proposal

## 1. Overview

The PAVI Projects Solar System Size Calculator is a responsive web application that helps homeowners, businesses, schools, churches, developers, and solar sales representatives estimate the size and cost of a suitable solar energy system. The application will guide users from initial energy consumption estimates through location-based solar-resource assessment, battery and inverter sizing, panel requirements, package recommendations, and a quotation request.

The project addresses a common problem in solar sales: customers often purchase systems that are either too small to meet daily demand or too large for their available budget and roof space. PAVI Projects combines a practical appliance-load calculator with local solar-resource data, component specifications, and transparent pricing information.

The project is motivated by the growing adoption of renewable energy, the need for accessible planning tools, and the opportunity to make solar-system decisions more informed, practical, and understandable for non-specialists.

## 2. Target Audience

The application will primarily serve:

- Homeowners who want to reduce utility costs and increase energy independence.
- Small businesses and commercial property owners planning cost-effective energy upgrades.
- Churches and community centers seeking reliable and affordable power solutions.
- Schools and educational institutions that need dependable energy planning.
- Solar installation companies that need a customer-facing sizing tool.
- Solar sales representatives preparing preliminary proposals.
- Property developers evaluating renewable-energy opportunities.
- Customers considering off-grid, hybrid, or grid-tied installation scenarios.

## 3. Major Functions

1. **Load Calculator**
   - Allows users to add common electrical appliances, assign quantities, and enter daily usage hours.
   - Calculates the total daily energy consumption in kilowatt-hours.
   - Identifies the highest simultaneous appliance demand to estimate peak load.
   - Warns users when the appliance list is empty or contains invalid values.

2. **Appliance Catalogue**
   - Provides a predefined catalogue of common appliances, including televisions, laptops, pumps, refrigerators, lights, water heaters, fans, and washing machines.
   - Displays each appliance's typical power rating, unit, and common usage pattern.
   - Allows users to select or modify items before calculating demand.

3. **Battery Sizing Calculator**
   - Calculates battery capacity using total daily energy demand, required autonomy, battery voltage, and depth of discharge.
   - Supports both 12 V and 24 V battery-bank configurations.
   - Converts the result into minimum required ampere-hour capacity.
   - Shows a practical safety margin to account for losses and system inefficiencies.

4. **Inverter Sizing Calculator**
   - Estimates minimum inverter capacity from the calculated peak demand.
   - Includes a safety factor for motor loads and temporary surges.
   - Recommends an inverter rating that matches the estimated system size.
   - Displays separate guidance for pure sine-wave and modified-sine-wave applications.

5. **Solar Panel Sizing Calculator**
   - Calculates the required array size from daily energy demand and available peak sun hours.
   - Estimates the number of standard solar panels needed for the selected system.
   - Supports custom panel power ratings and allows the user to compare alternatives.
   - Displays the array output in kilowatts and estimated daily production.

6. **Location-Based Solar Resource Lookup**
   - Accepts a user-entered location and converts it into coordinates with the OpenCage Geocoding API.
   - Requests solar-radiation data from the Open-Meteo Forecast API using the resulting latitude and longitude.
   - Displays daily and monthly solar-resource information.
   - Uses available peak sun hours to calculate a realistic system size.
   - Provides a clear message when an API request fails or the entered location cannot be found.

7. **Product Catalogue**
   - Displays batteries, inverters, and solar panels with product names, specifications, quantities, and prices.
   - Groups products by category and supports filtering by power rating or system suitability.
   - Calculates a preliminary component cost based on the recommended system size.
   - Shows product availability status and important technical notes.

8. **Package Recommendation Engine**
   - Compares the calculated system demand with predefined package capacities.
   - Recommends a suitable solar package such as 1.5 kVA, 3.2 kVA, 5 kVA, 6.2 kVA, 10 kVA, or 20 kVA.
   - Selects the smallest package that can meet the calculated load and safety requirements.
   - Displays the package description, expected output, battery range, and estimated installation cost.

9. **Customer Inquiry Form**
   - Captures customer name, email, phone number, and project details.
   - Sends the completed inquiry to the project owner through a suitable form-processing service or saves it locally during development.
   - Displays a confirmation message after an inquiry is submitted.
   - Includes front-end validation to prevent incomplete or invalid submissions.

10. **Testimonials and Feedback**

- Displays customer testimonials in a responsive card layout.
- Allows users to submit ratings and comments.
- Saves new reviews locally in browser storage so the feature remains usable without a backend.
- Identifies the most recent feedback entries and shows a simple star rating.

 1. **Quotation Generator**

- Combines the selected package, product prices, installation allowance, and projected system size.
- Calculates a preliminary total cost in the local currency.
- Generates a bill of materials that can be reviewed before sending an inquiry.
- Updates the quotation when the user changes the package or system assumptions.

 1. **Responsive Design and Accessibility**

- Presents the calculator on mobile and desktop layouts.
- Uses semantic HTML, labels, keyboard-accessible controls, and visible focus styles.
- Includes animated hero elements, card transitions, and status feedback.
- Keeps the interface usable at small viewport sizes without losing essential information.

## 4. Wireframes

### Mobile View

```text
+------------------------------+
| LOGO                 ☰     |
+------------------------------+
| Location Search              |
| [_____________________]     |
+------------------------------+
| Appliances                   |
| TV [Qty]                    |
| Pump [Qty]                  |
| Laptop [Qty]                |
+------------------------------+
| Calculate Load               |
+------------------------------+
| Results                      |
| Battery Size                 |
| Inverter Size                |
| Solar Panels                 |
| Estimated Cost               |
+------------------------------+
| Request Quote                |
+------------------------------+
```

### Desktop View

```text
+--------------------------------------------------------------+
| LOGO                        Navigation Menu                 |
+--------------------------------------------------------------+
| Location Search                Solar Resource Summary        |
| [address]                      Open-Meteo: 5.4 peak sun hours |
+--------------------------------------------------------------+
| Appliances       | Load Summary                              |
| TV [Qty]         | Daily Energy: 12.8 kWh                  |
| Pump [Qty]       | Peak Load: 4.2 kW                        |
| Laptop [Qty]     |                                          |
+--------------------------------------------------------------+
| Battery Size     | Inverter Size | Panels | Estimated Cost  |
+--------------------------------------------------------------+
| Recommended Solar Package                                   |
| 5 kVA Hybrid System                                         |
+--------------------------------------------------------------+
| Request Quote                    Testimonials                  |
+--------------------------------------------------------------+
```

## 5. External Data

### Open-Meteo API

The Open-Meteo API provides solar-radiation data for the selected location. It will allow the application to estimate:

- Daily solar radiation values.
- Average daily short-wave radiation.
- Peak sun hours for the selected area.
- Recent solar-resource trends for planning purposes.
- Energy production assumptions based on the selected site.

The application will use the latitude and longitude returned by OpenCage to request a solar profile. If the weather-service request fails, the application will use a conservative local fallback value and clearly label the estimate.

### OpenCage Geocoding API

The OpenCage API will convert a user-entered address into geographic coordinates. It will provide:

- Latitude.
- Longitude.
- Formatted address.
- Country and city details.
- The information necessary to request solar-production data.

### Local Data Storage

The application will store:

- A local appliance catalogue with typical power ratings.
- A local product catalogue with battery, inverter, and panel specifications.
- User inquiry records in browser storage during the prototype stage.
- Customer testimonials submitted through the feedback form.
- Calculated quotations for review and reuse.
- User-selected package recommendations and recent calculation results.

The application will use browser storage initially. A future version can add a server and database for persistent customer requests.

## 6. Module List

1. **User Interface Module**
   - Builds the page layout and controls.
   - Handles responsive navigation, forms, and dynamic updates.
   - Displays loading states and validation messages.

2. **Location Module**
   - Accepts a place name or address.
   - Calls the OpenCage API.
   - Stores and displays the selected coordinates.
   - Handles location errors and fallback selection.

3. **Solar Data Module**
   - Calls the Open-Meteo API.
   - Converts received radiation values into useful peak-sun-hour values.
   - Calculates average daily energy production.
   - Provides a fallback profile when external data is unavailable.

4. **Load Calculation Module**
   - Stores appliance definitions and quantities.
   - Calculates daily energy consumption.
   - Calculates peak power demand.
   - Validates user input and prevents impossible values.

5. **Battery Sizing Module**
   - Calculates battery capacity in ampere-hours.
   - Uses depth of discharge, autonomy, efficiency, and voltage.
   - Produces a recommended battery-bank size.

6. **Inverter Sizing Module**
   - Calculates a minimum inverter power rating.
   - Applies a surge and safety margin.
   - Matches the result to a practical package recommendation.

7. **Solar Array Module**
   - Calculates the required array size.
   - Estimates panel count and total generation.
   - Supports multiple panel-power options and panel efficiency assumptions.

8. **Product Catalogue Module**
   - Displays products and pricing.
   - Filters and groups components by category.
   - Calculates a preliminary component cost.

9. **Quotation Module**
   - Collects system assumptions and product prices.
   - Generates an estimated quote.
   - Displays a bill of materials and installation allowance.
   - Saves or submits customer inquiries.

10. **Feedback Module**

- Displays testimonials.
- Adds new customer reviews.
- Stores feedback in browser storage.
- Displays an accessible star-based rating.

 1. **State Management Module**

- Tracks the current location, load profile, solar data, selected package, and quotation.
- Keeps dynamic calculations synchronized with the user interface.
- Prevents the application from requiring a page reload after each change.

## 7. Graphic Identity

### Color Scheme

- Primary Blue: `#005B96`
- Primary Solar Orange: `#FFB000`
- Dark Gray: `#333333`
- Light Gray: `#F5F5F5`
- White: `#FFFFFF`
- Success Green: `#1F7A5B`
- Error Red: `#B42318`

The blue color communicates trust and technology, while orange represents sunlight and renewable energy. Dark gray is used for main text and headings, and light gray provides a clean background for content.

### Typography

- Headings: Poppins Bold.
- Body text: Roboto.
- Heading scale: large, bold, and spacious to create visual hierarchy.
- Body text: readable, high-contrast, and sized for mobile screens.

### Application Icon

The application icon will combine a solar panel with a rising sun and a calculator symbol. The icon will use the blue and orange palette and will be visible in the header and browser tab. A simple version is:

```text
      ☀
     ___
   ▣▣▣  +
```

The panel shape and calculator symbol together communicate solar-power planning and technical calculation.

## 8. Timeline

### Week 5 — Interface and Load Calculator

#### Goals

- Create responsive mobile and desktop wireframes.
- Design the page layout and visual identity.
- Set up the project structure and shared styling.
- Build the appliance catalogue and load calculator.
- Connect the location form to OpenCage.

#### Deliverable

A working appliance load calculator with a responsive interface and location lookup.

### Week 6 — System Sizing Engine

#### Sizing Goals

- Integrate PVGIS data for location-based solar production.
- Develop battery sizing calculations.
- Develop inverter sizing calculations.
- Develop solar panel sizing calculations.
- Add package recommendation rules.

#### Sizing Deliverable

A functional solar-system sizing engine that produces preliminary battery, inverter, panel, and package recommendations.

### Week 7 — Product Catalogue and Final Release

#### Release Goals

- Develop the product catalogue and pricing model.
- Implement quotation generation.
- Add testimonials, reviews, and inquiry submission.
- Test accessibility, form validation, responsive layouts, and calculation accuracy.
- Fix defects and prepare deployment.
- Publish the final project and document the result.

#### Release Deliverable

A fully functional, tested, and deployed web application that meets the course requirements.

## 9. Project Planning (Trello)

The Trello board should contain the following detailed cards.

### Backlog

- Research OpenCage API usage, request limits, and required authentication.
- Research Open-Meteo solar-radiation request formats and available data fields.
- Design a responsive mobile wireframe.
- Design a responsive desktop wireframe.
- Gather a product catalogue with sample batteries, inverters, and solar panels.
- Identify realistic pricing assumptions for the first prototype.
- Decide whether the first version will use browser storage or a backend service.
- Establish a visual style guide for colors, typography, and icons.
- Document accessibility requirements for all interactive controls.
- Research safe handling of API keys and environment variables.
- Define test cases for calculation accuracy and error handling.
- Plan deployment requirements for GitHub Pages or another hosting service.

### To Do

- Create the project folder and shared HTML structure.
- Build the responsive header and navigation.
- Create the hero layout and project introduction.
- Build the appliance catalog with typical power ratings.
- Implement appliance quantity and usage-hour inputs.
- Calculate total daily energy consumption.
- Calculate peak-load demand.
- Build the battery-sizing formula and display result.
- Build the inverter-sizing formula and display result.
- Build the solar-panel array formula and display result.
- Connect the OpenCage API to convert locations into coordinates.
- Connect the Open-Meteo API to obtain solar-resource data.
- Build a fallback solar-resource profile for failed API requests.
- Create package recommendation rules for 1.5 kVA to 20 kVA systems.
- Build the product catalogue page and pricing cards.
- Build the quotation summary and bill of materials.
- Add inquiry form validation and submission feedback.
- Add testimonials and review submission.
- Add local storage support for reviews and inquiries.
- Build responsive mobile and tablet layouts.
- Add CSS animations and visual status messages.
- Perform accessibility and responsive testing.
- Review the code for clean organization and comments.
- Run ESLint and project tests before submission.
- Optimize the project for deployment.
- Publish the final project and document any remaining limitations.

### Doing

- Build the calculator interface.
- Implement the system-sizing calculations.
- Integrate external location and solar data.
- Prepare the product catalogue and quotation model.
- Test calculation accuracy and responsive behavior.

### Testing

- Test empty appliance lists.
- Test invalid numeric input.
- Test zero or negative usage hours.
- Test missing location and failed API responses.
- Test battery sizing with different autonomy values.
- Test inverter sizing with high peak loads.
- Test panel calculations with different peak-sun-hour values.
- Test package selection for small and large loads.
- Test mobile navigation and form controls.
- Test keyboard navigation and focus visibility.
- Test browser storage when reviews are submitted.
- Test inquiry validation and error messages.
- Test API timeout and service-unavailable behavior.
- Test final build and deployment preview.

### Done

- Project proposal drafted.
- Initial project structure planned.
- Solar sizing concept selected.
- Required technology stack confirmed as HTML, CSS, and vanilla JavaScript.
- Required external APIs selected.
- Responsive design direction approved.
- Initial project backlog created.

## 10. Challenges

1. **Accurate appliance consumption values**
   - Typical power ratings vary by model, age, and operating mode.
   - The prototype must use clearly labeled assumptions and practical safety margins.

2. **Reliable sizing formulas**
   - Battery, inverter, and panel calculations must account for efficiency, autonomy, safety factors, and load variation.
   - The calculations will be verified against realistic sample values.

3. **Variable solar resources**
   - Solar production changes by latitude, weather, season, orientation, and shading.
   - The application must communicate that results are estimates, not exact engineering designs.

4. **API integration and availability**
   - Both OpenCage and Open-Meteo require reliable internet access and correct request parameters.
   - The application will include graceful fallbacks and clear status messages.

5. **Cross-device usability**
   - The interface must remain usable on small mobile screens and larger desktop displays.
   - A mobile-first design and careful spacing will be used.

6. **Accurate product pricing**
   - Local product prices change frequently.
   - The first version will use a curated sample catalogue with clearly noted prices and may require manual updates.

7. **Different customer scenarios**
   - Off-grid systems, hybrid systems, and grid-tied systems have different requirements.
   - The package recommendations will use conservative assumptions and explain the recommended system type.

8. **Technical scope management**
   - A complete professional solar design requires engineering data, site measurements, and local regulations.
   - The product will clearly remain a decision-support and quotation tool rather than a replacement for a licensed installer.

## 11. Project Requirements Checklist

- The project uses HTML, CSS, and vanilla JavaScript.
- The application uses at least two external third-party APIs.
- OpenWeatherMap is not used.
- The interface includes dynamically generated markup.
- The project uses responsive CSS and includes animation.
- The code is organized into modules.
- The project includes errors, fallback behavior, and input validation.
- The application supports both mobile and desktop layouts.
- The design includes a clear color identity and typography.
- The project includes a package-recommendation and quotation workflow.
- The application is suitable for deployment on a static-hosting platform.
