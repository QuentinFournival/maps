// Fonction pour calculer le statut d'un frigo basé sur son inventaire
function calculateFridgeStatus(inventory) {
  if (!inventory || inventory.length === 0) return 'green'

  // Calculer le pourcentage moyen de remplissage
  const fillPercentages = inventory.map(item => (item.current / item.capacity) * 100)
  const averageFill = fillPercentages.reduce((a, b) => a + b, 0) / fillPercentages.length

  // Vérifier si au moins un produit est à 0
  const hasEmptyProduct = inventory.some(item => item.current === 0)

  if (averageFill < 30 || hasEmptyProduct) return 'red'      // Urgent: < 30% ou produit vide
  if (averageFill < 60) return 'yellow'   // Attention: entre 30% et 60%
  return 'green'                          // OK: > 60%
}

export const fridges = [
  {
    id: 1,
    name: 'Frigo Gare Lille Flandres',
    lat: 50.6366,
    lng: 3.0747,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Gare Lille Flandres',
    inventory: [
      { id: 1, name: 'Sandwiches jambon-beurre', current: 3, capacity: 30 },
      { id: 2, name: 'Salades César', current: 2, capacity: 20 },
      { id: 3, name: 'Bouteilles d\'eau 50cl', current: 5, capacity: 50 },
      { id: 4, name: 'Jus d\'orange', current: 0, capacity: 25 },
      { id: 5, name: 'Yaourts nature', current: 4, capacity: 30 }
    ]
  },
  {
    id: 2,
    name: 'Frigo Citadelle',
    lat: 50.6446,
    lng: 3.0485,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Parc de la Citadelle',
    inventory: [
      { id: 1, name: 'Sandwiches mixtes', current: 18, capacity: 20 },
      { id: 2, name: 'Eau minérale', current: 28, capacity: 30 }
    ]
  },
  {
    id: 3,
    name: 'Frigo Vieux Lille',
    lat: 50.6411,
    lng: 3.0631,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Place du Général de Gaulle',
    inventory: [
      { id: 1, name: 'Wraps poulet', current: 1, capacity: 18 },
      { id: 2, name: 'Compotes pomme', current: 3, capacity: 25 },
      { id: 3, name: 'Coca-Cola 33cl', current: 0, capacity: 30 },
      { id: 4, name: 'Barres céréales', current: 5, capacity: 40 }
    ]
  },
  {
    id: 4,
    name: 'Frigo Wazemmes',
    lat: 50.6275,
    lng: 3.0545,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Marché de Wazemmes',
    inventory: [
      { id: 1, name: 'Sandwiches végétariens', current: 2, capacity: 25 },
      { id: 2, name: 'Salades composées', current: 1, capacity: 20 },
      { id: 3, name: 'Smoothies fruits', current: 0, capacity: 22 },
      { id: 4, name: 'Fromage blanc', current: 3, capacity: 28 },
      { id: 5, name: 'Fruits frais (pommes)', current: 4, capacity: 35 }
    ]
  },
  {
    id: 5,
    name: 'Frigo Euralille',
    lat: 50.6385,
    lng: 3.0755,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Centre Euralille',
    inventory: [
      { id: 1, name: 'Paninis', current: 15, capacity: 18 },
      { id: 2, name: 'Jus de fruits', current: 22, capacity: 25 }
    ]
  },
  {
    id: 6,
    name: 'Frigo République',
    lat: 50.6295,
    lng: 3.0600,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Place de la République',
    inventory: [
      { id: 1, name: 'Quiches lorraines', current: 0, capacity: 15 },
      { id: 2, name: 'Salades pâtes', current: 2, capacity: 18 },
      { id: 3, name: 'Perrier 33cl', current: 3, capacity: 25 },
      { id: 4, name: 'Cookies chocolat', current: 5, capacity: 32 },
      { id: 5, name: 'Yaourts aux fruits', current: 4, capacity: 25 }
    ]
  },
  {
    id: 7,
    name: 'Frigo Solférino',
    lat: 50.6325,
    lng: 3.0635,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Rue Solférino',
    inventory: [
      { id: 1, name: 'Sandwiches thon', current: 2, capacity: 20 },
      { id: 2, name: 'Salades grecques', current: 1, capacity: 15 },
      { id: 3, name: 'Ice tea pêche', current: 4, capacity: 30 },
      { id: 4, name: 'Madeleines', current: 0, capacity: 35 }
    ]
  },
  {
    id: 8,
    name: 'Frigo Gambetta',
    lat: 50.6285,
    lng: 3.0715,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Boulevard Gambetta',
    inventory: [
      { id: 1, name: 'Salades', current: 12, capacity: 15 },
      { id: 2, name: 'Boissons', current: 20, capacity: 25 }
    ]
  },
  {
    id: 9,
    name: 'Frigo Porte de Paris',
    lat: 50.6380,
    lng: 3.0680,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Porte de Paris',
    inventory: [
      { id: 1, name: 'Paninis 3 fromages', current: 1, capacity: 20 },
      { id: 2, name: 'Taboulé', current: 0, capacity: 18 },
      { id: 3, name: 'Orangina 33cl', current: 3, capacity: 28 },
      { id: 4, name: 'Brownies', current: 2, capacity: 24 },
      { id: 5, name: 'Fruits secs mélangés', current: 0, capacity: 22 }
    ]
  },
  {
    id: 10,
    name: 'Frigo Saint-Maurice',
    lat: 50.6420,
    lng: 3.0590,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Saint-Maurice',
    inventory: [
      { id: 1, name: 'Croissants', current: 3, capacity: 28 },
      { id: 2, name: 'Pains au chocolat', current: 2, capacity: 24 },
      { id: 3, name: 'Jus multifruits', current: 4, capacity: 32 },
      { id: 4, name: 'Compotes pomme-poire', current: 0, capacity: 30 }
    ]
  },
  {
    id: 11,
    name: 'Frigo Moulins',
    lat: 50.6350,
    lng: 3.0520,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Moulins',
    inventory: [
      { id: 1, name: 'Sandwiches poulet curry', current: 1, capacity: 25 },
      { id: 2, name: 'Salades quinoa', current: 0, capacity: 18 },
      { id: 3, name: 'Vittel 50cl', current: 5, capacity: 40 },
      { id: 4, name: 'Gâteaux aux amandes', current: 2, capacity: 22 },
      { id: 5, name: 'Fromages portion', current: 3, capacity: 24 }
    ]
  },
  {
    id: 12,
    name: 'Frigo Vauban',
    lat: 50.6320,
    lng: 3.0480,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Vauban',
    inventory: [
      { id: 1, name: 'Sandwiches mixtes', current: 8, capacity: 15 },
      { id: 2, name: 'Coca-Cola Zero 33cl', current: 10, capacity: 20 }
    ]
  },
  {
    id: 13,
    name: 'Frigo Bois Blancs',
    lat: 50.6460,
    lng: 3.0380,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Bois Blancs',
    inventory: [
      { id: 1, name: 'Bagels saumon', current: 0, capacity: 18 },
      { id: 2, name: 'Salade coleslaw', current: 2, capacity: 16 },
      { id: 3, name: 'Limonade 33cl', current: 3, capacity: 25 },
      { id: 4, name: 'Muffins myrtilles', current: 1, capacity: 26 },
      { id: 5, name: 'Bananes', current: 4, capacity: 30 }
    ]
  },
  {
    id: 14,
    name: 'Frigo Lomme',
    lat: 50.6450,
    lng: 3.0150,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Centre Lomme',
    inventory: [
      { id: 1, name: 'Croque-monsieur', current: 2, capacity: 22 },
      { id: 2, name: 'Salade niçoise', current: 0, capacity: 18 },
      { id: 3, name: 'Fanta Orange 33cl', current: 4, capacity: 30 },
      { id: 4, name: 'Donuts', current: 1, capacity: 24 }
    ]
  },
  {
    id: 15,
    name: 'Frigo Fives',
    lat: 50.6305,
    lng: 3.0890,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Fives',
    inventory: [
      { id: 1, name: 'Baguettes garnies', current: 1, capacity: 24 },
      { id: 2, name: 'Houmous & crudités', current: 0, capacity: 20 },
      { id: 3, name: 'Evian 50cl', current: 5, capacity: 35 },
      { id: 4, name: 'Cakes citron', current: 2, capacity: 22 },
      { id: 5, name: 'Raisins', current: 0, capacity: 18 }
    ]
  },
  {
    id: 16,
    name: 'Frigo Hellemmes',
    lat: 50.6270,
    lng: 3.1050,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Centre Hellemmes',
    inventory: [
      { id: 1, name: 'Pizzas froides', current: 0, capacity: 16 },
      { id: 2, name: 'Salades tomates-mozza', current: 1, capacity: 18 },
      { id: 3, name: 'Sprite 33cl', current: 3, capacity: 26 },
      { id: 4, name: 'Tiramisu', current: 2, capacity: 20 }
    ]
  },
  {
    id: 17,
    name: 'Frigo Saint-André',
    lat: 50.6500,
    lng: 3.0620,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Saint-André',
    inventory: [
      { id: 1, name: 'Wraps végétariens', current: 6, capacity: 12 },
      { id: 2, name: 'Eau gazeuse 50cl', current: 12, capacity: 20 }
    ]
  },
  {
    id: 18,
    name: 'Frigo Esquermes',
    lat: 50.6200,
    lng: 3.0520,
    get status() {
      return calculateFridgeStatus(this.inventory)
    },
    address: 'Quartier Esquermes',
    inventory: [
      { id: 1, name: 'Sandwiches jambon-emmental', current: 2, capacity: 24 },
      { id: 2, name: 'Salades de riz', current: 0, capacity: 18 },
      { id: 3, name: 'Thé glacé citron', current: 3, capacity: 30 },
      { id: 4, name: 'Financiers', current: 1, capacity: 26 },
      { id: 5, name: 'Clémentines', current: 0, capacity: 24 }
    ]
  }
]

export const deliveryDrivers = [
  { id: 1, name: 'Jean Dupont', available: true },
  { id: 2, name: 'Marie Martin', available: true },
  { id: 3, name: 'Pierre Durand', available: true }
]

// Point de départ - Entrepôt
export const warehouse = {
  name: 'Entrepôt',
  lat: 50.6292,
  lng: 3.0573,
  address: 'Entrepôt principal'
}
