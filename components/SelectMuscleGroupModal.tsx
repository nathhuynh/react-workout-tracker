import React from 'react';
import Select, { SingleValue } from 'react-select';

interface SelectMuscleGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: SingleValue<{ value: string, label: string }>) => void;
  muscleGroups: { value: string, label: string }[];
}

const SelectMuscleGroupModal: React.FC<SelectMuscleGroupModalProps> = ({ isOpen, onClose, onSelect, muscleGroups }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Select Muscle Group</h4>
          </div>

          <p className="text-sm text-gray-600 mb-4">Choose a muscle group to add an exercise:</p>
          
          <Select
            options={muscleGroups}
            onChange={onSelect}
            placeholder="Choose a muscle group"
            className="react-select-container mb-4"
            classNamePrefix="react-select"
          />

          <div className="mt-6 flex justify-start space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectMuscleGroupModal;