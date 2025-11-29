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

  // ========================================
  // CHECKOUT / CART ENDPOINTS (Backend TODO)
  // ========================================
  // These routes need to be implemented by the backend team:
  
  /**
   * Get user's cart items
   * GET /api/cart
   * Response: { items: [{ product_id, quantity, product_details }], total }
   */
  async getCart() {
    return this.request('/cart');
  }

  /**
   * Add item to cart
   * POST /api/cart
   * Body: { product_id: string, quantity: number }
   * Response: { success: boolean, cart: {...} }
   */
  async addToCart(productId, quantity = 1) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  /**
   * Update cart item quantity
   * PUT /api/cart/:product_id
   * Body: { quantity: number }
   * Response: { success: boolean, cart: {...} }
   */
  async updateCartItem(productId, quantity) {
    return this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/:product_id
   * Response: { success: boolean, cart: {...} }
   */
  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Clear entire cart
   * DELETE /api/cart
   * Response: { success: boolean }
   */
  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  /**
   * Create order from cart
   * POST /api/orders
   * Body: { shipping_address: {...}, payment_method: {...} }
   * Response: { order_id: string, status: string, total: number }
   */
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get order details
   * GET /api/orders/:order_id
   * Response: { order_id, items, total, status, created_at }
   */
  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  /**
   * Get user's order history
   * GET /api/orders
   * Response: { orders: [{order_id, total, status, created_at}] }
   */
  async getOrderHistory() {
    return this.request('/orders');
  }
}

export const api = new APIClient();
