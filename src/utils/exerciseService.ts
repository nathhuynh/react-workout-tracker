export interface Exercise {
  name: string;
  category: string;
  difficulty: string;
  instructions: string[];
}

export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
    const data: Exercise[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
};