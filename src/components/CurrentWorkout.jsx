import React, { useState, useEffect } from 'react';
import { fetchExercises } from '../utils/exerciseService';

export default function CurrentWorkout() {
  const [exercises, setExercises] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState(() => {
    const savedExercises = localStorage.getItem('workoutExercises');
    return savedExercises ? JSON.parse(savedExercises) : [];
  });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('workoutNotes');
    return savedNotes ? savedNotes : '';
  });

  // Fetch exercise data and load saved workout
  useEffect(() => {
    const loadExercises = async () => {
      const data = await fetchExercises();
      setExercises(data);
    };
    loadExercises();
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutExercises', JSON.stringify(workoutExercises));
  }, [workoutExercises]);

  useEffect(() => {
    localStorage.setItem('workoutNotes', notes);
  }, [notes]);

  const handleAddSet = (exerciseIndex) => {
    const newExercises = [...workoutExercises];
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '', rir: '' });
    setWorkoutExercises(newExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExercises = [...workoutExercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setWorkoutExercises(newExercises);
  };

  const handleInputChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...workoutExercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutExercises(newExercises);
  };

  const addWorkoutExercise = (exerciseName) => {
    setWorkoutExercises([
      ...workoutExercises,
      { name: exerciseName, sets: [{ weight: '', reps: '', rir: '' }] },
    ]);
  };

  const handleRemoveExercise = (exerciseIndex) => {
    const newExercises = [...workoutExercises];
    newExercises.splice(exerciseIndex, 1);
    setWorkoutExercises(newExercises);
  };

  const addCustomExercise = (exerciseName) => {
    setCustomExercises([...customExercises, { name: exerciseName }]);
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
        <select onChange={(e) => addWorkoutExercise(e.target.value)} className="p-2 rounded">
          <option value="">Select an exercise</option>
          {allExercises.map((exercise, index) => (
            <option className="text-black" key={index} value={exercise.name}>
              {exercise.name}
            </option>
          ))}
        </select>
      </div>
      {workoutExercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="mb-6 p-4 bg-gray-800 rounded">
          <div className="flex justify-between items-center">
            <h3 className="text-lg mb-2">{exercise.name}</h3>
            <button
              onClick={() => handleRemoveExercise(exerciseIndex)}
              className="bg-red-700 px-2 py-1 rounded"
            >
              Remove Exercise
            </button>
          </div>
          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="flex items-center mb-2">
              <div className="flex-1 mr-2">
                <label className="block">Set {setIndex + 1}</label>
                <input
                  type="text"
                  placeholder="Weight"
                  value={set.weight}
                  onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
              <div className="flex-1 mr-2">
                <label className="block">Reps</label>
                <input
                  type="text"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
              <div className="flex-1 mr-2">
                <label className="block">RIR</label>
                <input
                  type="text"
                  placeholder="RIR"
                  value={set.rir}
                  onChange={(e) => handleInputChange(exerciseIndex, setIndex, 'rir', e.target.value)}
                  className="w-full p-2 rounded text-black"
                />
              </div>
              <button
                onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                className="bg-red-700 px-2 py-1 rounded"
              >
                Remove Set
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddSet(exerciseIndex)}
            className="bg-green-700 px-4 py-2 rounded"
          >
            Add Set
          </button>
        </div>
      ))}
      {/* <div className="mt-4">
        <label className="block mb-2">Add Custom Exercise</label>
        <input
          type="text"
          placeholder="Exercise Name"
          onBlur={(e) => addCustomExercise(e.target.value)}
          className="p-2 rounded"
        />
      </div> */}
      <div className="mt-4">
        <label className="block mb-2">Notes</label>
        <textarea
          className="w-full p-2 rounded text-black"
          rows="4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}
