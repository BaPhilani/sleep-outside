/**
 * FormSubmissions Component
 * Task #12: Add quote and review form submissions
 * Creates and implements quote request and review submission forms
 */

export class FormSubmissions {
  constructor(config = {}) {
    this.config = {
      quoteFormSelector: '#quote-form',
      reviewFormSelector: '#review-form',
      formContainerSelector: '.forms-container',
      ...config
    };
    this.init();
  }

  /**
   * Initialize forms
   */
  init() {
    this.createQuoteForm();
    this.createReviewForm();
    this.attachFormListeners();
  }

  /**
   * Create quote request form component
   */
  createQuoteForm() {
    const container = document.querySelector(this.config.formContainerSelector);
    if (!container) return;

    const formHTML = `
      <form id="quote-form" class="form form-quote" novalidate>
        <h3>Request a Quote</h3>
        
        <div class="form-group">
          <label for="quote-name">Full Name *</label>
          <input type="text" id="quote-name" name="name" required>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="quote-email">Email *</label>
          <input type="email" id="quote-email" name="email" required>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="quote-phone">Phone</label>
          <input type="tel" id="quote-phone" name="phone">
        </div>

        <div class="form-group">
          <label for="quote-system-size">System Size (kWp) *</label>
          <input type="number" id="quote-system-size" name="systemSize" step="0.1" required>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="quote-location">Location *</label>
          <select id="quote-location" name="location" required>
            <option value="">Select Location</option>
            <option value="harare">Harare</option>
            <option value="bulawayo">Bulawayo</option>
            <option value="chitungwiza">Chitungwiza</option>
          </select>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="quote-message">Additional Details</label>
          <textarea id="quote-message" name="message" rows="4"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Request Quote</button>
        <div class="form-status"></div>
      </form>
    `;

    container.insertAdjacentHTML('beforeend', formHTML);
  }

  /**
   * Create customer review form component
   */
  createReviewForm() {
    const container = document.querySelector(this.config.formContainerSelector);
    if (!container) return;

    const formHTML = `
      <form id="review-form" class="form form-review" novalidate>
        <h3>Leave a Review</h3>
        
        <div class="form-group">
          <label for="review-name">Your Name *</label>
          <input type="text" id="review-name" name="name" required>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="review-email">Email *</label>
          <input type="email" id="review-email" name="email" required>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="review-rating">Rating *</label>
          <select id="review-rating" name="rating" required>
            <option value="">Select Rating</option>
            <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
            <option value="4">⭐⭐⭐⭐ Good</option>
            <option value="3">⭐⭐⭐ Average</option>
            <option value="2">⭐⭐ Poor</option>
            <option value="1">⭐ Very Poor</option>
          </select>
          <span class="error-message"></span>
        </div>

        <div class="form-group">
          <label for="review-text">Your Review *</label>
          <textarea id="review-text" name="review" rows="5" required></textarea>
          <span class="error-message"></span>
        </div>

        <button type="submit" class="btn btn-primary">Submit Review</button>
        <div class="form-status"></div>
      </form>
    `;

    container.insertAdjacentHTML('beforeend', formHTML);
  }

  /**
   * Implement form validation (client-side)
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual input
   */
  validateInput(input) {
    const errorElement = input.nextElementSibling?.classList.contains('error-message') 
      ? input.nextElementSibling 
      : null;

    let isValid = true;
    let errorMessage = '';

    if (input.type === 'email' && !this.isValidEmail(input.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    } else if (input.type === 'tel' && input.value && !this.isValidPhone(input.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    } else if (!input.value && input.required) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    input.classList.toggle('invalid', !isValid);
    return isValid;
  }

  /**
   * Helper: validate email
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Helper: validate phone
   */
  isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]{7,}$/.test(phone);
  }

  /**
   * Add user feedback messages
   */
  showFeedback(form, message, type = 'success') {
    const statusElement = form.querySelector('.form-status');
    if (statusElement) {
      statusElement.className = `form-status form-status-${type}`;
      statusElement.textContent = message;
      statusElement.style.display = 'block';
    }
  }

  /**
   * Wire up form submission handlers
   */
  attachFormListeners() {
    const quoteForm = document.querySelector('#quote-form');
    const reviewForm = document.querySelector('#review-form');

    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => this.handleQuoteSubmit(e));
    }

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
    }
  }

  /**
   * Handle quote form submission
   */
  handleQuoteSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (!this.validateForm(form)) {
      this.showFeedback(form, 'Please fix the errors above', 'error');
      return;
    }

    const formData = new FormData(form);
    this.submitForm(form, formData, 'quote');
  }

  /**
   * Handle review form submission
   */
  handleReviewSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (!this.validateForm(form)) {
      this.showFeedback(form, 'Please fix the errors above', 'error');
      return;
    }

    const formData = new FormData(form);
    this.submitForm(form, formData, 'review');
  }

  /**
   * Integrate with backend API
   */
  async submitForm(form, formData, type) {
    try {
      this.showFeedback(form, 'Submitting...', 'loading');

      const data = Object.fromEntries(formData);
      const response = await fetch(`/api/${type}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        this.showFeedback(form, `${type === 'quote' ? 'Quote request' : 'Review'} submitted successfully!`, 'success');
        form.reset();
        
        // Save to local storage
        const event = new CustomEvent('formSubmitted', { detail: { type, data } });
        document.dispatchEvent(event);
      } else {
        this.showFeedback(form, 'Submission failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFeedback(form, 'An error occurred. Please try again.', 'error');
    }
  }
}

export default FormSubmissions;
