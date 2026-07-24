let mapElement = null;

const EARTH_RADIUS_KM = 6371;

export const getMapElement = () => {
  if (!mapElement) {
    mapElement = document.querySelector('arcgis-map');
  }

  return mapElement;
};

export const getArcGISMap = () => getMapElement()?.view?.map || null;

export const findLayerByName = (map, name) => {
  if (!map?.layers || !name) return null;

  const target = String(name).toLowerCase();
  const items = map.layers.items || map.layers;

  for (const layer of items) {
    if (!layer) continue;
    const id = String(layer.id || '').toLowerCase();
    const title = String(layer.title || '').toLowerCase();
    const layerName = String(layer.name || '').toLowerCase();

    if (id === target || title === target || layerName === target) {
      return layer;
    }
  }

  return null;
};

export const setLayerVisible = (name, visible = true) => {
  const map = getArcGISMap();
  if (!map) return false;

  const layer = findLayerByName(map, name);
  if (!layer) return false;

  try {
    if (typeof layer.visible !== 'undefined') {
      layer.visible = visible;
    } else if (typeof layer.set === 'function') {
      layer.set('visible', visible);
    } else {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};

export const getPointCoordinates = (point) => {
  if (typeof point?.latitude === 'number' && typeof point?.longitude === 'number') {
    return {
      latitude: point.latitude,
      longitude: point.longitude
    };
  }

  if (typeof point?.x === 'number' && typeof point?.y === 'number') {
    const radius = 6378137;
    const longitude = (point.x / radius) * (180 / Math.PI);
    const latitude = (2 * Math.atan(Math.exp(point.y / radius)) - Math.PI / 2) * (180 / Math.PI);

    return {
      latitude,
      longitude
    };
  }

  return null;
};

export const evaluateProximity = (view, target, thresholdMeters = 10000) => {
  const center = view?.center;
  const centerCoordinates = getPointCoordinates(center);

  if (!centerCoordinates || !target) {
    return null;
  }

  const distanceKm = haversineDistanceKm(
    centerCoordinates.latitude,
    centerCoordinates.longitude,
    target.latitude,
    target.longitude
  );

  const distanceMeters = distanceKm * 1000;

  return {
    distanceMeters,
    isNear: distanceMeters <= thresholdMeters
  };
};

export const checkProximity = ({ view, target, thresholdMeters = 10000, onNear, onFar }) => {
  const result = evaluateProximity(view, target, thresholdMeters);
  if (!result) return null;

  if (result.isNear) {
    if (typeof onNear === 'function') onNear(result);
  } else if (typeof onFar === 'function') {
    onFar(result);
  }

  return result;
};