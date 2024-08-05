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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Select Muscle Group</h2>
        <p className="mb-4">Choose a muscle group to add an exercise:</p>
        <Select
          options={muscleGroups}
          onChange={onSelect}
          placeholder="Choose a muscle group"
          className="text-black mb-4"
          classNamePrefix="react-select"
        />
        <div className="flex justify-end mt-4 pt-4">
          <button
            className="text-black px-4 py-2 rounded font-bold"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectMuscleGroupModal;