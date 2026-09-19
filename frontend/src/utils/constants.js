export const DELHI_CENTER = [28.6139, 77.2090];
export const DEFAULT_ZOOM = 11;

export const MAP_TILES = {
  dark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};


export const CPCB_SAFE_LIMITS = {
  pm25: 60.0, // 24-hr standard in India (µg/m³)
  pm10: 100.0 // 24-hr standard in India (µg/m³)
};

export const TABS = {
  CITIZEN: 'citizen',
  OVERVIEW: 'overview',
  SCHOOL: 'school',
  WORKER: 'worker',
  EXPLAINER: 'explainer'
};

