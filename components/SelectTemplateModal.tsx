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

const SelectTemplateModal: React.FC<SelectTemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  templates, 
  onSelectTemplate, 
  selectedTemplate, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Select Template</h4>
          </div>

          <Select
            options={templates}
            onChange={onSelectTemplate}
            placeholder="Choose a template"
            className="react-select-container mb-4"
            classNamePrefix="react-select"
            value={selectedTemplate}
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
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplateModal;