import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export async function optimizeRoutes(points) {
  try {
    const response = await axios.post(`${API_URL}/optimize-route`, {
      points
    })
    return response.data.route
  } catch (error) {
    console.error('Erreur lors de l\'optimisation:', error)
    throw error
  }
}
