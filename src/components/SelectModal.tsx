import { X } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function SelectModal({ isOpen, onClose, title, options, selectedValue, onSelect }: SelectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/50 transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                onClose();
              }}
              className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                selectedValue === option.value
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              }`}
            >
              <span className="font-medium">{option.label}</span>
              {selectedValue === option.value && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}