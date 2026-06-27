import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ArrowLeft, Utensils } from 'lucide-react';
import FoodGrid from '../components/FoodGrid';

export default function RestoDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [meals, setMeals] = useState([]);
  const [isLoadingResto, setIsLoadingResto] = useState(true);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [isError, setIsError] = useState(false);

  // Fetch canteen profile details
  useEffect(() => {
    async function fetchRestoDetail() {
      setIsLoadingResto(true);
      setIsError(false);
      try {
        const response = await fetch(`http://localhost:5000/api/restaurants/${id}`);
        if (!response.ok) {
          throw new Error('Gagal memuat profil kantin');
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        console.error('Fetch restaurant error:', err);
        setIsError(true);
      } finally {
        setIsLoadingResto(false);
      }
    }
    fetchRestoDetail();
  }, [id]);

  // Fetch canteen meals dynamically based on areas
  useEffect(() => {
    async function fetchRestoMeals() {
      setIsLoadingMeals(true);
      try {
        const response = await fetch(`http://localhost:5000/api/restaurants/${id}/meals`);
        if (!response.ok) {
          throw new Error('Gagal memuat menu kantin');
        }
        const data = await response.json();
        setMeals(data.meals || []);
      } catch (err) {
        console.error('Fetch meals error:', err);
        // We do not treat meals fetch error as total page failure unless the restaurant also failed
      } finally {
        setIsLoadingMeals(false);
      }
    }
    fetchRestoMeals();
  }, [id]);

  if (isLoadingResto) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-8 bg-slate-50">
        <div className="h-6 w-24 skeleton-shimmer bg-white rounded animate-pulse"></div>
        <div className="h-64 skeleton-shimmer bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-6 w-48 skeleton-shimmer bg-white rounded animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-slate-150 rounded-2xl shadow-sm mt-12">
        <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-900 mb-2">Profil Kantin Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Profil kantin yang Anda cari tidak dapat dimuat atau telah dihapus.
        </p>
        <Link to="/restaurants" className="btn-primary inline-flex text-xs font-bold py-2 px-4 bg-blue-600 text-white rounded-xl">
          Kembali ke Daftar Kantin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-12">
      {/* Back link */}
      <Link
        to="/restaurants"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Kantin
      </Link>

      {/* Banner Section */}
      <section className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* Cover image */}
        <div className="md:w-2/5 aspect-[16/10] md:aspect-auto relative bg-slate-100 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info panel */}
        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {restaurant.name}
              </h1>
              <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{restaurant.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{restaurant.location}</span>
            </div>

            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              {restaurant.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mr-1">Masakan:</span>
            {restaurant.areas.map((area) => (
              <span
                key={area}
                className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Menu List Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-4">
          <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            <span>Daftar Menu Makanan</span>
          </h2>
          <span className="text-xs text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
            {!isLoadingMeals ? `${meals.length} menu tersedia` : 'Memuat...'}
          </span>
        </div>

        <FoodGrid meals={meals} isLoading={isLoadingMeals} isError={false} />
      </section>
    </div>
  );
}
