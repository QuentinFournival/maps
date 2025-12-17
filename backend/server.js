import express from 'express';
import cors from 'cors';
import routeOptimizer from './services/routeOptimizer.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/optimize-route', async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || !Array.isArray(points) || points.length < 2) {
      return res.status(400).json({ error: 'Il faut au moins 2 points' });
    }

    const optimizedRoute = await routeOptimizer.optimize(points);
    res.json({ route: optimizedRoute });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/optimize-multiple-routes', async (req, res) => {
  try {
    const { distributions, warehouse } = req.body;

    if (!distributions || !Array.isArray(distributions)) {
      return res.status(400).json({ error: 'Distributions invalides' });
    }

    const optimizedRoutes = await Promise.all(
      distributions.map(async (dist) => {
        // Ajouter l'entrepôt seulement au début (pas à la fin)
        const pointsWithWarehouse = [warehouse, ...dist.fridges];

        if (pointsWithWarehouse.length < 2) {
          return {
            driver: dist.driver,
            color: dist.color,
            fridges: dist.fridges,
            route: {
              coordinates: pointsWithWarehouse.map(f => [f.lng, f.lat]),
              distance: 0
            }
          };
        }

        const route = await routeOptimizer.optimize(pointsWithWarehouse);

        // Extraire les frigos optimisés (sans l'entrepôt)
        const optimizedFridges = route.optimizedPoints ? route.optimizedPoints.slice(1) : dist.fridges;

        return {
          driver: dist.driver,
          color: dist.color,
          fridges: optimizedFridges,
          route: {
            coordinates: route.coordinates,
            distance: route.distance
          }
        };
      })
    );

    res.json({ routes: optimizedRoutes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
