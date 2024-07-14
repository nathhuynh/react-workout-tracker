import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import '../styles/DotDropdownMenu.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaPen, FaCopy } from 'react-icons/fa';
import { useExerciseOptions } from '../utils/useExerciseOptions';

interface Exercise {
    name: string;
    muscleGroup: string;
}

interface Day {
    name: string;
    exercises: { muscleGroup: string, exercise: string | null }[];
}

interface Mesocycle {
    name: string;
    templateName: string;
    days: [string, { muscleGroup: string; exercise: string | null }[]][];
}

const dayOptions = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
];

const NewMesocycle: React.FC = () => {
    const { exercisesByMuscle } = useExerciseOptions();
    const [templates, setTemplates] = useState<{ label: string, value: string, days: Day[] }[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<{ label: string, value: string, days: Day[] } | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
    const [showCopyModal, setShowCopyModal] = useState<{ show: boolean, sourceDayIndex: number | null }>({ show: false, sourceDayIndex: null });
    const [copyTargetDayIndex, setCopyTargetDayIndex] = useState<number | null>(null);
    const [mesocycleName, setMesocycleName] = useState('New Mesocycle');
    const [isEditingName, setIsEditingName] = useState(false);
    const [templateName, setTemplateName] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch('/data/mesocycle-templates.json');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched templates:', data);
                    setTemplates(data);
                } else {
                    console.error('Failed to fetch templates.json', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        const savedTemplate = localStorage.getItem('selectedTemplate');
        const savedDays = localStorage.getItem('savedDays');
        if (savedTemplate) {
            const parsedTemplate = JSON.parse(savedTemplate);
            setSelectedTemplate(parsedTemplate);
            setTemplateName(parsedTemplate.label);
        }
        if (savedDays) {
            setDays(JSON.parse(savedDays));
        }
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            localStorage.setItem('savedDays', JSON.stringify(days));
            localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
        }
    }, [days, selectedTemplate]);

    const handleTemplateChange = (option: SingleValue<{ label: string, value: string, days: Day[] }>) => {
        if (option) {
            setSelectedTemplate(option);
            setTemplateName(option.label);
            setDays(option.days);
        }
    };

    const handleDayNameChange = (dayIndex: number, option: SingleValue<{ label: string, value: string }>) => {
        const newDays = days.map((day, i) => {
            if (i === dayIndex) {
                return { ...day, name: option?.value || day.name };
            }
            return day;
        });
        setDays(newDays);
    };

    const handleAddDay = () => {
        if (days.length >= 7) {
            alert("You can only have up to 7 days in a mesocycle.");
            return;
        }
        const newDay: Day = { name: `Day ${days.length + 1}`, exercises: [] };
        setDays([...days, newDay]);
    };

    const handleRemoveDay = (index: number) => {
        const newDays = days.filter((_, i) => i !== index);
        setDays(newDays);
    };

    const handleAddExercise = (dayIndex: number) => {
        setCurrentDayIndex(dayIndex);
        setShowModal(true);
    };

    const handleRemoveExercise = (dayIndex: number, exerciseIndex: number) => {
        const newDays = days.map((day, i) => {
            if (i === dayIndex) {
                return {
                    ...day,
                    exercises: day.exercises.filter((_, j) => j !== exerciseIndex)
                };
            }
            return day;
        });
        setDays(newDays);
    };

    const handleExerciseChange = (dayIndex: number, exerciseIndex: number, selectedExercise: SingleValue<{ value: string, label: string }>) => {
        const newDays = days.map((day, i) => {
            if (i === dayIndex) {
                const newExercises = day.exercises.map((exercise, j) => {
                    if (j === exerciseIndex) {
                        return { ...exercise, exercise: selectedExercise ? selectedExercise.value : null };
                    }
                    return exercise;
                });
                return { ...day, exercises: newExercises };
            }
            return day;
        });
        setDays(newDays);
    };

    const handleCreateMesocycle = () => {
        const mesocycle = new Map(days.map(day => [day.name, day.exercises]));
        const savedMesocycles = localStorage.getItem('mesocycles');
        const mesocycles = savedMesocycles ? JSON.parse(savedMesocycles) : [];
        mesocycles.push({ name: mesocycleName, templateName: selectedTemplate?.label, days: Array.from(mesocycle.entries()) });
        localStorage.setItem('mesocycles', JSON.stringify(mesocycles));
        alert('Mesocycle created and saved!');
        console.log("Mesocycle: ", mesocycle)
    };

    const handleCopyExercises = (sourceDayIndex: number, destinationDayIndex: number) => {
        const sourceExercises = days[sourceDayIndex].exercises;
        const newDays = days.map((day, i) => {
            if (i === destinationDayIndex) {
                return { ...day, exercises: [...sourceExercises] };
            }
            return day;
        });
        setDays(newDays);
        setShowCopyModal({ show: false, sourceDayIndex: null });
        setCopyTargetDayIndex(null);
    };

    const handleAddAndCopyExercises = (sourceDayIndex: number, targetDayName: string) => {
        const sourceExercises = days[sourceDayIndex].exercises;
        const newDay: Day = { name: targetDayName, exercises: [...sourceExercises] };
        setDays([...days, newDay]);
        setShowCopyModal({ show: false, sourceDayIndex: null });
        setCopyTargetDayIndex(null);
    };

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceDayIndex = parseInt(source.droppableId, 10);
        const destinationDayIndex = parseInt(destination.droppableId, 10);

        const sourceExercises = Array.from(days[sourceDayIndex].exercises);
        const [movedExercise] = sourceExercises.splice(source.index, 1);

        const newDays = Array.from(days);
        if (destination.droppableId === 'remove-exercise') {
            newDays[sourceDayIndex].exercises = sourceExercises;
        } else if (sourceDayIndex === destinationDayIndex) {
            sourceExercises.splice(destination.index, 0, movedExercise);
            newDays[sourceDayIndex].exercises = sourceExercises;
        } else {
            const destinationExercises = Array.from(days[destinationDayIndex].exercises);
            destinationExercises.splice(destination.index, 0, movedExercise);
            newDays[sourceDayIndex].exercises = sourceExercises;
            newDays[destinationDayIndex].exercises = destinationExercises;
        }

        setDays(newDays);
    };

    const getFilteredDayOptions = (currentDay: string) => {
        return dayOptions.filter(dayOption => !days.some(day => day.name === dayOption.value && day.name !== currentDay));
    };

    const handleMuscleGroupSelect = (option: SingleValue<{ value: string, label: string }>) => {
        if (currentDayIndex !== null && option) {
            const newDays = days.map((day, i) => {
                if (i === currentDayIndex) {
                    return {
                        ...day,
                        exercises: [...day.exercises, { muscleGroup: option.value, exercise: null }]
                    };
                }
                return day;
            });
            setDays(newDays);
            setShowModal(false);
        }
    };

    const sortedMuscleGroups = Object.keys(exercisesByMuscle).sort().map(muscle => ({ value: muscle, label: muscle }));

    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMesocycleName(e.target.value);
    };

    const handleNameBlur = () => {
        setIsEditingName(false);
        localStorage.setItem('mesocycleName', mesocycleName);
    };

    useEffect(() => {
        const savedName = localStorage.getItem('mesocycleName');
        if (savedName) {
            setMesocycleName(savedName);
        }
    }, []);

    const handleOpenCopyModal = (sourceDayIndex: number) => {
        setShowCopyModal({ show: true, sourceDayIndex });
    };

    const handleSelectCopyTargetDay = (option: SingleValue<{ label: string, value: string }>) => {
        const targetDayIndex = days.findIndex(day => day.name === option?.value);
        if (targetDayIndex !== -1) {
            setCopyTargetDayIndex(targetDayIndex);
        } else {
            setCopyTargetDayIndex(null);
            if (showCopyModal.sourceDayIndex !== null && option) {
                handleAddAndCopyExercises(showCopyModal.sourceDayIndex, option.value);
            }
        }
    };

    const handleConfirmCopy = () => {
        if (showCopyModal.sourceDayIndex !== null && copyTargetDayIndex !== null) {
            handleCopyExercises(showCopyModal.sourceDayIndex, copyTargetDayIndex);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={mesocycleName}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            autoFocus
                            className="text-2xl font-semibold text-black"
                        />
                    ) : (
                        <div className="flex items-center">
                            <h2
                                className="text-2xl font-semibold text-black cursor-pointer"
                                onClick={handleNameEdit}
                            >
                                {mesocycleName}
                            </h2>
                            <FaPen
                                className="ml-2 text-gray-600 cursor-pointer"
                                onClick={handleNameEdit}
                            />
                        </div>
                    )}
                </div>
                <div className="grid gap-1">
                    <button
                        className="bg-violet-950 text-white px-4 py-2 rounded uppercase"
                        onClick={handleCreateMesocycle}
                    >
                        Create Mesocycle
                    </button>
                    <button
                        className="bg-violet-950 text-white px-4 py-2 rounded uppercase"
                        onClick={handleAddDay}
                    >
                        + Add Day
                    </button>
                </div>
            </header>

            <div className="mb-4">
                <Select
                    options={templates}
                    onChange={handleTemplateChange}
                    placeholder="Choose a template"
                    className="text-black"
                    classNamePrefix="react-select"
                    value={selectedTemplate}
                />
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 auto-cols-fr">
                    {days.map((day, dayIndex) => (
                        <Droppable key={dayIndex} droppableId={`${dayIndex}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-white p-4 rounded shadow"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Select
                                            options={getFilteredDayOptions(day.name)}
                                            onChange={(option) => handleDayNameChange(dayIndex, option)}
                                            value={dayOptions.find(d => d.value === day.name)}
                                            className="text-black w-2/3"
                                            classNamePrefix="react-select"
                                        />
                                        <button
                                            className="text-gray-400 text-md"
                                            onClick={() => handleRemoveDay(dayIndex)}
                                        >
                                            <FaTrash />
                                        </button>
                                        <button
                                            className="text-blue-500 text-md"
                                            onClick={() => handleOpenCopyModal(dayIndex)}
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                    {day.exercises.map((exercise, exerciseIndex) => (
                                        <Draggable
                                            key={exerciseIndex}
                                            draggableId={`${dayIndex}-${exerciseIndex}`}
                                            index={exerciseIndex}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mb-2 p-2 border rounded"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-bold text-red-500">{exercise.muscleGroup.toUpperCase()}</span>
                                                    </div>
                                                    <Select
                                                        options={exercisesByMuscle[exercise.muscleGroup]?.map(ex => ({ value: ex.name, label: ex.name })) || []}
                                                        onChange={(option) => handleExerciseChange(dayIndex, exerciseIndex, option)}
                                                        placeholder="Choose an exercise"
                                                        className="text-black mt-2"
                                                        classNamePrefix="react-select"
                                                        value={exercise.exercise ? { value: exercise.exercise, label: exercise.exercise } : null}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                                        onClick={() => handleAddExercise(dayIndex)}
                                    >
                                        Add Exercise
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                        <h3 className="text-xl mb-4">Select Muscle Group</h3>
                        <Select
                            options={sortedMuscleGroups}
                            onChange={handleMuscleGroupSelect}
                            placeholder="Choose a muscle group"
                            className="text-black"
                            classNamePrefix="react-select"
                        />
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showCopyModal.show && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md w-1/3">
                        <h3 className="text-xl mb-4">Select Target Day</h3>
                        <Select
                            options={dayOptions.filter(day => !days.some(d => d.name === day.value))}
                            onChange={handleSelectCopyTargetDay}
                            placeholder="Choose a day"
                            className="text-black"
                            classNamePrefix="react-select"
                        />
                        <button
                            className="bg-violet-950 text-white px-4 py-2 rounded mt-4 uppercase"
                            onClick={handleConfirmCopy}
                        >
                            Copy
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-2 uppercase"
                            onClick={() => setShowCopyModal({ show: false, sourceDayIndex: null })}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewMesocycle;