// Calculer la distance entre deux points (formule de Haversine)
function calculateDistance(point1, point2) {
  const R = 6371 // Rayon de la Terre en km
  const lat1 = point1.lat * Math.PI / 180
  const lat2 = point2.lat * Math.PI / 180
  const deltaLat = (point2.lat - point1.lat) * Math.PI / 180
  const deltaLng = (point2.lng - point1.lng) * Math.PI / 180

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Estimer la distance totale d'une route en utilisant nearest neighbor
function estimateRouteDistance(fridges, warehouse) {
  if (fridges.length === 0) return 0
  if (fridges.length === 1) return calculateDistance(warehouse, fridges[0]) * 2

  let totalDistance = 0
  const visited = new Set()
  let current = warehouse

  // Distance de l'entrepôt au premier frigo
  let nearestIndex = 0
  let minDist = Infinity
  fridges.forEach((fridge, index) => {
    const dist = calculateDistance(current, fridge)
    if (dist < minDist) {
      minDist = dist
      nearestIndex = index
    }
  })

  totalDistance += minDist
  visited.add(nearestIndex)
  current = fridges[nearestIndex]

  // Calculer le reste du parcours avec nearest neighbor
  while (visited.size < fridges.length) {
    let nextIndex = -1
    let minDist = Infinity

    fridges.forEach((fridge, index) => {
      if (!visited.has(index)) {
        const dist = calculateDistance(current, fridge)
        if (dist < minDist) {
          minDist = dist
          nextIndex = index
        }
      }
    })

    if (nextIndex !== -1) {
      totalDistance += minDist
      visited.add(nextIndex)
      current = fridges[nextIndex]
    }
  }

  return totalDistance
}

export function distributeRoutesToDrivers(urgentFridges, availableDrivers, warehouse) {
  if (urgentFridges.length === 0 || availableDrivers.length === 0) {
    return []
  }

  const driversCount = availableDrivers.length

  // Initialiser les distributions pour chaque livreur
  const distributions = availableDrivers.map((driver, index) => ({
    driver: driver,
    fridges: [],
    estimatedDistance: 0,
    color: getDriverColor(index)
  }))

  // Copie des frigos à distribuer
  const remainingFridges = [...urgentFridges]

  // Phase 1: Distribution initiale équitable (round-robin géographique)
  // Trier les frigos par distance depuis l'entrepôt
  remainingFridges.sort((a, b) => {
    const distA = calculateDistance(warehouse, a)
    const distB = calculateDistance(warehouse, b)
    return distA - distB
  })

  // Distribuer un frigo à chaque livreur en alternance
  let driverIndex = 0
  while (remainingFridges.length > 0) {
    const fridge = remainingFridges.shift()
    const distribution = distributions[driverIndex]

    distribution.fridges.push(fridge)
    distribution.estimatedDistance = estimateRouteDistance(distribution.fridges, warehouse)

    driverIndex = (driverIndex + 1) % driversCount
  }

  // Phase 2: Rééquilibrage pour égaliser les distances
  const maxIterations = urgentFridges.length * 2
  let iteration = 0
  let improved = true

  while (improved && iteration < maxIterations) {
    improved = false
    iteration++

    // Trouver le livreur le plus chargé et le moins chargé
    distributions.sort((a, b) => a.estimatedDistance - b.estimatedDistance)
    const leastLoaded = distributions[0]
    const mostLoaded = distributions[distributions.length - 1]

    // Si la différence est trop grande, essayer de transférer un frigo
    const difference = mostLoaded.estimatedDistance - leastLoaded.estimatedDistance

    if (difference > 1 && mostLoaded.fridges.length > 1) { // Différence > 1km
      // Trouver le meilleur frigo à transférer du plus chargé au moins chargé
      let bestFridgeIndex = -1
      let bestImprovement = 0

      for (let i = 0; i < mostLoaded.fridges.length; i++) {
        const fridge = mostLoaded.fridges[i]

        // Calculer la nouvelle distance pour le livreur le plus chargé sans ce frigo
        const newMostLoadedFridges = mostLoaded.fridges.filter((_, idx) => idx !== i)
        const newMostLoadedDistance = estimateRouteDistance(newMostLoadedFridges, warehouse)

        // Calculer la nouvelle distance pour le livreur le moins chargé avec ce frigo
        const newLeastLoadedFridges = [...leastLoaded.fridges, fridge]
        const newLeastLoadedDistance = estimateRouteDistance(newLeastLoadedFridges, warehouse)

        // Calculer l'amélioration (réduction de l'écart)
        const currentGap = mostLoaded.estimatedDistance - leastLoaded.estimatedDistance
        const newGap = newMostLoadedDistance - newLeastLoadedDistance
        const improvement = currentGap - newGap

        // Si cet échange améliore l'équilibre
        if (improvement > bestImprovement && newGap < currentGap) {
          bestImprovement = improvement
          bestFridgeIndex = i
        }
      }

      // Effectuer le transfert si bénéfique
      if (bestFridgeIndex !== -1 && bestImprovement > 0.5) {
        const transferredFridge = mostLoaded.fridges.splice(bestFridgeIndex, 1)[0]
        leastLoaded.fridges.push(transferredFridge)

        mostLoaded.estimatedDistance = estimateRouteDistance(mostLoaded.fridges, warehouse)
        leastLoaded.estimatedDistance = estimateRouteDistance(leastLoaded.fridges, warehouse)

        improved = true
      }
    }
  }

  console.log('Distribution équilibrée:')
  distributions.forEach((dist, i) => {
    console.log(`Livreur ${i + 1} (${dist.driver.name}): ${dist.fridges.length} frigos, ~${dist.estimatedDistance.toFixed(2)} km`)
  })

  // Retourner uniquement les distributions avec des frigos
  return distributions.filter(dist => dist.fridges.length > 0)
}

function getDriverColor(index) {
  const colors = [
    '#ff6600', // Orange
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#00ff00', // Vert lime
    '#ffff00', // Jaune
    '#ff0080', // Rose vif
    '#0080ff', // Bleu vif
    '#80ff00', // Vert chartreuse
    '#ff8000', // Orange foncé
    '#00ff80', // Vert menthe
    '#8000ff', // Violet
    '#ff0040', // Rouge rose
    '#40ff00', // Vert pomme
    '#00ffff', // Cyan
    '#ff4000'  // Orange rouge
  ]
  return colors[index % colors.length]
}
