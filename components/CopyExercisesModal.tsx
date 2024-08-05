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

const CopyExercisesModal: React.FC<CopyExercisesModalProps> = ({ isOpen, onClose, onCopy, onSelectTargetDay, dayOptions, selectedDay }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Copy Exercises</h2>
        <p className="mb-4">Select the target day to copy exercises to:</p>
        <Select
          options={dayOptions}
          onChange={onSelectTargetDay}
          placeholder="Choose a day"
          className="text-black mb-4"
          classNamePrefix="react-select"
          value={selectedDay}
        />
        <div className="flex justify-end mt-4 pt-4">
          <button
            className="text-black px-4 py-2 rounded font-bold mr-2"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyExercisesModal;