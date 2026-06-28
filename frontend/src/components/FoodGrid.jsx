import React, { useState, useEffect } from 'react';
import FoodCard from './FoodCard';
import { AlertTriangle, SearchX, ChevronDown } from 'lucide-react';

export default function FoodGrid({ meals, isLoading, isError }) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth >= 768 ? 30 : 20);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync visibleCount with screen size adjustments when the user has not loaded more yet
  useEffect(() => {
    const defaultMobile = 20;
    const defaultDesktop = 30;
    if (isDesktop && visibleCount === defaultMobile) {
      setVisibleCount(defaultDesktop);
    } else if (!isDesktop && visibleCount === defaultDesktop) {
      setVisibleCount(defaultMobile);
    }
  }, [isDesktop]);

  // Reset limit when meals data changes (new searches or changing canteens)
  useEffect(() => {
    setVisibleCount(isDesktop ? 30 : 20);
  }, [meals, isDesktop]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + (isDesktop ? 30 : 20));
  };

  // Render skeleton loading cards in Light Theme
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card flex flex-col h-full overflow-hidden bg-white border-slate-100">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] w-full skeleton-shimmer bg-slate-100"></div>
            
            {/* Info Skeleton */}
            <div className="p-4 flex flex-col flex-grow gap-2.5">
              {/* Title skeleton */}
              <div className="h-4.5 w-3/4 skeleton-shimmer bg-slate-100 rounded"></div>
              
              {/* Merchant/Rating skeleton */}
              <div className="flex justify-between items-center mt-1">
                <div className="h-3 w-1/3 skeleton-shimmer bg-slate-100 rounded"></div>
                <div className="h-3 w-12 skeleton-shimmer bg-slate-100 rounded"></div>
              </div>
              
              {/* Price skeleton */}
              <div className="h-4 w-1/4 skeleton-shimmer bg-slate-100 rounded mt-2"></div>
              
              {/* Button skeleton */}
              <div className="h-10 w-full skeleton-shimmer bg-slate-100 rounded-xl mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-red-150 rounded-2xl max-w-xl mx-auto my-8 shadow-sm">
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Gagal Memuat Data</h3>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Terjadi kesalahan saat menghubungi server API. Periksa koneksi jaringan Anda dan coba lagi.
        </p>
      </div>
    );
  }

  // Render empty state
  if (!meals || meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-slate-150 rounded-2xl max-w-xl mx-auto my-8 shadow-sm">
        <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4 border border-slate-100">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Makanan Tidak Ditemukan</h3>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Kami tidak menemukan menu yang sesuai dengan kata kunci pencarian Anda. Silakan coba kategori atau kata kunci lain.
        </p>
      </div>
    );
  }

  const visibleMeals = meals.slice(0, visibleCount);
  const hasMore = meals.length > visibleCount;

  // Render content
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-4">
        {visibleMeals.map((meal) => (
          <FoodCard key={meal.idMeal} meal={meal} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={handleShowMore}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-500 hover:bg-slate-50 transition-all duration-300 font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] group"
          >
            <span>Tampilkan Lebih Banyak</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-y-0.5 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
}

