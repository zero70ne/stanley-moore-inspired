const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    this.setToken(result.token);
    return result;
  }

  async register(name, email, password) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
    this.setToken(result.token);
    return result;
  }

  // Products
  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    const queryString = params.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Admin - Products
  async getAdminProducts() {
    return this.request('/admin/products');
  }

  async createProduct(productData, images) {
    const formData = new FormData();
    formData.append('productData', JSON.stringify(productData));
    
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }

  async uploadProductImages(productId, images) {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }

  async updateProduct(id, product) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: product
    });
  }

  async deleteProduct(id) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Admin - Orders
  async getAdminOrders() {
    return this.request('/admin/orders');
  }

  async updateOrder(id, updates) {
    return this.request(`/admin/orders/${id}`, {
      method: 'PUT',
      body: updates
    });
  }

  // Admin - Users
  async getUsers() {
    return this.request('/admin/users');
  }

  // Payment
  async createPaymentIntent(amount) {
    return this.request('/payment/create-intent', {
      method: 'POST',
      body: { amount }
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData
    });
  }

  async getOrders() {
    return this.request('/orders');
  }
}

export default new ApiService();