import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface MesocycleData {
  name: string;
  templateName: string | null;
  days: Array<{
    name: string;
    exercises: Array<{
      muscleGroup: string;
      exerciseId: number | null;
    }>;
  }>;
}

export const fetchMesocycleTemplates = async () => {
  try {
    const response = await api.get('/mesocycle-templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching mesocycle templates:', error);
    throw error;
  }
};

export const fetchMesocycles = async () => {
  try {
    const response = await api.get<MesocycleData[]>('/mesocycles');
    return response.data;
  } catch (error) {
    console.error('Error fetching mesocycles:', error);
    throw error;
  }
};

export const createMesocycle = async (mesocycleData: MesocycleData) => {
  try {
    const response = await api.post('/mesocycles', mesocycleData);
    return response.data;
  } catch (error) {
    console.error('Error creating mesocycle:', error);
    throw error;
  }
};

export const updateMesocycle = async (id: number, mesocycleData: MesocycleData) => {
  try {
    const response = await api.put(`/mesocycles/${id}`, mesocycleData);
    return response.data;
  } catch (error) {
    console.error('Error updating mesocycle:', error);
    throw error;
  }
};

export const deleteMesocycle = async (name: string): Promise<void> => {
  try {
    console.log(`Attempting to delete mesocycle: ${name}`);
    await api.delete(`/mesocycles/${encodeURIComponent(name)}`);
    console.log('Mesocycle deleted successfully');
  } catch (error) {
    console.error('Error deleting mesocycle:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.error || 'Failed to delete mesocycle');
    }
    throw error;
  }
};
