import { useEffect, useState } from 'react';
import { fetchExercises, Exercise } from './exerciseService';

export interface ExerciseOptions {
  equipmentTypes: string[];
  primaryMuscles: string[];
  categories: string[];
  exercisesByMuscle: { [muscle: string]: Exercise[] };
}

const capitalize = (str: string | null | undefined) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

const combineMuscles = (muscle: string) => {
  const backMuscles = ['Traps', 'Lower Back', 'Middle Back', 'Lats'];
  const gluteMuscles = ['Glutes', 'Adductors', 'Abductors'];
  if (backMuscles.includes(muscle)) return 'Back';
  if (gluteMuscles.includes(muscle)) return 'Glutes';
  if (muscle === 'Quadriceps') return 'Quads';
  return muscle;
};

export const useExerciseOptions = (): ExerciseOptions => {
  const [options, setOptions] = useState<ExerciseOptions>({
    equipmentTypes: [],
    primaryMuscles: [],
    categories: [],
    exercisesByMuscle: {},
  });

  useEffect(() => {
    const preprocessExercises = (exercises: Exercise[]): Exercise[] => {
      return exercises.map(exercise => ({
        ...exercise,
        primaryMuscles: exercise.primaryMuscles.map(muscle => combineMuscles(capitalize(muscle))),
      }));
    };

    const fetchOptions = async () => {
      const exercises: Exercise[] = await fetchExercises();
      const customExercises = localStorage.getItem('customExercises');
      const parsedCustomExercises = customExercises ? JSON.parse(customExercises) : [];
      const allExercises = preprocessExercises([...exercises, ...parsedCustomExercises]);
      localStorage.setItem('preprocessedExercises', JSON.stringify(allExercises));
      const equipmentTypes = Array.from(
        new Set(allExercises.map(ex => capitalize(ex.equipment)).filter(Boolean))
      ).sort();

      const primaryMusclesSet = new Set<string>();
      const exercisesByMuscle: { [muscle: string]: Exercise[] } = {};

      allExercises.forEach(exercise => {
        exercise.primaryMuscles.forEach((muscle: string) => {
          primaryMusclesSet.add(muscle);

          if (!exercisesByMuscle[muscle]) {
            exercisesByMuscle[muscle] = [];
          }
          exercisesByMuscle[muscle].push(exercise);
        });
      });

      const primaryMuscles = Array.from(primaryMusclesSet).sort();
      const categories = Array.from(new Set(allExercises.map(ex => capitalize(ex.category)))).sort();

      setOptions({
        equipmentTypes,
        primaryMuscles,
        categories,
        exercisesByMuscle,
      });
    };

    fetchOptions();
  }, []);

  return options;
};