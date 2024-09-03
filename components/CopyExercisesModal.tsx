import React from 'react';
import Select, { SingleValue } from 'react-select';

interface CopyExercisesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
  onSelectTargetDay: (option: SingleValue<{ label: string, value: string }>) => void;
  dayOptions: { label: string, value: string }[];
  selectedDay: SingleValue<{ label: string, value: string }>;
}

const CopyExercisesModal: React.FC<CopyExercisesModalProps> = ({ 
  isOpen, 
  onClose, 
  onCopy, 
  onSelectTargetDay, 
  dayOptions, 
  selectedDay 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Copy Exercises</h4>
          </div>

          <p className="text-sm text-gray-600 mb-4">Select the target day to copy exercises to:</p>
          
          <Select
            options={dayOptions}
            onChange={onSelectTargetDay}
            placeholder="Choose a day"
            className="react-select-container mb-4"
            classNamePrefix="react-select"
            value={selectedDay}
          />

          <div className="mt-6 flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              onClick={onCopy}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyExercisesModal;