import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

interface Day {
    name: string;
    exercises: { muscleGroup: string, exercise: string | null }[];
}

const Mesocycles: React.FC = () => {
    const [mesocycles, setMesocycles] = useState<{ name: string, days: [string, { muscleGroup: string, exercise: string | null }[]][] }[]>([]);
    const [selectedMesocycle, setSelectedMesocycle] = useState<{ name: string, days: [string, { muscleGroup: string, exercise: string | null }[]][] } | null>(null);
    const [duration, setDuration] = useState<number>(4); // default to 4 weeks
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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

    const handleSelectMesocycle = (mesocycle: { name: string, days: [string, { muscleGroup: string, exercise: string | null }[]][] }) => {
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
                const dayOfWeek = (d.getDay()) % 7;
                const dayName = weekDays[dayOfWeek];
                const dayString = d.toISOString().split('T')[0];

                if (trainingDays.has(dayName)) {
                    const dayExercises = trainingDays.get(dayName);
                    const exercisesMap = new Map(dayExercises.map((ex: any) => [ex.exercise, [{ weight: 0, reps: 0, logged: false }]]));
                    localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify(Array.from(exercisesMap.entries())));
                } else {
                    localStorage.setItem(`workoutExercises_${dayString}`, JSON.stringify([["Rest Day", [{ weight: 0, reps: 0, logged: false }]]]));
                }
            }

            navigate('/workout');
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">Saved Mesocycles</h2>
                <Link to="/new-mesocycle" className="bg-violet-950 text-white px-4 py-2 rounded uppercase">
                    + New Mesocycle
                </Link>
            </header>
            <div>
                {mesocycles.length === 0 ? (
                    <p>No saved mesocycles</p>
                ) : (
                    <ul>
                        {mesocycles.map((mesocycle, index) => (
                            <li key={index} className="bg-white p-4 rounded shadow mb-2 flex justify-between items-center">
                                <span>{mesocycle.name}</span>
                                <div>
                                    <button
                                        className="text-blue-500 mr-2"
                                        onClick={() => handleSelectMesocycle(mesocycle)}
                                    >
                                        Load
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleDeleteMesocycle(mesocycle.name)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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