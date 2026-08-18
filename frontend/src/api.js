const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('notes_token');
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const signup = (name, email, password) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export async function getNotes() { return request('/notes'); }
export async function createNote(title, content) {
  return request('/notes', { method: 'POST', body: JSON.stringify({ title, content }) });
}
export async function updateNote(id, updates) {
  return request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}
export async function deleteNote(id) {
  return request(`/notes/${id}`, { method: 'DELETE' });
}
