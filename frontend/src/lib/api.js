const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Feed endpoints
  async getFeed(cursor = null, limit = 10) {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit);
    return this.request(`/feed?${params}`);
  }

  // Product endpoints
  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Swipe endpoints
  async recordSwipe(productId, direction) {
    return this.request('/swipes', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, direction }),
    });
  }

  // View tracking
  async recordView(productId, duration) {
    return this.request('/views', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, duration_ms: duration }),
    });
  }

  // Click tracking
  async recordClick(productId, target) {
    return this.request('/clicks', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, target }),
    });
  }

  // Auth endpoints
  async login(email, password, role = 'shopper') {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async signup(email, password, role = 'shopper') {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  // Onboarding
  async sendOnboardingMessage(conversation) {
    return this.request('/onboarding/ai', {
      method: 'POST',
      body: JSON.stringify({ conversation }),
    });
  }

  async finalizeOnboarding(preferences) {
    return this.request('/onboarding/finalize', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const api = new APIClient();
