<template>
  <div class="control-panel">
    <h2 class="title">Optimisation d'itinéraire - Lille</h2>

    <div class="preset-buttons">
      <button @click="addGareFlandres" class="btn btn-preset">
        Gare Lille Flandres
      </button>
      <button @click="addCitadelle" class="btn btn-preset">
        Citadelle
      </button>
      <button @click="addVieuxLille" class="btn btn-preset">
        Vieux Lille
      </button>
    </div>

    <div class="input-group">
      <input
        v-model="latitude"
        type="number"
        placeholder="Latitude"
        step="0.0001"
        class="input"
      />
      <input
        v-model="longitude"
        type="number"
        placeholder="Longitude"
        step="0.0001"
        class="input"
      />
      <button @click="addPoint" class="btn btn-add">
        Ajouter
      </button>
    </div>

    <div class="actions">
      <button @click="optimize" class="btn btn-optimize">
        Optimiser
      </button>
      <button @click="clear" class="btn btn-clear">
        Effacer
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-point', 'optimize', 'clear'])

const latitude = ref(50.6292)
const longitude = ref(3.0573)

const presetPoints = {
  gareFlandres: { lat: 50.6366, lng: 3.0747, name: 'Gare Lille Flandres' },
  citadelle: { lat: 50.6446, lng: 3.0485, name: 'Citadelle' },
  vieuxLille: { lat: 50.6411, lng: 3.0631, name: 'Vieux Lille' }
}

function addPoint() {
  emit('add-point', {
    lat: parseFloat(latitude.value),
    lng: parseFloat(longitude.value)
  })
}

function addGareFlandres() {
  emit('add-point', presetPoints.gareFlandres)
}

function addCitadelle() {
  emit('add-point', presetPoints.citadelle)
}

function addVieuxLille() {
  emit('add-point', presetPoints.vieuxLille)
}

function optimize() {
  emit('optimize')
}

function clear() {
  emit('clear')
}
</script>

<style scoped>
.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 102, 0, 0.3);
  box-shadow: 0 0 30px rgba(255, 102, 0, 0.2);
  min-width: 300px;
}

.title {
  color: #ff6600;
  font-size: 18px;
  margin-bottom: 15px;
  text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
}

.preset-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.btn-preset {
  background: rgba(138, 43, 226, 0.2);
  color: #ba55d3;
  border: 1px solid #ba55d3;
  padding: 8px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.btn-preset:hover {
  background: rgba(138, 43, 226, 0.3);
  box-shadow: 0 0 15px rgba(186, 85, 211, 0.5);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 102, 0, 0.3);
  border-radius: 6px;
  padding: 10px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.input:focus {
  border-color: #ff6600;
  box-shadow: 0 0 10px rgba(255, 102, 0, 0.3);
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.btn-add {
  background: rgba(255, 102, 0, 0.2);
  color: #ff6600;
  border: 1px solid #ff6600;
}

.btn-add:hover {
  background: rgba(255, 102, 0, 0.3);
  box-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
}

.btn-optimize {
  background: rgba(255, 0, 255, 0.2);
  color: #ff00ff;
  border: 1px solid #ff00ff;
}

.btn-optimize:hover {
  background: rgba(255, 0, 255, 0.3);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
}

.btn-clear {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
