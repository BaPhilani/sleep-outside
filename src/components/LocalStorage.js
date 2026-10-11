/**
 * LocalStorage Manager
 * Task #13: Save reviews and inquiry details in the browser
 * Implements browser-based storage for user data
 */

export class LocalStorageManager {
  constructor(config = {}) {
    this.config = {
      storagePrefix: 'solarCalculator_',
      version: '1.0',
      ...config
    };
    this.init();
  }

  /**
   * Initialize storage manager
   */
  init() {
    this.setupStorageListeners();
    this.cleanupOldData();
  }

  /**
   * Implement localStorage for persistent data
   */
  saveToLocalStorage(key, data) {
    try {
      const storageKey = this.config.storagePrefix + key;
      const dataToStore = {
        data,
        timestamp: new Date().toISOString(),
        version: this.config.version
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      return true;
    } catch (error) {
      console.error('LocalStorage save error:', error);
      return false;
    }
  }

  /**
   * Retrieve from localStorage
   */
  getFromLocalStorage(key) {
    try {
      const storageKey = this.config.storagePrefix + key;
      const item = localStorage.getItem(storageKey);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('LocalStorage retrieval error:', error);
      return null;
    }
  }

  /**
   * Implement sessionStorage for temporary data
   */
  saveToSessionStorage(key, data) {
    try {
      const storageKey = this.config.storagePrefix + key;
      sessionStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('SessionStorage save error:', error);
      return false;
    }
  }

  /**
   * Retrieve from sessionStorage
   */
  getFromSessionStorage(key) {
    try {
      const storageKey = this.config.storagePrefix + key;
      const item = sessionStorage.getItem(storageKey);
      if (!item) return null;
      
      return JSON.parse(item);
    } catch (error) {
      console.error('SessionStorage retrieval error:', error);
      return null;
    }
  }

  /**
   * Save review submissions locally
   */
  saveReview(review) {
    const reviews = this.getReviews() || [];
    reviews.push({
      ...review,
      id: Date.now(),
      savedAt: new Date().toISOString()
    });
    this.saveToLocalStorage('reviews', reviews);
    return review.id;
  }

  /**
   * Get all reviews
   */
  getReviews() {
    return this.getFromLocalStorage('reviews') || [];
  }

  /**
   * Save inquiry/quote details locally
   */
  saveInquiry(inquiry) {
    const inquiries = this.getInquiries() || [];
    inquiries.push({
      ...inquiry,
      id: Date.now(),
      savedAt: new Date().toISOString()
    });
    this.saveToLocalStorage('inquiries', inquiries);
    return inquiry.id;
  }

  /**
   * Get all inquiries
   */
  getInquiries() {
    return this.getFromLocalStorage('inquiries') || [];
  }

  /**
   * Create data retrieval functions
   */
  getAllData(type = 'all') {
    const data = {};
    if (type === 'reviews' || type === 'all') {
      data.reviews = this.getReviews();
    }
    if (type === 'inquiries' || type === 'all') {
      data.inquiries = this.getInquiries();
    }
    return data;
  }

  /**
   * Add data export functionality (CSV/JSON)
   */
  exportAsJSON(type = 'all') {
    const data = this.getAllData(type);
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, `export-${type}-${Date.now()}.json`, 'application/json');
  }

  /**
   * Export as CSV
   */
  exportAsCSV(type = 'all') {
    let csv = '';
    const data = this.getAllData(type);

    if (data.reviews && data.reviews.length > 0) {
      csv += 'REVIEWS\n';
      csv += 'Name,Email,Rating,Review,Date\n';
      data.reviews.forEach(review => {
        csv += `"${review.name}","${review.email}","${review.rating}","${review.review}","${review.savedAt}"\n`;
      });
      csv += '\n\n';
    }

    if (data.inquiries && data.inquiries.length > 0) {
      csv += 'INQUIRIES\n';
      csv += 'Name,Email,System Size,Location,Message,Date\n';
      data.inquiries.forEach(inquiry => {
        csv += `"${inquiry.name}","${inquiry.email}","${inquiry.systemSize}","${inquiry.location}","${inquiry.message}","${inquiry.savedAt}"\n`;
      });
    }

    this.downloadFile(csv, `export-${type}-${Date.now()}.csv`, 'text/csv');
  }

  /**
   * Helper to download files
   */
  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Implement data clearing/reset options
   */
  clearAllData() {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.config.storagePrefix)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Clear specific data type
   */
  clearDataType(type) {
    const key = this.config.storagePrefix + type;
    localStorage.removeItem(key);
  }

  /**
   * Add data validation for stored items
   */
  validateReview(review) {
    if (!review.name || typeof review.name !== 'string') return false;
    if (!review.email || !this.isValidEmail(review.email)) return false;
    if (!review.rating || ![1, 2, 3, 4, 5].includes(parseInt(review.rating))) return false;
    if (!review.review || typeof review.review !== 'string') return false;
    return true;
  }

  /**
   * Validate inquiry
   */
  validateInquiry(inquiry) {
    if (!inquiry.name || typeof inquiry.name !== 'string') return false;
    if (!inquiry.email || !this.isValidEmail(inquiry.email)) return false;
    if (!inquiry.systemSize || isNaN(parseFloat(inquiry.systemSize))) return false;
    if (!inquiry.location || typeof inquiry.location !== 'string') return false;
    return true;
  }

  /**
   * Helper: validate email
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Test storage limits and edge cases
   */
  testStorageCapacity() {
    const testKey = this.config.storagePrefix + 'test_capacity';
    let size = 0;
    
    try {
      while (size < 10 * 1024 * 1024) { // Test up to 10MB
        const testData = new Array(1024).join('x');
        localStorage.setItem(testKey, JSON.stringify({ data: testData, size }));
        size += testData.length;
      }
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('Storage limit reached at:', size / 1024, 'KB');
      }
    } finally {
      localStorage.removeItem(testKey);
    }
    
    return size;
  }

  /**
   * Setup storage listeners
   */
  setupStorageListeners() {
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith(this.config.storagePrefix)) {
        const event = new CustomEvent('storageUpdated', { 
          detail: { key: e.key, newValue: e.newValue } 
        });
        document.dispatchEvent(event);
      }
    });
  }

  /**
   * Cleanup old data (older than 30 days)
   */
  cleanupOldData() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const reviews = this.getReviews()?.filter(r => r.savedAt > thirtyDaysAgo) || [];
    const inquiries = this.getInquiries()?.filter(i => i.savedAt > thirtyDaysAgo) || [];
    
    if (reviews.length !== this.getReviews()?.length) {
      this.saveToLocalStorage('reviews', reviews);
    }
    if (inquiries.length !== this.getInquiries()?.length) {
      this.saveToLocalStorage('inquiries', inquiries);
    }
  }
}

export default LocalStorageManager;
