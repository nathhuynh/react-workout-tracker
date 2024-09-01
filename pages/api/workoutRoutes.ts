import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface Set {
  weight: number;
  reps: number;
  rir?: number;
  logged: boolean;
  type?: 'regular' | 'dropset';
}

export interface WorkoutData {
  exercises: Record<string, Set[]>;
  exerciseOrder: string[];
  notes: string;
}

export const fetchWorkoutData = async (date: string, userId: string): Promise<WorkoutData> => {
  try {
    const response = await api.get<WorkoutData>(`/workouts/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error in fetchWorkoutData:', error);
    throw error;
  }
};

export const updateWorkoutData = async (date: string, userId: string, workoutData: WorkoutData): Promise<void> => {
  try {
    await api.put(`/workouts/${date}`, workoutData);
  } catch (error) {
    console.error('Error in updateWorkoutData:', error);
    throw error;
  }
};