/**
 * API Service for VayuNet Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export async function fetchHealth() {
  return request('/health');
}

export async function fetchMapData() {
  return request('/map-data');
}

export async function fetchLocations(type = null) {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  return request(`/locations${query}`);
}

export async function fetchLocationById(id) {
  return request(`/locations/${id}`);
}

export async function fetchSchools() {
  return request('/schools');
}

export async function fetchSchoolById(id) {
  return request(`/schools/${id}`);
}

export async function predictCoordinates(lat, lng, locationId = null) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify({
      lat: Number(lat),
      lng: Number(lng),
      location_id: locationId,
    }),
  });
}

export async function fetchAdvisory(payload) {
  return request('/advisory', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function triggerRealtimeTick() {
  return request('/realtime-tick', {
    method: 'POST',
  });
}

