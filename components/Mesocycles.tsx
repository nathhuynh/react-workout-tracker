import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEllipsisV, FaPlus, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import ConfigureMesocycleModal from './ConfigureMesocycleModal';
import '../styles/globals.css';
import { fetchMesocycles, deleteMesocycle, MesocycleData } from '../pages/api/mesocycleRoutes';

const Mesocycles: React.FC = () => {
  const [mesocycles, setMesocycles] = useState<MesocycleData[]>([]);
  const [selectedMesocycle, setSelectedMesocycle] = useState<MesocycleData | null>(null);
  const [duration, setDuration] = useState<number>(4);
  const [showModal, setShowModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [setsPerExercise, setSetsPerExercise] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadMesocycles = async () => {
      try {
        setIsLoading(true);
        const fetchedMesocycles = await fetchMesocycles();
        setMesocycles(fetchedMesocycles);
      } catch (error) {
        setError('Failed to load mesocycles. Please try again.');
        console.error('Error fetching mesocycles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMesocycles();
  }, []);

  const handleDeleteMesocycle = async (name: string) => {
    try {
      await deleteMesocycle(name);
      // Update state or refetch mesocycles
      setMesocycles(prevMesocycles => prevMesocycles.filter(m => m.name !== name));
    } catch (error) {
      console.error('Failed to delete mesocycle:', error);
      // Display error message to the user
      alert(error instanceof Error ? error.message : 'Failed to delete mesocycle');
    }
  };

  const handleSelectMesocycle = (mesocycle: MesocycleData) => {
    setSelectedMesocycle(mesocycle);
    setShowModal(true);

    const initialSets = new Map<string, number>();
    mesocycle.days.forEach(day => {
      day.exercises.forEach(exercise => {
        if (exercise.exerciseId) {
          initialSets.set(exercise.exerciseId.toString(), setsPerExercise.get(exercise.exerciseId.toString()) || 3);
        }
      });
    });
    setSetsPerExercise(initialSets);
  };

  const calculateSetsPerMuscleGroup = () => {
    const setsPerMuscleGroup: { [key: string]: number } = {};

    selectedMesocycle?.days.forEach(day => {
      day.exercises.forEach(exercise => {
        if (exercise.exerciseId && setsPerExercise.has(exercise.exerciseId.toString())) {
          const sets = setsPerExercise.get(exercise.exerciseId.toString()) || 0;
          setsPerMuscleGroup[exercise.muscleGroup] = (setsPerMuscleGroup[exercise.muscleGroup] || 0) + sets;
        }
      });
    });

    return setsPerMuscleGroup;
  };

  // TODO - Loading Mesocycles
  const handleLoadMesocycle = () => {
    if (selectedMesocycle) {
      localStorage.setItem('currentMesocycle', JSON.stringify({ mesocycle: selectedMesocycle, duration, setsPerExercise: Array.from(setsPerExercise.entries()) }));

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration * 7);

      const trainingDays = new Map<string, any>(selectedMesocycle.days);
      const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      let currentDayIndex = startDate.getDay();
      let trainingDayFound = false;

      for (let i = 0; i < 7; i++) {
        const dayName = weekDays[(currentDayIndex + i) % 7];
        if (trainingDays.has(dayName)) {
          startDate.setDate(startDate.getDate() + i);
          trainingDayFound = true;
          break;
        }
      }

      if (!trainingDayFound) {
        console.error('No training days found in the current week');
        return;
      }

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay() % 7;
        const dayName = weekDays[dayOfWeek];
        const dayString = d.toISOString().split('T')[0];

        if (trainingDays.has(dayName)) {
          const dayExercises = trainingDays.get(dayName);
          const exercisesMap = new Map(dayExercises.map((ex: any) => [ex.exercise, Array(setsPerExercise.get(ex.exercise) || 3).fill({ weight: 0, reps: 0, logged: false })]));
          localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify(Array.from(exercisesMap.entries())));
        } else {
          localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify([["Rest Day", [{ weight: 0, reps: 0, logged: false }]]]));
        }
      }
      router.push('/workout');
    }
  };

  const handleDropdownSelect = (option: { value: string }, mesocycleName: string) => {
    if (option.value === 'load') {
      const mesocycle = mesocycles.find(m => m.name === mesocycleName);
      if (mesocycle) handleSelectMesocycle(mesocycle);
    } else if (option.value === 'delete') {
      handleDeleteMesocycle(mesocycleName);
    }
    setDropdownVisible(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Saved Mesocycles</h2>
          <Link href="/new-mesocycle">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300 flex items-center">
              <FaPlus className="mr-2" />
              <span>New</span>
            </div>
          </Link>
        </div>

        {mesocycles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaDumbbell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No saved mesocycles</p>
            <Link href="/new-mesocycle">
              <div className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300">
                Create Your First MesocycleData
              </div>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mesocycles.map((mesocycle, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="block text-sm font-semibold text-indigo-600 uppercase mb-1">{mesocycle.templateName}</span>
                      <h3 className="text-xl font-bold text-gray-800">{mesocycle.name}</h3>
                    </div>
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setDropdownVisible(dropdownVisible === mesocycle.name ? null : mesocycle.name)}
                      >
                        <FaEllipsisV />
                      </button>
                      {dropdownVisible === mesocycle.name && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleDropdownSelect({ value: 'load' }, mesocycle.name)}
                          >
                            Load
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleDropdownSelect({ value: 'delete' }, mesocycle.name)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>{mesocycle.days.length} Days</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <button
                    className="w-full bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200 transition duration-300"
                    onClick={() => handleSelectMesocycle(mesocycle)}
                  >
                    Configure & Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfigureMesocycleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedMesocycle={selectedMesocycle}
        duration={duration}
        setDuration={setDuration}
        setsPerExercise={setsPerExercise}
        setSetsPerExercise={setSetsPerExercise}
        calculateSetsPerMuscleGroup={calculateSetsPerMuscleGroup}
        onLoadMesocycle={handleLoadMesocycle}
      />
    </div>
  );
};

export default Mesocycles;