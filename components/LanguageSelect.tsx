
import React from 'react';
import { Language } from '../types';

interface Props {
  value: Language;
  onChange: (value: Language) => void;
}

const LanguageSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Language / اللغة</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="block w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {Object.values(Language).map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelect;
