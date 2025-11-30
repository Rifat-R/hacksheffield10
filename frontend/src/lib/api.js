const API_BASE_URL = (() => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const origin = window.location.origin.replace(/\/$/, '');
  if (origin.includes('localhost:5173') || origin.includes('127.0.0.1:5173')) {
    return 'http://localhost:5000/api';
  }
  return `${origin}/api`;
})();


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
        const body = await safeParseJSON(response);
        const message = body?.error || response.statusText || 'Request failed';
        throw new Error(`HTTP ${response.status} ${message}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', { url, message: error?.message, error });
      throw error;
    }
  }

  // Product endpoints (legacy bulk fetch)
  async getProducts(limit = 20, offset = 0) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    return this.request(`/products?${params.toString()}`);
  }

  async getProduct(id) {
    const response = await this.getProducts(100, 0);
    const products = response.products || response;
    return products.find(
      (product) =>
        String(product.id) === String(id) ||
        String(product.external_id) === String(id)
    );
  }

  // Search products
  async searchProducts(query) {
    const params = new URLSearchParams();
    params.append('q', query);
    return this.request(`/products/search?${params.toString()}`);
  }

  // Swipe endpoints (dashboard/swipes)
  async getNextProduct() {
    return this.request(`/next-product`);
  }

  async registerSwipe({ productId, liked }) {
    return this.request('/register-swipe', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        liked,
      }),
    });
  }

  // Deprecated: use registerSwipe instead
  async recordSwipe(productId, direction) {
    return this.registerSwipe({
      productId,
      liked: direction === 'like',
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

  // ==================== Dashboard CRUD ====================
  
  /**
   * Get all dashboard products
   * GET /api/dashboard/products
   * Response: Array of products
   */
  async getDashboardProducts() {
    return this.request('/dashboard/products');
  }

  /**
   * Get single dashboard product
   * GET /api/dashboard/products/:id
   * Response: Single product object
   */
  async getDashboardProduct(productId) {
    return this.request(`/dashboard/products/${productId}`);
  }

  /**
   * Create new product
   * POST /api/dashboard/products
   * Body: { name, description, price, category, image_url, tags }
   * Response: Created product with id
   */
  async createProduct(productData) {
    return this.request('/dashboard/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Update existing product
   * PUT /api/dashboard/products/:id
   * Body: { name, description, price, category, image_url, tags }
   * Response: Updated product
   */
  async updateProduct(productId, updates) {
    return this.request(`/dashboard/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete product
   * DELETE /api/dashboard/products/:id
   * Response: Success message
   */
  async deleteProduct(productId) {
    return this.request(`/dashboard/products/${productId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new APIClient();

async function safeParseJSON(response) {
  try {
    return await response.json();
  } catch (_err) {
    return null;
  }
}
