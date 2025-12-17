<template>
  <div class="route-container">
    <Sidebar
      :drivers="drivers"
      :fridges="fridges"
      @generate-routes="generateDailyRoutes"
      @toggle-driver="toggleDriver"
      @select-fridge="selectFridge"
      @add-driver="addDriver"
      @add-fridge="addFridge"
    />
    <div class="map-wrapper">
      <MapView :routes="routes" :fridges="fridges" :warehouse="warehouse" @select-route="selectRoute" />
    </div>
    <RouteDetailPanel
      v-if="showDetailPanel"
      :selected-route="selectedRoute"
      @close="closeDetailPanel"
      @generate-qr="openQRPanel"
    />
    <QRCodePanel
      v-if="showQRPanel"
      :selected-route="selectedRoute"
      @close="closeQRPanel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MapView from './MapView.vue'
import Sidebar from './Sidebar.vue'
import QRCodePanel from './QRCodePanel.vue'
import RouteDetailPanel from './RouteDetailPanel.vue'
import { fridges as initialFridges, deliveryDrivers, warehouse } from '../data/fridges'
import { distributeRoutesToDrivers } from '../services/routeDistribution'
import axios from 'axios'

const fridges = ref(initialFridges)
const drivers = ref(deliveryDrivers.map(d => ({ ...d, selected: true })))
const routes = ref([])
const selectedRoute = ref(null)
const showDetailPanel = ref(false)
const showQRPanel = ref(false)

const redFridgesCount = computed(() =>
  fridges.value.filter(f => f.status === 'red').length
)

function selectFridge(fridge) {
  console.log('Frigo sélectionné:', fridge)
}

function selectRoute(route) {
  selectedRoute.value = route
  showDetailPanel.value = true
  showQRPanel.value = false
}

function openQRPanel() {
  showQRPanel.value = true
  showDetailPanel.value = false
}

function closeDetailPanel() {
  showDetailPanel.value = false
  selectedRoute.value = null
}

function closeQRPanel() {
  showQRPanel.value = false
}

function toggleDriver(driverId) {
  const driver = drivers.value.find(d => d.id === driverId)
  if (driver) {
    driver.selected = !driver.selected
  }
}

function addDriver(driverData) {
  const newId = Math.max(...drivers.value.map(d => d.id), 0) + 1
  drivers.value.push({
    id: newId,
    name: driverData.name,
    available: true,
    selected: true,
    assignedCount: 0
  })
}

function addFridge(fridgeData) {
  const newId = Math.max(...fridges.value.map(f => f.id), 0) + 1
  fridges.value.push({
    id: newId,
    ...fridgeData
  })
}

async function generateDailyRoutes() {
  const urgentFridges = fridges.value.filter(f => f.status === 'red')
  const availableDrivers = drivers.value.filter(d => d.available && d.selected)

  if (urgentFridges.length === 0) {
    alert('Aucun frigo urgent à traiter')
    return
  }

  if (availableDrivers.length === 0) {
    alert('Aucun livreur disponible')
    return
  }

  const distributions = distributeRoutesToDrivers(urgentFridges, availableDrivers, warehouse)

  try {
    const response = await axios.post('http://localhost:3000/api/optimize-multiple-routes', {
      distributions,
      warehouse
    })

    routes.value = response.data.routes

    drivers.value = drivers.value.map(driver => {
      const assignment = distributions.find(d => d.driver.id === driver.id)
      return {
        ...driver,
        assignedCount: assignment ? assignment.fridges.length : 0,
        routeColor: assignment ? assignment.color : null
      }
    })

  } catch (error) {
    console.error('Erreur lors de la génération des itinéraires:', error)
    alert('Erreur lors de la génération des itinéraires')
  }
}
</script>

<style scoped>
.route-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
