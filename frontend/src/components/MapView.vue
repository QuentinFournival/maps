<template>
  <div class="map-wrapper">
    <div v-if="!mapLoaded" class="loader-overlay">
      <div class="loader"></div>
      <p class="loader-text">Chargement de la carte...</p>
    </div>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  routes: Array,
  fridges: Array,
  warehouse: Object
})

const emit = defineEmits(['select-route'])

const mapContainer = ref(null)
let map = null
let mapLoaded = ref(false)
let fridgeMarkers = []

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        },
        'osm-buildings': {
          type: 'vector',
          url: 'https://tiles.openfreemap.org/planet'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: { 'background-color': '#0a0e27' }
        },
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          paint: {
            'raster-opacity': 0.6,
            'raster-brightness-min': 0.2,
            'raster-brightness-max': 0.5
          }
        }
      ]
    },
    center: [3.0573, 50.6292],
    zoom: 12,
    pitch: 60,
    bearing: -17,
    antialias: true
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    // Add 3D buildings with initial state (underground - negative base)
    if (map.getSource('osm-buildings')) {
      console.log('Adding 3D buildings layer...')

      map.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'osm-buildings',
        'source-layer': 'building',
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['*', ['to-number', ['get', 'building:levels'], 3], 3],
            0, '#1a1f3a',
            15, '#252b4a',
            30, '#2f3659',
            60, '#3a4169'
          ],
          'fill-extrusion-height': ['*', ['to-number', ['get', 'building:levels'], 3], 3],
          'fill-extrusion-base': ['*', ['to-number', ['get', 'building:levels'], 3], -3],
          'fill-extrusion-opacity': 0.9,
          'fill-extrusion-vertical-gradient': true
        }
      })

      map.addLayer({
        id: 'buildings-outline',
        type: 'line',
        source: 'osm-buildings',
        'source-layer': 'building',
        paint: {
          'line-color': '#3b82f6',
          'line-width': 0.5,
          'line-opacity': 0
        }
      })

      console.log('3D buildings layer added, starting animation...')

      // Animate buildings emerging from underground
      setTimeout(() => {
        mapLoaded.value = true

        const duration = 2500
        const startTime = Date.now()

        const animateBuildings = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function (ease-out-cubic)
          const eased = 1 - Math.pow(1 - progress, 3)

          // Interpolate base from -3 to 0
          const currentBase = -3 + (3 * eased)

          try {
            map.setPaintProperty('buildings-3d', 'fill-extrusion-base',
              ['*', ['to-number', ['get', 'building:levels'], 3], currentBase]
            )

            map.setPaintProperty('buildings-outline', 'line-opacity', 0.3 * eased)
          } catch (error) {
            console.error('Animation error:', error)
          }

          if (progress < 1) {
            requestAnimationFrame(animateBuildings)
          } else {
            console.log('Animation complete!')
            // Final state - buildings fully emerged at ground level
            map.setPaintProperty('buildings-3d', 'fill-extrusion-base', 0)
            map.setPaintProperty('buildings-outline', 'line-opacity', 0.3)
          }
        }

        animateBuildings()
      }, 300)
    } else {
      console.log('No osm-buildings source found')
      mapLoaded.value = true
    }

    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: []
        }
      }
    })

    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 4,
        'line-opacity': 0.8
      }
    })

    // Make routes clickable
    map.on('click', 'route-line', (e) => {
      const feature = e.features[0]
      if (feature && feature.properties) {
        const clickedRoute = props.routes.find(r =>
          r.driver?.name === feature.properties.driverName
        )
        if (clickedRoute) {
          emit('select-route', clickedRoute)
        }
      }
    })

    // Change cursor on hover
    map.on('mouseenter', 'route-line', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'route-line', () => {
      map.getCanvas().style.cursor = ''
    })

    // Add warehouse marker
    if (props.warehouse) {
      const warehouseEl = document.createElement('div')
      warehouseEl.className = 'warehouse-marker'
      warehouseEl.innerHTML = `
        <div class="warehouse-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 22V12H15V22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `
      new maplibregl.Marker({ element: warehouseEl })
        .setLngLat([props.warehouse.lng, props.warehouse.lat])
        .addTo(map)
    }

    // Add fridges immediately after map loads
    if (props.fridges && props.fridges.length > 0) {
      props.fridges.forEach((fridge) => {
        const el = document.createElement('div')
        el.className = 'fridge-marker'
        el.innerHTML = `<div class="fridge-dot ${fridge.status}"></div>`
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([fridge.lng, fridge.lat])
          .addTo(map)
        fridgeMarkers.push(marker)
      })
    }
  })
})

