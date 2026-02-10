
import React from 'react';
import { Tone } from '../types';

interface Props {
  value: Tone;
  onChange: (value: Tone) => void;
}

const ToneSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Tone / النبرة</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Tone)}
        className="block w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {Object.values(Tone).map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ToneSelect;
