import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaPlus, FaDumbbell, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useExerciseOptions } from '../utils/useExerciseOptions';
import { fetchCustomExercises, createCustomExercise, updateCustomExercise, deleteCustomExercise } from '../pages/api/customExercises';
import { useSession } from 'next-auth/react';
import CustomExerciseModal from './CustomExerciseModal';

const AddCustomExercise: React.FC = () => {
    const [customExercises, setCustomExercises] = useState<any[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
    const { equipmentTypes, primaryMuscles: muscleOptions, categories } = useExerciseOptions();
    const { data: session, status } = useSession();
    const [selectedExercise, setSelectedExercise] = useState<any | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const exercises = await fetchCustomExercises();
            setCustomExercises(exercises);
        } catch (error) {
            console.error('Failed to fetch custom exercises:', error);
        }
    };

    const handleSave = async (exerciseData: any) => {
        if (status !== 'authenticated') {
            console.error('User is not authenticated');
            return;
        }

        try {
            const createdExercise = await createCustomExercise(exerciseData);
            console.log('Exercise created successfully:', createdExercise);
            await fetchExercises();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Failed to create custom exercise:', error);
        }
    };

    const handleUpdate = async (id: string, exerciseData: any) => {
        try {
            const result = await updateCustomExercise(id, exerciseData);
            console.log('Update result:', result);
            await fetchExercises();
            setIsFormVisible(false);
        } catch (error) {
            console.error('Failed to update custom exercise:', error);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await deleteCustomExercise(id);
            await fetchExercises();
            setSelectedExercise(null);
        } catch (error) {
            console.error('Failed to delete custom exercise:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Custom Exercises</h2>
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300 flex items-center"
                        onClick={() => {
                            setIsFormVisible(true);
                            setSelectedExercise(null);
                        }}
                    >
                        <FaPlus className="mr-2" />
                        <span>New</span>
                    </button>
                </div>

                {customExercises.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FaDumbbell className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-600">No custom exercises yet</p>
                        <button
                            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
                            onClick={() => {
                                setIsFormVisible(true);
                                setSelectedExercise(null);
                            }}
                        >
                            Create Your First Custom Exercise
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {customExercises.map(exercise => (
                            <div key={exercise.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="block text-sm font-semibold text-indigo-600 uppercase mb-1">{exercise.primaryMuscles.join(', ')}</span>
                                            <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
                                        </div>
                                        <div className="relative">
                                            <button
                                                className="text-gray-500 hover:text-gray-700"
                                                onClick={() => setDropdownVisible(dropdownVisible === exercise.id ? null : exercise.id)}
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            {dropdownVisible === exercise.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    <button
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                        onClick={() => {
                                                            setSelectedExercise(exercise);
                                                            setIsFormVisible(true);
                                                            setDropdownVisible(null);
                                                        }}
                                                    >
                                                        <FaEdit className="mr-2" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                                        onClick={() => handleRemove(exercise.id)}
                                                    >
                                                        <FaTrashAlt className="mr-2" />
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaDumbbell className="mr-2" />
                                        <span>{exercise.equipment}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <CustomExerciseModal
                    isFormVisible={isFormVisible}
                    setIsFormVisible={setIsFormVisible}
                    selectedExercise={selectedExercise}
                    handleSave={handleSave}
                    handleUpdate={handleUpdate}
                    equipmentTypes={equipmentTypes}
                    muscleOptions={muscleOptions}
                    categories={categories}
                />
            </main>
        </div>
    );
};

export default AddCustomExercise;