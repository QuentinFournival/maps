<template>
  <div v-if="selectedRoute !== null" class="route-detail-panel" @click.self="closePanel">
    <div class="detail-content">
      <button class="close-btn" @click="closePanel">✕</button>

      <div class="route-header">
        <div class="route-color-bar" :style="{ backgroundColor: selectedRoute.color }"></div>
        <div class="route-header-info">
          <h3 class="panel-title">Itinéraire - {{ selectedRoute.driver?.name }}</h3>
          <div class="route-stats">
            <span class="stat">
              <span class="stat-icon">📦</span>
              {{ getFridgeCount(selectedRoute) }} frigos
            </span>
            <span class="stat">
              <span class="stat-icon">📏</span>
              {{ formatDistance(selectedRoute.route?.distance) }}
            </span>
          </div>
        </div>
      </div>

      <div class="fridges-section">
        <h4 class="section-title">Liste des produits par frigo</h4>
        <div class="fridges-list">
          <div v-for="(fridge, index) in getRouteFridges(selectedRoute)" :key="fridge.id" class="fridge-card">
            <div class="fridge-card-header">
              <div class="fridge-number">{{ index + 1 }}</div>
              <div class="fridge-details">
                <div class="fridge-name">{{ fridge.name }}</div>
                <div class="fridge-address">{{ fridge.address }}</div>
              </div>
              <div class="fridge-status-dot" :class="fridge.status"></div>
            </div>
            <div class="products-list">
              <div v-for="product in getProductsForFridge(fridge)" :key="product.id" class="product-item">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-quantity">x{{ product.quantity }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="generateQRCode" class="btn-action btn-qr">
          <span>📱</span>
          Générer QR Code
        </button>
        <button @click="printRoute" class="btn-action btn-print">
          <span>🖨️</span>
          Imprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedRoute: Object
})

const emit = defineEmits(['close', 'generate-qr'])

function getFridgeCount(route) {
  if (!route || !route.fridges) return 0
  return route.fridges.length
}

function formatDistance(distance) {
  if (!distance) return '0 km'
  return `${distance.toFixed(1)} km`
}

function getRouteFridges(route) {
  if (!route || !route.fridges) return []
  return route.fridges
}

function getProductsForFridge(fridge) {
  if (!fridge || !fridge.inventory) return []

  // Calculer les besoins: seulement les produits qui ont besoin de réapprovisionnement
  return fridge.inventory
    .map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.capacity - item.current // Quantité nécessaire pour remplir
    }))
    .filter(item => item.quantity > 0) // Ne garder que les produits avec besoin > 0
}

function closePanel() {
  emit('close')
}

function generateQRCode() {
  emit('generate-qr', props.selectedRoute)
}

function printRoute() {
  window.print()
}
</script>

<style scoped>
.route-detail-panel {
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
  padding: 20px;
}

.detail-content {
  position: relative;
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  z-index: 10;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.route-header {
  display: flex;
  gap: 16px;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.route-color-bar {
  width: 6px;
  border-radius: 3px;
  flex-shrink: 0;
}

.route-header-info {
  flex: 1;
}

.panel-title {
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.route-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.stat-icon {
  font-size: 16px;
}

.fridges-section {
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.fridges-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fridge-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.fridge-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.fridge-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.fridge-details {
  flex: 1;
  min-width: 0;
}

.fridge-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.fridge-address {
  font-size: 12px;
  color: #6b7280;
}

.fridge-status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fridge-status-dot.green {
  background: #10b981;
}

.fridge-status-dot.yellow {
  background: #f59e0b;
}

.fridge-status-dot.red {
  background: #ef4444;
}

.products-list {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.product-name {
  font-size: 13px;
  color: #374151;
}

.product-quantity {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
}

.actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-action {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-qr {
  background: #3b82f6;
  color: white;
}

.btn-qr:hover {
  background: #2563eb;
}

.btn-print {
  background: #f3f4f6;
  color: #374151;
}

.btn-print:hover {
  background: #e5e7eb;
}

.detail-content::-webkit-scrollbar {
  width: 6px;
}

.detail-content::-webkit-scrollbar-track {
  background: transparent;
}

.detail-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
