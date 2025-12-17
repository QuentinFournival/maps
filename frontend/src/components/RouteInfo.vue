<template>
  <div v-if="routes.length > 0" class="route-info">
    <h3 class="info-title">Informations</h3>
    <div v-for="(route, index) in routes" :key="index" class="route-item">
      <div class="stat">
        <span class="label">Distance:</span>
        <span class="value">{{ route.distance.toFixed(2) }} km</span>
      </div>
      <div class="stat">
        <span class="label">Points:</span>
        <span class="value">{{ route.coordinates.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  routes: Array
})
</script>

<style scoped>
.route-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 102, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.2);
  min-width: 250px;
}

.info-title {
  color: #ff6600;
  font-size: 16px;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.route-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 14px;
}

.label {
  color: rgba(255, 255, 255, 0.7);
}

.value {
  color: #ff6600;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(255, 102, 0, 0.5);
}
</style>
