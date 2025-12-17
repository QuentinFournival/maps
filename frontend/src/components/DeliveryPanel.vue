<template>
  <div class="delivery-panel">
    <h3 class="panel-title">Livreurs ({{ availableCount }}/{{ drivers.length }})</h3>

    <div class="drivers-list">
      <div
        v-for="driver in drivers"
        :key="driver.id"
        class="driver-item"
        :class="{ unavailable: !driver.available, selected: driver.selected }"
        @click="toggleDriver(driver)"
      >
        <div class="driver-status" :class="{ active: driver.available && driver.selected }"></div>
        <div class="driver-info">
          <div class="driver-name">{{ driver.name }}</div>
          <div class="driver-badge">
            {{ getDriverStatus(driver) }}
          </div>
        </div>
        <div v-if="driver.assignedCount" class="assigned-count">
          {{ driver.assignedCount }} frigos
        </div>
      </div>
    </div>

    <button @click="generateRoutes" class="btn-generate" :disabled="redFridgesCount === 0">
      <span class="btn-icon">🚚</span>
      Générer les itinéraires ({{ redFridgesCount }} urgents)
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  drivers: Array,
  redFridgesCount: Number
})

const emit = defineEmits(['generate-routes', 'toggle-driver'])

const availableCount = computed(() =>
  props.drivers.filter(d => d.available && d.selected).length
)

function toggleDriver(driver) {
  if (driver.available) {
    emit('toggle-driver', driver.id)
  }
}

function getDriverStatus(driver) {
  if (!driver.available) return 'En livraison'
  return driver.selected ? 'Sélectionné' : 'Non sélectionné'
}

function generateRoutes() {
  emit('generate-routes')
}
</script>

<style scoped>
.delivery-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 320px;
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.2);
}

.panel-title {
  color: #ff6600;
  font-size: 18px;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.drivers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.driver-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.driver-item:hover:not(.unavailable) {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 102, 0, 0.4);
}

.driver-item.selected {
  background: rgba(255, 102, 0, 0.15);
  border-color: rgba(255, 102, 0, 0.5);
}

.driver-item.unavailable {
  opacity: 0.6;
  cursor: not-allowed;
}

.driver-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
  flex-shrink: 0;
}

.driver-status.active {
  background: #00ff00;
  box-shadow: 0 0 15px #00ff00;
  animation: pulse-green 2s ease-in-out infinite;
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 0 15px #00ff00;
  }
  50% {
    box-shadow: 0 0 25px #00ff00, 0 0 35px rgba(0, 255, 0, 0.5);
  }
}

.driver-info {
  flex: 1;
  min-width: 0;
}

.driver-name {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.driver-badge {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.assigned-count {
  color: #ff6600;
  font-weight: 600;
  font-size: 13px;
  background: rgba(255, 102, 0, 0.2);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 102, 0, 0.3);
}

.btn-generate {
  width: 100%;
  padding: 14px;
  background: rgba(255, 102, 0, 0.2);
  color: #ff6600;
  border: 2px solid #ff6600;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-generate:hover:not(:disabled) {
  background: rgba(255, 102, 0, 0.3);
  box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
  transform: translateY(-2px);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 20px;
}
</style>
