import axios from 'axios'

const API_BASE_URL = '/api'

export const getExercises = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch exercises:', error)
    return []
  }
}

export const getCustomExercises = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/custom-exercises`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch custom exercises:', error)
    return []
  }
}

export const getWorkoutData = async (date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workout?date=${date}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch workout data:', error)
    return { exercises: [], exerciseOrder: [], notes: '' }
  }
}

export const updateWorkoutData = async (date, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workout?date=${date}`, data)
    return response.data
  } catch (error) {
    console.error('Failed to update workout data:', error)
    throw error
  }
}

export const getMesocycleData = async() => {
  try {
    const response = await axios.get()
    return response.data
  } catch (error) {
    console.error('Failed to get current mesocycle data:', error)
    throw error
  }
}