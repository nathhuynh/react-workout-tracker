import React, { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomExerciseModalProps {
  isFormVisible: boolean;
  setIsFormVisible: (isVisible: boolean) => void;
  selectedExercise: any | null;
  handleSave: (exerciseData: any) => Promise<void>;
  handleUpdate: (id: string, exerciseData: any) => Promise<void>;
  equipmentTypes: string[];
  muscleOptions: string[];
  categories: string[];
}

const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({
  isFormVisible,
  setIsFormVisible,
  selectedExercise,
  handleSave,
  handleUpdate,
  equipmentTypes,
  muscleOptions,
  categories
}) => {
  const [name, setName] = useState('');
  const [equipmentType, setEquipmentType] = useState<SingleValue<SelectOption>>(null);
  const [primaryMuscles, setPrimaryMuscles] = useState<MultiValue<SelectOption>>([]);
  const [category, setCategory] = useState<SingleValue<SelectOption>>(null);

  useEffect(() => {
    if (selectedExercise) {
      setName(selectedExercise.name);
      setEquipmentType({ value: selectedExercise.equipment, label: selectedExercise.equipment });
      setPrimaryMuscles(selectedExercise.primaryMuscles.map((muscle: string) => ({ value: muscle, label: muscle })));
      setCategory({ value: selectedExercise.category, label: selectedExercise.category });
    } else {
      resetForm();
    }
  }, [selectedExercise]);

  const resetForm = () => {
    setName('');
    setEquipmentType(null);
    setPrimaryMuscles([]);
    setCategory(null);
  };

  const handleSubmit = async () => {
    const exerciseData = {
      name,
      equipment: equipmentType?.value || 'N/A',
      primaryMuscles: primaryMuscles.map(muscle => muscle.value),
      category: category?.value || 'N/A',
    };

    if (selectedExercise) {
      await handleUpdate(selectedExercise.id, exerciseData);
    } else {
      await handleSave(exerciseData);
    }

    resetForm();
    setIsFormVisible(false);
  };

  const selectOptions = (options: string[]): SelectOption[] => 
    options.map(option => ({ value: option, label: option }));

  if (!isFormVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">
              {selectedExercise ? 'Edit Exercise' : 'Create Custom Exercise'}
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="exercise-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="exercise-name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter exercise name"
              />
            </div>

            <div>
              <label htmlFor="equipment-type" className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
              <Select
                id="equipment-type"
                options={selectOptions(equipmentTypes)}
                value={equipmentType}
                onChange={setEquipmentType}
                placeholder="Choose equipment"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label htmlFor="primary-muscles" className="block text-sm font-medium text-gray-700 mb-1">Muscles</label>
              <Select
                id="primary-muscles"
                options={selectOptions(muscleOptions)}
                value={primaryMuscles}
                isMulti
                onChange={setPrimaryMuscles}
                placeholder="Choose muscles worked"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select
                id="category"
                options={selectOptions(categories)}
                value={category}
                onChange={setCategory}
                placeholder="Choose exercise category"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              onClick={() => {
                resetForm();
                setIsFormVisible(false);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={handleSubmit}
            >
              {selectedExercise ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomExerciseModal;