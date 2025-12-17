import fetch from 'node-fetch';

function calculateDistance(point1, point2) {
  const R = 6371;
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
  const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function nearestNeighbor(points) {
  if (points.length <= 1) return points;

  // Le premier point est l'entrepôt, on ne l'optimise pas
  const warehouse = points[0];
  const deliveryPoints = points.slice(1); // Tous les points sauf l'entrepôt

  if (deliveryPoints.length === 0) {
    return points;
  }

  // Optimiser uniquement les points de livraison
  const visited = new Set();
  const route = [deliveryPoints[0]];
  visited.add(0);

  let current = warehouse; // On commence depuis l'entrepôt

  // Trouver le point le plus proche de l'entrepôt
  let nearestFromWarehouse = 0;
  let minDistFromWarehouse = Infinity;
  deliveryPoints.forEach((point, index) => {
    const distance = calculateDistance(warehouse, point);
    if (distance < minDistFromWarehouse) {
      minDistFromWarehouse = distance;
      nearestFromWarehouse = index;
    }
  });

  route[0] = deliveryPoints[nearestFromWarehouse];
  visited.clear();
  visited.add(nearestFromWarehouse);

  // Continuer avec nearest neighbor pour les autres points
  while (route.length < deliveryPoints.length) {
    current = route[route.length - 1];
    let nearestIndex = -1;
    let minDistance = Infinity;

    deliveryPoints.forEach((point, index) => {
      if (!visited.has(index)) {
        const distance = calculateDistance(current, point);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      }
    });

    if (nearestIndex !== -1) {
      route.push(deliveryPoints[nearestIndex]);
      visited.add(nearestIndex);
    }
  }

  // Retourner: Entrepôt -> Points optimisés (sans retour à l'entrepôt)
  return [warehouse, ...route];
}

async function getRouteFromOSRM(points) {
  const coords = points.map(p => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      return {
        coordinates: data.routes[0].geometry.coordinates,
        distance: data.routes[0].distance / 1000
      };
    }
  } catch (error) {
    console.error('Erreur OSRM:', error);
  }

  return null;
}

async function optimize(points) {
  console.log('=== OPTIMIZE START ===');
  console.log('Input points:', points.map(p => ({ name: p.name, lat: p.lat, lng: p.lng })));

  const optimizedPoints = nearestNeighbor(points);

  console.log('Optimized points:', optimizedPoints.map(p => ({ name: p.name, lat: p.lat, lng: p.lng })));

  const routeData = await getRouteFromOSRM(optimizedPoints);

  if (routeData) {
    console.log('Route from OSRM - distance:', routeData.distance, 'km');
    console.log('First coord:', routeData.coordinates[0]);
    console.log('Last coord:', routeData.coordinates[routeData.coordinates.length - 1]);
    // Retourner les points optimisés avec toutes leurs données
    return {
      ...routeData,
      optimizedPoints: optimizedPoints
    };
  }

  return {
    coordinates: optimizedPoints.map(p => [p.lng, p.lat]),
    distance: optimizedPoints.reduce((total, point, index) => {
      if (index === 0) return 0;
      return total + calculateDistance(optimizedPoints[index - 1], point);
    }, 0),
    optimizedPoints: optimizedPoints
  };
}

export default { optimize };
