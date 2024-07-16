'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Dropdown from 'react-dropdown';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import { fetchExercises, Exercise } from '../utils/exerciseService';
import '../styles/DotDropdownMenu.css';
import Stopwatch from '../components/Stopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

interface Set {
  weight: number;
  reps: number;
  logged: boolean;
  type?: 'regular' | 'dropset';
}

type ExerciseMap = Map<string, Set[]>;

const CurrentWorkout: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseMap>(new Map());
  const [notes, setNotes] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mesocycleStartDate, setMesocycleStartDate] = useState(new Date());
  const [duration, setDuration] = useState(4);
  const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const startDate = localStorage.getItem('mesocycleStartDate') || new Date().toISOString();
      setMesocycleStartDate(new Date(startDate));
      setDuration(Number(localStorage.getItem('mesocycleDuration') || 4));
    }
  }, []);

  useEffect(() => {
    const loadExercises = async () => {
      const data: Exercise[] = await fetchExercises();
      setExercises(data);

      if (typeof window !== 'undefined') {
        const savedCustomExercises = localStorage.getItem('customExercises');
        if (savedCustomExercises) {
          setCustomExercises(JSON.parse(savedCustomExercises));
        }
      }
    };
    loadExercises();
  }, []);

  useEffect(() => {
    if (isMounted) {
      const savedExercises = localStorage.getItem(`workoutExercises_${selectedDate.toISOString().split('T')[0]}`);
      setWorkoutExercises(savedExercises ? new Map(JSON.parse(savedExercises)) : new Map());
      const savedNotes = localStorage.getItem(`workoutNotes_${selectedDate.toISOString().split('T')[0]}`);
      setNotes(savedNotes || '');
    }
  }, [isMounted, selectedDate]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(`workoutExercises_${selectedDate.toISOString().split('T')[0]}`, JSON.stringify(Array.from(workoutExercises.entries())));
    }
  }, [workoutExercises, selectedDate, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(`workoutNotes_${selectedDate.toISOString().split('T')[0]}`, notes);
    }
  }, [notes, selectedDate, isMounted]);

  const handleAddSet = (exerciseName: string, type: 'regular' | 'dropset' = 'regular') => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      const sets = [...(updated.get(exerciseName) || [])];
      const lastSet = sets[sets.length - 1] || { weight: 0, reps: 0, logged: false };
      sets.push({ weight: lastSet.weight, reps: lastSet.reps, logged: false, type });
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
    { value: 'addDropset', label: 'Add Dropset' },
    { value: 'removeSet', label: 'Remove Set' },
    { value: 'removeExercise', label: 'Remove Exercise' },
  ];

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(undefined);

  const handleSelect = (exerciseName: string, option: any) => {
    switch (option.value) {
      case 'addSet':
        handleAddSet(exerciseName);
        break;
      case 'addDropset':
        handleAddSet(exerciseName, 'dropset');
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

  const allExercises = [...exercises, ...customExercises].sort((a, b) => a.name.localeCompare(b.name));
  const exerciseOptions = allExercises.map(exercise => ({ value: exercise.name, label: exercise.name }));

  const handleDateChange = (value: Date | Date[] | null) => {
    if (!value || Array.isArray(value)) return;
    const normalisedDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    setSelectedDate(normalisedDate);

    if (isMounted) {
      const dateKey = normalisedDate.toISOString().split('T')[0];
      const savedExercises = localStorage.getItem(`workoutExercises_${dateKey}`);
      setWorkoutExercises(savedExercises ? new Map(JSON.parse(savedExercises)) : new Map());
      const savedNotes = localStorage.getItem(`workoutNotes_${dateKey}`);
      setNotes(savedNotes || '');
    }

    setIsCalendarVisible(false);
  };

  const calculateDayAndWeek = (selectedDate: Date, startDate: Date, duration: number) => {
    const start = new Date(startDate);
    const selected = new Date(selectedDate);
    const dayDiff = Math.floor((selected.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    let weekNumber = Math.floor(dayDiff / 7) + 1;
    let dayNumber = (dayDiff % 7) + 1;

    if (dayDiff < 0 || weekNumber - 1 > duration) {
      weekNumber = 0;
      dayNumber = 0;
    }

    return { week: weekNumber, day: dayNumber };
  };

  const { week, day } = calculateDayAndWeek(selectedDate, mesocycleStartDate, duration);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-10 bg-gray-100 w-full">
        <div className="w-full lg:px-96">
          <header className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-black">
                {selectedDate.toDateString()}
              </h2>
              <h2 className="text-2xl text-black">
                Day {day} Week {week}
              </h2>
            </div>
            <button
              className="bg-violet-950 text-white px-4 py-2 rounded"
              onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            >
              {isCalendarVisible ? 'Hide Calendar' : 'Show Calendar'}
            </button>
          </header>

          {isCalendarVisible && (
            <div className="mb-4 flex justify-center">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
              />
            </div>
          )}

          {/* Stopwatch */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsStopwatchVisible(!isStopwatchVisible)}
              className="bg-violet-950 text-white px-4 py-2 rounded flex items-center"
            >
              <FontAwesomeIcon icon={faStopwatch} className="mr-2" />
              {isStopwatchVisible ? 'Hide Stopwatch' : 'Show Stopwatch'}
            </button>
          </div>
          {isStopwatchVisible && (
            <div className="mb-4">
              <Stopwatch />
            </div>
          )}

          <div className="mb-4">
            <Select
              options={exerciseOptions}
              onChange={(option: SingleValue<{ value: string; label: string }>) => {
                if (option) {
                  addWorkoutExercise(option.value);
                }
              }}
              placeholder="Add Exercise"
              className="text-black w-full"
              classNamePrefix="react-select"
            />
          </div>

          {Array.from(workoutExercises.entries()).map(([exerciseName, sets], exerciseIndex) => (
            <div key={exerciseIndex} className="mb-6 p-4 bg-white rounded shadow w-full">
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
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center text-sm font-semibold uppercase text-center text-gray-600">
                    <div>Weight (kg)</div>
                    <div>Reps</div>
                    <div></div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center border-t py-2">

                        <div className="flex-1">
                          <Select
                            options={generateWeightOptions().map(option => ({ value: option.toString(), label: option.toString() }))}
                            onChange={(option: SingleValue<{ value: string; label: string }>) => handleInputChange(exerciseName, setIndex, 'weight', Number(option?.value))}
                            placeholder="ENTER"
                            className="w-full text-black"
                            classNamePrefix="react-select"
                            value={{ value: set.weight.toString(), label: set.weight.toString() }}
                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
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
                              valueContainer: (provided) => ({
                                ...provided,
                                justifyContent: 'center',
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                textAlign: 'center',
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
                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
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
                              valueContainer: (provided) => ({
                                ...provided,
                                justifyContent: 'center',
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                textAlign: 'center',
                              })
                            }}
                          />

                        </div>
                        <div className="flex items-center justify-center">
                          {set.logged ? (
                            <FontAwesomeIcon
                              icon={faCheckSquare}
                              className="text-violet-600 cursor-pointer"
                              style={{ fontSize: '24px' }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faSquare}
                              className="cursor-pointer"
                              style={{
                                fontSize: '19px',
                                color: 'white',
                                border: '2px solid #8b5cf6',
                                borderRadius: '4px'
                              }}
                              onClick={() => handleLogSet(exerciseName, setIndex)}
                            />
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