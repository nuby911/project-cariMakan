import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group">
        {/* Soft shadow expansion on focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-5 group-focus-within:opacity-15 transition duration-300"></div>
        
        {/* Input Container */}
        <div className="relative flex items-center bg-white border border-slate-200 rounded-full pl-6 pr-2.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cari makanan favoritmu..."
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-sm font-medium pr-2"
          />

          {value && (
            <button
              onClick={onClear}
              className="text-slate-400 hover:text-slate-600 p-1.5 mr-1.5 active:scale-90"
              type="button"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Circle Blue Search Button inside input */}
          <button
            type="button"
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors active:scale-95 shadow shadow-blue-500/15"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
