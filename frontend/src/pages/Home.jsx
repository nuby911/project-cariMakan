import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FoodGrid from '../components/FoodGrid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Debouncing search query to avoid spamming the backend API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch meals from local Express backend
  useEffect(() => {
    let isMounted = true;
    
    async function fetchMeals() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(
          `/api/meals?s=${encodeURIComponent(debouncedQuery)}`
        );
        if (!response.ok) {
          throw new Error('Backend server response error');
        }
        const data = await response.json();
        
        if (isMounted) {
          setMeals(data.meals || []);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
          console.error('Fetch meals error:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMeals();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-3 max-w-3xl mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
          Pemesanan Makanan Kantin Kampus
        </h1>
        <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-semibold">
          Panduan Kuliner Kampus Temukan Pilihan Menu Favorit Anda Sebelum Ke Kantin
        </p>
      </section>

      {/* Search Section */}
      <section className="space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={handleClear} />
      </section>

      {/* Grid Results Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-4">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <span>Pilihan Menu</span>
            {searchQuery && (
              <span className="text-[11px] font-normal text-slate-400">
                (Hasil &ldquo;{searchQuery}&rdquo;)
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {!isLoading && meals ? `${meals.length} menu` : 'Memuat...'}
          </span>
        </div>

        <FoodGrid meals={meals} isLoading={isLoading} isError={isError} />
      </section>
    </div>
  );
}
