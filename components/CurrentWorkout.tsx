'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
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
import { faStopwatch, faSquare, faCheckSquare, faCalendarAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import LastStatsModal from '../components/LastStatsModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { fetchCustomExercises } from '../pages/api/customExercises';
import { fetchPresetExercises } from '../pages/api/presetExercises';
import { fetchWorkoutData, updateWorkoutData, WorkoutData, Set } from '../pages/api/workoutRoutes';

type ExerciseMap = Map<string, Set[]>;

const CurrentWorkout: React.FC = () => {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())));
  // const [workoutExercises, setWorkoutExercises] = useState<ExerciseMap>(new Map());
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    exercises: {},
    exerciseOrder: [],
    notes: '',
  });

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
  // const [workoutExerciseOrder, setWorkoutExerciseOrder] = useState<string[]>(Array.from(workoutExercises.keys()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localNotes, setLocalNotes] = useState(workoutData.notes);

  useEffect(() => {
    setIsMounted(true);
    const fetchMesocycleData = async () => {
      try {
        const mesocycleData = await getMesocycleData(); // Ignore for now
        setMesocycleStartDate(new Date(mesocycleData.startDate));
        setDuration(mesocycleData.duration);
      } catch (error) {
        console.error('Failed to fetch mesocycle data:', error);
      }
    };
    fetchMesocycleData();
  }, []);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const [fetchedPresetExercises, fetchedCustomExercises] = await Promise.all([
          fetchPresetExercises(),
          fetchCustomExercises()
        ]);
        setExercises(fetchedPresetExercises);
        setCustomExercises(fetchedCustomExercises);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      }
    };
    loadExercises();
  }, []);

  useEffect(() => {
    const fetchWorkoutDataForDay = async () => {
      if (isMounted && session?.user?.id) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        try {
          const data = await fetchWorkoutData(dateKey, session.user.id);
          setWorkoutData(data);
        } catch (error) {
          console.error('Failed to fetch workout data:', error);
          setWorkoutData({
            exercises: {},
            exerciseOrder: [],
            notes: '',
          });
        }
      }
    };
    fetchWorkoutDataForDay();
  }, [isMounted, selectedDate, session]);

  useEffect(() => {
    const saveWorkoutData = async () => {
      if (isMounted && session?.user?.id) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        try {
          await updateWorkoutData(dateKey, session.user.id, workoutData);
        } catch (error) {
          console.error('Failed to save workout data:', error);
        }
      }
    };
    saveWorkoutData();
  }, [workoutData, selectedDate, isMounted, session]);

  useEffect(() => {
    setLocalNotes(workoutData.notes);
  }, [workoutData.notes]);

  const handleAddSet = async (exerciseName: string, type: 'regular' | 'dropset' = 'regular') => {
    setIsLoading(true);
    try {
      setWorkoutData(prev => {
        const exerciseSets = prev.exercises[exerciseName] || [];
        const lastSet = exerciseSets[exerciseSets.length - 1] || { weight: 0, reps: 0, logged: false };
        const newSet: Set = { weight: lastSet.weight, reps: lastSet.reps, logged: false, type };
        return {
          ...prev,
          exercises: {
            ...prev.exercises,
            [exerciseName]: [...exerciseSets, newSet],
          },
        };
      });
    } catch (error) {
      console.error('Failed to add set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSet = async (exerciseName: string, setIndex: number) => {
    setIsLoading(true);
    try {
      setWorkoutData(prev => {
        const exercises = { ...prev.exercises };
        const sets = exercises[exerciseName] || [];
        sets.splice(setIndex, 1);
        if (sets.length === 0) {
          delete exercises[exerciseName];
          return {
            ...prev,
            exercises,
            exerciseOrder: prev.exerciseOrder.filter(name => name !== exerciseName)
          };
        } else {
          exercises[exerciseName] = sets;
          return { ...prev, exercises };
        }
      });
    } catch (error) {
      console.error('Failed to remove set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (exerciseName: string, setIndex: number, field: keyof Set, value: number) => {
    setIsLoading(true);
    try {
      setWorkoutData(prev => {
        const exercises = { ...prev.exercises };
        const sets = [...(exercises[exerciseName] || [])];
        sets[setIndex] = { ...sets[setIndex], [field]: value };
        exercises[exerciseName] = sets;
        return { ...prev, exercises };
      });
    } catch (error) {
      console.error('Failed to update set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSet = async (exerciseName: string, setIndex: number) => {
    setIsLoading(true);
    try {
      setWorkoutData(prev => {
        const exercises = { ...prev.exercises };
        const sets = [...(exercises[exerciseName] || [])];
        sets[setIndex] = { ...sets[setIndex], logged: !sets[setIndex].logged };
        exercises[exerciseName] = sets;
        return { ...prev, exercises };
      });
    } catch (error) {
      console.error('Failed to log set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkoutExercise = async (exerciseName: string) => {
    await handleAsyncOperation(async () => {
      setWorkoutData(prev => {
        if (!prev.exercises[exerciseName]) {
          return {
            ...prev,
            exercises: {
              ...prev.exercises,
              [exerciseName]: [{ weight: 0, reps: 0, logged: false }],
            },
            exerciseOrder: [...prev.exerciseOrder, exerciseName],
          };
        }
        return prev;
      });
    }, "Failed to add workout exercise");
  };

  const handleRemoveExercise = async (exerciseName: string) => {
    setIsLoading(true);
    try {
      setWorkoutData(prev => {
        const { [exerciseName]: _, ...remainingExercises } = prev.exercises;
        return {
          ...prev,
          exercises: remainingExercises,
          exerciseOrder: prev.exerciseOrder.filter(name => name !== exerciseName)
        };
      });
    } catch (error) {
      console.error('Failed to remove exercise:', error);
    } finally {
      setIsLoading(false);
    }
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

  const handleSelect = async (exerciseName: string, option: any) => {
    switch (option.value) {
      case 'addSet':
        handleAddSet(exerciseName);
        break;
      case 'addDropset':
        handleAddSet(exerciseName, 'dropset');
        break;
      case 'removeSet':
        handleRemoveSet(exerciseName, (workoutData.exercises[exerciseName] || []).length - 1);
        break;
      case 'removeExercise':
        handleRemoveExercise(exerciseName);
        break;
      case 'seeLastStats':
        setCurrentExercise(exerciseName);
        const stats = await findLastSessionStats(exerciseName);
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

  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const handleDateChange = async (value: Value, event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    if (!value || Array.isArray(value) || !session?.user?.id) return;
    const normalisedDate = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    setSelectedDate(normalisedDate);

    if (isMounted) {
      const dateKey = normalisedDate.toISOString().split('T')[0];
      try {
        const data = await fetchWorkoutData(dateKey, session.user.id);
        setWorkoutData(data);
      } catch (error) {
        console.error('Failed to fetch workout data:', error);
        setWorkoutData({
          exercises: {},
          exerciseOrder: [],
          notes: '',
        });
      }
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

  const findLastSessionStats = async (exerciseName: string): Promise<{ date: string, sets: Set[] } | null> => {
    if (!session?.user?.id) return null;
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);

    for (let i = 0; i < 365; i++) {
      const dateKey = currentDate.toISOString().split('T')[0];
      try {
        const data = await fetchWorkoutData(dateKey, session.user.id);
        if (data.exercises[exerciseName]) {
          return { date: dateKey, sets: data.exercises[exerciseName] };
        }
      } catch (error) {
        console.error('Failed to fetch workout data:', error);
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return null;
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(workoutData.exerciseOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkoutData(prev => ({ ...prev, exerciseOrder: items }));
  };

  const handleAsyncOperation = async (operation: () => Promise<void>, errorMessage: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await operation();
    } catch (err) {
      console.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-100 w-full">
        <div className="p-4 w-full lg:px-96">
          {/* Date Header in a separate white box */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-2xl text-black mb-2">
              Day {day} Week {week}
            </h2>
            <header className="flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-black">
                  {selectedDate.toDateString()}
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-base">
                {Object.values(workoutData.exercises).every(sets => sets.every(set => set.logged)) && (
                  <FontAwesomeIcon icon={faCheckSquare} className="text-indigo-700" />
                )}
                <button
                  className="text-indigo-950 flex items-center"
                  onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                >
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </button>
                <button
                  onClick={() => setIsStopwatchVisible(!isStopwatchVisible)}
                  className="text-indigo-950 flex items-center"
                >
                  <FontAwesomeIcon icon={faStopwatch} />
                </button>
              </div>
            </header>
          </div>

          {isCalendarVisible && (
            <div className="mb-4">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="react-calendar bg-white shadow-md rounded-lg p-4 w-full max-w-md mx-auto"
                tileClassName={({ date, view }) =>
                  view === 'month' && date.toDateString() === selectedDate.toDateString()
                    ? 'bg-indigo-600 text-white rounded-full'
                    : ''
                }
                prevLabel={<span className="text-indigo-600">&lsaquo;</span>}
                nextLabel={<span className="text-indigo-600">&rsaquo;</span>}
                prev2Label={<span className="text-indigo-600">&laquo;</span>}
                next2Label={<span className="text-indigo-600">&raquo;</span>}
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
              onChange={async (option: SingleValue<{ value: string; label: string }>) => {
                if (option) {
                  addWorkoutExercise(option.value);
                }
              }}
              placeholder="Add Exercise"
              className="text-black w-full"
              classNamePrefix="react-select"
            />
          </div>

          {isLoading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}

          <DragDropContext onDragEnd={(result) => handleAsyncOperation(async () => await onDragEnd(result), "Failed to reorder exercises")}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {workoutData.exerciseOrder.map((exerciseName, index) => {
                    const sets = workoutData.exercises[exerciseName];
                    const exercise = exercises.find(ex => ex.name === exerciseName) || customExercises.find(ex => ex.name === exerciseName);
                    if (!exercise || !sets) return null;

                    return (
                      <Draggable key={exerciseName} draggableId={exerciseName} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-6 bg-white rounded shadow w-full relative"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-center">
                                <span className="bg-indigo-100 text-xs text-indigo-700 px-2 py-0.5 rounded-tl rounded-br uppercase font-semibold border-2 border-indigo-700 flex items-center">
                                  {exercise.primaryMuscles.map(muscle => (
                                    <span key={muscle}>{muscle}</span>
                                  ))}
                                  {sets.every((set: Set) => set.logged) && (
                                    <FontAwesomeIcon icon={faCheckSquare} className="ml-2 text-indigo-700" />
                                  )}
                                </span>
                                <Dropdown
                                  options={options}
                                  onChange={(option) => handleAsyncOperation(async () => await handleSelect(exerciseName, option), "Failed to perform selected action")}
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
                                  <div className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 items-center text-sm font-semibold uppercase text-center text-gray-600 p-2 rounded-t">
                                    <div>Set</div>
                                    <div className="text-left pl-2">Weight (kg)</div>
                                    <div className="text-left pl-5">Reps</div>
                                    <div></div>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    {sets.map((set: Set, setIndex: number) => {
                                      const displayIndex = sets.filter((s: Set) => s.type !== 'dropset').indexOf(set) + 1;
                                      return (
                                        <div key={setIndex} className="grid grid-cols-[40px_1fr_1fr_auto] gap-4 items-center border-t py-2">
                                          <div className="flex-1 text-center font-bold">
                                            {set.type === 'dropset' ? (
                                              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">DS</span>
                                            ) : (
                                              displayIndex
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <Select
                                              options={generateWeightOptions().map(option => ({ value: option.toString(), label: option.toString() }))}
                                              onChange={(option: SingleValue<{ value: string; label: string }>) =>
                                                handleAsyncOperation(
                                                  async () => await handleInputChange(exerciseName, setIndex, 'weight', Number(option?.value)),
                                                  "Failed to update weight"
                                                )
                                              }
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
                                              onChange={(option: SingleValue<{ value: string; label: string }>) =>
                                                handleAsyncOperation(
                                                  async () => await handleInputChange(exerciseName, setIndex, 'reps', Number(option?.value)),
                                                  "Failed to update reps"
                                                )
                                              }
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
                                                className="text-indigo-600 cursor-pointer"
                                                style={{ fontSize: '24px' }}
                                                onClick={() => handleAsyncOperation(async () => await handleLogSet(exerciseName, setIndex), "Failed to log set")}
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
                                                onClick={() => handleAsyncOperation(async () => await handleLogSet(exerciseName, setIndex), "Failed to log set")}
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
                            {/* Add Set button at the bottom of each exercise */}
                            <div className="bg-gray-50 px-4 py-3 rounded-b">
                              <button
                                onClick={() => handleAsyncOperation(async () => await handleAddSet(exerciseName), "Failed to add set")}
                                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                              >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Add Set
                              </button>
                            </div>
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

          {/* Notes in a separate white box */}
          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <label className="block mb-2 text-lg text-black">Notes</label>
            <textarea
              className="w-full p-2 border rounded text-gray-700"
              rows={4}
              value={localNotes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setLocalNotes(e.target.value)
              }
              onBlur={() => {
                setWorkoutData(prev => ({ ...prev, notes: localNotes }))
              }}
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
