import React from 'react';
import FoodCard from './FoodCard';
import { AlertTriangle, SearchX } from 'lucide-react';

export default function FoodGrid({ meals, isLoading, isError }) {
  
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

  // Render content
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-4">
      {meals.map((meal) => (
        <FoodCard key={meal.idMeal} meal={meal} />
      ))}
    </div>
  );
}
