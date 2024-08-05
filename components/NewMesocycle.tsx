import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select, { SingleValue } from 'react-select';
import 'react-dropdown/style.css';
import '../styles/DotDropdownMenu.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaPen, FaCopy, FaEllipsisV } from 'react-icons/fa';
import { useExerciseOptions } from '../utils/useExerciseOptions';
import Dropdown from 'react-dropdown';
import '../styles/globals.css';
import SelectMuscleGroupModal from '../components/SelectMuscleGroupModal';
import CopyExercisesModal from '../components/CopyExercisesModal';
import SelectTemplateModal from '../components/SelectTemplateModal';

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

const dropdownOptions = [
    { value: 'addDay', label: 'Add Day' },
    { value: 'selectTemplate', label: 'Select Template' },
    { value: 'resetTemplate', label: 'Reset Template' },
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
    const [showDropdownModal, setShowDropdownModal] = useState(false);
    const [dropdownModalContent, setDropdownModalContent] = useState<string | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
    const [tempSelectedTemplate, setTempSelectedTemplate] = useState<{ label: string, value: string, days: Day[] } | null>(null);
    const router = useRouter();

    const CustomControl = () => {
        return (
            <div className="w-[40px] justify-center flex items-center cursor-pointer pl-5">
                <i className="fas fa-ellipsis-v"></i>
            </div>
        );
    };

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
            setTempSelectedTemplate(option);
        }
    };

    const handleConfirmTemplate = () => {
        if (tempSelectedTemplate) {
            setSelectedTemplate(tempSelectedTemplate);
            setTemplateName(tempSelectedTemplate.label);
            setDays(tempSelectedTemplate.days);
            setShowDropdownModal(false);
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
        console.log("Mesocycle: ", mesocycle);
        router.push('/mesocycles');
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

    const resetTemplate = () => {
        const newDays = days.map(day => ({
            ...day,
            exercises: day.exercises.map(exercise => ({ ...exercise, exercise: null }))
        }));
        setDays(newDays);
        setSelectedTemplate(null);
        setTemplateName('');
        setDropdownModalContent(null);
    };

    const handleDropdownSelect = (option: any) => {
        setDropdownVisible(null);
        switch (option?.value) {
            case 'addDay':
                handleAddDay();
                break;
            case 'selectTemplate':
                setDropdownModalContent('selectTemplate');
                setShowDropdownModal(true);
                break;
            case 'resetTemplate':
                resetTemplate();
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-100">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
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
                <div className="flex items-center">
                    <Dropdown
                        options={dropdownOptions}
                        onChange={(option) => handleDropdownSelect(option)}
                        placeholder=""
                        className="dropdown"
                        controlClassName="dropdown-control custom-control"
                        menuClassName="dropdown-menu"
                        arrowClosed={<CustomControl />}
                        arrowOpen={<CustomControl />}
                    />
                </div>
            </header>

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
                                            className="text-violet-700 text-md"
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

            <SelectMuscleGroupModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSelect={handleMuscleGroupSelect}
                muscleGroups={sortedMuscleGroups}
            />

            <CopyExercisesModal
                isOpen={showCopyModal.show}
                onClose={() => setShowCopyModal({ show: false, sourceDayIndex: null })}
                onCopy={handleConfirmCopy}
                onSelectTargetDay={handleSelectCopyTargetDay}
                dayOptions={dayOptions.filter(day => !days.some(d => d.name === day.value))}
                selectedDay={
                    copyTargetDayIndex !== null
                        ? { label: days[copyTargetDayIndex].name, value: days[copyTargetDayIndex].name }
                        : null
                }
            />

            <SelectTemplateModal
                isOpen={showDropdownModal && dropdownModalContent === 'selectTemplate'}
                onClose={() => setShowDropdownModal(false)}
                templates={templates}
                onSelectTemplate={handleTemplateChange}
                selectedTemplate={tempSelectedTemplate}
                onConfirm={handleConfirmTemplate}
            />

            <div className="flex justify-end p-6 pr-0">
                <button
                    className="bg-gray-300 text-black uppercase font-bold px-4 py-2"
                    onClick={handleCreateMesocycle}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default NewMesocycle;