<template>
  <div class="fridge-list">
    <h3 class="list-title">Frigos Connectés ({{ fridges.length }})</h3>

    <div class="status-summary">
      <div class="status-item">
        <span class="status-dot green"></span>
        <span>{{ greenCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-dot yellow"></span>
        <span>{{ yellowCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-dot red"></span>
        <span>{{ redCount }}</span>
      </div>
    </div>

    <div class="fridge-items">
      <div
        v-for="fridge in fridges"
        :key="fridge.id"
        class="fridge-item"
        :class="{ selected: selectedFridge?.id === fridge.id }"
        @click="selectFridge(fridge)"
      >
        <span class="status-indicator" :class="fridge.status"></span>
        <div class="fridge-info">
          <div class="fridge-name">{{ fridge.name }}</div>
          <div class="fridge-address">{{ fridge.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  fridges: Array
})

const emit = defineEmits(['select-fridge'])

const selectedFridge = ref(null)

const greenCount = computed(() =>
  props.fridges.filter(f => f.status === 'green').length
)

const yellowCount = computed(() =>
  props.fridges.filter(f => f.status === 'yellow').length
)

const redCount = computed(() =>
  props.fridges.filter(f => f.status === 'red').length
)

function selectFridge(fridge) {
  selectedFridge.value = fridge
  emit('select-fridge', fridge)
}
</script>

<style scoped>
.fridge-list {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  max-height: calc(100vh - 40px);
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.2);
}

.list-title {
  color: #ff6600;
  font-size: 18px;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.status-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.status-dot.green {
  background: #00ff00;
  box-shadow: 0 0 15px #00ff00;
}

.status-dot.yellow {
  background: #ffff00;
  box-shadow: 0 0 15px #ffff00;
}

.status-dot.red {
  background: #ff0000;
  box-shadow: 0 0 15px #ff0000;
}

.fridge-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fridge-items::-webkit-scrollbar {
  width: 6px;
}

.fridge-items::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.fridge-items::-webkit-scrollbar-thumb {
  background: rgba(255, 102, 0, 0.3);
  border-radius: 3px;
}

.fridge-items::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 102, 0, 0.5);
}

.fridge-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.fridge-item:hover {
  background: rgba(255, 102, 0, 0.1);
  border-color: rgba(255, 102, 0, 0.3);
  transform: translateX(-3px);
}

.fridge-item.selected {
  background: rgba(255, 102, 0, 0.2);
  border-color: #ff6600;
  box-shadow: 0 0 15px rgba(255, 102, 0, 0.3);
}

.status-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-indicator.green {
  background: #00ff00;
  box-shadow: 0 0 12px #00ff00;
}

.status-indicator.yellow {
  background: #ffff00;
  box-shadow: 0 0 12px #ffff00;
}

.status-indicator.red {
  background: #ff0000;
  box-shadow: 0 0 12px #ff0000;
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 0 12px #ff0000;
  }
  50% {
    box-shadow: 0 0 20px #ff0000, 0 0 30px rgba(255, 0, 0, 0.5);
  }
}

.fridge-info {
  flex: 1;
  min-width: 0;
}

.fridge-name {
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fridge-address {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
