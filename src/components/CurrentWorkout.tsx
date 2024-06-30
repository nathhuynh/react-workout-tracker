import React, { useState, useEffect, ChangeEvent } from 'react';
import { fetchExercises, Exercise } from '../utils/exerciseService';

interface Set {
  weight: number;
  reps: number;
  logged: boolean;
}

type ExerciseMap = Map<string, Set[]>;

const CurrentWorkout: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseMap>(() => {
    const savedExercises = localStorage.getItem('workoutExercises');
    return savedExercises ? new Map(JSON.parse(savedExercises)) : new Map();
  });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('workoutNotes');
    return savedNotes ? savedNotes : '';
  });

  useEffect(() => {
    const loadExercises = async () => {
      const data: Exercise[] = await fetchExercises();
      setExercises(data);
    };
    loadExercises();
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutExercises', JSON.stringify(Array.from(workoutExercises.entries())));
  }, [workoutExercises]);

  useEffect(() => {
    localStorage.setItem('workoutNotes', notes);
  }, [notes]);

  const handleAddSet = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = [...(updated.get(exerciseName) || [])];
      const lastSet = sets[sets.length - 1] || { weight: 0, reps: 0, logged: false };
      sets.push({ weight: lastSet.weight, reps: lastSet.reps, logged: false });
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const handleRemoveSet = (exerciseName: string, setIndex: number) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets.splice(setIndex, 1);
      if (sets.length === 0) {
        updated.delete(exerciseName);
      } else {
        updated.set(exerciseName, sets);
      }
      return updated;
    });
  };

  const handleInputChange = (exerciseName: string, setIndex: number, field: keyof Set, value: number) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets[setIndex] = { ...sets[setIndex], [field]: value };
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const handleLogSet = (exerciseName: string, setIndex: number) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = updated.get(exerciseName) || [];
      sets[setIndex].logged = true;
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const addWorkoutExercise = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      if (!updated.has(exerciseName)) {
        updated.set(exerciseName, [{ weight: 0, reps: 0, logged: false }]);
      }
      return updated;
    });
  };

  const handleRemoveExercise = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      updated.delete(exerciseName);
      return updated;
    });
  };

  const generateWeightOptions = () => {
    const options = [];
    for (let i = 1; i <= 10; i++) {
      options.push(i);
    }
    options.push(7.5);
    for (let i = 10.25; i <= 300; i += 0.25) {
      options.push(parseFloat(i.toFixed(2)));
    }
    return options;
  };

  const generateRepsOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  const allExercises = [...exercises, ...customExercises];

  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-r from-indigo-950 to-slate-950 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">WEEK 1 DAY 2 Tuesday</h2>
        <button className="bg-gray-700 px-4 py-2 rounded">Minimize Calendar</button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Add Exercise</label>
        <select onChange={(e: ChangeEvent<HTMLSelectElement>) => addWorkoutExercise(e.target.value)} className="p-2 rounded">
          <option value="">Select an exercise</option>
          {allExercises.map((exercise, index) => (
            <option className="text-black" key={index} value={exercise.name}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      {Array.from(workoutExercises.entries()).map(([exerciseName, sets], exerciseIndex) => (
        <div key={exerciseIndex} className="mb-6 p-4 bg-gray-800 rounded">
          <div className="flex justify-between items-center">
            <h3 className="text-lg mb-2">{exerciseName}</h3>
            <button
              onClick={() => handleRemoveExercise(exerciseName)}
              className="bg-red-700 px-2 py-1 rounded"
            >
              Remove Exercise
            </button>
          </div>
          {sets && sets.length > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="uppercase">Set</div>
                <div className="uppercase">Weight (kg)</div>
                <div className="uppercase">Reps</div>
                <div></div>
              </div>
              <div className="flex flex-col space-y-2">
                {sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-4 gap-4 items-center">
                    <div className="flex items-center justify-center">{setIndex + 1}</div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="ENTER"
                        value={set.weight || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(exerciseName, setIndex, 'weight', Number(e.target.value))}
                        className="w-full p-2 rounded text-black"
                        list={`weight-options-${exerciseIndex}-${setIndex}`}
                      />
                      <datalist id={`weight-options-${exerciseIndex}-${setIndex}`}>
                        {generateWeightOptions().map(option => (
                          <option key={option} value={option} />
                        ))}
                      </datalist>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="ENTER"
                        value={set.reps || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(exerciseName, setIndex, 'reps', Number(e.target.value))}
                        className="w-full p-2 rounded text-black"
                        list={`reps-options-${exerciseIndex}-${setIndex}`}
                      />
                      <datalist id={`reps-options-${exerciseIndex}-${setIndex}`}>
                        {generateRepsOptions(30).map(option => (
                          <option key={option} value={option} />
                        ))}
                      </datalist>
                    </div>
                    <div className="flex items-center justify-center">
                      {set.logged ? (
                        <span>✔️</span>
                      ) : (
                        <button
                          onClick={() => handleLogSet(exerciseName, setIndex)}
                          className="bg-blue-700 px-4 py-2 rounded"
                        >
                          Log Set
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No sets available.</p>
          )}
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleAddSet(exerciseName)}
              className="bg-green-700 px-4 py-2 rounded"
            >
              Add Set
            </button>
            {sets.length > 0 && (
              <button
                onClick={() => handleRemoveSet(exerciseName, sets.length - 1)}
                className="bg-red-700 px-4 py-2 rounded"
              >
                Remove Set
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="mt-4">
        <label className="block mb-2">Notes</label>
        <textarea
          className="w-full p-2 rounded text-black"
          rows={4}
          value={notes}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default CurrentWorkout;