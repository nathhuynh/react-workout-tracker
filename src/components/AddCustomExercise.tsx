import React, { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import { useExerciseOptions } from '../utils/useExerciseOptions';
import 'react-dropdown/style.css';
import '../styles/DotDropdownMenu.css';

const AddCustomExercise: React.FC = () => {
    const [name, setName] = useState('');
    const [equipmentType, setEquipmentType] = useState<SingleValue<{ value: string; label: string }>>(null);
    const [primaryMuscles, setPrimaryMuscles] = useState<MultiValue<{ value: string; label: string }>>([]);
    const [category, setCategory] = useState<SingleValue<{ value: string; label: string }>>(null);
    const [customExercises, setCustomExercises] = useState<any[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<SingleValue<{ value: string; label: string }>>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { equipmentTypes, primaryMuscles: muscleOptions, categories } = useExerciseOptions();

    useEffect(() => {
        const savedCustomExercises = localStorage.getItem('customExercises');
        if (savedCustomExercises) {
            setCustomExercises(JSON.parse(savedCustomExercises));
        }
    }, []);

    const generateId = (name: string) => name.replace(/\s+/g, '_').toLowerCase();

    const handleSave = () => {
        const id = generateId(name);
        const newExercise = {
            id,
            name,
            force: 'N/A',
            level: 'N/A',
            mechanic: 'N/A',
            equipment: equipmentType?.value || 'N/A',
            primaryMuscles: primaryMuscles.map(muscle => muscle.value),
            secondaryMuscles: [],
            instructions: [],
            category: category?.value || 'N/A',
            images: [],
            sets: [],
        };

        const updatedCustomExercises = [...customExercises, newExercise];
        setCustomExercises(updatedCustomExercises);
        localStorage.setItem('customExercises', JSON.stringify(updatedCustomExercises));

        // Clear form
        setName('');
        setEquipmentType(null);
        setPrimaryMuscles([]);
        setCategory(null);
        setIsFormVisible(false);

        console.log(newExercise);
    };

    const handleRemove = (id: string) => {
        const updatedCustomExercises = customExercises.filter(exercise => exercise.id !== id);
        setCustomExercises(updatedCustomExercises);
        localStorage.setItem('customExercises', JSON.stringify(updatedCustomExercises));
        setSelectedExercise(null);
    };

    const handleUpdate = () => {
        const updatedCustomExercises = customExercises.map(exercise => {
            if (exercise.id === selectedExercise?.value) {
                return {
                    ...exercise,
                    name,
                    equipment: equipmentType?.value || 'N/A',
                    primaryMuscles: primaryMuscles.map(muscle => muscle.value),
                    category: category?.value || 'N/A',
                };
            }
            return exercise;
        });

        setCustomExercises(updatedCustomExercises);
        localStorage.setItem('customExercises', JSON.stringify(updatedCustomExercises));
    };

    const selectOptions = (options: string[]) => options.map(option => ({ value: option, label: option }));
    const customExerciseOptions = customExercises.map(exercise => ({ value: exercise.id, label: exercise.name }));

    useEffect(() => {
        if (selectedExercise) {
            const exercise = customExercises.find(ex => ex.id === selectedExercise.value);
            if (exercise) {
                setName(exercise.name);
                setEquipmentType({ value: exercise.equipment, label: exercise.equipment });
                setPrimaryMuscles(exercise.primaryMuscles.map((muscle: string) => ({ value: muscle, label: muscle })));
                setCategory({ value: exercise.category, label: exercise.category });
            }
        }
    }, [selectedExercise, customExercises]);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 p-6 bg-gray-100">
                <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow-md">
                    <h2 className="text-2xl font-semibold text-black mb-4">Manage Custom Exercises</h2>
                    {isFormVisible && selectedExercise && (
                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-black h-10 min-h-10 focus:border-purple-500 hover:border-purple-700"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter an exercise"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Equipment Type</label>
                                <Select
                                    options={selectOptions(equipmentTypes)}
                                    value={equipmentType}
                                    onChange={(newValue) => setEquipmentType(newValue)}
                                    placeholder="Choose equipment"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black',
                                        })
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Muscles</label>
                                <Select
                                    options={selectOptions(muscleOptions)}
                                    value={primaryMuscles}
                                    isMulti
                                    onChange={(newValue) => setPrimaryMuscles(newValue as MultiValue<{ value: string; label: string }>)}
                                    placeholder="Choose muscles worked"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black'
                                        })
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Category</label>
                                <Select
                                    options={selectOptions(categories)}
                                    value={category}
                                    onChange={(newValue) => setCategory(newValue)}
                                    placeholder="Choose exercise category"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black',
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => {
                                    setName('');
                                    setEquipmentType(null);
                                    setPrimaryMuscles([]);
                                    setCategory(null);
                                    setIsFormVisible(false);
                                    setSelectedExercise(null);
                                }}>Clear</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleUpdate}>Update</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="max-w-3xl mx-auto mt-6 bg-white p-4 rounded shadow-md">
                    <h2 className="text-2xl font-semibold text-black mb-4">Custom Exercises</h2>
                    <ul>
                        {customExercises.map(exercise => (
                            <li key={exercise.id} className="flex justify-between items-center mb-2">
                                <span className="text-black">{exercise.name}</span>
                                <div>
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                                        onClick={() => {
                                            setSelectedExercise({ value: exercise.id, label: exercise.name });
                                            setIsFormVisible(true);
                                        }}
                                    >
                                        Manage
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                        onClick={() => handleRemove(exercise.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                        onClick={() => {
                            setIsFormVisible(!isFormVisible);
                            setSelectedExercise(null);
                            setName('');
                            setEquipmentType(null);
                            setPrimaryMuscles([]);
                            setCategory(null);
                        }}
                    >
                        {isFormVisible && !selectedExercise ? 'Cancel' : 'Add Exercise'}
                    </button>
                    {isFormVisible && !selectedExercise && (
                        <div className="mt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-black h-10 min-h-10 focus:border-purple-500 hover:border-purple-700"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter an exercise"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Equipment Type</label>
                                <Select
                                    options={selectOptions(equipmentTypes)}
                                    value={equipmentType}
                                    onChange={(newValue) => setEquipmentType(newValue)}
                                    placeholder="Choose equipment"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black',
                                        })
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Muscles</label>
                                <Select
                                    options={selectOptions(muscleOptions)}
                                    value={primaryMuscles}
                                    isMulti
                                    onChange={(newValue) => setPrimaryMuscles(newValue as MultiValue<{ value: string; label: string }>)}
                                    placeholder="Choose muscles worked"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black'
                                        })
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-black">Category</label>
                                <Select
                                    options={selectOptions(categories)}
                                    value={category}
                                    onChange={(newValue) => setCategory(newValue)}
                                    placeholder="Choose exercise category"
                                    classNamePrefix="react-select"
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
                                            justifyContent: 'left'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            color: 'black',
                                        })
                                    }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => {
                                    setName('');
                                    setEquipmentType(null);
                                    setPrimaryMuscles([]);
                                    setCategory(null);
                                    setIsFormVisible(false);
                                }}>Clear</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AddCustomExercise;