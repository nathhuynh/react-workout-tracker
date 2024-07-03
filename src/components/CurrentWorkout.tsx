import React, { useState, useEffect, ChangeEvent } from 'react';
import Dropdown from 'react-dropdown';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import { fetchExercises, Exercise } from '../utils/exerciseService';
import '../styles/DotDropdownMenu.css'

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      const data: Exercise[] = await fetchExercises();
      setExercises(data);

      const savedCustomExercises = localStorage.getItem('customExercises');
      if (savedCustomExercises) {
        setCustomExercises(JSON.parse(savedCustomExercises));
      }
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
    for (let i = 10.25; i <= 300; i += 0.25) {
      options.push(parseFloat(i.toFixed(2)));
    }
    return options;
  };

  const generateRepsOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => i + 1);
  };

  const options = [
    { value: 'addSet', label: 'Add Set' },
    { value: 'removeSet', label: 'Remove Set' },
    { value: 'removeExercise', label: 'Remove Exercise' },
  ];

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(undefined);

  const handleSelect = (exerciseName: string, option: any) => {
    switch (option.value) {
      case 'addSet':
        handleAddSet(exerciseName);
        break;
      case 'removeSet':
        handleRemoveSet(exerciseName, workoutExercises.get(exerciseName)!.length - 1);
        break;
      case 'removeExercise':
        handleRemoveExercise(exerciseName);
        break;
      default:
        break;
    }
    setDropdownValue(undefined);
  };

  const CustomControl = () => {
    return (
      <div className="w-[40px] justify-center flex items-center cursor-pointer">
        <i className="fas fa-ellipsis-v"></i>
      </div>
    );
  };

  // const allExercises = [...exercises, ...customExercises];
  const allExercises = [...exercises, ...customExercises].sort((a, b) => a.name.localeCompare(b.name)); // slowdown?
  const exerciseOptions = allExercises.map(exercise => ({ value: exercise.name, label: exercise.name }));

  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-black">WEEK 1 DAY 1 Monday</h2>
            <button className="bg-violet-950 text-white px-4 py-2 rounded">Minimise Calendar</button>
            {/* fa fa-calendar */}
          </header>

          <div className="mb-4">
            <Select
              options={exerciseOptions}
              onChange={(option: SingleValue<{ value: string; label: string }>) => {
                if (option) {
                  addWorkoutExercise(option.value);
                }
              }}
              placeholder="Add Exercise"
              className="text-black"
              classNamePrefix="react-select"
            />
          </div>

          {Array.from(workoutExercises.entries()).map(([exerciseName, sets], exerciseIndex) => (
            <div key={exerciseIndex} className="mb-6 p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-black">{exerciseName}</h3>
                <Dropdown
                  options={options}
                  onChange={(option) => handleSelect(exerciseName, option)}
                  placeholder=""
                  className="dropdown"
                  controlClassName="dropdown-control custom-control"
                  menuClassName="dropdown-menu"
                  arrowClosed={<CustomControl />}
                  arrowOpen={<CustomControl />}
                />
              </div>

              {sets && sets.length > 0 ? (
                <>
                  <div className="grid grid-cols-4 gap-4 items-center text-sm font-semibold uppercase text-center text-gray-600">
                    <div>Set</div>
                    <div>Weight (kg)</div>
                    <div>Reps</div>
                    <div></div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-4 gap-4 items-center border-t py-2">
                        <div className="flex items-center justify-center text-black">{setIndex + 1}</div>
                        <div className="flex-1">
                          <Select
                            options={generateWeightOptions().map(option => ({ value: option.toString(), label: option.toString() }))}
                            onChange={(option: SingleValue<{ value: string; label: string }>) => handleInputChange(exerciseName, setIndex, 'weight', Number(option?.value))}
                            placeholder="ENTER"
                            className="w-full text-black"
                            classNamePrefix="react-select"
                            value={{ value: set.weight.toString(), label: set.weight.toString() }}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                height: '40px',
                                minHeight: '40px',
                                justifyContent: 'center',
                                borderColor: state.isFocused ? 'purple' : '#e0e0e0',
                                '&:hover': {
                                  borderColor: '#4A148C',
                                },
                              }),
                              indicatorSeparator: (provided) => ({
                                ...provided,
                                display: 'none'
                              }),
                              dropdownIndicator: (provided) => ({
                                ...provided,
                                color: '#718096'
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                display: 'flex',
                                justifyContent: 'right'
                              })
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Select
                            options={generateRepsOptions(50).map(option => ({ value: option.toString(), label: option.toString() }))}
                            onChange={(option: SingleValue<{ value: string; label: string }>) => handleInputChange(exerciseName, setIndex, 'reps', Number(option?.value))}
                            placeholder="ENTER"
                            className="w-full text-black"
                            classNamePrefix="react-select text-black"
                            value={{ value: set.reps.toString(), label: set.reps.toString() }}
                            styles={{
                              control: (provided, state) => ({
                                ...provided,
                                height: '40px',
                                minHeight: '40px',
                                justifyContent: 'center',
                                borderColor: state.isFocused ? 'purple' : '#e0e0e0',
                                '&:hover': {
                                  borderColor: '#4A148C',
                                },
                              }),
                              indicatorSeparator: (provided) => ({
                                ...provided,
                                display: 'none'
                              }),
                              dropdownIndicator: (provided) => ({
                                ...provided,
                                color: '#718096'
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                display: 'flex',
                                justifyContent: 'right'
                              })
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          {set.logged ? (
                            <span className="text-green-500">✔️</span>
                          ) : (
                            <button
                              onClick={() => handleLogSet(exerciseName, setIndex)}
                              className="bg-violet-900 text-white px-4 py-2 rounded uppercase"
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
                <p className="text-sm text-gray-500">No sets available.</p>
              )}
            </div>
          ))}

          <div className="mt-4">
            <label className="block mb-2 text-lg text-black">Notes</label>
            <textarea
              className="w-full p-2 border rounded text-gray-700"
              rows={4}
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CurrentWorkout;