import React, { useState } from 'react';

export default function AddExercise({ addExercise }) {
  const [exerciseName, setExerciseName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (exerciseName) {
      addExercise({ name: exerciseName, weightProgression: [] });
      setExerciseName('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Add Exercise</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Exercise Name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          className="p-2 rounded"
        />
        <button type="submit" className="bg-blue-700 px-4 py-2 rounded text-white">
          Add Exercise
        </button>
      </form>
    </div>
  );
}
