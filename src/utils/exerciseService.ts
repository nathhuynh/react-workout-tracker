export interface Exercise {
  id: string;
  name: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  sets?: {
    weight: number;
    reps: number;
    rir: number;
  }[];
}

// Credit: https://github.com/yuhonas/free-exercise-db

export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
    const data: Exercise[] = await response.json();
    // Initialize 'sets' as an empty array
    return data.map(exercise => ({ ...exercise, sets: [] }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
};