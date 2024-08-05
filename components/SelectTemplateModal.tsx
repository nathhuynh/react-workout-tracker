import React from 'react';
import Select, { SingleValue } from 'react-select';

interface Template {
  label: string;
  value: string;
  days: Day[];
}

interface Day {
  name: string;
  exercises: { muscleGroup: string, exercise: string | null }[];
}

interface SelectTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelectTemplate: (option: SingleValue<Template>) => void;
  selectedTemplate: SingleValue<Template>;
  onConfirm: () => void;
}

const SelectTemplateModal: React.FC<SelectTemplateModalProps> = ({ isOpen, onClose, templates, onSelectTemplate, selectedTemplate, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Select Template</h2>
        <Select
          options={templates}
          onChange={onSelectTemplate}
          placeholder="Choose a template"
          className="text-black mb-4"
          classNamePrefix="react-select"
          value={selectedTemplate}
        />
        <div className="flex justify-end mt-4 pt-4">
          <button
            className="text-black px-4 py-2 rounded font-bold mr-2"
            onClick={onClose}
          >
            CLOSE
          </button>
          <button
            className="text-black px-4 py-2 rounded font-bold"
            onClick={onConfirm}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplateModal;