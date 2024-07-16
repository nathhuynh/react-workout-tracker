// Mesocycles.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEllipsisV } from 'react-icons/fa';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface Day {
  name: string;
  exercises: { muscleGroup: string, exercise: string | null }[];
}

interface Mesocycle {
  name: string;
  templateName: string;
  days: [string, { muscleGroup: string; exercise: string | null }[]][];
}

const Mesocycles: React.FC = () => {
  const [mesocycles, setMesocycles] = useState<Mesocycle[]>([]);
  const [selectedMesocycle, setSelectedMesocycle] = useState<Mesocycle | null>(null);
  const [duration, setDuration] = useState<number>(4); // default to 4 weeks
  const [showModal, setShowModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const mesocyclesFromStorage = localStorage.getItem('mesocycles');
    if (mesocyclesFromStorage) {
      setMesocycles(JSON.parse(mesocyclesFromStorage));
    }
  }, []);

  const handleDeleteMesocycle = (name: string) => {
    const updatedMesocycles = mesocycles.filter(mesocycle => mesocycle.name !== name);
    setMesocycles(updatedMesocycles);
    localStorage.setItem('mesocycles', JSON.stringify(updatedMesocycles));
  };

  const handleSelectMesocycle = (mesocycle: Mesocycle) => {
    setSelectedMesocycle(mesocycle);
    setShowModal(true);
  };

  const handleLoadMesocycle = () => {
    if (selectedMesocycle) {
      localStorage.setItem('currentMesocycle', JSON.stringify({ mesocycle: selectedMesocycle, duration }));

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration * 7);

      const trainingDays = new Map<string, any>(selectedMesocycle.days);
      const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      let currentDayIndex = startDate.getDay();
      let trainingDayFound = false;

      // Find the first training day from the start date
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
          const exercisesMap = new Map(dayExercises.map((ex: any) => [ex.exercise, [{ weight: 0, reps: 0, logged: false }]]));
          localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify(Array.from(exercisesMap.entries())));
          console.log(dayString)
        } else {
          localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify([["Rest Day", [{ weight: 0, reps: 0, logged: false }]]]));
        }
      }
      router.push('/workout');
    }
  };

  const options = [
    { value: 'load', label: 'Load' },
    { value: 'delete', label: 'Delete' },
  ];

  const handleDropdownSelect = (option: any, name: string) => {
    if (option.value === 'load') {
      const mesocycle = mesocycles.find(m => m.name === name);
      if (mesocycle) handleSelectMesocycle(mesocycle);
    } else if (option.value === 'delete') {
      handleDeleteMesocycle(name);
    }
    setDropdownVisible(null);
  };

  const CustomControl = () => {
    return (
      <div className="w-[40px] justify-center flex items-center cursor-pointer">
        <FaEllipsisV />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-black mb-4">Saved Mesocycles</h2>
          <Link href="/new-mesocycle">
            <div className="bg-violet-950 text-white px-4 py-2 mb-4 rounded uppercase">+ New</div>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-4 pt-0 rounded shadow-md">
          <ul>
            {mesocycles.length === 0 ? (
              <p>No saved mesocycles</p>
            ) : (
              mesocycles.map((mesocycle, index) => (
                <li key={index} className="border-b border-gray-300 flex justify-between items-center py-4">
                  <div>
                    <span className="block text-sm text-gray-600 uppercase">{mesocycle.templateName}</span>
                    <span className="block font-semibold">{mesocycle.name}</span>
                    <span className="block text-sm text-gray-600">{mesocycle.days.length} DAYS</span>
                  </div>
                  <div className="relative">
                    <button
                      className="text-gray-600 mb-10"
                      onClick={() => setDropdownVisible(dropdownVisible === mesocycle.name ? null : mesocycle.name)}
                    >
                      <FaEllipsisV />
                    </button>
                    {dropdownVisible === mesocycle.name && (
                      <div className="absolute right-0 -mt-8 w-48 bg-white border border-gray-300 rounded shadow-md z-10">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleDropdownSelect({ value: 'load' }, mesocycle.name)}
                        >
                          Load
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleDropdownSelect({ value: 'delete' }, mesocycle.name)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-xl mb-4">Select Length of Mesocycle</h3>
            <select
              className="w-full p-2 border rounded mb-4"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            >
              <option value={4}>4 Weeks</option>
              <option value={5}>5 Weeks</option>
              <option value={6}>6 Weeks</option>
            </select>
            <button
              className="bg-violet-950 text-white px-4 py-2 rounded uppercase"
              onClick={handleLoadMesocycle}
            >
              Load Mesocycle
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded uppercase ml-2"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mesocycles;