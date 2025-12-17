# Gestion Frigos - Système de gestion de livraison

Application de gestion de livraison pour frigos connectés avec optimisation d'itinéraires et visualisation 3D.

## Fonctionnalités

- **Visualisation 3D interactive** avec MapLibre GL JS
- **Gestion des frigos** avec statut automatique basé sur l'inventaire
- **Optimisation d'itinéraires** équitable entre livreurs
- **Distribution automatique** des livraisons
- **Suivi en temps réel** des statuts des frigos
- **Génération de QR codes** pour les livreurs
- **Interface intuitive** pour la gestion des livreurs et frigos

## Structure du projet

```
maps/
├── frontend/          # Application Vue 3
│   ├── src/
│   │   ├── components/    # Composants Vue
│   │   ├── data/          # Données des frigos
│   │   └── services/      # Services d'optimisation
│   └── package.json
├── backend/           # Serveur Node.js
│   ├── services/
│   │   └── routeOptimizer.js
│   └── server.js
└── README.md
```

## Technologies utilisées

### Frontend
- **Vue 3** - Framework JavaScript
- **MapLibre GL JS** - Cartographie 3D
- **Vite** - Build tool
- **Axios** - Client HTTP
- **QRCode** - Génération de QR codes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **OSRM** - Optimisation de routes

## Installation

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation du frontend

```bash
cd frontend
npm install
```

### Installation du backend

```bash
cd backend
npm install
```

## Utilisation

### Démarrer le backend

```bash
cd backend
node server.js
```

Le serveur démarre sur http://localhost:3000

### Démarrer le frontend

```bash
cd frontend
npm run dev
```

L'application est accessible sur http://localhost:5173

## Algorithmes

### Calcul automatique du statut des frigos
- **Rouge (Urgent)** : < 30% de remplissage moyen OU au moins un produit vide
- **Jaune (Attention)** : Entre 30% et 60% de remplissage
- **Vert (OK)** : > 60% de remplissage

### Distribution équitable des itinéraires
1. **Phase 1** : Distribution initiale en round-robin géographique
2. **Phase 2** : Rééquilibrage itératif pour égaliser les distances entre livreurs
3. **Optimisation** : Algorithme du plus proche voisin (Nearest Neighbor) pour chaque itinéraire

## Licence

MIT

## Auteur

Quentin Fournival
