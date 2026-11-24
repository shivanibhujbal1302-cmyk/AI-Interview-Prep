import { apiRequest } from './api.js';

const USER_KEY = 'aiprep_user';

function saveUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
  return user;
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
}

export async function login({ email, password }) {
  const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
  return saveUser(data.user);
}

export async function register({ name, email, password }) {
  const data = await apiRequest('/auth/register', { method: 'POST', body: { name, email, password } });
  return saveUser(data.user);
}

export async function logout() {
  try { await apiRequest('/auth/logout', { method: 'POST' }); }
  finally { saveUser(null); }
}

export async function updateProfile(updates) {
  // Profile fields are currently kept locally; server-side profile editing is a later integration step.
  return saveUser({ ...getStoredUser(), ...updates });
}
