import React from 'react';

export function Input({ label, error, hint, required, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]'
        }`}
      />
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, hint, required, rows = 4, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        {...props}
        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all font-light leading-relaxed ${
          error ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]'
        }`}
      />
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}

export function Select({ label, error, hint, required, options = [], ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
          error ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-[#C88A2E]/30 focus:border-[#C88A2E]'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}