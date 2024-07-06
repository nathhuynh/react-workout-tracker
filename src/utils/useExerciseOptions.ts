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
    const fetchOptions = async () => {
      const exercises: Exercise[] = await fetchExercises();

      const equipmentTypes = Array.from(
        new Set(exercises.map(ex => capitalize(ex.equipment)).filter(Boolean))
      ).sort();

      const primaryMusclesSet = new Set<string>();
      const exercisesByMuscle: { [muscle: string]: Exercise[] } = {};

      exercises.forEach(exercise => {
        exercise.primaryMuscles.forEach(muscle => {
          const capitalizedMuscle = capitalize(muscle);
          const combinedMuscle = combineMuscles(capitalizedMuscle);
          primaryMusclesSet.add(combinedMuscle);

          if (!exercisesByMuscle[combinedMuscle]) {
            exercisesByMuscle[combinedMuscle] = [];
          }
          exercisesByMuscle[combinedMuscle].push(exercise);
        });
      });

      const primaryMuscles = Array.from(primaryMusclesSet).sort();
      const categories = Array.from(new Set(exercises.map(ex => capitalize(ex.category)))).sort();

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