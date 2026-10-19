import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ children, variant = 'primary', loading, icon: Icon, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#C88A2E] hover:bg-[#b57a24] text-white shadow-md',
    secondary: 'bg-stone-100 hover:bg-stone-200 text-stone-900',
    outline: 'border-2 border-stone-300 hover:border-[#C88A2E] text-stone-700 hover:text-[#C88A2E] bg-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md',
    ghost: 'text-stone-600 hover:text-[#C88A2E] hover:bg-stone-100',
  };

  return (
    <button className={`${base} ${variants[variant]}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
}