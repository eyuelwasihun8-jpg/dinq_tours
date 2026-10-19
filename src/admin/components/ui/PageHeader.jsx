import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({ title, subtitle, backTo, actions }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        {backTo && (
          <Link to={backTo} className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-[#C88A2E] mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">{title}</h1>
        {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}