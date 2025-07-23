export const iconMap = {
  marker: "📍",
  building: "🏢", 
  home: "🏠",
  store: "🏪",
  factory: "🏭",
};

export function formatCoordinates(lng, lat) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function getBoundingBoxFromPolygon(coordinates) {
  if (!coordinates || !coordinates[0]) return null;
  
  const points = coordinates[0];
  let minLng = points[0][0];
  let maxLng = points[0][0];
  let minLat = points[0][1];
  let maxLat = points[0][1];
  
  points.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  });
  
  return {
    southwest: [minLng, minLat],
    northeast: [maxLng, maxLat],
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2]
  };
}

export function calculatePolygonArea(coordinates) {
  if (!coordinates || !coordinates[0]) return 0;
  
  const points = coordinates[0];
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  
  return Math.abs(area / 2);
}