'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
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
import { faStopwatch, faSquare, faCheckSquare, faCalendarAlt, faEllipsisV, faDumbbell, faPlus } from '@fortawesome/free-solid-svg-icons';
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
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Day {day} Week {week}
            </h2>
            <div className="flex items-center space-x-4">
              {Object.values(workoutData.exercises).every(sets => sets.every(set => set.logged)) && (
                <FontAwesomeIcon icon={faCheckSquare} className="text-green-600 text-xl" />
              )}
              <button
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                onClick={() => setIsCalendarVisible(!isCalendarVisible)}
              >
                <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
              </button>
              <button
                onClick={() => setIsStopwatchVisible(!isStopwatchVisible)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FontAwesomeIcon icon={faStopwatch} size="lg" />
              </button>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {selectedDate.toDateString()}
          </h3>
        </div>

        {isCalendarVisible && (
          <div className="mb-6">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              className="mx-auto bg-white rounded-lg shadow-md p-4"
            />
          </div>
        )}

        {isStopwatchVisible && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-4">
            <Stopwatch />
          </div>
        )}

        <div className="mb-6">
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

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">{error}</div>}

        <DragDropContext onDragEnd={(result) => handleAsyncOperation(async () => await onDragEnd(result), "Failed to reorder exercises")}>
          <Droppable droppableId="exercises">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
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
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {exercise.primaryMuscles.join(', ')}
                              </span>
                              <div className="relative">
                                <button
                                  onClick={() => handleSelect(exerciseName, { value: 'showOptions' })}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                {/* Dropdown menu would go here */}
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{exercise.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{exercise.equipment}</p>

                            {sets && sets.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3">Set</th>
                                      <th scope="col" className="px-6 py-3">Weight (kg)</th>
                                      <th scope="col" className="px-6 py-3">Reps</th>
                                      <th scope="col" className="px-6 py-3">Done</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sets.map((set: Set, setIndex: number) => {
                                      const displayIndex = sets.filter((s: Set) => s.type !== 'dropset').indexOf(set) + 1;
                                      return (
                                        <tr key={setIndex} className="bg-white border-b">
                                          <td className="px-6 py-4 font-medium text-gray-900">
                                            {set.type === 'dropset' ? (
                                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                DS
                                              </span>
                                            ) : displayIndex}
                                          </td>
                                          <td className="px-6 py-4">
                                            <Select
                                              options={generateWeightOptions().map(option => ({ value: option.toString(), label: option.toString() }))}
                                              onChange={(option: SingleValue<{ value: string; label: string }>) =>
                                                handleAsyncOperation(
                                                  async () => await handleInputChange(exerciseName, setIndex, 'weight', Number(option?.value)),
                                                  "Failed to update weight"
                                                )
                                              }
                                              value={{ value: set.weight.toString(), label: set.weight.toString() }}
                                              className="w-full"
                                              classNamePrefix="react-select"
                                              // ... (keep the existing styles)
                                            />
                                          </td>
                                          <td className="px-6 py-4">
                                            <Select
                                              options={generateRepsOptions(50).map(option => ({ value: option.toString(), label: option.toString() }))}
                                              onChange={(option: SingleValue<{ value: string; label: string }>) =>
                                                handleAsyncOperation(
                                                  async () => await handleInputChange(exerciseName, setIndex, 'reps', Number(option?.value)),
                                                  "Failed to update reps"
                                                )
                                              }
                                              value={{ value: set.reps.toString(), label: set.reps.toString() }}
                                              className="w-full"
                                              classNamePrefix="react-select"
                                              // ... (keep the existing styles)
                                            />
                                          </td>
                                          <td className="px-6 py-4">
                                            <button
                                              onClick={() => handleAsyncOperation(async () => await handleLogSet(exerciseName, setIndex), "Failed to log set")}
                                              className={`w-6 h-6 flex items-center justify-center rounded ${
                                                set.logged ? 'bg-green-500 text-white' : 'bg-gray-200'
                                              }`}
                                            >
                                              <FontAwesomeIcon icon={set.logged ? faCheckSquare : faSquare} />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No sets available.</p>
                            )}
                          </div>
                          <div className="bg-gray-50 px-4 py-3">
                            <button
                              onClick={() => handleAsyncOperation(async () => await handleAddSet(exerciseName), "Failed to add set")}
                              className="text-indigo-600 hover:text-indigo-800 font-medium"
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

        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Workout Notes</label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded-md text-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            value={workoutData.notes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setWorkoutData(prev => ({ ...prev, notes: e.target.value }))
            }
          ></textarea>
        </div>

        <LastStatsModal
          isOpen={isLastStatsModalOpen}
          onClose={() => setIsLastStatsModalOpen(false)}
          exerciseName={currentExercise}
          lastStats={lastStats}
        />
      </main>
    </div>
  );
};

export default CurrentWorkout;