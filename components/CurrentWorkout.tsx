'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/globals.css';
import Dropdown from 'react-dropdown';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import { fetchExercises, Exercise } from '../utils/exerciseService';
import { useExerciseOptions } from '../utils/useExerciseOptions';
import '../styles/DotDropdownMenu.css';
import Stopwatch from '../components/Stopwatch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch, faSquare, faCheckSquare, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import LastStatsModal from '../components/LastStatsModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [selectedDate, setSelectedDate] = useState(() => new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())));
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseMap>(new Map());
  const { equipmentTypes, primaryMuscles, exercisesByMuscle } = useExerciseOptions();
  const [notes, setNotes] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mesocycleStartDate, setMesocycleStartDate] = useState(new Date());
  const [duration, setDuration] = useState(4);
  const [isStopwatchVisible, setIsStopwatchVisible] = useState(false);
  const [isLastStatsModalOpen, setIsLastStatsModalOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [lastStats, setLastStats] = useState<{ date: string, sets: Set[] } | null>(null);
  const [workoutExerciseOrder, setWorkoutExerciseOrder] = useState<string[]>(Array.from(workoutExercises.keys()));

  // useEffect(() => {
  //   console.log('Workout Exercises:', Array.from(workoutExercises.entries()));
  //   console.log('Workout keys:', Array.from(workoutExercises.keys()));
  // }, [workoutExercises]);

  // useEffect(() => {
  //   console.log('Workout Exercise Order:', workoutExerciseOrder);
  // }, [workoutExerciseOrder]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const startDate = localStorage.getItem('mesocycleStartDate') || new Date().toISOString();
      setMesocycleStartDate(new Date(startDate));
      setDuration(Number(localStorage.getItem('mesocycleDuration') || 4));
    }
  }, []);

  useEffect(() => {
    const loadExercises = () => {
      if (typeof window !== 'undefined') {
        const savedPreprocessedExercises = localStorage.getItem('preprocessedExercises');
        if (savedPreprocessedExercises) {
          setExercises(JSON.parse(savedPreprocessedExercises));
        }
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
      const dateKey = selectedDate.toISOString().split('T')[0];
      const savedWorkoutExercises = localStorage.getItem(`workoutExercises_${dateKey}`);
      const savedWorkoutExerciseOrder = localStorage.getItem(`workoutExerciseOrder_${dateKey}`);
      if (savedWorkoutExercises) {
        const parsedExercises: ExerciseMap = new Map<string, Set[]>(JSON.parse(savedWorkoutExercises));
        setWorkoutExercises(parsedExercises);
        if (savedWorkoutExerciseOrder) {
          const parsedOrder: string[] = JSON.parse(savedWorkoutExerciseOrder);
          setWorkoutExerciseOrder(parsedOrder);
        } else {
          setWorkoutExerciseOrder(Array.from(parsedExercises.keys()));
        }
      } else {
        setWorkoutExercises(new Map());
        setWorkoutExerciseOrder([]);
      }
      const savedNotes = localStorage.getItem(`workoutNotes_${dateKey}`);
      setNotes(savedNotes || '');
    }
  }, [isMounted, selectedDate]);  

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(`workoutExercises_${selectedDate.toISOString().split('T')[0]}`, JSON.stringify(Array.from(workoutExercises.entries())));
      localStorage.setItem(`workoutExerciseOrder_${selectedDate.toISOString().split('T')[0]}`, JSON.stringify(workoutExerciseOrder));
    }
  }, [workoutExercises, workoutExerciseOrder, selectedDate, isMounted]);

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
      sets[setIndex].logged = !sets[setIndex].logged;
      updated.set(exerciseName, sets);
      return updated;
    });
  };

  const addWorkoutExercise = (exerciseName: string) => {
    setWorkoutExercises(prev => {
      const updated = new Map(prev);
      if (!updated.has(exerciseName)) {
        updated.set(exerciseName, [{ weight: 0, reps: 0, logged: false }]);
        setWorkoutExerciseOrder(prevOrder => {
          const newOrder = [...prevOrder, exerciseName];
          localStorage.setItem(`workoutExerciseOrder_${selectedDate.toISOString().split('T')[0]}`, JSON.stringify(newOrder));
          return newOrder;
        });
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
    setWorkoutExerciseOrder(prev => prev.filter(name => name !== exerciseName));
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
    { value: 'seeLastStats', label: 'Last Session' },
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
      case 'seeLastStats':
        setCurrentExercise(exerciseName);
        const stats = findLastSessionStats(exerciseName);
        setLastStats(stats);
        setIsLastStatsModalOpen(true);
        break;
      default:
        break;
    }
    setDropdownValue(undefined);
  };

  const CustomControl = () => {
    return (
      <div className="w-[40px] justify-center flex items-center cursor-pointer pl-5">
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
      const savedWorkoutExerciseOrder = localStorage.getItem(`workoutExerciseOrder_${dateKey}`);
      const parsedExercises: ExerciseMap = savedExercises ? new Map<string, Set[]>(JSON.parse(savedExercises)) : new Map();
      
      if (savedWorkoutExerciseOrder) {
        const parsedOrder: string[] = JSON.parse(savedWorkoutExerciseOrder);
        if (parsedOrder.length > 0) {
          setWorkoutExerciseOrder(parsedOrder);
        } else {
          const keys = Array.from(parsedExercises.keys());
          setWorkoutExerciseOrder(keys);
          localStorage.setItem(`workoutExerciseOrder_${dateKey}`, JSON.stringify(keys));
        }
      } else {
        const keys = Array.from(parsedExercises.keys());
        setWorkoutExerciseOrder(keys);
        localStorage.setItem(`workoutExerciseOrder_${dateKey}`, JSON.stringify(keys));
      }
  
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

  const findLastSessionStats = (exerciseName: string): { date: string, sets: Set[] } | null => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const savedExercises = localStorage.getItem(`workoutExercises_${dateKey}`);

      if (savedExercises) {
        const exercises = new Map(JSON.parse(savedExercises) as [string, Set[]][]);
        if (exercises.has(exerciseName)) {
          const sets = exercises.get(exerciseName);
          if (sets) {
            return { date: dateKey, sets: sets as Set[] };
          }
        }
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return null;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(workoutExerciseOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkoutExerciseOrder(items);
    localStorage.setItem(`workoutExerciseOrder_${selectedDate.toISOString().split('T')[0]}`, JSON.stringify(items));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-10 bg-gray-100 w-full">
        <div className="p-4 w-full lg:px-96">
          <h2 className="text-2xl text-black">
            {/* TODO: Add Mesocycle name */}
            Day {day} Week {week}
          </h2>
          <header className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-black">
                {selectedDate.toDateString()}
              </h2>
            </div>
            <div className="flex items-center space-x-4 text-base">
              {Array.from(workoutExercises.values()).every(sets => sets.every(set => set.logged)) && (
                <FontAwesomeIcon icon={faCheckSquare} className="text-violet-700" />
              )}
              <button
                className="text-violet-950 flex items-center"
                onClick={() => setIsCalendarVisible(!isCalendarVisible)}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
              </button>
              <button
                onClick={() => setIsStopwatchVisible(!isStopwatchVisible)}
                className="text-violet-950 flex items-center"
              >
                <FontAwesomeIcon icon={faStopwatch} />
              </button>
            </div>
          </header>

          {isCalendarVisible && (
            <div className="mb-4 flex justify-center">
              <Calendar
                className="react-calendar"
                onChange={handleDateChange}
                value={selectedDate}
              />
            </div>
          )}

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

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {workoutExerciseOrder.map((exerciseName, index) => {
                    const sets = workoutExercises.get(exerciseName);
                    const exercise = exercises.find(ex => ex.name === exerciseName) || customExercises.find(ex => ex.name === exerciseName);
                    if (!exercise || !sets) return null;

                    return (
                      <Draggable key={exerciseName} draggableId={exerciseName} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-6 p-4 bg-white rounded shadow w-full relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="bg-violet-100 text-xs text-violet-700 px-2 py-0.5 rounded-tl rounded-br uppercase font-semibold border-2 border-violet-700 flex items-center">
                                {exercise.primaryMuscles.map(muscle => (
                                  <span key={muscle}>{muscle}</span>
                                ))}
                                {sets.every(set => set.logged) && (
                                  <FontAwesomeIcon icon={faCheckSquare} className="ml-2 text-violet-700" />
                                )}
                              </span>
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
                            <div>
                              <h3 className="text-lg font-semibold text-black">{exercise.name}</h3>
                              <p className="font-medium text-gray-600 uppercase text-xs pb-2">{exercise.equipment}</p>
                            </div>

                            {sets && sets.length > 0 ? (
                              <>
                                <div className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 items-center text-sm font-semibold uppercase text-center text-gray-600">
                                  <div>Set</div>
                                  <div>Weight (kg)</div>
                                  <div>Reps</div>
                                  <div></div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  {sets.map((set, setIndex) => {
                                    const displayIndex = sets.filter(s => s.type !== 'dropset').indexOf(set) + 1;
                                    return (
                                      <div key={setIndex} className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 items-center border-t py-2">
                                        <div className="flex-1 text-center font-bold">
                                          {set.type === 'dropset' ? (
                                            <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded">DS</span>
                                          ) : (
                                            displayIndex
                                          )}
                                        </div>
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
                                              onClick={() => handleLogSet(exerciseName, setIndex)}
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
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500">No sets available.</p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-4">
            <label className="block mb-2 text-lg text-black">Notes</label>
            <textarea
              className="w-full p-2 border rounded text-gray-700"
              rows={4}
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <LastStatsModal
            isOpen={isLastStatsModalOpen}
            onClose={() => setIsLastStatsModalOpen(false)}
            exerciseName={currentExercise}
            lastStats={lastStats}
          />
        </div>
      </main>
    </div>
  );
};

export default CurrentWorkout;