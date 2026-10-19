import React from 'react';

export default function Card({ children, className = '', title, description }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 shadow-sm p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-5 pb-4 border-b border-stone-100">
          {title && <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>}
          {description && <p className="text-xs text-stone-500 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}