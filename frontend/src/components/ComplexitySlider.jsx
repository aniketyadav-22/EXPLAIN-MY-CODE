import { useState } from 'react';

export default function ComplexitySlider({ level, onChange, disabled }) {
  const levels = [
    { value: 'beginner', label: 'Beginner 👶', description: 'Like I\'m 5' },
    { value: 'intermediate', label: 'Intermediate 👨‍💻', description: 'Junior Dev' },
    { value: 'expert', label: 'Expert 🧠', description: 'Code Review' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Complexity Level
      </label>
      
      <div className="space-y-3">
        {levels.map((lv) => (
          <label key={lv.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="level"
              value={lv.value}
              checked={level === lv.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="font-medium text-gray-900">{lv.label}</span>
              <p className="text-xs text-gray-600">{lv.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
