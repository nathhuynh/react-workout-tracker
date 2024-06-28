export const fetchExercises = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  };