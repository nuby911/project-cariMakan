import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Utensils } from 'lucide-react';

export default function RestoList() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch('/api/restaurants');
        if (!response.ok) {
          throw new Error('Gagal mengambil daftar kantin');
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Fetch restaurants error:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 space-y-8 bg-slate-50">
        <div className="space-y-3 max-w-3xl mx-auto text-center">
          <div className="h-8 w-64 skeleton-shimmer bg-white rounded mx-auto animate-pulse"></div>
          <div className="h-4 w-96 skeleton-shimmer bg-white rounded mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row gap-6 animate-pulse">
              <div className="md:w-2/5 aspect-[4/3] md:aspect-auto bg-slate-100 rounded-xl"></div>
              <div className="md:w-3/5 flex-grow space-y-3 py-2">
                <div className="h-5 bg-slate-100 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-slate-150 rounded-2xl shadow-sm mt-12">
        <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-900 mb-2">Gagal Memuat Daftar Kantin</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Terjadi kesalahan saat menghubungi server. Pastikan server backend Anda berjalan.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary inline-flex text-xs font-bold py-2 px-4 bg-blue-600 text-white rounded-xl"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-12">
      {/* Header Section */}
      <section className="text-center space-y-3 max-w-3xl mx-auto py-4">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
          Daftar Kantin Kampus
        </h1>
        <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto leading-relaxed font-medium">
          Temukan kantin terdekat di fakultas Anda dan nikmati menu kuliner khas yang higienis serta bersahabat bagi mahasiswa.
        </p>
      </section>

      {/* Grid Kantin */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {restaurants.map((resto) => (
            <article 
              key={resto.id} 
              className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="md:w-2/5 aspect-[4/3] md:aspect-auto relative bg-slate-100 overflow-hidden">
                <img 
                  src={resto.image} 
                  alt={resto.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Info Body */}
              <div className="p-6 flex flex-col justify-between flex-grow md:w-3/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight">
                      {resto.name}
                    </h2>
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{resto.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{resto.location}</span>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-3">
                    {resto.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {resto.areas.slice(0, 2).map((area) => (
                      <span 
                        key={area} 
                        className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                      >
                        {area}
                      </span>
                    ))}
                    {resto.areas.length > 2 && (
                      <span className="text-[9px] font-extrabold bg-slate-50 text-slate-500 px-2 py-0.5 rounded">
                        +{resto.areas.length - 2}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/restaurant/${resto.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                  >
                    <span>Kunjungi</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
