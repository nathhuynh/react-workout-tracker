// Caching options for creating new custom exercises
import { useEffect, useState } from 'react';
import { fetchExercises, Exercise } from './exerciseService';

export interface ExerciseOptions {
  equipmentTypes: string[];
  primaryMuscles: string[];
  categories: string[];
}

// Helper function to capitalize the first letter of each word
const capitalize = (str: string | null | undefined) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export const useExerciseOptions = (): ExerciseOptions => {
  const [options, setOptions] = useState<ExerciseOptions>({
    equipmentTypes: [],
    primaryMuscles: [],
    categories: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      const exercises: Exercise[] = await fetchExercises();
      // console.log('Fetched exercises:', exercises);

      const equipmentTypes = Array.from(
        new Set(exercises.map(ex => capitalize(ex.equipment)).filter(Boolean))
      ).sort();
      const primaryMuscles = Array.from(new Set(exercises.flatMap(ex => ex.primaryMuscles.map(capitalize)))).sort();
      
      const categories = Array.from(new Set(exercises.map(ex => capitalize(ex.category)))).sort();

      // console.log('Capitalized equipment types:', equipmentTypes);
      // console.log('Capitalized primary muscles:', primaryMuscles);
      // console.log('Capitalized categories:', categories);

      setOptions({
        equipmentTypes,
        primaryMuscles,
        categories,
      });
    };

    fetchOptions();
  }, []);

  return options;
};
