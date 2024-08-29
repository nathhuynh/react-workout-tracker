import axios from 'axios';
import { Exercise } from '../../utils/exerciseService';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchPresetExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await api.get('/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};