watch(() => props.routes, (newRoutes) => {
  console.log('Routes updated:', newRoutes)

  if (!mapLoaded.value || !newRoutes || newRoutes.length === 0) {
    console.log('No routes to display or map not loaded')
    const source = map.getSource('route')
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: []
      })
    }
    return
  }

  const source = map.getSource('route')
  if (!source) {
    console.log('Route source not found!')
    return
  }

  const features = newRoutes.map((routeData, index) => {
    console.log(`Processing route ${index}:`, routeData)
    if (!routeData.route || !routeData.route.coordinates) {
      console.log(`Route ${index} has no coordinates`)
      return null
    }

    return {
      type: 'Feature',
      properties: {
        color: routeData.color || '#ff6600',
        driverName: routeData.driver?.name || `Route ${index + 1}`
      },
      geometry: {
        type: 'LineString',
        coordinates: routeData.route.coordinates
      }
    }
  }).filter(f => f !== null)

  source.setData({
    type: 'FeatureCollection',
    features
  })

  if (features.length > 0 && features[0].geometry.coordinates.length > 0) {
    const allCoords = features.flatMap(f => f.geometry.coordinates)
    const bounds = allCoords.reduce((bounds, coord) => {
      return bounds.extend(coord)
    }, new maplibregl.LngLatBounds(allCoords[0], allCoords[0]))

    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 400, right: 50 },
      pitch: 60,
      bearing: -17
    })
  }
}, { deep: true })

watch(() => props.fridges, (newFridges) => {
  if (!map || !mapLoaded.value || !newFridges) return

  // Supprimer tous les marqueurs existants
  fridgeMarkers.forEach(marker => marker.remove())
  fridgeMarkers = []

  // Ajouter les nouveaux marqueurs
  newFridges.forEach((fridge) => {
    const el = document.createElement('div')
    el.className = 'fridge-marker'
    el.innerHTML = `<div class="fridge-dot ${fridge.status}"></div>`

    const marker = new maplibregl.Marker({ element: el })
      .setLngLat([fridge.lng, fridge.lat])
      .addTo(map)

    fridgeMarkers.push(marker)
  })
}, { deep: true })
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0e27;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loader-text {
  margin-top: 20px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 500;
}

.map-container {
  width: 100%;
  height: 100%;
  background: #0a0e27;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(.maplibregl-canvas-container) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.maplibregl-canvas) {
  outline: none;
  width: 100% !important;
  height: 100% !important;
}

:deep(.fridge-dot) {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

:deep(.fridge-dot:hover) {
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

:deep(.fridge-dot.green) {
  background: #10b981;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
}

:deep(.fridge-dot.yellow) {
  background: #f59e0b;
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.6);
}

:deep(.fridge-dot.red) {
  background: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  animation: pulse-red-marker 2s ease-in-out infinite;
}

@keyframes pulse-red-marker {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 30px rgba(239, 68, 68, 1);
  }
}

:deep(.fridge-marker) {
  background: transparent;
  border: none;
}

:deep(.warehouse-marker) {
  background: transparent;
  border: none;
}

:deep(.warehouse-icon) {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  border: 3px solid rgba(255, 255, 255, 0.9);
  animation: pulse-warehouse 3s ease-in-out infinite;
}

@keyframes pulse-warehouse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(59, 130, 246, 1);
  }
}

:deep(.maplibregl-ctrl-group) {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.maplibregl-ctrl-group button) {
  background-color: rgba(255, 255, 255, 0.95);
  color: #374151;
}

:deep(.maplibregl-ctrl-group button:hover) {
  background-color: white;
}

:deep(.maplibregl-ctrl-attrib) {
  background: rgba(10, 14, 39, 0.8);
  color: #9ca3af;
  font-size: 10px;
}
</style>
