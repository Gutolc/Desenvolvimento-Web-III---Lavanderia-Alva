/* ==========================================================
   API Helpers - Centraliza as chamadas ao Backend
   ========================================================== */
const API_BASE_URL = 'http://localhost:8080';

const API = {
  // CORRIGIDO: Agora o GET aceita o token JWT
  async get(endpoint, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error(`GET ${endpoint} falhou: ${response.status}`);
    return response.json();
  },

  async post(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`POST ${endpoint} falhou: ${response.status}`);
    return response.json();
  },

  async put(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`PUT ${endpoint} falhou: ${response.status}`);
    return response.json();
  },

  async delete(endpoint, token = null) {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error(`DELETE ${endpoint} falhou: ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
};