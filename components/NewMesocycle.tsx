import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Select, { SingleValue } from 'react-select';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaPen, FaCopy, FaEllipsisV, FaPlus, FaDumbbell } from 'react-icons/fa';
import { useExerciseOptions } from '../utils/useExerciseOptions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import SelectMuscleGroupModal from '../components/SelectMuscleGroupModal';
import CopyExercisesModal from '../components/CopyExercisesModal';
import SelectTemplateModal from '../components/SelectTemplateModal';
import { fetchMesocycleTemplates, createMesocycle, MesocycleData } from '../pages/api/mesocycleRoutes';

interface Day {
  name: string;
  exercises: { muscleGroup: string; exercise: string | null }[];
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
  const [templates, setTemplates] = useState<{ label: string; value: string; days: Day[] }[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<{ label: string; value: string; days: Day[] } | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [showCopyModal, setShowCopyModal] = useState<{ show: boolean; sourceDayIndex: number | null }>({
    show: false,
    sourceDayIndex: null,
  });
  const [copyTargetDayIndex, setCopyTargetDayIndex] = useState<number | null>(null);
  const [mesocycleName, setMesocycleName] = useState('New Mesocycle');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showDropdownModal, setShowDropdownModal] = useState(false);
  const [dropdownModalContent, setDropdownModalContent] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const [tempSelectedTemplate, setTempSelectedTemplate] = useState<{ label: string, value: string, days: Day[] } | null>(null);
  const [tempCopyTargetDay, setTempCopyTargetDay] = useState<{ label: string; value: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/data/mesocycle-templates.json'); // TODO: Load JSON into database
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
      setShowTemplateModal(false);
      setTempSelectedTemplate(null);
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

  const handleCreateMesocycle = async () => {
    const hasEmptyExercises = days.some(day =>
      day.exercises.some(exercise => !exercise.exercise)
    );

    if (hasEmptyExercises) {
      alert("Please fill in all exercise fields before creating the mesocycle.");
      return;
    }

    try {
      const mesocycleData: MesocycleData = {
        name: mesocycleName,
        templateName: selectedTemplate?.label ?? null,
        days: days.map(day => ({
          name: day.name,
          exercises: day.exercises.map(exercise => {
            const muscleExercises = exercisesByMuscle[exercise.muscleGroup] || [];
            const foundExercise = muscleExercises.find(e => e.name === exercise.exercise);

            return {
              muscleGroup: exercise.muscleGroup,
              exerciseId: foundExercise?.id ?? null,
            };
          }),
        })),
      };

      console.log('Sending mesocycle data:', mesocycleData);
      const createdMesocycle = await createMesocycle(mesocycleData);
      console.log('Mesocycle created:', createdMesocycle);
      router.push('/mesocycles');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to create mesocycle:', error.message);

        if (axios.isAxiosError(error) && error.response) {
          console.error('Error response:', error.response.data);
          alert(`An error occurred: ${error.response.data.error || 'Unknown error'}`);
        } else {
          alert(`An error occurred: ${error.message}`);
        }
      } else {
        console.error('An unknown error occurred');
        alert('An unknown error occurred. Please try again.');
      }
    }
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
    if (option) {
      setTempCopyTargetDay(option);
    }
  };

  const handleConfirmCopy = () => {
    if (showCopyModal.sourceDayIndex !== null && tempCopyTargetDay) {
      const targetDayIndex = days.findIndex(day => day.name === tempCopyTargetDay.value);
      if (targetDayIndex !== -1) {
        handleCopyExercises(showCopyModal.sourceDayIndex, targetDayIndex);
      } else {
        handleAddAndCopyExercises(showCopyModal.sourceDayIndex, tempCopyTargetDay.value);
      }
      setShowCopyModal({ show: false, sourceDayIndex: null });
      setTempCopyTargetDay(null);
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
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {isEditingName ? (
              <Input
                value={mesocycleName}
                onChange={(e) => setMesocycleName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className="text-3xl font-bold text-gray-800"
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                {mesocycleName}
                <FaPen
                  className="ml-3 text-gray-500 cursor-pointer text-xl"
                  onClick={() => setIsEditingName(true)}
                />
              </h2>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="">
                <FaEllipsisV className="mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={handleAddDay}>
                <FaPlus className="mr-2" /> Add Day
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowTemplateModal(true)}>
                <FaDumbbell className="mr-2" /> Select Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={resetTemplate}>
                Reset Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {days.map((day, dayIndex) => (
              <Droppable key={dayIndex} droppableId={`${dayIndex}`}>
                {(provided) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <Select
                          options={getFilteredDayOptions(day.name)}
                          onChange={(option) => handleDayNameChange(dayIndex, option)}
                          value={dayOptions.find((d) => d.value === day.name)}
                          className="w-2/3"
                          classNamePrefix="react-select"
                        />
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenCopyModal(dayIndex)}
                          >
                            <FaCopy />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveDay(dayIndex)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
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
                              className="mb-2 p-2 border rounded bg-gray-50"
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-indigo-600">
                                  {exercise.muscleGroup.toUpperCase()}
                                </span>
                              </div>
                              <Select
                                options={
                                  exercisesByMuscle[exercise.muscleGroup]?.map((ex) => ({
                                    value: ex.name,
                                    label: ex.name,
                                  })) || []
                                }
                                onChange={(option) => handleExerciseChange(dayIndex, exerciseIndex, option)}
                                placeholder="Select exercise"
                                className="text-black mt-2"
                                classNamePrefix="react-select"
                                value={
                                  exercise.exercise
                                    ? { value: exercise.exercise, label: exercise.exercise }
                                    : null
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    <div className="px-6 py-4">
                      <Button
                        variant="outline"
                        className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition duration-300"
                        onClick={() => handleAddExercise(dayIndex)}
                      >
                        Add Exercise
                      </Button>
                    </div>
                  </Card>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {days.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
            <FaDumbbell className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No days added to your mesocycle</p>
            <Button
              className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300"
              onClick={handleAddDay}
            >
              Add Your First Day
            </Button>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleCreateMesocycle}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Create Mesocycle
          </Button>
        </div>
      </main>

      <SelectMuscleGroupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleMuscleGroupSelect}
        muscleGroups={sortedMuscleGroups}
      />

      <SelectTemplateModal
        isOpen={showTemplateModal}
        onClose={() => {
          setShowTemplateModal(false);
          setTempSelectedTemplate(null);
        }}
        templates={templates}
        onSelectTemplate={handleTemplateChange}
        selectedTemplate={tempSelectedTemplate}
        onConfirm={handleConfirmTemplate}
      />

      <CopyExercisesModal
        isOpen={showCopyModal.show}
        onClose={() => {
          setShowCopyModal({ show: false, sourceDayIndex: null });
          setTempCopyTargetDay(null);
        }}
        onCopy={handleConfirmCopy}
        onSelectTargetDay={handleSelectCopyTargetDay}
        dayOptions={dayOptions.filter((day) => !days.some((d) => d.name === day.value))}
        selectedDay={tempCopyTargetDay}
      />
    </div>
  );
};

export default NewMesocycle;
