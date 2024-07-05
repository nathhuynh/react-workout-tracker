import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import '../styles/DotDropdownMenu.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash } from 'react-icons/fa';

interface Exercise {
    name: string;
    muscleGroup: string;
}

interface Day {
    name: string;
    exercises: { muscleGroup: string, exercise: string | null }[];
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

const templates = [
    {
        label: 'Push/Pull/Legs',
        value: 'push-pull-legs',
        days: [
            {
                name: 'Monday',
                exercises: [
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Triceps', exercise: null },
                    { muscleGroup: 'Triceps', exercise: null },
                    { muscleGroup: 'Shoulders', exercise: null },
                ],
            },
            {
                name: 'Tuesday',
                exercises: [
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Biceps', exercise: null },
                    { muscleGroup: 'Biceps', exercise: null },
                ],
            },
            {
                name: 'Wednesday',
                exercises: [
                    { muscleGroup: 'Hamstrings', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Calves', exercise: null },
                ],
            },
            {
                name: 'Thursday',
                exercises: [
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Chest', exercise: null },
                    { muscleGroup: 'Triceps', exercise: null },
                    { muscleGroup: 'Triceps', exercise: null },
                    { muscleGroup: 'Shoulders', exercise: null },
                ],
            },
            {
                name: 'Friday',
                exercises: [
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Back', exercise: null },
                    { muscleGroup: 'Biceps', exercise: null },
                    { muscleGroup: 'Biceps', exercise: null },
                ],
            },
            {
                name: 'Saturday',
                exercises: [
                    { muscleGroup: 'Hamstrings', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Quads', exercise: null },
                    { muscleGroup: 'Calves', exercise: null },
                ],
            },
        ],
    },
];

const NewMesocycle: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<{ label: string, value: string, days: Day[] } | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        // Fetch exercises from the API or local storage
        const fetchExercises = async () => {
            // Assuming fetchExercises() returns an array of exercises
            const data = await fetch('/api/exercises').then(res => res.json());
            setExercises(data);
        };

        fetchExercises();

        // Load template and days from localStorage
        const savedTemplate = localStorage.getItem('selectedTemplate');
        const savedDays = localStorage.getItem('savedDays');
        if (savedTemplate) {
            setSelectedTemplate(JSON.parse(savedTemplate));
        }
        if (savedDays) {
            setDays(JSON.parse(savedDays));
        }
    }, []);

    useEffect(() => {
        // Save days and selected template to localStorage whenever days or template state changes
        if (selectedTemplate) {
            localStorage.setItem('savedDays', JSON.stringify(days));
            localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
        }
    }, [days, selectedTemplate]);

    const handleTemplateChange = (option: SingleValue<{ label: string, value: string, days: Day[] }>) => {
        if (option) {
            setSelectedTemplate(option);
            setDays(option.days); // Initialize days from template
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
        const newDays = days.map((day, i) => {
            if (i === dayIndex) {
                return {
                    ...day,
                    exercises: [...day.exercises, { muscleGroup: '', exercise: null }]
                };
            }
            return day;
        });
        setDays(newDays);
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
        localStorage.setItem('mesocycle', JSON.stringify(Array.from(mesocycle.entries())));
        alert('Mesocycle created and saved!');
    };

    const onDragEnd = (result: any) => {
        const { source, destination } = result;

        // If dropped outside the list
        if (!destination) {
            return;
        }

        // If dropped in the same place
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const sourceDayIndex = parseInt(source.droppableId, 10);
        const destinationDayIndex = parseInt(destination.droppableId, 10);

        const sourceExercises = Array.from(days[sourceDayIndex].exercises);
        const [movedExercise] = sourceExercises.splice(source.index, 1);

        const newDays = Array.from(days);
        if (destination.droppableId === 'remove-exercise') {
            // Removing the exercise
            newDays[sourceDayIndex].exercises = sourceExercises;
        } else if (sourceDayIndex === destinationDayIndex) {
            // Moving within the same day
            sourceExercises.splice(destination.index, 0, movedExercise);
            newDays[sourceDayIndex].exercises = sourceExercises;
        } else {
            // Moving to a different day
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

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">New Mesocycle</h2>
                <button
                    className="bg-violet-950 text-white px-4 py-2 rounded"
                    onClick={handleCreateMesocycle}
                >
                    Create Mesocycle
                </button>
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
                                                        {/* Remove the trash icon from here */}
                                                    </div>
                                                    <Select
                                                        options={exercises.filter(ex => ex.muscleGroup.toLowerCase() === exercise.muscleGroup.toLowerCase()).map(ex => ({ value: ex.name, label: ex.name }))}
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
                                    {/* Add the Remove Exercise box here */}
                                    <Droppable droppableId="remove-exercise">
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="bg-red-500 text-white px-2 py-1 rounded mt-4 text-center"
                                            >
                                                Remove Exercise
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={handleAddDay}
            >
                Add Day
            </button>
        </div>
    );
};

export default NewMesocycle;