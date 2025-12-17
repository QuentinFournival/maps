<template>
  <div class="app">
    <RouteMap />
  </div>
</template>

<script setup>
import RouteMap from './components/RouteMap.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a0e27;
  font-family: 'Inter', sans-serif;
  position: fixed;
}

.app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
