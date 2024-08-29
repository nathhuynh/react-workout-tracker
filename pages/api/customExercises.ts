import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const fetchCustomExercises = async () => {
  const response = await api.get('/custom-exercises');
  return response.data;
};

export const createCustomExercise = async (exerciseData: any) => {
  try {
    const response = await api.post('/custom-exercises', exerciseData);
    return response.data;
  } catch (error) {
    console.error('Error in createCustomExercise:', error);
    throw error;
  }
};

export const updateCustomExercise = async (id: string, exerciseData: any) => {
  try {
    const response = await api.put(`/custom-exercises/${id}`, exerciseData);
    return response.data;
  } catch (error) {
    console.error('Error in updateCustomExercise:', error);
    throw error;
  }
};

export const deleteCustomExercise = async (id: string) => {
  try {
    await api.delete(`/custom-exercises/${id}`);
  } catch (error) {
    console.error('Error in deleteCustomExercise:', error);
    throw error;
  }
};