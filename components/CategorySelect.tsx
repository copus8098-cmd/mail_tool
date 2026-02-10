
import React from 'react';
import { Category } from '../types';

interface Props {
  value: Category;
  onChange: (value: Category) => void;
}

const CategorySelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">Category / التصنيف</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Category)}
        className="block w-full rounded-lg border-slate-200 bg-white px-4 py-2.5 text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {Object.values(Category).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
