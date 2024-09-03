import React from 'react';

interface Exercise {
  muscleGroup: string;
  exercise: string | null;
}

interface Day {
  0: string;
  1: Exercise[];
}

interface Mesocycle {
  name: string;
  templateName: string;
  days: Day[];
}

interface ConfigureMesocycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMesocycle: Mesocycle | null;
  duration: number;
  setDuration: (duration: number) => void;
  setsPerExercise: Map<string, number>;
  setSetsPerExercise: (setsPerExercise: Map<string, number>) => void;
  calculateSetsPerMuscleGroup: () => { [key: string]: number };
  onLoadMesocycle: () => void;
}

const ConfigureMesocycleModal: React.FC<ConfigureMesocycleModalProps> = ({
  isOpen,
  onClose,
  selectedMesocycle,
  duration,
  setDuration,
  setsPerExercise,
  setSetsPerExercise,
  calculateSetsPerMuscleGroup,
  onLoadMesocycle,
}) => {
  if (!isOpen || !selectedMesocycle) return null;

  const uniqueExercises = Array.from(new Set(selectedMesocycle.days.flatMap(day => 
    day[1].map(ex => ex.exercise).filter((exercise): exercise is string => exercise !== null)
  )));

  const durationOptions = [4, 5, 6];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Configure Mesocycle</h4>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Select Mesocycle Duration (Weeks)</h5>
              <div className="flex space-x-2">
                {durationOptions.map((option) => (
                  <button
                    key={option}
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      duration === option
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setDuration(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Select Sets per Exercise</h5>
              {uniqueExercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{exercise}</span>
                  <select
                    className="p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={setsPerExercise.get(exercise) || 3}
                    onChange={(e) => setSetsPerExercise(new Map(setsPerExercise).set(exercise, parseInt(e.target.value, 10)))}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Weekly Sets per Muscle Group</h5>
              <div className="bg-gray-100 p-3 rounded-md">
                {Object.entries(calculateSetsPerMuscleGroup()).map(([muscleGroup, sets], index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{muscleGroup}</span>
                    <span className="text-sm font-semibold">{sets}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={onLoadMesocycle}
            >
              Load
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureMesocycleModal;