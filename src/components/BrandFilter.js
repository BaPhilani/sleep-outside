/**
 * BrandFilter Component
 * Task #10: Feature: Must-Have and Hz Brands
 * Implements brand filtering and featuring functionality for Must-Have and Hz branded products
 */

export class BrandFilter {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.brands = {
      mustHave: [],
      hz: [],
      other: []
    };
    this.init();
  }

  /**
   * Initialize brand filter UI
   */
  init() {
    this.render();
    this.attachEventListeners();
  }

  /**
   * Render brand filter sections
   */
  render() {
    const html = `
      <div class="brand-filter">
        <h3>Filter by Brand</h3>
        
        <div class="brand-section must-have">
          <h4>Must-Have Brands</h4>
          <div class="brand-options" id="must-have-brands"></div>
        </div>
        
        <div class="brand-section hz">
          <h4>Hz Brands</h4>
          <div class="brand-options" id="hz-brands"></div>
        </div>
        
        <div class="brand-section other">
          <h4>Other Brands</h4>
          <div class="brand-options" id="other-brands"></div>
        </div>
        
        <button id="clear-filters" class="btn-secondary">Clear Filters</button>
      </div>
    `;
    this.container.innerHTML = html;
  }

  /**
   * Add brand to filter
   */
  addBrand(brand, category = 'other') {
    if (!this.brands[category].includes(brand)) {
      this.brands[category].push(brand);
    }
  }

  /**
   * Get selected brands
   */
  getSelectedBrands() {
    const selected = [];
    document.querySelectorAll('.brand-option input:checked').forEach(checkbox => {
      selected.push(checkbox.value);
    });
    return selected;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    document.getElementById('clear-filters')?.addEventListener('click', () => {
      document.querySelectorAll('.brand-option input').forEach(checkbox => {
        checkbox.checked = false;
      });
      this.onFilterChange();
    });

    document.querySelectorAll('.brand-option input').forEach(checkbox => {
      checkbox.addEventListener('change', () => this.onFilterChange());
    });
  }

  /**
   * Callback when filters change
   */
  onFilterChange() {
    const selected = this.getSelectedBrands();
    const event = new CustomEvent('brandsFiltered', { detail: { brands: selected } });
    document.dispatchEvent(event);
  }
}

export default BrandFilter;
