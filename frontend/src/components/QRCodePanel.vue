<template>
  <div v-if="selectedRoute !== null" class="qrcode-panel" @click.self="closePanel">
    <div class="qr-content">
      <button class="close-btn" @click="closePanel">✕</button>
      <h3 class="panel-title">Itinéraire - {{ selectedRoute.driver?.name }}</h3>
      <div class="fridge-count">{{ getFridgeCount(selectedRoute) }} frigos à livrer</div>
      <canvas ref="qrCanvas" class="qr-canvas"></canvas>
      <p class="instruction">Scannez pour ouvrir dans Google Maps</p>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  selectedRoute: Object
})

const emit = defineEmits(['close'])

const qrCanvas = ref(null)

function getFridgeCount(route) {
     if (!route || !route.driver || !route.driver.assignedcount) return 0;
    return route.driver.assignedcount;
}

function closePanel() {
  emit('close')
}

function generateGoogleMapsUrl(route) {
  if (!route || !route.route || !route.route.coordinates || route.route.coordinates.length === 0) {
    return ''
  }

  const coords = route.route.coordinates

  // Google Maps URL format: origin + destination + waypoints
  const origin = `${coords[0][1]},${coords[0][0]}`
  const destination = `${coords[coords.length - 1][1]},${coords[coords.length - 1][0]}`

  // Waypoints (max 25 waypoints for Google Maps)
  const waypoints = coords.slice(1, -1)
    .slice(0, 25)
    .map(coord => `${coord[1]},${coord[0]}`)
    .join('|')

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

  if (waypoints) {
    url += `&waypoints=${waypoints}`
  }

  return url
}

async function generateQRCode() {
  if (!qrCanvas.value || !props.selectedRoute) return

  const url = generateGoogleMapsUrl(props.selectedRoute)
  if (url) {
    try {
      await QRCode.toCanvas(qrCanvas.value, url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('Erreur génération QR code:', error)
    }
  }
}

watch(() => props.selectedRoute, (newRoute) => {
  if (newRoute) {
    setTimeout(() => {
      generateQRCode()
    }, 100)
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.qrcode-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 90%;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.panel-title {
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.fridge-count {
  color: #6b7280;
  font-size: 15px;
  margin: -16px 0 0 0;
}

.qr-canvas {
  width: 300px;
  height: 300px;
  border-radius: 12px;
  background: white;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.instruction {
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  margin: 0;
}
</style>
